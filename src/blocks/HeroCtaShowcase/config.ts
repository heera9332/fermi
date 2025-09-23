import type { Block } from 'payload'

export const HeroCtaShowcase: Block = {
  slug: 'heroCtaShowcase',
  labels: { singular: 'Hero + CTA', plural: 'Hero + CTA' },
  imageURL: '/assets/icons/svg/yt.svg', // optional: any icon preview in admin
  interfaceName: 'HeroCtaShowcaseBlock',

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'titleHighlighted',
      type: 'text',
      required: true,
      label: 'Title (highlighted)',
    },
    {
      name: 'content',
      type: 'textarea',
      label: 'Content',
      required: true,
      admin: {
        description: 'Short paragraph under the title.',
      },
    },

    // CTA
    {
      name: 'cta',
      type: 'group',
      label: 'CTA',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'link', type: 'text', required: true },
        { name: 'newTab', type: 'checkbox', defaultValue: false, required: true },
      ],
    },

    // Companies (max 3)
    {
      name: 'companies',
      type: 'array',
      label: 'Companies',
      minRows: 0,
      maxRows: 3,
      admin: { description: 'Up to 3 logos with brief result/description.' },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media', // your Media collection
          required: true,
        },
      ],
    },

    // Section background / hero image
    {
      name: 'sectionImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Section Image',
      required: true,
    },
    {
      name: 'sectionImageMobile',
      type: 'upload',
      relationTo: 'media',
      label: 'Section Image (mobile)',
      required: true,
    },
  ],
}
