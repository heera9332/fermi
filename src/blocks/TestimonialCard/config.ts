import type { Block } from 'payload'

export const TestimonialCard: Block = {
  slug: 'testimonialCard',
  labels: { singular: 'Testimonial', plural: 'Testimonials' },
  interfaceName: 'TestimonialCardBlock',

  fields: [
    // Main quote
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      label: 'Quote',
      admin: {
        description: 'Customer testimonial text shown large inside the card.',
      },
    },

    // Author (left bottom)
    {
      name: 'author',
      type: 'group',
      label: 'Author',
      fields: [
        { name: 'name', type: 'text', required: true, defaultValue: '' },
        {
          name: 'role',
          type: 'text',
          required: false,
          label: 'Role / Company (small line under name)',
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          label: 'Avatar',
          admin: { description: 'Square image; rendered as a circle ~40px.' },
        },
      ],
    },

    // Company logo (right bottom)
    {
      name: 'company',
      type: 'group',
      label: 'Company (logo on the right)',
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo',
          admin: { description: 'SVG/PNG; shown small on the card bottom-right.' },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Optional link (case study, website)',
        },
        { name: 'newTab', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
