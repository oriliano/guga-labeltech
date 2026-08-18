import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'
import { seoFields } from '../fields/seo'

/**
 * Case studies. The single most persuasive asset for an export buyer and the one
 * thing the legacy site had none of.
 */
export const References: CollectionConfig = {
  slug: 'references',
  labels: { singular: 'Referans', plural: 'Referanslar' },
  admin: {
    group: 'İçerik',
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'sector', '_status'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: publishedOrAuthenticated,
    update: authenticated,
  },
  versions: {
    drafts: { autosave: false },
    maxPerDoc: 10,
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: 'Başlık' },
    {
      name: 'client',
      type: 'text',
      label: 'Müşteri',
      admin: { description: 'Müşteri adı paylaşılamıyorsa boş bırakın; sektör yeterlidir.' },
    },
    { name: 'sector', type: 'text', required: true, localized: true, label: 'Sektör' },
    { name: 'country', type: 'text', label: 'Ülke' },
    { name: 'challenge', type: 'textarea', required: true, localized: true, label: 'Sorun' },
    { name: 'approach', type: 'textarea', required: true, localized: true, label: 'Uygulanan çözüm' },
    {
      name: 'results',
      type: 'array',
      label: 'Sonuçlar',
      minRows: 1,
      admin: { description: 'Rakamlı sonuç: "%80" + "sayım süresinde azalma".' },
      fields: [
        { name: 'metric', type: 'text', required: true, label: 'Rakam' },
        { name: 'label', type: 'text', required: true, localized: true, label: 'Açıklama' },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Görsel' },
    {
      name: 'relatedSolution',
      type: 'relationship',
      relationTo: 'solutions',
      label: 'İlgili çözüm',
    },
    seoFields,
    slugField(),
  ],
}
