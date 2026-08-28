import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'
import { seoFields } from '../fields/seo'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Yazı', plural: 'Bilgi Merkezi' },
  admin: {
    group: 'İçerik',
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status'],
    description:
      'Yeni blog yazısı için “Yeni Ekle” düğmesini kullanın. Başlık, özet, kapak ve ana yazıyı doldurduktan sonra “Yayınla”ya basın.',
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
    { name: 'title', type: 'text', required: true, localized: true, label: 'Başlık' },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      localized: true,
      label: 'Özet',
      admin: { description: 'Liste kartlarında ve arama sonuçlarında görünür.' },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Kapak görseli',
      admin: { description: 'Kart ve sayfa başlığında 16:9 çerçeve kullanılıyor. En iyi sonuç için 1600×900 civarı yatay bir görsel yükleyin; kare ya da dikey görsel kırpılmadan çerçeveye sığdırılır.' },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      localized: true,
      label: 'Blog yazısı — ana içerik',
      admin: {
        description:
          'Yazının tamamını burada hazırlayın. Paragraf, ara başlık, kalın/italik metin, bağlantı ve listeler kullanabilirsiniz.',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Etiketler',
      admin: {
        description:
          'İsteğe bağlıdır. Yazının konusunu anlatan kısa kelime veya ifadeler ekleyin; örneğin RFID, depo, lojistik, kuyum, tekstil veya soğuk zincir.',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          localized: true,
          label: 'Etiket (isteğe bağlı)',
          admin: {
            description: 'Örnek: RFID, depo, lojistik, kuyum, tekstil, soğuk zincir',
            placeholder: 'Örnek: RFID',
          },
        },
      ],
    },
    {
      name: 'relatedSolutions',
      type: 'relationship',
      relationTo: 'solutions',
      hasMany: true,
      label: 'İlgili çözümler',
    },
    seoFields,
    slugField(),
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Yayın tarihi',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
      hooks: {
        beforeChange: [({ value, siblingData }) => value ?? (siblingData?._status === 'published' ? new Date() : value)],
      },
    },
  ],
}
