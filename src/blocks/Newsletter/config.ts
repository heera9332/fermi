import type { Block } from 'payload'

export const NewsLetterBlock: Block = {
  slug: 'newsLetter',
  interfaceName: 'NewsLetter',
  fields: [
    {
      label: 'Heading',
      type: 'text',
      name: 'heading',
      required: true,
      defaultValue: 'Mais de 100 empreendedores recebem as',
    },
    {
      label: 'Heading (highlighted)',
      type: 'text',
      name: 'headingHighlighted',
      required: true,
      defaultValue: 'nossas dicas 1x por semana.',
    },
    {
      label: 'Sub heading (top)',
      type: 'text',
      name: 'subHeading',
      required: true,
      defaultValue: 'Subscreva o grupo FermiGrowth',
    },
    {
      label: 'Description',
      type: 'textarea',
      name: 'description',
      required: true,
      defaultValue:
        'Todas as semanas oferecemos dicas práticas para aumentar as suas vendas e leads e crescer o seu negócio.',
    },
    {
      name: 'form',
      type: 'relationship',
      admin: {
        description: 'Make sure form has only one field that is email',
      },
      relationTo: 'forms',
      required: true,
    },
  ],
}
