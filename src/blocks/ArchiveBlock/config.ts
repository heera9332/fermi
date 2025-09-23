import type { Block } from 'payload'

export const Archive: Block = {
  slug: 'archive',
  interfaceName: 'ArchiveBlock',
  labels: { plural: 'Archives', singular: 'Archive' },
  fields: [
    { name: 'heading', type: 'text', label: 'Heading', required: true },
    { name: 'description', type: 'text', label: 'Description' },
    {
      name: 'populateBy',
      type: 'select',
      label: 'Populate By',
      defaultValue: 'collection',
      options: [
        { label: 'Collection', value: 'collection' },
        { label: 'Individual Selection', value: 'selection' },
      ],
    },

    {
      name: 'relationTo',
      type: 'select',
      label: 'Collections To Show',
      defaultValue: 'posts',
      admin: { condition: (_, s) => s.populateBy === 'collection' },
      options: [{ label: 'Posts', value: 'posts' }],
    },

    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'Categories To Show',
      admin: { condition: (_, s) => s.populateBy === 'collection' },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Limit',
      defaultValue: 10,
      admin: { condition: (_, s) => s.populateBy === 'collection', step: 1 },
    },
    {
      name: 'postTypeFilter',
      type: 'select',
      label: 'Post Type Filter',
      defaultValue: 'projects',
      options: [
        { label: 'Projects', value: 'projects' },
        { label: 'Posts', value: 'posts' },
      ],
      admin: {
        position: 'sidebar',
        condition: (_, s) => s.populateBy === 'collection' && s.relationTo === 'posts',
      },
    },

    {
      name: 'headerAlignment',
      label: 'Header alignment',
      type: 'select',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      defaultValue: 'left',
      required: true,
    },
    {
      name: 'dots',
      label: 'Show dots on secton top',
      type: 'checkbox',
      defaultValue: true,
      required: true,
    },
    {
      name: 'link',
      type: 'group',
      label: 'Link',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Link Label',
          defaultValue: 'Ver todos os projectos',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'Link URL',
          required: true,
          defaultValue: '#',
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab',
          required: true,
          defaultValue: false,
        },
      ],
    },
  ],
}
