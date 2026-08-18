import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'
import { seoFields } from '../fields/seo'

export const PRODUCT_CATEGORIES = [
  { label: 'RFID Donanım', value: 'hardware' },
  { label: 'RFID Etiket', value: 'label' },
  { label: 'Endüstriyel Tag', value: 'industrial-tag' },
  { label: 'Endüstriyel Etiket', value: 'industrial-label' },
  { label: 'Kart', value: 'card' },
  { label: 'Ribon', value: 'ribbon' },
  { label: 'Yaka İpi', value: 'lanyard' },
  { label: 'Kütüphane & Arşiv', value: 'library' },
  { label: 'Perakende', value: 'retail' },
] as const

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Ürün', plural: 'Ürünler' },
  admin: {
    group: 'İçerik',
    useAsTitle: 'title',
    defaultColumns: ['title', 'model', 'category', '_status', 'updatedAt'],
    listSearchableFields: ['title', 'model'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: publishedOrAuthenticated,
    update: authenticated,
  },
  versions: {
    drafts: { autosave: false },
    maxPerDoc: 20,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Genel',
          fields: [
            { name: 'title', type: 'text', required: true, localized: true, label: 'Ürün adı' },
            {
              name: 'model',
              type: 'text',
              label: 'Model kodu',
              admin: { description: 'Örn. GugaTY850. Ürün listelerinde ve tekliflerde kullanılır.' },
            },
            {
              name: 'category',
              type: 'select',
              required: true,
              label: 'Kategori',
              options: [...PRODUCT_CATEGORIES],
            },
            {
              name: 'excerpt',
              type: 'textarea',
              localized: true,
              label: 'Kısa açıklama',
              admin: { description: 'Listelerde ve arama sonuçlarında görünür. 1-2 cümle.' },
            },
            { name: 'body', type: 'richText', localized: true, label: 'Açıklama' },
          ],
        },
        {
          label: 'Teknik',
          fields: [
            {
              name: 'specs',
              type: 'array',
              label: 'Teknik özellikler',
              labels: { singular: 'Özellik', plural: 'Özellikler' },
              admin: { description: 'Ürün sayfasındaki teknik tabloyu oluşturur. İhracat müşterisinin ilk baktığı yer.' },
              fields: [
                { name: 'label', type: 'text', required: true, localized: true, label: 'Özellik' },
                { name: 'value', type: 'text', required: true, localized: true, label: 'Değer' },
              ],
            },
            {
              name: 'highlights',
              type: 'array',
              label: 'Öne çıkan avantajlar',
              fields: [{ name: 'text', type: 'text', required: true, localized: true, label: 'Avantaj' }],
            },
            {
              name: 'datasheets',
              type: 'relationship',
              relationTo: 'documents',
              hasMany: true,
              label: 'Teknik föy / katalog',
            },
          ],
        },
        {
          label: 'Görseller & İlişkiler',
          fields: [
            { name: 'images', type: 'upload', relationTo: 'media', hasMany: true, label: 'Görseller' },
            {
              name: 'relatedSolutions',
              type: 'relationship',
              relationTo: 'solutions',
              hasMany: true,
              label: 'İlgili çözümler',
            },
          ],
        },
      ],
    },
    seoFields,
    slugField(),
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Ana sayfada öne çıkar',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Sıra',
      defaultValue: 100,
      admin: { position: 'sidebar', description: 'Küçük sayı önce gelir.' },
    },
  ],
}
