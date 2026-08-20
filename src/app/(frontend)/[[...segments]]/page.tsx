import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  GroupedProducts,
  HomePage,
  ListingPage,
  PostDetail,
  ProductDetail,
  SolutionDetail,
} from '@/components/pages'
import { AboutPage } from '@/components/pages/about'
import { KvkkPage, PrivacyPage } from '@/components/pages/legal'
import { ContactPage, ExportPage } from '@/components/pages/static'
import { ProductGlyph } from '@/components/site/ProductGlyph'
import { Shell } from '@/components/site/Shell'
import { ArticleJsonLd, BreadcrumbJsonLd, ProductJsonLd } from '@/components/site/StructuredData'
import {
  findBySlug,
  getSiteSettings,
  listPosts,
  listProducts,
  listSolutions,
} from '@/lib/data'
import { DEFAULT_LOCALE, isLocale, t, type Locale } from '@/lib/i18n'
import { CATEGORIES, CATEGORY_SEGMENT, categoryBySlug, categoryPath } from '@/lib/categories'
import { postImage, productPhoto, solutionImage } from '@/lib/imagery'
import { imageUrl } from '@/lib/media'
import { alternatePath, legalPath, matchLegal, matchSection, sectionPath, type Section } from '@/lib/routes'

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
  const legal = path[0] && !section ? matchLegal(locale, path[0]) : null
  return { locale, section, legal, slug: path[1], extra: path.slice(2), isHome: path.length === 0 }
}

const titleFor = (section: Section, locale: Locale) =>
  ({
    products: t('nav.products', locale),
    solutions: t('nav.solutions', locale),
    insights: t('nav.insights', locale),
    about: t('nav.about', locale),
    export: t('nav.export', locale),
    contact: t('nav.contact', locale),
  })[section]

export const generateMetadata = async ({ params }: { params: Promise<Params> }): Promise<Metadata> => {
  const { locale, section, legal, slug, extra, isHome } = resolve((await params).segments)
  const settings = await getSiteSettings(locale)

  if (legal) {
    const title =
      legal === 'kvkk'
        ? locale === 'tr'
          ? 'Kişisel Verilerin Korunması Aydınlatma Metni'
          : 'Personal Data Protection Notice'
        : locale === 'tr'
          ? 'Gizlilik ve Çerez Politikası'
          : 'Privacy and Cookie Policy'
    return {
      title,
      alternates: {
        canonical: legalPath(legal, locale),
        languages: { tr: legalPath(legal, 'tr'), en: legalPath(legal, 'en') },
      },
    }
  }

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

  if (section === 'products' && slug === CATEGORY_SEGMENT[locale] && extra[0]) {
    const category = categoryBySlug(locale, extra[0])
    if (category) {
      return {
        title: category.label[locale],
        description: category.lead[locale],
        alternates: {
          canonical: categoryPath(category, locale),
          languages: { tr: categoryPath(category, 'tr'), en: categoryPath(category, 'en') },
        },
      }
    }
  }

  if (section && slug) {
    const collection = { products: 'products', solutions: 'solutions', insights: 'posts' }[
      section as string
    ] as 'products' | 'solutions' | 'posts' | undefined
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
  const { locale, section, legal, slug, extra, isHome } = resolve((await params).segments)
  const isCategory = section === 'products' && slug === CATEGORY_SEGMENT[locale] && extra.length === 1
  if (extra.length && !isCategory) notFound()

  // A category page has its own localized segments, so the language switch has to
  // be built from the category rather than from the section alone.
  const otherLocale: Locale = locale === 'tr' ? 'en' : 'tr'
  const categoryOnPage = isCategory ? categoryBySlug(locale, extra[0]) : undefined
  const alternateHref = legal
    ? legalPath(legal, otherLocale)
    : categoryOnPage
      ? categoryPath(categoryOnPage, otherLocale)
      : alternatePath(locale, section, slug)

  const content = await (async () => {
    if (legal) return legal === 'kvkk' ? <KvkkPage locale={locale} /> : <PrivacyPage locale={locale} />

    if (isHome) {
      const [settings, solutions] = await Promise.all([
        getSiteSettings(locale),
        listSolutions({ locale }),
      ])
      return (
        <HomePage
          locale={locale}
          tagline={
            settings?.tagline ??
            (locale === 'tr'
              ? 'RFID etiket ve donanım üretimi, IoT ve RTLS yazılımlarıyla depodan perakendeye tam izlenebilirlik.'
              : 'RFID tag and hardware manufacturing with IoT and RTLS software for full traceability.')
          }
          solutions={solutions.map((item: any) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            sector: item.sector ?? undefined,
            excerpt: item.excerpt ?? undefined,
            image: imageUrl(item.heroImage, solutionImage(item.slug)),
          }))}
        />
      )
    }

    if (!section) notFound()

    switch (section) {
      case 'products': {
        if (slug === CATEGORY_SEGMENT[locale] && extra[0]) {
          const category = categoryBySlug(locale, extra[0])
          if (!category) notFound()
          const products = await listProducts({ locale, where: { category: { equals: category.value } } })
          return (
            <>
              <BreadcrumbJsonLd locale={locale} section="products" title={category.label[locale]} />
              <ListingPage
                eyebrow={t('nav.products', locale)}
                title={category.label[locale]}
                lead={category.lead[locale]}
                items={products}
                emptyText={t('empty.products', locale)}
                hrefFor={(item) => sectionPath('products', locale, item.slug)}
                eyebrowOf={(item) => item.model ?? undefined}
                bodyOf={(item) => item.excerpt ?? undefined}
                imageOf={(item) => imageUrl(item.images?.[0], productPhoto(item.slug))}
                visualOf={(item) => <ProductGlyph category={item.category} className="h-full w-full" />}
                filters={{
                  label: t('label.category', locale),
                  items: CATEGORIES.map((entry) => ({
                    label: entry.label[locale],
                    href: categoryPath(entry, locale),
                    active: entry.value === category.value,
                  })),
                  allHref: sectionPath('products', locale),
                  allLabel: t('cta.allProducts', locale),
                }}
              />
            </>
          )
        }
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
        // Gruplama tum katalogu istiyor; varsayilan 100 limiti kalabalik
        // kategorilerde sayiyi yanlis gosteriyordu.
        const products = await listProducts({ locale, limit: 500 })
        // Liste kategori kategori gruplanıyor; tek uzun ızgara 48 üründe
        // gezilmesi zor bir yığın oluyordu.
        // Grupta ilk üç ürün gösteriliyor; sıra panelden `order` alanıyla
        // belirleniyor, gerisi kategori sayfasında.
        const PREVIEW = 3
        const groups = CATEGORIES.map((category) => {
          const inCategory = products.filter((item: any) => item.category === category.value)
          return {
            key: category.value,
            label: category.label[locale],
            lead: category.lead[locale],
            href: categoryPath(category, locale),
            total: inCategory.length,
            // Etiket oldugu gibi kullaniliyor; Turkce kucultme "RFID"yi "rfıd"
            // yapip marka adini bozuyordu.
            moreLabel:
              locale === 'tr'
                ? `Tüm ${category.label[locale]} (${inCategory.length})`
                : `All ${category.label[locale]} (${inCategory.length})`,
            items: inCategory.slice(0, PREVIEW).map((item: any) => ({
              id: item.id,
              title: item.title,
              model: item.model,
              excerpt: item.excerpt,
              href: sectionPath('products', locale, item.slug),
              // Panelden yuklenen fotograf her zaman once gelir; depodaki statik
              // gorsel yalnizca fotograf yoksa devreye giriyor.
              image: imageUrl(item.images?.[0], productPhoto(item.slug)),
            })),
          }
        }).filter((group) => group.total)

        return (
          <>
            <BreadcrumbJsonLd locale={locale} section="products" />
            <GroupedProducts
              eyebrow={t('nav.products', locale)}
              title={t('nav.products', locale)}
              lead={
                locale === 'tr'
                  ? 'RFID etiket, endüstriyel tag, okuyucu, kart, ribon ve yaka ipi ürünlerimiz.'
                  : 'RFID tags, industrial tags, readers, cards, ribbons and lanyards.'
              }
              groups={groups}
              filters={{
                label: t('label.category', locale),
                items: CATEGORIES.map((entry) => ({
                  label: entry.label[locale],
                  href: categoryPath(entry, locale),
                  active: false,
                })),
                allHref: sectionPath('products', locale),
                allLabel: t('cta.allProducts', locale),
              }}
            />
          </>
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
            imageOf={(item) => imageUrl(item.heroImage, solutionImage(item.slug))}
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
            imageOf={(item) => imageUrl(item.coverImage, postImage(item.slug))}
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
