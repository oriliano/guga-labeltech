import { DEFAULT_LOCALE, localePrefix, type Locale } from './i18n'

/**
 * Section slugs are localized so URLs read naturally in both languages:
 * /urunler/guga-ty850 and /en/products/guga-ty850.
 */
export const SECTION_SLUGS = {
  products: { tr: 'urunler', en: 'products' },
  solutions: { tr: 'cozumler', en: 'solutions' },
  references: { tr: 'referanslar', en: 'references' },
  insights: { tr: 'bilgi-merkezi', en: 'insights' },
  about: { tr: 'kurumsal', en: 'company' },
  export: { tr: 'ihracat', en: 'export' },
  contact: { tr: 'iletisim', en: 'contact' },
} as const

export type Section = keyof typeof SECTION_SLUGS

export const sectionPath = (section: Section, locale: Locale, slug?: string): string => {
  const base = `${localePrefix(locale)}/${SECTION_SLUGS[section][locale]}`
  return slug ? `${base}/${slug}` : base
}

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
