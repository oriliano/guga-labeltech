import type { CollectionConfig, FieldHook } from 'payload'

import { anyone, authenticated } from '../access'
import { slugify } from '../fields/slug'

/**
 * Ürün kategorileri. Önceden kategori listesi kodun içinde sabit bir seçim
 * listesiydi; yeni kategori açmak dağıtım gerektiriyordu. Artık kategori de
 * içerik: panelden eklenip sıralanabiliyor, kategori sayfasının başlığı ve
 * açıklaması da burada duruyor. Ürün kaydındaki "Kategori" alanı bu koleksiyona
 * bağlı, o yüzden yeni kategori eklendiği anda ürün formunda seçilebiliyor.
 */
/** Boş bırakılan anahtar/adres alanını kategori adından üretir. */
const slugFrom =
  (from: string): FieldHook =>
  ({ value, data }) => {
    if (typeof value === 'string' && value.trim()) return slugify(value)
    const source = data?.[from]
    return typeof source === 'string' ? slugify(source) : value
  }

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  labels: { singular: 'Ürün Kategorisi', plural: 'Ürün Kategorileri' },
  admin: {
    group: 'İçerik',
    useAsTitle: 'title',
    defaultColumns: ['title', 'key', 'order', 'updatedAt'],
    description:
      'Ürün kategorileri ve kategori sayfalarının metinleri. Yeni kategori eklediğinizde menüde, filtre şeridinde ve ürün formundaki kategori listesinde kendiliğinden görünür.',
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
          'Kod tarafındaki sabit anahtar (rfid-etiket gibi). Boş bırakılırsa kategori adından üretilir. Bir kez verilir, sonradan değiştirmeyin.',
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
