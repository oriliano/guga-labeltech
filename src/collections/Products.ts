import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'
import { seoFields } from '../fields/seo'

/**
 * Kategori listesi artık `product-categories` koleksiyonunda; buradaki anahtarlar
 * yalnızca seed betiklerinin hangi kategoriye yazacağını bilmesi için duruyor.
 */
export const PRODUCT_CATEGORY_KEYS = [
  'hardware',
  'label',
  'industrial-tag',
  'industrial-label',
  'card',
  'ribbon',
  'lanyard',
  'library',
  'retail',
] as const

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Ürün', plural: 'Ürünler' },
  admin: {
    group: 'İçerik',
    useAsTitle: 'title',
    defaultColumns: ['title', 'model', 'category', 'order', '_status', 'updatedAt'],
    listSearchableFields: ['title', 'model'],
  },
  // Liste sayfasi kategoriye gore gruplanmis ilk uc urunu `order` alanina gore
  // seciyor; panel de ayni siraya gore aciliyor ki editor gordugu sira gercek olsun.
  defaultSort: 'order',
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
              type: 'relationship',
              relationTo: 'product-categories',
              required: true,
              label: 'Kategori',
              admin: {
                description:
                  'Kategori listesi “Ürün Kategorileri” bölümünden yönetiliyor. Listede olmayan bir kategori gerekiyorsa buradaki alanın yanındaki artı düğmesiyle yenisini ekleyebilirsiniz.',
              },
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
            {
              name: 'images',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Görseller',
              admin: { description: 'Ürün kartı fotoğrafı kırpmadan gösteriyor. Beyaz ya da sade zeminde, 1200×1200 civarı kare bir fotoğraf en iyi sonucu veriyor.' },
            },
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
