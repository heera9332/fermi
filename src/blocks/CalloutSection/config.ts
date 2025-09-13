import type { Block } from 'payload'

export const CalloutSection: Block = {
  slug: 'calloutSection',
  interfaceName: 'CalloutSectionBlock',
  labels: {
    singular: 'Callout Section',
    plural: 'Callout Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Heading (normal part)',
      defaultValue: 'Ainda vai a tempo de estar',
    },
    {
      name: 'headingHighlighted',
      type: 'text',
      required: true,
      label: 'Heading (highlighted part)',
      defaultValue: 'entre os primeiros.',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue:
        'A inteligência artificial é uma vantagem para quem chega cedo. As empresas que a adotam agora automatizam mais, gastam menos e crescem mais rápido. O momento certo é agora.',
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Call to Action',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Button Label',
          defaultValue: 'Quero Saber Como',
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          label: 'Button Link (URL)',
          defaultValue: '#',
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab?',
          defaultValue: false,
        },
      ],
    },
  ],
}
