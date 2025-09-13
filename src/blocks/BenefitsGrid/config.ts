import type { Block } from 'payload'

export const BenefitsGrid: Block = {
  slug: 'benefitsGrid',
  labels: { singular: 'Benefits Grid', plural: 'Benefits Grids' },
  interfaceName: 'BenefitsGridBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'A Inteligência Artificial poupa tempo e supera a capacidade humana.',
      required: true,
    },

    {
      name: 'intro',
      type: 'textarea',
      label: 'Intro',
      defaultValue:
        'É comum pensar que a Inteligência Artificial acelera processos, mas sacrifica a qualidade. Na verdade, ela entrega mais, com melhor resultado — e com um nível de personalização que surpreende.',
      required: true,
    },

    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      required: true,
      labels: { singular: 'Card', plural: 'Cards' },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          label: 'Icon',
          relationTo: 'media',
          required: true,
        },
        { name: 'heading', type: 'text', required: true, label: 'Card Title' },
        {
          name: 'body',
          type: 'textarea',
          required: true,
          label: 'Card Description',
        },
        {
          name: 'link',
          type: 'group',
          label: 'Optional Link',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'url', type: 'text' },
            { name: 'newTab', type: 'checkbox', defaultValue: true },
          ],
        },
      ],
    },
  ],
}
