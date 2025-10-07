import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from '@/fields/slug'

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'posts',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'posts',
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
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'excerpt',
              type: 'textarea',
              label: 'Excerpt',
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: false,
              required: true,
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

        {
          name: 'relatedContents',
          label: 'Related contents',
          fields: [
            {
              name: 'isEnableRelatedBlock',
              type: 'checkbox',
              label: 'Enable related posts',
              required: true,
              defaultValue: true,
            },

            {
              type: 'row',
              admin: {
                condition: (_, siblingData) => siblingData?.isEnableRelatedBlock === true,
              },
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  label: 'Heading',
                  required: true,
                  defaultValue: 'Related Articles',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                  defaultValue:
                    'Keep learning about how artificial intelligence can boost your business',
                },
              ],
            },

            {
              name: 'mode',
              type: 'radio',
              label: 'Populate By',
              options: [
                { label: 'Auto (filters)', value: 'auto' },
                { label: 'Manual (pick items)', value: 'manual' },
              ],
              defaultValue: 'auto',
              admin: {
                layout: 'horizontal',
                condition: (_, siblingData) => siblingData?.isEnableRelatedBlock === true,
              },
            },

            /* -------------------- AUTO -------------------- */
            {
              type: 'collapsible',
              label: 'Auto Options',
              admin: {
                initCollapsed: false,
                condition: (_, s) => s?.isEnableRelatedBlock === true && s?.mode === 'auto',
              },
              fields: [
                {
                  name: 'limit',
                  type: 'number',
                  label: 'Limit',
                  defaultValue: 8,
                  min: 1,
                  max: 24,
                  admin: { step: 1 },
                },
                {
                  name: 'columns',
                  label: 'Number of columns',
                  type: 'number',
                  defaultValue: 3,
                  min: 1,
                  max: 6,
                  admin: { step: 1 },
                },
                {
                  name: 'excludeCurrent',
                  type: 'checkbox',
                  label: 'Exclude current item',
                  defaultValue: true,
                },
                {
                  name: 'sortBy',
                  type: 'select',
                  label: 'Sort by',
                  defaultValue: '-publishedAt',
                  options: [
                    { label: 'Newest first', value: '-publishedAt' },
                    { label: 'Oldest first', value: 'publishedAt' },
                  ],
                  admin: {
                    description: 'Auto mode always queries the same `postType` as this document.',
                  },
                },
              ],
            },

            /* -------------------- MANUAL -------------------- */
            {
              type: 'collapsible',
              label: 'Manual Selection',
              admin: {
                initCollapsed: false,
                condition: (_, s) => s?.isEnableRelatedBlock === true && s?.mode === 'manual',
              },
              fields: [
                {
                  name: 'items',
                  type: 'relationship',
                  relationTo: 'posts',
                  hasMany: true,
                  admin: {
                    description: 'Pick specific items to show (can include posts or projects).',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'author',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      relationTo: 'users',
    },
    ...slugField(),
    {
      name: 'postType',
      label: 'Post type',
      type: 'select',
      options: [
        {
          label: 'post',
          value: 'posts',
        },
        {
          label: 'project',
          value: 'projects',
        },
      ],
      defaultValue: 'posts',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featuredImage',
      label: 'Featured image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePost],
    afterRead: [],
    afterDelete: [revalidateDelete],
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
