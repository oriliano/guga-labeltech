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
    { name: 'coverImage', type: 'upload', relationTo: 'media', label: 'Kapak görseli' },
    { name: 'body', type: 'richText', localized: true, label: 'İçerik' },
    {
      name: 'tags',
      type: 'array',
      label: 'Etiketler',
      fields: [{ name: 'tag', type: 'text', required: true, localized: true }],
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
