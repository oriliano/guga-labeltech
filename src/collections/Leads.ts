import type { CollectionConfig } from 'payload'

import { authenticated } from '../access'

/**
 * Quote requests submitted from the public site. Created by the server action that
 * handles the form, never through the API by anonymous clients.
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Teklif Talebi', plural: 'Teklif Talepleri' },
  admin: {
    group: 'Satış',
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'country', 'status', 'createdAt'],
    listSearchableFields: ['name', 'company', 'email', 'message'],
    description:
      'Siteden gelen teklif ve iletişim talepleri. CSV dışa aktarma: /api/leads/export — tarih aralığı için ?from=2026-01-01&to=2026-01-31 ekleyin.',
  },
  access: {
    create: () => false,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Ad Soyad' },
        { name: 'company', type: 'text', label: 'Firma' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', required: true, label: 'E-posta' },
        { name: 'phone', type: 'text', label: 'Telefon' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'country', type: 'text', label: 'Ülke' },
        {
          name: 'locale',
          type: 'select',
          label: 'Form dili',
          options: [
            { label: 'Türkçe', value: 'tr' },
            { label: 'English', value: 'en' },
          ],
        },
      ],
    },
    { name: 'message', type: 'textarea', label: 'Mesaj' },
    {
      name: 'productInterest',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'İlgilendiği ürünler',
    },
    {
      name: 'sourcePath',
      type: 'text',
      label: 'Geldiği sayfa',
      admin: { readOnly: true },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Durum',
      defaultValue: 'new',
      required: true,
      admin: { position: 'sidebar' },
      options: [
        { label: 'Yeni', value: 'new' },
        { label: 'Görüşülüyor', value: 'in-progress' },
        { label: 'Teklif verildi', value: 'quoted' },
        { label: 'Kazanıldı', value: 'won' },
        { label: 'Kaybedildi', value: 'lost' },
        { label: 'Spam', value: 'spam' },
      ],
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      label: 'Sorumlu',
      admin: { position: 'sidebar' },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'İç notlar',
      admin: { description: 'Yalnızca panelde görünür, siteye çıkmaz.' },
    },
  ],
}
