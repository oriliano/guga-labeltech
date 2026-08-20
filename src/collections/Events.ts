import type { CollectionConfig } from 'payload'

import { authenticated } from '../access'

/**
 * First-party, cookie-free analytics. Written by the tracking route; the admin
 * dashboard aggregates these rows. No visitor identifier is stored, so this needs
 * no consent banner.
 */
export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Olay', plural: 'Analitik' },
  admin: {
    group: 'Satış',
    useAsTitle: 'path',
    defaultColumns: ['type', 'path', 'country', 'createdAt'],
    description: 'Ham kayıtlar. Özet için panel ana sayfasındaki grafiklere bakın.',
  },
  access: {
    create: () => false,
    delete: authenticated,
    read: authenticated,
    update: () => false,
  },
  indexes: [{ fields: ['type', 'createdAt'] }],
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Sayfa görüntüleme', value: 'pageview' },
        { label: 'Doküman indirme', value: 'download' },
        { label: 'Form gönderimi', value: 'lead' },
      ],
    },
    { name: 'path', type: 'text', required: true, index: true, label: 'Sayfa' },
    { name: 'locale', type: 'text', label: 'Dil' },
    { name: 'country', type: 'text', index: true, label: 'Ülke' },
    { name: 'referrerHost', type: 'text', label: 'Yönlendiren site' },
    { name: 'deviceType', type: 'text', label: 'Cihaz türü' },
    {
      name: 'documentRef',
      type: 'relationship',
      relationTo: 'documents',
      label: 'Doküman',
    },
    {
      name: 'productRef',
      type: 'relationship',
      relationTo: 'products',
      label: 'Ürün',
    },
  ],
}
