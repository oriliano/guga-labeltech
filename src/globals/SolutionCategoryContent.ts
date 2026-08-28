import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { SOLUTION_CATEGORY_DEFINITIONS } from '../lib/solutionCategories'

export const SolutionCategoryContent: GlobalConfig = {
  slug: 'solution-category-content',
  label: 'Çözümlerin Kategori Sayfa Metinleri',
  admin: {
    group: 'İçerik',
    description:
      'Çözüm kategorilerini, kategori sayfası başlıklarını ve kısa açıklamalarını buradan yönetebilirsiniz.',
  },
  access: { read: anyone, update: authenticated },
  fields: [
    {
      name: 'categories',
      type: 'array',
      label: 'Çözüm kategorileri',
      labels: { singular: 'Kategori', plural: 'Kategoriler' },
      admin: {
        description:
          'Yeni kategori için “Kategori ekle”ye basın. Anahtarı kısa ve sabit yazın (depo, saglik gibi). Çözüm kaydındaki “Sektör etiketi” ile kategori başlığı aynı olmalıdır.',
      },
      defaultValue: SOLUTION_CATEGORY_DEFINITIONS.map((category) => ({ key: category.value })),
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
          label: 'Kategori anahtarı',
          admin: { description: 'URL için sabit anahtar. Örnek: depo, lojistik, soguk-zincir.' },
        },
        {
          name: 'label',
          type: 'text',
          localized: true,
          label: 'Kategori / sayfa başlığı',
          admin: {
            description:
              'Menüde, filtrede ve kategori sayfasında görünür. Yeni kategorilerde mutlaka doldurun.',
          },
        },
        {
          name: 'lead',
          type: 'textarea',
          localized: true,
          label: 'Başlık altı açıklama',
          admin: { description: 'Kategori sayfasının başlığı altında görünen kısa metin.' },
        },
      ],
    },
  ],
}
