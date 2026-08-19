import type { Locale } from './i18n'

/**
 * BELCERT tarafından düzenlenen yönetim sistemi belgeleri. Bilgiler belgelerin
 * kendi üzerinden okundu: standart, belge numarası, yayın ve geçerlilik tarihi.
 * Belge yenilendiğinde buradaki tarih ve görsel birlikte güncellenmeli.
 */
export type Certificate = {
  standard: string
  title: Record<Locale, string>
  number: string
  issued: string
  validUntil: string
  image: string
}

export const CERTIFICATES: Certificate[] = [
  {
    standard: 'ISO 45001:2018',
    title: {
      tr: 'İş Sağlığı ve Güvenliği Yönetim Sistemi',
      en: 'Occupational Health and Safety Management System',
    },
    number: 'A1593255',
    issued: '2025-10-07',
    validUntil: '2026-10-07',
    image: '/img/sertifika-iso-45001.jpg',
  },
  {
    standard: 'ISO 14001:2015',
    title: {
      tr: 'Çevre Yönetim Sistemi',
      en: 'Environmental Management System',
    },
    number: 'A1593254',
    issued: '2025-10-07',
    validUntil: '2026-10-07',
    image: '/img/sertifika-iso-14001.jpg',
  },
  {
    standard: 'ISO 26000:2021',
    title: {
      tr: 'Sosyal Sorumluluk Yönetim Sistemi',
      en: 'Social Responsibility Management System',
    },
    number: 'A1593250',
    issued: '2025-10-07',
    validUntil: '2026-10-07',
    image: '/img/sertifika-iso-26000.jpg',
  },
]

export const CERTIFIER = {
  name: 'BELCERT Uluslararası Belgelendirme',
  accreditation: 'ILAS-MS-0089',
  verifyUrl: 'https://www.belcert.com',
}

export const formatDate = (value: string, locale: Locale) =>
  new Date(value).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
