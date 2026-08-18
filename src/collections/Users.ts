import type { CollectionConfig } from 'payload'

import { adminFieldOnly, adminsOnly, authenticated } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Sistem',
    defaultColumns: ['name', 'email', 'role'],
  },
  auth: true,
  access: {
    admin: authenticated,
    create: adminsOnly,
    delete: adminsOnly,
    read: authenticated,
    update: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Ad Soyad',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Rol',
      defaultValue: 'editor',
      required: true,
      access: {
        create: adminFieldOnly,
        update: adminFieldOnly,
      },
      options: [
        { label: 'Yönetici', value: 'admin' },
        { label: 'Editör', value: 'editor' },
      ],
    },
  ],
}
