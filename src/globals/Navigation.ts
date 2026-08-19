import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'

const linkFields = [
  { name: 'label', type: 'text' as const, required: true, localized: true, label: 'Etiket' },
  {
    name: 'href',
    type: 'text' as const,
    required: true,
    // Adres de dile bağlı: bölüm adresleri iki dilde farklı (/urunler ve
    // /en/products). Ortak tek alan olduğunda ikinci dilin adresi birincisini
    // eziyor ve Türkçe menü İngilizce sayfalara gidiyordu.
    localized: true,
    label: 'Adres',
    admin: { description: 'Türkçe için /urunler, İngilizce için /en/products biçiminde yazın.' },
  },
]

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Menüler',
  admin: { group: 'Sistem' },
  access: { read: anyone, update: authenticated },
  fields: [
    {
      name: 'header',
      type: 'array',
      label: 'Üst menü',
      fields: [
        ...linkFields,
        {
          name: 'children',
          type: 'array',
          label: 'Alt menü',
          fields: linkFields,
        },
      ],
    },
    {
      name: 'footerColumns',
      type: 'array',
      label: 'Alt bilgi sütunları',
      fields: [
        { name: 'title', type: 'text', required: true, localized: true, label: 'Sütun başlığı' },
        { name: 'links', type: 'array', label: 'Bağlantılar', fields: linkFields },
      ],
    },
  ],
}
