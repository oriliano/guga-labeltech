import type { Field } from 'payload'

/**
 * Per-document SEO overrides. Every template falls back to the document's own
 * title/excerpt when these are blank, so pages are never left without metadata
 * the way the legacy site was.
 */
export const seoFields: Field = {
  type: 'collapsible',
  label: 'SEO',
  admin: { initCollapsed: true },
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      localized: true,
      label: 'Meta başlık',
      admin: { description: 'Boşsa sayfa başlığı kullanılır. 60 karaktere kadar önerilir.' },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      localized: true,
      label: 'Meta açıklama',
      admin: { description: 'Boşsa özet kullanılır. 150-160 karakter idealdir.' },
    },
    {
      name: 'metaImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Paylaşım görseli',
      admin: { description: 'Boşsa sayfanın ana görseli kullanılır.' },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      label: 'Arama motorlarından gizle',
      defaultValue: false,
    },
  ],
}
