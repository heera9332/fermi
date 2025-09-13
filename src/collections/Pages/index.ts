import type { CollectionConfig, Where } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { slugField } from '@/fields/slug'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { HeroCtaShowcase } from '@/blocks/HeroCtaShowcase/config'
import { TestimonialCard } from '@/blocks/TestimonialCard/config'
import { BenefitsGrid } from '@/blocks/BenefitsGrid/config'
import { BriefHistory } from '@/blocks/BriefHistory/config'
import { CalloutSection } from '@/blocks/CalloutSection/config'
import { AboutSplit } from '@/blocks/AboutSplit/config'
import { EmptyBlock } from '@/blocks/EmptyBlock/config'
import { NewsLetterBlock } from '@/blocks/Newsletter/config'

const COLLECTION_MAP: Record<string, string> = {
  posts: 'posts',
  projects: 'posts',
}

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'isHeaderDark',
      type: 'checkbox',
      label: 'Is header dark',
      defaultValue: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                HeroCtaShowcase,
                TestimonialCard,
                BenefitsGrid,
                BriefHistory,
                CalloutSection,
                AboutSplit,
                NewsLetterBlock,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
                EmptyBlock,
              ],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
    afterRead: [
      async ({ doc, req }) => {
        if (!Array.isArray(doc?.layout)) return doc
        const hydrated = await Promise.all(
          doc.layout.map(async (block: any) => {
            if (block?.blockType !== 'archive') return block
            const limit = Math.max(1, Math.min(Number(block.limit || 10), 48))
            // MODE: collection
            if (block.populateBy === 'collection') {
              const collection = block.relationTo || 'posts'
              const where: Where = { _status: { equals: 'published' } }
              if (collection === 'posts' && block.postTypeFilter) {
                where.postType = { equals: block.postTypeFilter }
              }
              if (Array.isArray(block.categories) && block.categories.length) {
                const catIDs = block.categories.map((c: any) => c?.id || c).filter(Boolean)
                if (catIDs.length) where.categories = { in: catIDs }
              }
              const { docs } = await req.payload.find({
                collection,
                where,
                limit,
                depth: 2,
                sort: '-publishedAt',
              })
              return { ...block, docs }
            }
            // MODE: selection
            const selected = Array.isArray(block.selectedDocs) ? block.selectedDocs : []
            if (!selected.length) return { ...block, docs: [] }
            // If relationTo allows only 'posts', simplify:
            const ids = selected.map((s: any) => s?.id || s?.value || s).filter(Boolean)
            const { docs } = await req.payload.find({
              collection: block.relationTo || 'posts',
              where: { id: { in: ids } },
              limit: ids.length,
              depth: 2,
            })
            // preserve author order
            const order = new Map(ids.map((id: string, i: number) => [String(id), i]))
            docs.sort(
              (a: any, b: any) => (order.get(String(a.id)) ?? 0) - (order.get(String(b.id)) ?? 0),
            )
            return { ...block, docs: docs.slice(0, limit) }
          }),
        )
        doc.layout = hydrated
        return doc
      },
    ],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
