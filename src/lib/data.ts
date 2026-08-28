import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { Locale } from './i18n'

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

export const getCatalogContent = async (locale: Locale) => {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'catalog-content', locale, depth: 0 })
}
