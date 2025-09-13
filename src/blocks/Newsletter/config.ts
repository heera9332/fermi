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
      type: 'group',
      label: 'Form',
      name: 'form',
      fields: [
        {
          label: 'Placeholder',
          name: 'placeHolder',
          type: 'text',
          defaultValue: 'you@example.com',
          required: true,
        },
        {
          label: 'Success message',
          name: 'message',
          type: 'text',
          defaultValue: 'Thank your form submitted',
          required: true,
        },
        {
          label: 'Button label',
          name: 'buttonLabel',
          type: 'text',
          required: true,
          defaultValue: 'Subscrever',
        },
      ],
    },
  ],
}
