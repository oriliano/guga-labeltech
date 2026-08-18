import type { Field } from 'payload'

const TURKISH_MAP: Record<string, string> = {
  ç: 'c',
  ğ: 'g',
  ı: 'i',
  İ: 'i',
  ö: 'o',
  ş: 's',
  ü: 'u',
}

/**
 * URL-safe slug. Turkish letters are transliterated rather than stripped, so
 * "RFID Depo Yönetimi" becomes "rfid-depo-yonetimi" and not "rfid-depo-y-netimi".
 */
export const slugify = (value: string): string =>
  value
    .trim()
    .replace(/[çğıİöşü]/g, (char) => TURKISH_MAP[char] ?? char)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const slugField = (from = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  label: 'URL adresi',
  admin: {
    position: 'sidebar',
    description: 'Boş bırakılırsa başlıktan otomatik üretilir. Yayındaki bir sayfanın adresini değiştirmek bağlantıları kırar.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.length > 0) return slugify(value)
        const source = data?.[from]
        return typeof source === 'string' ? slugify(source) : value
      },
    ],
  },
})
