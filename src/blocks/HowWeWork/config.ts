import type { Block } from 'payload'

export const HowWeWork: Block = {
  slug: 'howWeWork',
  labels: { singular: 'How We Work', plural: 'How we work' },
  interfaceName: 'HowWeWork',

  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Heading',
      defaultValue: 'Como trabalhamos?',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Description',
      defaultValue:
        'Seguimos etapas claras que tornam o projeto mais ágil, organizado e eficiente — do planeamento à entrega final.',
    },
    {
      name: 'steps',
      label: 'Steps',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Image',
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
          label: 'Heading',
          defaultValue: 'Descoberta',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Description',
          defaultValue:
            'Analisamos o seu negócio e os objetivos que quer atingir, para desenhar uma estrutura de website pensada para converter.',
        },
      ],
    },
  ],
}
