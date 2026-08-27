import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'
import { seoFields } from '../fields/seo'

export const Solutions: CollectionConfig = {
  slug: 'solutions',
  labels: { singular: 'Çözüm', plural: 'Çözümler' },
  admin: {
    group: 'İçerik',
    useAsTitle: 'title',
    defaultColumns: ['title', 'sector', '_status', 'updatedAt'],
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
            { name: 'title', type: 'text', required: true, localized: true, label: 'Başlık' },
            {
              name: 'sector',
              type: 'text',
              localized: true,
              label: 'Sektör etiketi',
              admin: { description: 'Örn. Depo, Perakende, Sağlık. Kartlarda rozet olarak görünür.' },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              localized: true,
              label: 'Kısa açıklama',
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Kapak görseli',
              admin: {
                description:
                  'Kart ve sayfa başlığında 16:9 çerçeve kullanılıyor. En iyi sonuç için 1600×900 civarı yatay bir görsel yükleyin; kare ya da dikey görsel kırpılmadan çerçeveye sığdırılır.',
              },
            },
          ],
        },
        {
          label: 'İçerik',
          fields: [
            {
              name: 'problem',
              type: 'richText',
              localized: true,
              label: 'Neden RFID? (problem)',
            },
            {
              name: 'capabilities',
              type: 'array',
              label: 'Sistem yetenekleri',
              admin: { description: 'Çözüm sayfasının ana bloğu: her madde bir başlık ve açıklama.' },
              fields: [
                { name: 'title', type: 'text', required: true, localized: true, label: 'Başlık' },
                { name: 'description', type: 'textarea', required: true, localized: true, label: 'Açıklama' },
              ],
            },
            {
              name: 'outcomes',
              type: 'array',
              label: 'Ölçülebilir kazanımlar',
              admin: { description: 'Örn. "%80" + "sayım süresinde azalma". Rakam olmadan ihracat müşterisi ikna olmaz.' },
              fields: [
                { name: 'metric', type: 'text', required: true, label: 'Rakam' },
                { name: 'label', type: 'text', required: true, localized: true, label: 'Açıklama' },
              ],
            },
            {
              name: 'integrations',
              type: 'array',
              label: 'Entegrasyonlar',
              fields: [{ name: 'name', type: 'text', required: true, label: 'Sistem adı' }],
            },
          ],
        },
        {
          label: 'İlişkiler',
          fields: [
            {
              name: 'relatedProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              label: 'Kullanılan ürünler',
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
      admin: { position: 'sidebar' },
    },
  ],
}
