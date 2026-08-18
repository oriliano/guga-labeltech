import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

/**
 * Datasheets, certificates and catalogues. Download counts are incremented by the
 * public download route, which is also what records the analytics event.
 */
export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'Doküman', plural: 'Dokümanlar' },
  admin: {
    group: 'İçerik',
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'downloadCount', 'updatedAt'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  upload: {
    mimeTypes: ['application/pdf'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Başlık',
    },
    {
      name: 'kind',
      type: 'select',
      label: 'Tür',
      defaultValue: 'datasheet',
      options: [
        { label: 'Teknik föy (datasheet)', value: 'datasheet' },
        { label: 'Katalog', value: 'catalogue' },
        { label: 'Sertifika', value: 'certificate' },
        { label: 'Diğer', value: 'other' },
      ],
    },
    {
      name: 'downloadCount',
      type: 'number',
      label: 'İndirilme',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Bu dosyanın kaç kez indirildiği. Otomatik sayılır.',
      },
    },
  ],
}
