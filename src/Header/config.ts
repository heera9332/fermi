import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'brand',
      label: 'Brand name',
      type: 'text',
      required: true,
      defaultValue: 'Fermi',
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'cta',
      label: 'CTA',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'label',
          label: 'Label',
          type: 'text',
          required: true,
          defaultValue: 'Fale Conosco',
        },
        {
          name: 'link',
          label: 'Link',
          type: 'text',
          required: true,
          defaultValue: 'https://femit.it',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
