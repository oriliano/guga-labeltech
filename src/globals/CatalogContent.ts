import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { CATEGORIES, categoryContentField } from '../lib/categories'

export const CatalogContent: GlobalConfig = {
  slug: 'catalog-content',
  label: 'Kategori Sayfa Metinleri',
  admin: {
    group: 'İçerik',
    description: 'Ürün kategori sayfalarının başlık ve açıklamalarını buradan değiştirebilirsiniz.',
  },
  access: { read: anyone, update: authenticated },
  fields: CATEGORIES.map((category) => ({
    name: categoryContentField(category),
    type: 'group',
    label: category.label.tr,
    fields: [
      {
        name: 'label',
        type: 'text',
        localized: true,
        label: 'Sayfa başlığı',
        admin: { description: `Boş bırakılırsa “${category.label.tr}” kullanılır.` },
      },
      {
        name: 'lead',
        type: 'textarea',
        localized: true,
        label: 'Başlık altı açıklama',
        admin: { description: 'Kategori sayfasında başlığın altındaki kısa tanıtım metni.' },
      },
    ],
  })),
}
