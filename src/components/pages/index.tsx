import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { ProductGlyph } from '@/components/site/ProductGlyph'
import { SolutionsShowcase } from '@/components/pages/SolutionsShowcase'
import { Reveal, TextReveal } from '@/components/site/Reveal'
import { RichText } from '@/components/site/RichText'
import { Breadcrumbs, ButtonLink, Card, Section, SectionHeading, SpecTable, StatTile } from '@/components/site/ui'
import { t, type Locale } from '@/lib/i18n'
import { Hero } from '@/components/site/Hero'
import { postImage, productPhoto, solutionImage } from '@/lib/imagery'
import { imageFitOf, mediaOf } from '@/lib/media'
import { sectionPath } from '@/lib/routes'

const Figure = ({
  media,
  priority = false,
  fit = 'cover',
}: {
  media: unknown
  priority?: boolean
  fit?: 'cover' | 'contain'
}) => {
  const image = mediaOf(media)
  if (!image?.url) return null
  return (
    <Image
      src={image.url}
      alt={image.alt ?? ''}
      width={image.width ?? 1600}
      height={image.height ?? 900}
      priority={priority}
      className={`w-full rounded-xl ${fit === 'contain' ? 'aspect-[4/3] bg-ink-900 object-contain p-4' : 'h-full object-cover'}`}
    />
  )
}

/* ---------------------------------------------------------------- home ---- */

export const HomePage = ({
  locale,
  tagline,
  solutions,
}: {
  locale: Locale
  tagline: string
  solutions: {
    id: string | number
    title: string
    slug: string
    sector?: string
    excerpt?: string
    image?: string
  }[]
}) => (
  <>
    <Hero locale={locale} tagline={tagline} />
    <SolutionsShowcase locale={locale} items={solutions} headingLevel="h2" />
  </>
)

/**
 * Detay sayfalarındaki 16:9 çerçeve. Panelden yüklenen görsel bu orana yakınsa
 * çerçeveyi dolduruyor, değilse kırpılmadan içine sığdırılıyor.
 */
const frameClass = (fit: 'cover' | 'contain') =>
  fit === 'contain'
    ? 'aspect-[16/9] w-full rounded-xl bg-ink-900 object-contain p-4'
    : 'aspect-[16/9] w-full rounded-xl object-cover'

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
  imageFit,
  imageFitOf,
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
  imageFit?: 'cover' | 'contain'
  /** Görsel başına oran kararı; verilmezse `imageFit` geçerli. */
  imageFitOf?: (item: any) => 'cover' | 'contain'
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
            imageFit={imageFitOf?.(item) ?? imageFit}
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
export const GroupedCatalog = ({
  eyebrow,
  title,
  lead,
  groups,
  filters,
  countLabel = (count) => String(count),
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
  countLabel?: (count: number) => string
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
              {countLabel(group.total)} →
            </Link>
          </div>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item, index) => (
              <Reveal key={item.id} delay={Math.min(index, 6) * 60} className="h-full">
                <Card
                  href={item.href}
                  eyebrow={item.eyebrow ?? item.model ?? undefined}
                  title={item.title}
                  body={item.excerpt ?? undefined}
                  image={item.image}
                  imageFit={item.imageFit}
                  visual={item.visual}
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

export const GroupedProducts = GroupedCatalog

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
          <Figure media={product.images?.[0]} priority fit="contain" />
        ) : productPhoto(product.slug) ? (
          <Image
            src={productPhoto(product.slug) as string}
            alt={product.title}
            width={900}
            height={700}
            priority
            className="aspect-[4/3] w-full rounded-xl border border-[var(--card-border)] bg-ink-900 object-contain p-4"
          />
        ) : (
          <ProductGlyph category={product.category} className="aspect-[16/9] w-full rounded-xl" />
        )}
        {/* Ürün görselinin altında otomatik açıklama bloğu gösterilmez. İçerik panelde saklanır. */}
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
  const heroFit = imageFitOf(solution.heroImage, 'cover')

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
            className={
              heroFit === 'contain' ? frameClass('contain') : 'h-full w-full rounded-xl object-cover'
            }
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

export const CaseStudyDetail = ({
  locale,
  item,
  section,
}: {
  locale: Locale
  item: any
  section: 'references' | 'projects'
}) => {
  const image = mediaOf(item.image)
  const sectionLabel = t(`nav.${section}`, locale)

  return (
    <>
      <Section>
        <Breadcrumbs
          items={[
            { label: sectionLabel, href: sectionPath(section, locale) },
            { label: item.title },
          ]}
        />
        <div className={`grid gap-12 lg:items-center ${image?.url ? 'lg:grid-cols-[1.05fr_0.95fr]' : 'max-w-3xl'}`}>
          <div>
            {item.sector ? <p className="eyebrow">{item.sector}</p> : null}
            <h1 className="mt-3 text-h1 font-semibold">{item.title}</h1>
            {item.excerpt ? <p className="mt-4 text-lead text-muted">{item.excerpt}</p> : null}
            {item.client || item.country ? (
              <p className="mt-5 text-sm text-muted">
                {[item.client, item.country].filter(Boolean).join(' · ')}
              </p>
            ) : null}
            <div className="mt-8">
              <ButtonLink href={sectionPath('contact', locale)}>{t('cta.contactUs', locale)}</ButtonLink>
            </div>
          </div>
          {image?.url ? (
            <Image
              src={image.url}
              alt={image.alt ?? item.title}
              width={image.width ?? 1400}
              height={image.height ?? 900}
              priority
              className={frameClass(imageFitOf(item.image, 'cover'))}
            />
          ) : null}
        </div>
      </Section>

      {item.results?.length ? (
        <Section tone="tint">
          <h2 className="text-h2 font-semibold">{t('label.results', locale)}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {item.results.map((result: any, index: number) => (
              <StatTile key={index} metric={result.metric} label={result.label} />
            ))}
          </div>
        </Section>
      ) : null}

      <Section className={item.results?.length ? '' : 'pt-0'}>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="card-surface p-7">
            <h2 className="text-h3 font-semibold">{t('label.challenge', locale)}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.challenge}</p>
          </div>
          <div className="card-surface p-7">
            <h2 className="text-h3 font-semibold">{t('label.approach', locale)}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.approach}</p>
          </div>
        </div>
      </Section>

      {item.relatedSolution?.slug ? (
        <Section tone="tint">
          <h2 className="text-h2 font-semibold">{t('label.relatedSolutions', locale)}</h2>
          <div className="mt-8 max-w-md">
            <Card
              href={sectionPath('solutions', locale, item.relatedSolution.slug)}
              eyebrow={item.relatedSolution.sector ?? undefined}
              title={item.relatedSolution.title}
              body={item.relatedSolution.excerpt ?? undefined}
              image={mediaOf(item.relatedSolution.heroImage)?.url ?? solutionImage(item.relatedSolution.slug)}
            />
          </div>
        </Section>
      ) : null}

      {item.relatedProducts?.length ? (
        <Section>
          <h2 className="text-h2 font-semibold">{t('label.relatedProducts', locale)}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {item.relatedProducts.map((product: any) =>
              product?.slug ? (
                <Card
                  key={product.id}
                  href={sectionPath('products', locale, product.slug)}
                  eyebrow={product.model ?? undefined}
                  title={product.title}
                  body={product.excerpt ?? undefined}
                  image={mediaOf(product.images?.[0])?.url ?? productPhoto(product.slug)}
                  imageFit="contain"
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
          className={`mb-8 ${frameClass(imageFitOf(post.coverImage, 'cover'))}`}
        />
      ) : null}
      <h1 className="text-3xl font-semibold sm:text-4xl">{post.title}</h1>
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
