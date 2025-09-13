import type { Block } from 'payload'

export const AboutSplit: Block = {
  slug: 'aboutSplit',
  interfaceName: 'AboutSplitBlock',
  labels: { singular: 'About Split', plural: 'About Splits' },
  fields: [
    { name: 'heading', type: 'text', required: true, label: 'Heading' },
    { name: 'subheading', type: 'text', label: 'Subheading' },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
      required: true,
    },
  ],
}
