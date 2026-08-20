import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { ProductGlyph } from '@/components/site/ProductGlyph'
import { Reveal, TextReveal } from '@/components/site/Reveal'
import { RichText } from '@/components/site/RichText'
import { Breadcrumbs, ButtonLink, Card, Section, SectionHeading, SpecTable, StatTile } from '@/components/site/ui'
import { t, type Locale } from '@/lib/i18n'
import { Hero } from '@/components/site/Hero'
import { postImage, productPhoto, solutionImage } from '@/lib/imagery'
import { sectionPath } from '@/lib/routes'

type Media = { url?: string | null; alt?: string | null; width?: number | null; height?: number | null }

/**
 * Payload gorsel adresini tam adres olarak veriyor; next/image tam adresleri
 * remotePatterns olmadan reddediyor ve gorsel kirik cikiyor. Kendi alan
 * adimizdaki adresi goreli yola cevirmek alan adi degistiginde de calisir.
 */
const mediaOf = (value: unknown): Media | null => {
  if (!value || typeof value !== 'object' || !('url' in (value as Media))) return null
  const media = value as Media
  if (!media.url?.startsWith('http')) return media
  try {
    const parsed = new URL(media.url)
    return { ...media, url: `${parsed.pathname}${parsed.search}` }
  } catch {
    return media
  }
}

const Figure = ({ media, priority = false }: { media: unknown; priority?: boolean }) => {
  const image = mediaOf(media)
  if (!image?.url) return null
  return (
    <Image
      src={image.url}
      alt={image.alt ?? ''}
      width={image.width ?? 1600}
      height={image.height ?? 900}
      priority={priority}
      className="h-full w-full rounded-xl object-cover"
    />
  )
}

/* ---------------------------------------------------------------- home ---- */

export const HomePage = ({
  locale,
  tagline,
  solutions,
  products,
  posts,
}: {
  locale: Locale
  tagline: string
  solutions: any[]
  products: any[]
  posts: any[]
}) => (
  <>
    <Hero locale={locale} tagline={tagline} />

    <Section>
      <SectionHeading
        eyebrow={t('nav.solutions', locale)}
        title={locale === 'tr' ? 'Sektörünüze göre çözümler' : 'Solutions built per sector'}
        lead={
          locale === 'tr'
            ? 'Aynı teknoloji, sektöre göre farklı kurgu. Depodan kuyuma, hastaneden tekstile.'
            : 'One technology, configured per sector — warehousing, retail, healthcare, textiles and more.'
        }
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {solutions.slice(0, 6).map((solution, index) => (
          <Reveal key={solution.id} delay={index * 70} className="h-full">
          <Card
            key={solution.id}
            href={sectionPath('solutions', locale, solution.slug)}
            eyebrow={solution.sector ?? undefined}
            title={solution.title}
            body={solution.excerpt ?? undefined}
            footer={t('cta.readMore', locale)}
            image={mediaOf(solution.heroImage)?.url ?? solutionImage(solution.slug)}
          />
          </Reveal>
        ))}
      </div>
      <div className="mt-8">
        <ButtonLink href={sectionPath('solutions', locale)} variant="secondary">
          {t('cta.allSolutions', locale)}
        </ButtonLink>
      </div>
    </Section>

    <Section tone="tint">
      <SectionHeading
        eyebrow={t('nav.products', locale)}
        title={locale === 'tr' ? 'Öne çıkan ürünler' : 'Featured products'}
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 8).map((product, index) => (
          <Reveal key={product.id} delay={index * 60} className="h-full">
          <Card
            key={product.id}
            href={sectionPath('products', locale, product.slug)}
            eyebrow={product.model ?? undefined}
            title={product.title}
            body={product.excerpt ?? undefined}
            image={mediaOf(product.images?.[0])?.url ?? productPhoto(product.slug)}
            visual={<ProductGlyph category={product.category} className="h-full w-full" />}
          />
          </Reveal>
        ))}
      </div>
      <div className="mt-8">
        <ButtonLink href={sectionPath('products', locale)} variant="secondary">
          {t('cta.allProducts', locale)}
        </ButtonLink>
      </div>
    </Section>

    {posts.length ? (
      <Section tone="tint">
        <SectionHeading eyebrow={t('nav.insights', locale)} title={locale === 'tr' ? 'Bilgi Merkezi' : 'Insights'} />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <Card
              key={post.id}
              href={sectionPath('insights', locale, post.slug)}
              title={post.title}
              body={post.excerpt}
              footer={t('cta.readMore', locale)}
              image={mediaOf(post.coverImage)?.url ?? postImage(post.slug)}
            />
          ))}
        </div>
      </Section>
    ) : null}
  </>
)

/* ------------------------------------------------------------ listings ---- */

export const ListingPage = ({
  eyebrow,
  title,
  lead,
  items,
  emptyText,
  hrefFor,
  eyebrowOf,
  bodyOf,
  imageOf,
  visualOf,
  filters,
}: {
  eyebrow?: string
  title: string
  lead?: string
  items: any[]
  emptyText: string
  hrefFor: (item: any) => string
  eyebrowOf?: (item: any) => string | undefined
  bodyOf?: (item: any) => string | undefined
  imageOf?: (item: any) => string | undefined
  visualOf?: (item: any) => ReactNode
  filters?: {
    label: string
    items: { label: string; href: string; active: boolean }[]
    allHref: string
    allLabel: string
  }
}) => (
  <Section>
    <SectionHeading eyebrow={eyebrow} title={title} lead={lead} as="h1" />
    {filters ? (
      <nav aria-label={filters.label} className="mt-10 border-y border-[var(--card-border)] py-4">
        <ul className="flex flex-wrap items-center gap-x-1 gap-y-2">
          {[{ label: filters.allLabel, href: filters.allHref, active: filters.items.every((item) => !item.active) }]
            .concat(filters.items)
            .map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={item.active ? 'page' : undefined}
                  className={`inline-block rounded-full px-4 py-2 text-sm transition ${
                    item.active
                      ? 'bg-signal-500 font-semibold text-ink-950'
                      : 'text-muted hover:bg-ink-800 hover:text-ink-100'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    ) : null}
    {items.length ? (
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <Reveal key={item.id} delay={Math.min(index, 8) * 60} className="h-full">
          <Card
            href={hrefFor(item)}
            eyebrow={eyebrowOf?.(item)}
            title={item.title}
            body={bodyOf?.(item)}
            image={imageOf?.(item)}
            visual={visualOf?.(item)}
          />
          </Reveal>
        ))}
      </div>
    ) : (
      <p className="mt-10 text-muted">{emptyText}</p>
    )}
  </Section>
)

/** Kategori kategori gruplanmış ürün listesi. Her grup kendi başlığıyla açılır. */
export const GroupedProducts = ({
  eyebrow,
  title,
  lead,
  groups,
  filters,
}: {
  eyebrow?: string
  title: string
  lead?: string
  groups: {
    key: string
    label: string
    lead?: string
    href: string
    items: any[]
    total: number
    moreLabel: string
  }[]
  filters?: {
    label: string
    items: { label: string; href: string; active: boolean }[]
    allHref: string
    allLabel: string
  }
}) => (
  <Section>
    <SectionHeading eyebrow={eyebrow} title={title} lead={lead} as="h1" />
    {filters ? (
      <nav aria-label={filters.label} className="mt-10 border-y border-[var(--card-border)] py-4">
        <ul className="flex flex-wrap items-center gap-x-1 gap-y-2">
          {[{ label: filters.allLabel, href: filters.allHref, active: filters.items.every((i) => !i.active) }]
            .concat(filters.items)
            .map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={item.active ? 'page' : undefined}
                  className={`inline-block rounded-full px-4 py-2 text-sm transition ${
                    item.active
                      ? 'bg-signal-500 font-semibold text-ink-950'
                      : 'text-muted hover:bg-ink-800 hover:text-ink-100'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    ) : null}

    <div className="mt-14 space-y-16">
      {groups.map((group) => (
        <section key={group.key} id={group.key} className="scroll-mt-28">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--card-border)] pb-4">
            <div>
              <h2 className="text-h2 font-semibold">{group.label}</h2>
              {group.lead ? <p className="mt-2 max-w-2xl text-sm text-muted">{group.lead}</p> : null}
            </div>
            <Link href={group.href} className="text-sm font-medium text-signal-400 hover:underline">
              {group.total} ürün →
            </Link>
          </div>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item, index) => (
              <Reveal key={item.id} delay={Math.min(index, 6) * 60} className="h-full">
                <Card
                  href={item.href}
                  eyebrow={item.model ?? undefined}
                  title={item.title}
                  body={item.excerpt ?? undefined}
                  image={item.image}
                  visual={<ProductGlyph category={group.key} className="h-full w-full" />}
                />
              </Reveal>
            ))}
          </div>

          {group.total > group.items.length ? (
            <div className="mt-8">
              <ButtonLink href={group.href} variant="secondary">
                {group.moreLabel}
              </ButtonLink>
            </div>
          ) : null}
        </section>
      ))}
    </div>
  </Section>
)

/* -------------------------------------------------------------- details ---- */

export const ProductDetail = ({ locale, product }: { locale: Locale; product: any }) => (
  <Section>
    <Breadcrumbs
      items={[
        { label: t('nav.products', locale), href: sectionPath('products', locale) },
        { label: product.title },
      ]}
    />
    <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
      <div>
        {product.model ? (
          <p className="text-sm font-semibold uppercase tracking-widest text-signal-400">{product.model}</p>
        ) : null}
        <h1 className="mt-2 text-h1 font-semibold">{product.title}</h1>
        {product.excerpt ? <p className="mt-4 text-lead text-muted">{product.excerpt}</p> : null}

        {product.highlights?.length ? (
          <ul className="mt-8 space-y-2">
            {product.highlights.map((item: any, index: number) => (
              <li key={index} className="flex gap-3 text-sm">
                <span aria-hidden className="mt-1 text-signal-400">
                  ▸
                </span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={sectionPath('contact', locale)}>{t('cta.quote', locale)}</ButtonLink>
          {product.datasheets?.map((doc: any) =>
            doc?.id ? (
              <a
                key={doc.id}
                href={`/api/download/${doc.id}`}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--card-border)] px-5 py-3 text-sm font-semibold hover:border-signal-500 hover:text-signal-400"
              >
                {t('cta.datasheet', locale)}
              </a>
            ) : null,
          )}
        </div>
      </div>
      <div className="space-y-6">
        {mediaOf(product.images?.[0]) ? (
          <Figure media={product.images?.[0]} priority />
        ) : productPhoto(product.slug) ? (
          <Image
            src={productPhoto(product.slug) as string}
            alt={product.title}
            width={900}
            height={700}
            priority
            className="w-full rounded-xl border border-[var(--card-border)] object-cover"
          />
        ) : (
          <ProductGlyph category={product.category} className="aspect-[16/9] w-full rounded-xl" />
        )}
        <RichText data={product.body} />
      </div>
    </div>

    {product.specs?.length ? (
      <div className="mt-16 max-w-3xl">
        <h2 className="text-h2 font-semibold">{t('label.specs', locale)}</h2>
        <div className="mt-6">
          <SpecTable rows={product.specs} caption={`${product.title} — ${t('label.specs', locale)}`} />
        </div>
      </div>
    ) : null}

    {product.relatedSolutions?.length ? (
      <div className="mt-16">
        <h2 className="text-h2 font-semibold">{t('label.relatedSolutions', locale)}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {product.relatedSolutions.map((solution: any) =>
            solution?.slug ? (
              <Card
                key={solution.id}
                href={sectionPath('solutions', locale, solution.slug)}
                title={solution.title}
                body={solution.excerpt}
                image={solutionImage(solution.slug)}
              />
            ) : null,
          )}
        </div>
      </div>
    ) : null}
  </Section>
)

export const SolutionDetail = ({ locale, solution }: { locale: Locale; solution: any }) => {
  const heroSrc = mediaOf(solution.heroImage)?.url ?? solutionImage(solution.slug)

  return (
  <>
    <Section>
      <Breadcrumbs
        items={[
          { label: t('nav.solutions', locale), href: sectionPath('solutions', locale) },
          { label: solution.title },
        ]}
      />
      <div className={`grid gap-12 lg:items-center ${heroSrc ? 'lg:grid-cols-[1.05fr_0.95fr]' : 'max-w-3xl'}`}>
        <div>
          {solution.sector ? (
            <p className="text-sm font-semibold uppercase tracking-widest text-signal-400">{solution.sector}</p>
          ) : null}
          <h1 className="mt-2 text-h1 font-semibold">{solution.title}</h1>
          <p className="mt-4 text-lead text-muted">{solution.excerpt}</p>
          <div className="mt-8">
            <ButtonLink href={sectionPath('contact', locale)}>{t('cta.quote', locale)}</ButtonLink>
          </div>
        </div>
        {heroSrc ? (
          <Image
            src={heroSrc}
            alt=""
            width={1400}
            height={900}
            priority
            className="h-full w-full rounded-xl object-cover"
          />
        ) : null}
      </div>
    </Section>

    {solution.outcomes?.length ? (
      <Section tone="tint">
        <h2 className="text-h2 font-semibold">{t('label.outcomes', locale)}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {solution.outcomes.map((outcome: any, index: number) => (
            <StatTile key={index} metric={outcome.metric} label={outcome.label} />
          ))}
        </div>
      </Section>
    ) : null}

    {solution.problem ? (
      <Section className={solution.outcomes?.length ? '' : 'pt-0'}>
        <div className="max-w-3xl">
          <RichText data={solution.problem} />
        </div>
      </Section>
    ) : null}

    {solution.capabilities?.length ? (
      <Section tone={solution.outcomes?.length ? 'default' : 'tint'}>
        <h2 className="text-h2 font-semibold">{t('label.capabilities', locale)}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {solution.capabilities.map((item: any, index: number) => (
            <div key={index} className="card-surface p-6">
              <h3 className="text-h3 font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>
    ) : null}

    {solution.integrations?.length ? (
      <Section tone={solution.capabilities?.length ? 'tint' : 'default'}>
        <h2 className="text-h2 font-semibold">{t('label.integrations', locale)}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          {locale === 'tr'
            ? 'Kurulum mevcut sisteminizin yerine geçmez, veriyi ona aktarır.'
            : 'The deployment does not replace your existing system; it feeds data into it.'}
        </p>
        <ul className="mt-6 flex flex-wrap gap-3">
          {solution.integrations.map((item: any, index: number) => (
            <li
              key={index}
              className="rounded-full border border-[var(--card-border)] px-4 py-2 text-sm font-medium"
            >
              {item.name}
            </li>
          ))}
        </ul>
      </Section>
    ) : null}

    {solution.relatedProducts?.length ? (
      <Section>
        <h2 className="text-h2 font-semibold">{t('label.relatedProducts', locale)}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {solution.relatedProducts.map((product: any) =>
            product?.slug ? (
              <Card
                key={product.id}
                href={sectionPath('products', locale, product.slug)}
                eyebrow={product.model ?? undefined}
                title={product.title}
                body={product.excerpt}
                image={mediaOf(product.images?.[0])?.url ?? productPhoto(product.slug)}
                visual={<ProductGlyph category={product.category} className="h-full w-full" />}
              />
            ) : null,
          )}
        </div>
      </Section>
    ) : null}
  </>
  )
}

export const PostDetail = ({ locale, post }: { locale: Locale; post: any }) => {
  const cover = mediaOf(post.coverImage)?.url ?? postImage(post.slug)

  return (
  <Section>
    <article className="mx-auto max-w-3xl">
      <Breadcrumbs
        items={[{ label: t('nav.insights', locale), href: sectionPath('insights', locale) }, { label: post.title }]}
      />
      {cover ? (
        <Image
          src={cover}
          alt=""
          width={1200}
          height={675}
          priority
          className="mb-8 aspect-[16/9] w-full rounded-xl object-cover"
        />
      ) : null}
      <h1 className="text-h1 font-semibold">{post.title}</h1>
      {post.publishedAt ? (
        <p className="mt-3 text-sm text-muted">
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
        </p>
      ) : null}
      <p className="mt-6 text-lead text-muted">{post.excerpt}</p>
      <div className="mt-8">
        <RichText data={post.body} />
      </div>
    </article>
  </Section>
  )
}
