import type { Block } from 'payload'

export const ContactHeroBlock: Block = {
  slug: 'contactHero',
  interfaceName: 'ContactHeroBlock',
  fields: [
    {
      name: 'subHeading',
      label: 'Sub heading',
      type: 'text',
      required: true,
      defaultValue: 'Consultoria Grátis',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Quer saber como utilizar IA para alavancar o seu negócio?',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      defaultValue:
        'Preencha o formulário e, dentro de 24 horas, a nossa equipa entrará em contacto consigo para agendar uma consolturia grátis.',
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
  ],
}
