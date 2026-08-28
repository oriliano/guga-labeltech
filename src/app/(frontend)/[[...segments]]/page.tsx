import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  CaseStudyDetail,
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
  getCorporateContent,
  getSiteSettings,
  listPosts,
  listProductCategories,
  listProjects,
  listProducts,
  listReferences,
  listSolutionCategories,
  listSolutions,
} from '@/lib/data'
import { DEFAULT_LOCALE, isLocale, t, type Locale } from '@/lib/i18n'
import { CATEGORY_SEGMENT, categoryBySlug, categoryOfProduct, categoryPath } from '@/lib/categories'
import { postImage, productPhoto, solutionImage } from '@/lib/imagery'
import { imageFitOf, imageUrl } from '@/lib/media'
import {
  CONTENT_CATEGORY_SEGMENT,
  alternatePath,
  contentCategoryPath,
  legalPath,
  matchLegal,
  matchSection,
  sectionPath,
  type Section,
} from '@/lib/routes'
import { slugify } from '@/fields/slug'
import { categoryOfSolution, solutionCategoryPath } from '@/lib/solutionCategories'

// Railway's private network is unavailable during build, so pages render per request
// instead of being prerendered against the database.
export const dynamic = 'force-dynamic'

type Params = { segments?: string[] }
type ContentSection = 'solutions' | 'references' | 'projects'

const isContentSection = (section: Section | null): section is ContentSection =>
  section === 'solutions' || section === 'references' || section === 'projects'

const listContent = (section: ContentSection, locale: Locale) => {
  switch (section) {
    case 'solutions':
      return listSolutions({ locale, limit: 500 })
    case 'references':
      return listReferences({ locale, limit: 500 })
    case 'projects':
      return listProjects({ locale, limit: 500 })
  }
}

const collectionForContent = (
  section: ContentSection,
): 'solutions' | 'references' | 'projects' =>
  section

const contentLead = (section: ContentSection, locale: Locale) => {
  const copy = {
    solutions: {
      tr: 'Sektöre özel RFID, RTLS ve IoT kurguları.',
      en: 'Sector-specific RFID, RTLS and IoT deployments.',
    },
    references: {
      tr: 'Farklı sektörlerde tamamladığımız uygulama örnekleri.',
      en: 'Examples of deployments completed across different sectors.',
    },
    projects: {
      tr: 'İhtiyaca göre tasarlanan ve uygulanan RFID projeleri.',
      en: 'RFID projects designed and delivered around each deployment need.',
    },
  } as const
  return copy[section][locale]
}

const contentItemLabel = (section: ContentSection, locale: Locale) => {
  const labels = {
    solutions: { tr: 'çözüm', en: 'solutions' },
    references: { tr: 'referans', en: 'references' },
    projects: { tr: 'proje', en: 'projects' },
  } as const
  return labels[section][locale]
}

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
    references: t('nav.references', locale),
    projects: t('nav.projects', locale),
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
    const category = categoryBySlug(await listProductCategories(), locale, extra[0])
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
    const collection = {
      products: 'products',
      solutions: 'solutions',
      references: 'references',
      projects: 'projects',
      insights: 'posts',
    }[
      section as string
    ] as 'products' | 'solutions' | 'references' | 'projects' | 'posts' | undefined
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
  const isProductCategory = section === 'products' && slug === CATEGORY_SEGMENT[locale] && extra.length === 1
  const isContentCategory = isContentSection(section) && slug === CONTENT_CATEGORY_SEGMENT[locale] && extra.length === 1
  if (extra.length && !isProductCategory && !isContentCategory) notFound()

  // A category page has its own localized segments, so the language switch has to
  // be built from the category rather than from the section alone.
  const otherLocale: Locale = locale === 'tr' ? 'en' : 'tr'
  const productCategories = isProductCategory || section === 'products' ? await listProductCategories() : []
  const categoryOnPage = isProductCategory ? categoryBySlug(productCategories, locale, extra[0]) : undefined
  const alternateHref = legal
    ? legalPath(legal, otherLocale)
    : categoryOnPage
      ? categoryPath(categoryOnPage, otherLocale)
      : isContentCategory && section
        ? sectionPath(section, otherLocale)
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
            sector: item.sector ?? (typeof item.category === 'object' ? item.category?.title : undefined),
            excerpt: item.excerpt ?? undefined,
            image: imageUrl(item.heroImage, solutionImage(item.slug)),
          }))}
        />
      )
    }

    if (!section) notFound()

    if (isContentSection(section)) {
      const items = await listContent(section, locale)
      const solutionCategories = section === 'solutions' ? await listSolutionCategories() : []
      const itemLabel = contentItemLabel(section, locale)
      const emptyText = t(`empty.${section}`, locale)
      const allLabel = t(
        section === 'solutions'
          ? 'cta.allSolutions'
          : section === 'references'
            ? 'cta.allReferences'
            : 'cta.allProjects',
        locale,
      )
      // Referans ve projelerde sektör hâlâ serbest metin; çözümlerde ise grup
      // artık kategori kaydından geliyor.
      const groupLabel = (item: any) =>
        section === 'solutions'
          ? (categoryOfSolution(solutionCategories, item)?.label[locale] ??
            (locale === 'tr' ? 'Diğer' : 'Other'))
          : item.sector?.split(/[•|,/]/)[0]?.trim() || (locale === 'tr' ? 'Diğer' : 'Other')

      if (isContentCategory) {
        if (section !== 'solutions') notFound()
        const selectedCategory = solutionCategories.find((category) => category.slug[locale] === extra[0])
        if (!selectedCategory) notFound()
        const selectedItems = items.filter(
          (item: any) => categoryOfSolution(solutionCategories, item)?.id === selectedCategory.id,
        )

        return (
          <>
            <BreadcrumbJsonLd locale={locale} section={section} title={selectedCategory.label[locale]} />
            <ListingPage
              eyebrow={t(`nav.${section}`, locale)}
              title={selectedCategory.label[locale]}
              lead={selectedCategory.lead[locale]}
              items={selectedItems}
              emptyText={emptyText}
              hrefFor={(item) => sectionPath(section, locale, item.slug)}
              eyebrowOf={(item) => item.client ?? groupLabel(item)}
              bodyOf={(item) => item.excerpt ?? undefined}
              imageOf={(item) =>
                section === 'solutions'
                  ? imageUrl(item.heroImage, solutionImage(item.slug))
                  : imageUrl(item.image)
              }
              imageFitOf={(item) =>
                imageFitOf(section === 'solutions' ? item.heroImage : item.image, 'cover')
              }
              cardVariant="compact"
              filters={{
                label: t('label.sector', locale),
                items: solutionCategories.map((category) => ({
                  label: category.label[locale],
                  href: solutionCategoryPath(category, locale),
                  active: category.id === selectedCategory.id,
                })),
                allHref: sectionPath(section, locale),
                allLabel,
              }}
            />
          </>
        )
      }

      if (slug) {
        const item = await findBySlug(collectionForContent(section), slug, locale)
        if (!item) notFound()
        return (
          <>
            <BreadcrumbJsonLd locale={locale} section={section} title={item.title} />
            {section === 'solutions' ? (
              <SolutionDetail locale={locale} solution={item} />
            ) : (
              <CaseStudyDetail locale={locale} item={item} section={section} />
            )}
          </>
        )
      }

      if (section !== 'solutions') {
        return (
          <>
            <BreadcrumbJsonLd locale={locale} section={section} />
            <ListingPage
              eyebrow={t(`nav.${section}`, locale)}
              title={t(`nav.${section}`, locale)}
              lead={contentLead(section, locale)}
              items={items}
              emptyText={emptyText}
              hrefFor={(item) => sectionPath(section, locale, item.slug)}
              eyebrowOf={(item) => item.client ?? undefined}
              bodyOf={(item) => item.excerpt ?? undefined}
              imageOf={(item) => imageUrl(item.image)}
              imageFitOf={(item) => imageFitOf(item.image, 'cover')}
            />
          </>
        )
      }

      if (!items.length) {
        return (
          <ListingPage
            eyebrow={t(`nav.${section}`, locale)}
            title={t(`nav.${section}`, locale)}
            lead={contentLead(section, locale)}
            items={[]}
            emptyText={emptyText}
            hrefFor={() => sectionPath(section, locale)}
            filters={{
              label: t('label.sector', locale),
              items: solutionCategories.map((category) => ({
                label: category.label[locale],
                href: solutionCategoryPath(category, locale),
                active: false,
              })),
              allHref: sectionPath('solutions', locale),
              allLabel,
            }}
          />
        )
      }

      const grouped = new Map<string, any[]>()
      for (const item of items) {
        const label = groupLabel(item)
        grouped.set(label, [...(grouped.get(label) ?? []), item])
      }

      const PREVIEW = 3
      const groups = [...grouped.entries()].map(([label, groupItems]) => ({
        key: slugify(label),
        label,
        lead: solutionCategories.find((category) => category.label[locale] === label)?.lead[locale],
        href: contentCategoryPath(section, locale, slugify(label)),
        total: groupItems.length,
        moreLabel:
          locale === 'tr'
            ? `Tüm ${label} (${groupItems.length})`
            : `All ${label} (${groupItems.length})`,
        items: groupItems.slice(0, PREVIEW).map((item) => ({
          id: item.id,
          title: item.title,
          eyebrow: item.client ?? groupLabel(item),
          excerpt: item.excerpt ?? undefined,
          href: sectionPath(section, locale, item.slug),
          image:
            section === 'solutions'
              ? imageUrl(item.heroImage, solutionImage(item.slug))
              : imageUrl(item.image),
          imageFit: imageFitOf(section === 'solutions' ? item.heroImage : item.image, 'cover'),
        })),
      }))

      return (
        <>
          <BreadcrumbJsonLd locale={locale} section={section} />
          <GroupedProducts
            eyebrow={t(`nav.${section}`, locale)}
            title={t(`nav.${section}`, locale)}
            lead={contentLead(section, locale)}
            groups={groups}
            cardVariant="compact"
            countLabel={(count) => `${count} ${itemLabel}`}
            filters={{
              label: t('label.sector', locale),
              items: solutionCategories.map((category) => ({
                label: category.label[locale],
                href: solutionCategoryPath(category, locale),
                active: false,
              })),
              allHref: sectionPath(section, locale),
              allLabel,
            }}
          />
        </>
      )
    }

    switch (section) {
      case 'products': {
        const categories = productCategories
        const glyphKey = (item: any) => categoryOfProduct(categories, item)?.value ?? undefined

        if (slug === CATEGORY_SEGMENT[locale] && extra[0]) {
          const category = categoryBySlug(categories, locale, extra[0])
          if (!category) notFound()
          const copy = { label: category.label[locale], lead: category.lead[locale] }
          const products = await listProducts({ locale, where: { category: { equals: category.id } } })
          return (
            <>
              <BreadcrumbJsonLd locale={locale} section="products" title={copy.label} />
              <ListingPage
                eyebrow={t('nav.products', locale)}
                title={copy.label}
                lead={copy.lead}
                items={products}
                emptyText={t('empty.products', locale)}
                hrefFor={(item) => sectionPath('products', locale, item.slug)}
                eyebrowOf={(item) => item.model ?? undefined}
                bodyOf={(item) => item.excerpt ?? undefined}
                imageOf={(item) => imageUrl(item.images?.[0], productPhoto(item.slug))}
                imageFitOf={(item) => imageFitOf(item.images?.[0], 'contain')}
                visualOf={(item) => <ProductGlyph category={glyphKey(item)} className="h-full w-full" />}
                cardVariant="product"
                filters={{
                  label: t('label.category', locale),
                  items: categories.map((entry) => ({
                    label: entry.label[locale],
                    href: categoryPath(entry, locale),
                    active: entry.id === category.id,
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
        const groups = categories.map((category) => {
          const copy = { label: category.label[locale], lead: category.lead[locale] }
          const inCategory = products.filter(
            (item: any) => categoryOfProduct(categories, item)?.id === category.id,
          )
          return {
            key: String(category.id),
            label: copy.label,
            lead: copy.lead,
            href: categoryPath(category, locale),
            total: inCategory.length,
            // Etiket oldugu gibi kullaniliyor; Turkce kucultme "RFID"yi "rfıd"
            // yapip marka adini bozuyordu.
            moreLabel:
              locale === 'tr'
                ? `Tüm ${copy.label} (${inCategory.length})`
                : `All ${copy.label} (${inCategory.length})`,
            items: inCategory.slice(0, PREVIEW).map((item: any) => ({
              id: item.id,
              title: item.title,
              model: item.model,
              eyebrow: item.model,
              excerpt: item.excerpt,
              href: sectionPath('products', locale, item.slug),
              // Panelden yuklenen fotograf her zaman once gelir; depodaki statik
              // gorsel yalnizca fotograf yoksa devreye giriyor.
              image: imageUrl(item.images?.[0], productPhoto(item.slug)),
              imageFit: imageFitOf(item.images?.[0], 'contain'),
              visual: <ProductGlyph category={glyphKey(item)} className="h-full w-full" />,
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
              cardVariant="product"
              countLabel={(count) => (locale === 'tr' ? `${count} ürün` : `${count} products`)}
              filters={{
                label: t('label.category', locale),
                items: categories.map((entry) => ({
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
            imageFitOf={(item) => imageFitOf(item.coverImage, 'cover')}
          />
        )
      }
      case 'about': {
        const [settings, corporate] = await Promise.all([
          getSiteSettings(locale),
          getCorporateContent(locale),
        ])
        return <AboutPage locale={locale} settings={settings} content={corporate} />
      }
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
