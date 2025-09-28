import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { s3Storage } from '@payloadcms/storage-s3'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Fermi.it` : 'Fermi.it'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
      file: false,
      checkbox: false,
      date: false,
      select: false,
      state: false,
      country: false,
    },
    formOverrides: {
      fields: ({ defaultFields }: { defaultFields: any[] }) => {
        // --- helpers ---
        const isNamed = (f: any, n: string) =>
          f && typeof f === 'object' && 'name' in f && f.name === n

        // Recursively remove any field with name === 'width'
        const deepStripWidth = (fields: any[]): any[] => {
          return (fields || [])
            .filter((f: any) => !isNamed(f, 'width')) // strip at this level
            .map((f: any) => {
              if (!f || typeof f !== 'object') return f

              // descend into known container shapes
              if (Array.isArray((f as any).fields)) {
                return { ...f, fields: deepStripWidth((f as any).fields) }
              }
              if (Array.isArray((f as any).tabs)) {
                return {
                  ...f,
                  tabs: (f as any).tabs.map((t: any) =>
                    Array.isArray(t?.fields) ? { ...t, fields: deepStripWidth(t.fields) } : t,
                  ),
                }
              }
              return f
            })
        }

        // Insert placeholder ONCE per block: prefer first row that has 'label', else first row, else top-level after top-level 'label'
        const injectPlaceholderOnce = (fields: any[]): any[] => {
          // If already present anywhere at this level, do nothing
          if ((fields || []).some((f: any) => isNamed(f, 'placeholder'))) return fields

          const placeholderField = {
            name: 'placeholder',
            label: 'Placeholder',
            type: 'text',
            admin: { description: 'Optional placeholder shown inside the input' },
            // localized: true, // enable if you need i18n
          }

          // 1) Try rows: find rows
          const rowIdxs: number[] = []
          ;(fields || []).forEach((f: any, i: number) => {
            if (f?.type === 'row' && Array.isArray(f.fields)) rowIdxs.push(i)
          })

          if (rowIdxs.length > 0) {
            // If any row already has placeholder, abort (avoid duplicates on HMR)
            const anyRowHas = rowIdxs.some((i) =>
              fields[i].fields.some((rf: any) => isNamed(rf, 'placeholder')),
            )
            if (anyRowHas) return fields

            // Prefer a row with label
            let injectRowIdx = rowIdxs.find((i) =>
              fields[i].fields.some((rf: any) => isNamed(rf, 'label')),
            )
            if (injectRowIdx === undefined) injectRowIdx = rowIdxs[0]

            const row = fields[injectRowIdx]
            const labelIdx = row.fields.findIndex((rf: any) => isNamed(rf, 'label'))
            const newRowFields =
              labelIdx > -1
                ? [
                    ...row.fields.slice(0, labelIdx + 1),
                    placeholderField,
                    ...row.fields.slice(labelIdx + 1),
                  ]
                : [placeholderField, ...row.fields]

            const next = [...fields]
            next[injectRowIdx] = { ...row, fields: newRowFields }
            return next
          }

          // 2) No rows: try top-level after top-level label
          const topLabelIdx = (fields || []).findIndex((f: any) => isNamed(f, 'label'))
          if (topLabelIdx > -1) {
            return [
              ...fields.slice(0, topLabelIdx + 1),
              placeholderField,
              ...fields.slice(topLabelIdx + 1),
            ]
          }

          // 3) Otherwise prepend
          return [placeholderField, ...(fields || [])]
        }

        // --- your override mapping ---
        return defaultFields.map((field) => {
          // keep your existing confirmationMessage editor override
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  FixedToolbarFeature(),
                  HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                ],
              }),
            }
          }

          if (field.type === 'blocks' && Array.isArray(field.blocks)) {
            return {
              ...field,
              blocks: field.blocks.map((block: any) => {
                const target = ['text', 'email', 'number', 'textarea']
                if (!target.includes(block.slug) || !Array.isArray(block.fields)) return block

                // 1) strip all 'width' occurrences recursively
                let cleaned = deepStripWidth(block.fields)

                // 2) add placeholder once
                cleaned = injectPlaceholderOnce(cleaned)

                return { ...block, fields: cleaned }
              }),
            }
          }

          return field
        })
      },
    },
  }),

  payloadCloudPlugin(),

  s3Storage({
    collections: {
      media: {
        prefix: 'fermi',
      },
    },
    bucket: process.env.S3_BUCKET!,
    config: {
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT,
    },
  }),
]
