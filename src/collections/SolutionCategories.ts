import type { CollectionConfig, FieldHook } from 'payload'

import { anyone, authenticated } from '../access'
import { slugify } from '../fields/slug'

/**
 * Çözüm kategorileri; ürün kategorileriyle aynı düzen. Kategori listesi eskiden
 * kodda sabitti, çözüm kaydındaki sektör etiketi de serbest metindi; hangi
 * çözümün hangi grupta çıkacağı yazılan metnin harfine bağlıydı. Artık kategori
 * bir kayıt: panelden eklenip sıralanıyor, kategori sayfasının başlığı ve
 * açıklaması burada duruyor, çözüm kaydı da bu koleksiyona bağlanıyor.
 */
/** Boş bırakılan anahtar/adres alanını kategori adından üretir. */
const slugFrom =
  (from: string): FieldHook =>
  ({ value, data }) => {
    if (typeof value === 'string' && value.trim()) return slugify(value)
    const source = data?.[from]
    return typeof source === 'string' ? slugify(source) : value
  }

export const SolutionCategories: CollectionConfig = {
  slug: 'solution-categories',
  labels: { singular: 'Çözüm Kategorisi', plural: 'Çözüm Kategorileri' },
  admin: {
    group: 'İçerik',
    useAsTitle: 'title',
    defaultColumns: ['title', 'key', 'order', 'updatedAt'],
    description:
      'Çözüm kategorileri ve kategori sayfalarının metinleri. Yeni kategori eklediğinizde menüde, filtre şeridinde ve çözüm formundaki kategori listesinde kendiliğinden görünür.',
  },
  defaultSort: 'order',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Kategori adı',
      admin: { description: 'Menüde, filtrede ve kategori sayfasının başlığında görünür.' },
    },
    {
      name: 'lead',
      type: 'textarea',
      localized: true,
      label: 'Başlık altı açıklama',
      admin: { description: 'Kategori sayfasında başlığın altındaki kısa tanıtım metni.' },
    },
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Kategori anahtarı',
      admin: {
        position: 'sidebar',
        description:
          'Kod tarafındaki sabit anahtar (depo, soguk-zincir gibi). Boş bırakılırsa kategori adından üretilir. Bir kez verilir, sonradan değiştirmeyin.',
      },
      hooks: { beforeValidate: [slugFrom('title')] },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      localized: true,
      index: true,
      label: 'URL adresi',
      admin: {
        position: 'sidebar',
        description:
          'Kategori sayfasının adresi, her dil için ayrı. Boş bırakılırsa kategori adından üretilir. Yayındaki bir adresi değiştirmek bağlantıları kırar.',
      },
      hooks: { beforeValidate: [slugFrom('title')] },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Sıra',
      admin: {
        position: 'sidebar',
        description: 'Küçük sayı önce gelir. Menüdeki ve listedeki sırayı belirler.',
      },
    },
  ],
}
