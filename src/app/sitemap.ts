import type { MetadataRoute } from 'next'

// Queries the database, so it must not be prerendered at build time.
export const dynamic = 'force-dynamic'

import {
  listPosts,
  listProductCategories,
  listProducts,
  listProjects,
  listReferences,
  listSolutions,
} from '@/lib/data'
import { categoryPath } from '@/lib/categories'
import { LOCALES, type Locale } from '@/lib/i18n'
import { LEGAL_SLUGS, absoluteUrl, legalPath, sectionPath, type Legal, type Section } from '@/lib/routes'

const STATIC_SECTIONS: Section[] = ['products', 'solutions', 'references', 'projects', 'insights', 'about', 'contact']

const entry = (path: string, priority: number, lastModified?: string): MetadataRoute.Sitemap[number] => ({
  url: absoluteUrl(path),
  lastModified: lastModified ? new Date(lastModified) : undefined,
  priority,
})

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const entries: MetadataRoute.Sitemap = []
  const categories = await listProductCategories()

  for (const locale of LOCALES as readonly Locale[]) {
    entries.push(entry(locale === 'tr' ? '/' : '/en', 1))
    for (const section of STATIC_SECTIONS) entries.push(entry(sectionPath(section, locale), 0.8))
    for (const category of categories) entries.push(entry(categoryPath(category, locale), 0.75))
    for (const page of Object.keys(LEGAL_SLUGS) as Legal[]) entries.push(entry(legalPath(page, locale), 0.3))

    const [products, solutions, references, projects, posts] = await Promise.all([
      listProducts({ locale, limit: 500 }),
      listSolutions({ locale, limit: 500 }),
      listReferences({ locale, limit: 500 }),
      listProjects({ locale, limit: 500 }),
      listPosts({ locale, limit: 200 }),
    ])

    for (const doc of products) entries.push(entry(sectionPath('products', locale, doc.slug), 0.7, doc.updatedAt))
    for (const doc of solutions) entries.push(entry(sectionPath('solutions', locale, doc.slug), 0.7, doc.updatedAt))
    for (const doc of references) entries.push(entry(sectionPath('references', locale, doc.slug), 0.7, doc.updatedAt))
    for (const doc of projects) entries.push(entry(sectionPath('projects', locale, doc.slug), 0.7, doc.updatedAt))
    for (const doc of posts) entries.push(entry(sectionPath('insights', locale, doc.slug), 0.6, doc.updatedAt))
  }

  return entries
}

export default sitemap
