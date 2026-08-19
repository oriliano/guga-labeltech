import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Görsel', plural: 'Görseller' },
  admin: { group: 'İçerik' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  upload: {
    // Yuklenen dosyalar konteyner diskine yaziliyor; uretimde bu yol kalici bir
    // Railway diskine bagli, yoksa her dagitimda silinirdi.
    staticDir: process.env.MEDIA_DIR || undefined,
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 576, position: 'centre' },
      { name: 'wide', width: 1600, height: 900, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      label: 'Alternatif metin',
      admin: {
        description: 'Görseli göremeyen ziyaretçi ve arama motorları için kısa açıklama.',
      },
    },
    {
      name: 'credit',
      type: 'text',
      label: 'Kaynak / telif',
    },
  ],
}
