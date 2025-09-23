import type { Block } from 'payload'

export const RelatedContentBlock: Block = {
  slug: 'relatedContent',
  interfaceName: 'RelatedContent',
  labels: { plural: 'Related Content', singular: 'Related Content' },
  fields: [
    { name: 'heading', type: 'text', label: 'Heading', required: true },
    { name: 'description', type: 'text', label: 'Description' },

    {
      name: 'mode',
      type: 'radio',
      label: 'Populate By',
      options: [
        { label: 'Auto (filters)', value: 'auto' },
        { label: 'Manual (pick items)', value: 'manual' },
      ],
      defaultValue: 'auto',
      admin: { layout: 'horizontal' },
    },

    // ===== AUTO CONFIG =====
    {
      name: 'auto',
      type: 'group',
      admin: { condition: (_, s) => s.mode === 'auto' },
      fields: [
        {
          name: 'postTypeFilter',
          type: 'select',
          label: 'Post Type',
          defaultValue: 'any',
          options: [
            { label: 'Any', value: 'any' },
            { label: 'Posts', value: 'posts' },
            { label: 'Projects', value: 'projects' },
          ],
        },
        {
          name: 'matchByCurrentCategories',
          type: 'checkbox',
          label: 'Match by current page categories',
          defaultValue: true,
        },
        {
          name: 'categories',
          type: 'relationship',
          relationTo: 'categories',
          hasMany: true,
          label: 'Or add categories',
          admin: { description: 'Union with current page categories if enabled above.' },
        },
        {
          name: 'excludeCurrent',
          type: 'checkbox',
          label: 'Exclude current page',
          defaultValue: true,
        },
        {
          name: 'sortBy',
          type: 'select',
          label: 'Sort by',
          defaultValue: 'publishedAt',
          options: [
            { label: 'Published At', value: 'publishedAt' },
            { label: 'Updated At', value: 'updatedAt' },
            { label: 'Title', value: 'title' },
          ],
        },
        {
          name: 'order',
          type: 'select',
          label: 'Order',
          defaultValue: 'desc',
          options: [
            { label: 'Descending', value: 'desc' },
            { label: 'Ascending', value: 'asc' },
          ],
        },
        {
          name: 'limit',
          type: 'number',
          label: 'Limit',
          defaultValue: 8,
          admin: { step: 1, min: 1, max: 24 },
        },
      ],
    },

    // ===== MANUAL PICK =====
    {
      name: 'selection',
      type: 'relationship',
      label: 'Items',
      relationTo: 'posts',
      hasMany: true,
      admin: { condition: (_, s) => s.mode === 'manual' },
      filterOptions: ({ siblingData }) => {
        const pt = siblingData?.auto?.postTypeFilter
        if (pt && pt !== 'any') {
          return { postType: { equals: pt } }
        }
        return true
      },
    },
    {
      name: 'columns',
      label: 'Number of columns',
      type: 'number',
      defaultValue: 4,
      max: 6,
      min: 1,
    },
  ],
}
