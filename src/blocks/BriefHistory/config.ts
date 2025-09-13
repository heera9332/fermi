import type { Block } from 'payload'

export const BriefHistory: Block = {
  slug: 'briefHistory',
  labels: { singular: 'Brief History', plural: 'Brief History' },
  interfaceName: 'BriefHistory',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue:
        'A IA é hoje o que a internet foi nos anos 2000 — entre cedo, ou corra atrás depois.',
      required: true,
    },

    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue:
        'A inteligência artificial é uma vantagem para quem chega cedo. As empresas que a adotam agora automatizam mais, gastam menos e crescem mais rápido. O momento certo é agora.',
      required: true,
    },

    {
      name: 'sectionImage',
      label: 'Section Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
