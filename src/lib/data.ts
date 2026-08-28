import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { FALLBACK_CATEGORIES, type ProductCategory } from './categories'
import type { Locale } from './i18n'
import { FALLBACK_SOLUTION_CATEGORIES, type SolutionCategory } from './solutionCategories'

/**
 * `locale: 'all'` ile okunan alan {tr, en} nesnesi dönüyor. Bir dil boşsa
 * diğerine düşüyor ki menü ya da başlık boş kalmasın.
 */
const localized = (value: unknown, fallback = ''): Record<Locale, string> => {
  const record = (value ?? {}) as Partial<Record<Locale, string>>
  const tr = record.tr?.trim() || record.en?.trim() || fallback
  const en = record.en?.trim() || tr
  return { tr, en }
}

export const payloadClient = async () => getPayload({ config: configPromise })

type ListArgs = {
  locale: Locale
  limit?: number
  where?: Record<string, unknown>
  sort?: string
}

export const listProducts = async ({ locale, limit = 100, where, sort = 'order' }: ListArgs) => {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    locale,
    limit,
    sort,
    where: { _status: { equals: 'published' }, ...(where ?? {}) },
    depth: 1,
  })
  return docs
}

export const listSolutions = async ({ locale, limit = 100, where, sort = 'order' }: ListArgs) => {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'solutions',
    locale,
    limit,
    sort,
    where: { _status: { equals: 'published' }, ...(where ?? {}) },
    depth: 1,
  })
  return docs
}

export const listReferences = async ({ locale, limit = 100, where, sort = 'order' }: ListArgs) => {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'references',
    locale,
    limit,
    sort,
    where: { _status: { equals: 'published' }, ...(where ?? {}) },
    depth: 1,
  })
  return docs
}

export const listProjects = async ({ locale, limit = 100, where, sort = 'order' }: ListArgs) => {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    locale,
    limit,
    sort,
    where: { _status: { equals: 'published' }, ...(where ?? {}) },
    depth: 1,
  })
  return docs
}

export const listPosts = async ({ locale, limit = 50 }: ListArgs) => {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    locale,
    limit,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
    depth: 1,
  })
  return docs
}

export const findBySlug = async <T extends 'products' | 'solutions' | 'references' | 'projects' | 'posts'>(
  collection: T,
  slug: string,
  locale: Locale,
) => {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection,
    locale,
    limit: 1,
    depth: 2,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  return docs[0] ?? null
}

export const getSiteSettings = async (locale: Locale) => {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'site-settings', locale, depth: 1 })
}

export const getNavigation = async (locale: Locale) => {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'navigation', locale, depth: 0 })
}

/**
 * Ürün kategorileri iki dilde birden okunuyor (`locale: 'all'`): dil değiştirme
 * bağlantısı ve alternatif adresler için diğer dilin slug'ı da gerekiyor.
 * Koleksiyon boşsa koddaki yedek liste dönüyor, böylece temiz bir kurulumda
 * menü ve kategori sayfaları yine çalışıyor.
 */
export const listProductCategories = async (): Promise<ProductCategory[]> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'product-categories',
    locale: 'all',
    limit: 0,
    sort: 'order',
    depth: 0,
  })

  const mapped = docs.map((doc: any) => {
    const label = localized(doc.title, doc.key ?? '')
    return {
      id: doc.id,
      value: doc.key ?? String(doc.id),
      label,
      slug: localized(doc.slug, doc.key ?? ''),
      lead: localized(doc.lead),
    }
  })

  return mapped.length ? mapped : FALLBACK_CATEGORIES
}

/** Çözüm kategorileri; ürün kategorileriyle aynı okuma düzeni. */
export const listSolutionCategories = async (): Promise<SolutionCategory[]> => {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'solution-categories',
    locale: 'all',
    limit: 0,
    sort: 'order',
    depth: 0,
  })

  const mapped = docs.map((doc: any) => {
    const label = localized(doc.title, doc.key ?? '')
    return {
      id: doc.id,
      value: doc.key ?? String(doc.id),
      label,
      slug: localized(doc.slug, doc.key ?? ''),
      lead: localized(doc.lead),
    }
  })

  return mapped.length ? mapped : FALLBACK_SOLUTION_CATEGORIES
}

export const getCorporateContent = async (locale: Locale) => {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'corporate-content', locale, depth: 1 })
}
