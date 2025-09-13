// src/globals/Footer.ts
import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: { read: () => true },

  fields: [
    /** ── CTA block ─────────────────────────────────────────────── */
    {
      name: 'cta',
      type: 'group',
      label: 'CTA',
      required: true,
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'Pronto para transformar o seu negócio com IA?',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          defaultValue:
            'Agende a sua consultoria gratuita e descubra as melhores oportunidades de crescimento.',
        },
        {
          name: 'button',
          type: 'group',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              defaultValue: 'Falar com um Especialista em IA',
            },
            {
              name: 'link',
              type: 'text',
              required: true,
              defaultValue: '/contacto',
            },
            { name: 'newTab', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },

    /** ── Brand & Socials ───────────────────────────────────────── */
    {
      name: 'brand',
      type: 'text',
      label: 'Brand name',
      defaultValue: 'fermi',
    },
    {
      name: 'social',
      label: 'Social Links',
      type: 'array',
      labels: { singular: 'Social link', plural: 'Social links' },
      defaultValue: [
        { platform: 'x', url: 'https://x.com/fermi' },
        { platform: 'instagram', url: 'https://instagram.com/fermi' },
        { platform: 'youtube', url: 'https://youtube.com/@fermi' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/fermi' },
      ],
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'X (Twitter)', value: 'x' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'LinkedIn', value: 'linkedin' },
          ],
        },
        { name: 'url', type: 'text', required: true },
      ],
    },

    /** ── Link columns ──────────────────────────────────────────── */
    {
      name: 'columns',
      type: 'array',
      label: 'Link Columns',
      minRows: 1,
      defaultValue: [
        {
          title: 'Links',
          links: [
            { label: 'Home', link: '/', newTab: false },
            { label: 'Casos de Sucesso', link: '/cases', newTab: false },
            { label: 'Sobre Nós', link: '/sobre', newTab: false },
            { label: 'Blog', link: '/blog', newTab: false },
            { label: 'Contacto', link: '/contacto', newTab: false },
            { label: 'Consultoria Grátis', link: '/consultoria', newTab: false },
          ],
        },
        {
          title: 'Contacto',
          links: [
            { label: 'contacto@fermi.pt', link: 'mailto:contacto@fermi.pt', newTab: false },
            { label: '934 500 150', link: 'tel:+351934500150', newTab: false },
          ],
        },
      ],
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          minRows: 1,
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'link', type: 'text', required: true },
            { name: 'newTab', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },

    /** ── Contact ──────────────────────────────────────────────── */
    {
      name: 'contact',
      type: 'group',
      label: 'Contact (optional)',
      fields: [
        { name: 'email', type: 'email', defaultValue: 'contacto@fermi.pt' },
        { name: 'phone', type: 'text', defaultValue: '934 500 150' },
      ],
    },

    /** ── Background ───────────────────────────────────────────── */
    {
      name: 'footerBackground',
      type: 'upload',
      label: 'Footer Background',
      relationTo: 'media',
    },
  ],
}
