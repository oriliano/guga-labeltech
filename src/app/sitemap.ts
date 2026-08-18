import type { MetadataRoute } from 'next'

// Queries the database, so it must not be prerendered at build time.
export const dynamic = 'force-dynamic'

import { listPosts, listProducts, listReferences, listSolutions } from '@/lib/data'
import { LOCALES, type Locale } from '@/lib/i18n'
import { absoluteUrl, sectionPath, type Section } from '@/lib/routes'

const STATIC_SECTIONS: Section[] = ['products', 'solutions', 'references', 'insights', 'about', 'export', 'contact']

const entry = (path: string, priority: number, lastModified?: string): MetadataRoute.Sitemap[number] => ({
  url: absoluteUrl(path),
  lastModified: lastModified ? new Date(lastModified) : undefined,
  priority,
})

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of LOCALES as readonly Locale[]) {
    entries.push(entry(locale === 'tr' ? '/' : '/en', 1))
    for (const section of STATIC_SECTIONS) entries.push(entry(sectionPath(section, locale), 0.8))

    const [products, solutions, references, posts] = await Promise.all([
      listProducts({ locale, limit: 500 }),
      listSolutions({ locale, limit: 500 }),
      listReferences({ locale, limit: 200 }),
      listPosts({ locale, limit: 200 }),
    ])

    for (const doc of products) entries.push(entry(sectionPath('products', locale, doc.slug), 0.7, doc.updatedAt))
    for (const doc of solutions) entries.push(entry(sectionPath('solutions', locale, doc.slug), 0.7, doc.updatedAt))
    for (const doc of references) entries.push(entry(sectionPath('references', locale, doc.slug), 0.6, doc.updatedAt))
    for (const doc of posts) entries.push(entry(sectionPath('insights', locale, doc.slug), 0.6, doc.updatedAt))
  }

  return entries
}

export default sitemap
