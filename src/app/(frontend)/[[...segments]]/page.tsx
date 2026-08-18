import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { HomePage, ListingPage, PostDetail, ProductDetail, ReferenceDetail, SolutionDetail } from '@/components/pages'
import { AboutPage, ContactPage, ExportPage } from '@/components/pages/static'
import { Shell } from '@/components/site/Shell'
import { ArticleJsonLd, BreadcrumbJsonLd, ProductJsonLd } from '@/components/site/StructuredData'
import {
  findBySlug,
  getSiteSettings,
  listPosts,
  listProducts,
  listReferences,
  listSolutions,
} from '@/lib/data'
import { DEFAULT_LOCALE, isLocale, t, type Locale } from '@/lib/i18n'
import { alternatePath, matchSection, sectionPath, type Section } from '@/lib/routes'

// Railway's private network is unavailable during build, so pages render per request
// instead of being prerendered against the database.
export const dynamic = 'force-dynamic'

type Params = { segments?: string[] }

/** Splits `/en/products/guga-ty850` into locale `en`, section `products`, slug `guga-ty850`. */
const resolve = (segments: string[] = []) => {
  const [first, ...rest] = segments
  const locale: Locale = first && isLocale(first) ? first : DEFAULT_LOCALE
  const path = first && isLocale(first) ? rest : segments
  const section = path[0] ? matchSection(locale, path[0]) : null
  return { locale, section, slug: path[1], extra: path.slice(2), isHome: path.length === 0 }
}

const titleFor = (section: Section, locale: Locale) =>
  ({
    products: t('nav.products', locale),
    solutions: t('nav.solutions', locale),
    references: t('nav.references', locale),
    insights: t('nav.insights', locale),
    about: t('nav.about', locale),
    export: t('nav.export', locale),
    contact: t('nav.contact', locale),
  })[section]

export const generateMetadata = async ({ params }: { params: Promise<Params> }): Promise<Metadata> => {
  const { locale, section, slug, isHome } = resolve((await params).segments)
  const settings = await getSiteSettings(locale)

  const alternates = {
    canonical: slug && section ? sectionPath(section, locale, slug) : section ? sectionPath(section, locale) : locale === 'tr' ? '/' : '/en',
    languages: {
      tr: section ? sectionPath(section, 'tr', slug) : '/',
      en: section ? sectionPath(section, 'en', slug) : '/en',
    },
  }

  if (isHome) {
    return {
      title: { absolute: `${settings?.brandName ?? 'GUGA LABELTECH'} — ${settings?.tagline ?? 'RFID, IoT ve izlenebilirlik'}` },
      description: settings?.tagline ?? undefined,
      alternates,
    }
  }

  if (section && slug) {
    const collection = { products: 'products', solutions: 'solutions', insights: 'posts', references: 'references' }[
      section as string
    ] as 'products' | 'solutions' | 'posts' | 'references' | undefined
    if (collection) {
      const doc: any = await findBySlug(collection, slug, locale)
      if (doc) {
        return {
          title: doc.metaTitle || doc.title,
          description: doc.metaDescription || doc.excerpt || undefined,
          robots: doc.noIndex ? { index: false, follow: false } : undefined,
          alternates,
        }
      }
    }
  }

  return { title: section ? titleFor(section, locale) : undefined, alternates }
}

const Page = async ({ params }: { params: Promise<Params> }) => {
  const { locale, section, slug, extra, isHome } = resolve((await params).segments)
  if (extra.length) notFound()

  const alternateHref = alternatePath(locale, section, slug)

  const content = await (async () => {
    if (isHome) {
      const [settings, solutions, products, references, posts] = await Promise.all([
        getSiteSettings(locale),
        listSolutions({ locale, limit: 6 }),
        listProducts({ locale, limit: 8, where: { featured: { equals: true } } }),
        listReferences({ locale, limit: 3 }),
        listPosts({ locale, limit: 3 }),
      ])
      const featured = products.length ? products : await listProducts({ locale, limit: 8 })
      return (
        <HomePage
          locale={locale}
          tagline={
            settings?.tagline ??
            (locale === 'tr'
              ? 'RFID etiket ve donanım üretimi, IoT ve RTLS yazılımlarıyla depodan perakendeye tam izlenebilirlik.'
              : 'RFID tag and hardware manufacturing with IoT and RTLS software for full traceability.')
          }
          solutions={solutions}
          products={featured}
          references={references}
          posts={posts}
        />
      )
    }

    if (!section) notFound()

    switch (section) {
      case 'products': {
        if (slug) {
          const product = await findBySlug('products', slug, locale)
          if (!product) notFound()
          return (
            <>
              <BreadcrumbJsonLd locale={locale} section="products" title={product.title} />
              <ProductJsonLd locale={locale} product={product} />
              <ProductDetail locale={locale} product={product} />
            </>
          )
        }
        const products = await listProducts({ locale })
        return (
          <ListingPage
            title={t('nav.products', locale)}
            lead={
              locale === 'tr'
                ? 'RFID etiket, endüstriyel tag, okuyucu, kart, ribon ve yaka ipi ürünlerimiz.'
                : 'RFID tags, industrial tags, readers, cards, ribbons and lanyards.'
            }
            items={products}
            emptyText={t('empty.products', locale)}
            hrefFor={(item) => sectionPath('products', locale, item.slug)}
            eyebrowOf={(item) => item.model ?? undefined}
            bodyOf={(item) => item.excerpt ?? undefined}
          />
        )
      }
      case 'solutions': {
        if (slug) {
          const solution = await findBySlug('solutions', slug, locale)
          if (!solution) notFound()
          return (
            <>
              <BreadcrumbJsonLd locale={locale} section="solutions" title={solution.title} />
              <SolutionDetail locale={locale} solution={solution} />
            </>
          )
        }
        const solutions = await listSolutions({ locale })
        return (
          <ListingPage
            title={t('nav.solutions', locale)}
            lead={
              locale === 'tr'
                ? 'Sektöre özel RFID, RTLS ve IoT kurguları.'
                : 'Sector-specific RFID, RTLS and IoT deployments.'
            }
            items={solutions}
            emptyText={t('empty.products', locale)}
            hrefFor={(item) => sectionPath('solutions', locale, item.slug)}
            eyebrowOf={(item) => item.sector ?? undefined}
            bodyOf={(item) => item.excerpt ?? undefined}
          />
        )
      }
      case 'references': {
        if (slug) {
          const item = await findBySlug('references', slug, locale)
          if (!item) notFound()
          return (
            <>
              <BreadcrumbJsonLd locale={locale} section="references" title={item.title} />
              <ReferenceDetail locale={locale} item={item} />
            </>
          )
        }
        const items = await listReferences({ locale })
        return (
          <ListingPage
            title={t('nav.references', locale)}
            items={items}
            emptyText={t('empty.references', locale)}
            hrefFor={(item) => sectionPath('references', locale, item.slug)}
            eyebrowOf={(item) => item.sector}
            bodyOf={(item) => item.challenge}
          />
        )
      }
      case 'insights': {
        if (slug) {
          const post = await findBySlug('posts', slug, locale)
          if (!post) notFound()
          return (
            <>
              <BreadcrumbJsonLd locale={locale} section="insights" title={post.title} />
              <ArticleJsonLd locale={locale} post={post} />
              <PostDetail locale={locale} post={post} />
            </>
          )
        }
        const posts = await listPosts({ locale })
        return (
          <ListingPage
            title={t('nav.insights', locale)}
            items={posts}
            emptyText={t('empty.posts', locale)}
            hrefFor={(item) => sectionPath('insights', locale, item.slug)}
            bodyOf={(item) => item.excerpt}
          />
        )
      }
      case 'about':
        return <AboutPage locale={locale} settings={await getSiteSettings(locale)} />
      case 'export':
        return <ExportPage locale={locale} settings={await getSiteSettings(locale)} />
      case 'contact':
        return <ContactPage locale={locale} settings={await getSiteSettings(locale)} />
      default:
        notFound()
    }
  })()

  return (
    <Shell locale={locale} alternateHref={alternateHref}>
      {content}
    </Shell>
  )
}

export default Page
