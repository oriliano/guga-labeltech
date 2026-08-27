import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access'
import { seoFields } from '../fields/seo'
import { slugField } from '../fields/slug'

/**
 * Project portfolio entries use the same card, filter and detail structure as
 * products, while retaining the fields needed to explain an implementation.
 */
export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Proje', plural: 'Projeler' },
  admin: {
    group: 'İçerik',
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'sector', 'order', '_status', 'updatedAt'],
  },
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
    { name: 'title', type: 'text', required: true, localized: true, label: 'Başlık' },
    {
      name: 'client',
      type: 'text',
      label: 'Müşteri / iş ortağı',
      admin: { description: 'Gizlilik gerektiriyorsa boş bırakın.' },
    },
    {
      name: 'sector',
      type: 'text',
      required: true,
      localized: true,
      label: 'Kategori / sektör',
      admin: {
        description:
          'Liste sayfasındaki grup başlığı ve filtre düğmesi. Tek bir sektör yazın; birden fazla sektör yazarsanız yalnızca ilki başlık olarak kullanılır.',
      },
    },
    { name: 'country', type: 'text', label: 'Ülke' },
    { name: 'excerpt', type: 'textarea', required: true, localized: true, label: 'Kısa özet' },
    { name: 'challenge', type: 'textarea', required: true, localized: true, label: 'İhtiyaç' },
    { name: 'approach', type: 'textarea', required: true, localized: true, label: 'Uygulama' },
    {
      name: 'results',
      type: 'array',
      label: 'Sonuçlar',
      // Rakam zorunlu değil: bir vaka, ölçülmüş bir kazanç paylaşılamadan da
      // yayına alınabiliyor. Uydurma rakam girilmesin diye satır da zorunlu değil.
      fields: [
        { name: 'metric', type: 'text', required: true, label: 'Rakam' },
        { name: 'label', type: 'text', required: true, localized: true, label: 'Açıklama' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Kapak görseli',
      admin: { description: 'Kart ve sayfa başlığında 16:9 çerçeve kullanılıyor. En iyi sonuç için 1600×900 civarı yatay bir görsel yükleyin; kare ya da dikey görsel kırpılmadan çerçeveye sığdırılır.' },
    },
    {
      name: 'relatedSolution',
      type: 'relationship',
      relationTo: 'solutions',
      label: 'İlgili çözüm',
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Kullanılan ürünler',
    },
    seoFields,
    slugField(),
    {
      name: 'order',
      type: 'number',
      label: 'Sıra',
      defaultValue: 100,
      admin: { position: 'sidebar', description: 'Küçük sayı önce gelir.' },
    },
  ],
}
