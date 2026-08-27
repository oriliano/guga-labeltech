import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Görsel', plural: 'Görseller' },
  admin: {
    group: 'İçerik',
    description:
      'Kartlar ve detay sayfaları görseli 16:9 çerçevede gösterir. Oranı 1.3 ile 2.1 arasındaki yatay görsel çerçeveyi doldurur (önerilen ölçü 1600×900). Kare, dikey ya da çok geniş görsel kırpılmaz, tamamı çerçeveye sığdırılır ve kenarlarda boşluk kalır. Ürün fotoğrafı hiçbir zaman kırpılmaz; sade zeminde 1200×1200 civarı kare fotoğraf en iyi sonucu verir. Yüklenen dosya olduğu gibi saklanır, panelde kırpma aracı yok.',
  },
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
