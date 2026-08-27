import { DEFAULT_LOCALE, localePrefix, type Locale } from './i18n'

/**
 * Section slugs are localized so URLs read naturally in both languages:
 * /urunler/guga-ty850 and /en/products/guga-ty850.
 */
export const SECTION_SLUGS = {
  products: { tr: 'urunler', en: 'products' },
  solutions: { tr: 'cozumler', en: 'solutions' },
  references: { tr: 'referanslar', en: 'references' },
  projects: { tr: 'projeler', en: 'projects' },
  insights: { tr: 'bilgi-merkezi', en: 'insights' },
  about: { tr: 'kurumsal', en: 'company' },
  export: { tr: 'ihracat', en: 'export' },
  contact: { tr: 'iletisim', en: 'contact' },
} as const

/** Yasal sayfalar menüde değil, alt bilgide duruyor. */
export const LEGAL_SLUGS = {
  kvkk: { tr: 'kvkk-aydinlatma-metni', en: 'data-protection' },
  privacy: { tr: 'gizlilik-politikasi', en: 'privacy' },
} as const

export type Legal = keyof typeof LEGAL_SLUGS

export const legalPath = (page: Legal, locale: Locale): string =>
  `${localePrefix(locale)}/${LEGAL_SLUGS[page][locale]}`

export const matchLegal = (locale: Locale, segment: string): Legal | null => {
  const entry = (Object.entries(LEGAL_SLUGS) as [Legal, Record<Locale, string>][]).find(
    ([, slugs]) => slugs[locale] === segment,
  )
  return entry ? entry[0] : null
}

export type Section = keyof typeof SECTION_SLUGS

export const sectionPath = (section: Section, locale: Locale, slug?: string): string => {
  const base = `${localePrefix(locale)}/${SECTION_SLUGS[section][locale]}`
  return slug ? `${base}/${slug}` : base
}

export const CONTENT_CATEGORY_SEGMENT = { tr: 'kategori', en: 'category' } as const

export const contentCategoryPath = (section: Section, locale: Locale, category: string): string =>
  `${sectionPath(section, locale)}/${CONTENT_CATEGORY_SEGMENT[locale]}/${category}`

export const homePath = (locale: Locale): string => localePrefix(locale) || '/'

/** Resolves an incoming URL path into a locale plus a section, or null when unknown. */
export const matchSection = (locale: Locale, segment: string): Section | null => {
  const entry = (Object.entries(SECTION_SLUGS) as [Section, Record<Locale, string>][]).find(
    ([, slugs]) => slugs[locale] === segment,
  )
  return entry ? entry[0] : null
}

/** Same page in the other language, used by the language switcher and hreflang tags. */
export const alternatePath = (
  locale: Locale,
  section: Section | null,
  slug?: string,
): string => {
  const other: Locale = locale === 'tr' ? 'en' : 'tr'
  if (!section) return homePath(other)
  return sectionPath(section, other, slug)
}

export const absoluteUrl = (path: string): string => {
  const base = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export { DEFAULT_LOCALE }
