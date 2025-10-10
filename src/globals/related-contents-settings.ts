// globals/related-contents-settings.ts
import type { GlobalConfig } from 'payload'

export const RelatedContentsSettings: GlobalConfig = {
  label: 'Releated contents',
  slug: 'related-contents-settings',
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Posts type (post articles)',
          fields: [
            {
              name: 'posts',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'heading',
                      type: 'text',
                      required: true,
                      defaultValue: 'Related Articles',
                    },
                    { name: 'description', type: 'textarea', defaultValue: 'Keep learning …' },
                  ],
                },
                {
                  name: 'mode',
                  type: 'radio',
                  options: [
                    { label: 'Auto (filters)', value: 'auto' },
                    { label: 'Manual (pick items)', value: 'manual' },
                  ],
                  defaultValue: 'auto',
                  admin: { layout: 'horizontal' },
                },
                {
                  type: 'collapsible',
                  label: 'Auto Options',
                  admin: { condition: (_, s) => s?.posts?.mode === 'auto' },
                  fields: [
                    { name: 'limit', type: 'number', defaultValue: 6, min: 1, max: 24 },
                    { name: 'columns', type: 'number', defaultValue: 3, min: 1, max: 6 },
                    { name: 'excludeCurrent', type: 'checkbox', defaultValue: true },
                    {
                      name: 'sortBy',
                      type: 'select',
                      defaultValue: '-publishedAt',
                      options: [
                        { label: 'Newest first', value: '-publishedAt' },
                        { label: 'Oldest first', value: 'publishedAt' },
                      ],
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Manual Selection',
                  admin: { condition: (_, s) => s?.posts?.mode === 'manual' },
                  fields: [
                    { name: 'items', type: 'relationship', relationTo: 'posts', hasMany: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Projects type (case studies)',
          fields: [
            {
              name: 'projects',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'heading',
                      type: 'text',
                      required: true,
                      defaultValue: 'Explore More Projects',
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      defaultValue: 'See similar case studies …',
                    },
                  ],
                },
                {
                  name: 'mode',
                  type: 'radio',
                  options: [
                    { label: 'Auto (filters)', value: 'auto' },
                    { label: 'Manual (pick items)', value: 'manual' },
                  ],
                  defaultValue: 'auto',
                  admin: { layout: 'horizontal' },
                },
                {
                  type: 'collapsible',
                  label: 'Auto Options',
                  admin: { condition: (_, s) => s?.projects?.mode === 'auto' },
                  fields: [
                    { name: 'limit', type: 'number', defaultValue: 6, min: 1, max: 24 },
                    { name: 'columns', type: 'number', defaultValue: 3, min: 1, max: 6 },
                    { name: 'excludeCurrent', type: 'checkbox', defaultValue: true },
                    {
                      name: 'sortBy',
                      type: 'select',
                      defaultValue: '-publishedAt',
                      options: [
                        { label: 'Newest first', value: '-publishedAt' },
                        { label: 'Oldest first', value: 'publishedAt' },
                      ],
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Manual Selection',
                  admin: { condition: (_, s) => s?.projects?.mode === 'manual' },
                  fields: [
                    { name: 'items', type: 'relationship', relationTo: 'posts', hasMany: true },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
