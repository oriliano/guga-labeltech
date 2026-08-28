import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { CATEGORIES, categoryContentField } from '../lib/categories'

export const CatalogContent: GlobalConfig = {
  slug: 'catalog-content',
  label: 'Ürünlerin Kategori Sayfa Metinleri',
  admin: {
    group: 'İçerik',
    description:
      'Ürün kategorilerini listeye ekleyip kategori sayfasındaki başlık ve açıklamayı buradan yönetebilirsiniz.',
  },
  access: { read: anyone, update: authenticated },
  fields: [
    {
      name: 'categories',
      type: 'array',
      label: 'Ürün kategorileri',
      labels: { singular: 'Kategori', plural: 'Kategoriler' },
      admin: {
        description:
          '“Kategori ekle” ile düzenlemek istediğiniz ürün kategorisini seçin. Aynı kategoriyi iki kez eklemeyin.',
      },
      defaultValue: CATEGORIES.map((category) => ({ category: category.value })),
      fields: [
        {
          name: 'category',
          type: 'select',
          required: true,
          label: 'Kategori',
          options: CATEGORIES.map((category) => ({ label: category.label.tr, value: category.value })),
        },
        {
          name: 'label',
          type: 'text',
          localized: true,
          label: 'Sayfa başlığı',
          admin: { description: 'Boş bırakılırsa kategorinin mevcut adı kullanılır.' },
        },
        {
          name: 'lead',
          type: 'textarea',
          localized: true,
          label: 'Başlık altı açıklama',
          admin: { description: 'Kategori sayfasında başlığın altındaki kısa tanıtım metni.' },
        },
      ],
    },
    ...CATEGORIES.map((category) => ({
      name: categoryContentField(category),
      type: 'group' as const,
      label: category.label.tr,
      admin: { hidden: true },
      fields: [
        { name: 'label', type: 'text' as const, localized: true },
        { name: 'lead', type: 'textarea' as const, localized: true },
      ],
    })),
  ],
}
