import Image from 'next/image'
import Link from 'next/link'

import { RichText } from '@/components/site/RichText'
import { Breadcrumbs, ButtonLink, Card, Section, SectionHeading, SpecTable, StatTile } from '@/components/site/ui'
import { t, type Locale } from '@/lib/i18n'
import { HOME_HERO, postImage, solutionImage } from '@/lib/imagery'
import { sectionPath } from '@/lib/routes'

type Media = { url?: string | null; alt?: string | null; width?: number | null; height?: number | null }

const mediaOf = (value: unknown): Media | null =>
  value && typeof value === 'object' && 'url' in (value as Media) ? (value as Media) : null

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
  references,
  posts,
}: {
  locale: Locale
  tagline: string
  solutions: any[]
  products: any[]
  references: any[]
  posts: any[]
}) => (
  <>
    <section className="relative isolate border-b border-ink-100 bg-ink-900 text-ink-100 dark:border-ink-800">
      <Image src={HOME_HERO} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-25" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-900 via-ink-900/95 to-ink-900/70"
      />
      <div className="container-page grid gap-12 py-20 md:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-signal-400">
            RFID · RTLS · IoT
          </p>
          <h1 className="text-display font-semibold">
            {locale === 'tr'
              ? 'Etiketten yazılıma, tek elden izlenebilirlik'
              : 'End-to-end traceability, from the tag to the software'}
          </h1>
          <p className="mt-6 max-w-xl text-lead text-ink-200">{tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={sectionPath('contact', locale)}>{t('cta.quote', locale)}</ButtonLink>
            <Link
              href={sectionPath('products', locale)}
              className="inline-flex items-center rounded-lg border border-ink-600 px-5 py-3 text-sm font-semibold hover:border-signal-400 hover:text-signal-400"
            >
              {t('cta.explore', locale)}
            </Link>
          </div>
          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-ink-800 pt-8">
            {[
              { k: locale === 'tr' ? 'Üretim' : 'Manufacturing', v: locale === 'tr' ? 'Kendi etiketimiz' : 'Own tags' },
              { k: locale === 'tr' ? 'Donanım' : 'Hardware', v: locale === 'tr' ? 'Projeye özel' : 'Project-specific' },
              { k: locale === 'tr' ? 'Yazılım' : 'Software', v: locale === 'tr' ? 'ERP/WMS entegre' : 'ERP/WMS integrated' },
            ].map((item) => (
              <div key={item.k}>
                <dt className="text-xs uppercase tracking-wider text-ink-400">{item.k}</dt>
                <dd className="mt-1 text-sm font-medium">{item.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="hidden lg:flex lg:items-center lg:justify-center">
          {mediaOf(solutions[0]?.heroImage) ? (
            <Figure media={solutions[0]?.heroImage} priority />
          ) : (
            <Image
              src="/logo.png"
              alt=""
              aria-hidden
              width={475}
              height={200}
              priority
              className="w-full max-w-md opacity-90"
            />
          )}
        </div>
      </div>
    </section>

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
        {solutions.slice(0, 6).map((solution) => (
          <Card
            key={solution.id}
            href={sectionPath('solutions', locale, solution.slug)}
            eyebrow={solution.sector ?? undefined}
            title={solution.title}
            body={solution.excerpt ?? undefined}
            footer={t('cta.readMore', locale)}
            image={mediaOf(solution.heroImage)?.url ?? solutionImage(solution.slug)}
          />
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
        {products.slice(0, 8).map((product) => (
          <Card
            key={product.id}
            href={sectionPath('products', locale, product.slug)}
            eyebrow={product.model ?? undefined}
            title={product.title}
            body={product.excerpt ?? undefined}
          />
        ))}
      </div>
      <div className="mt-8">
        <ButtonLink href={sectionPath('products', locale)} variant="secondary">
          {t('cta.allProducts', locale)}
        </ButtonLink>
      </div>
    </Section>

    {references.length ? (
      <Section>
        <SectionHeading eyebrow={t('nav.references', locale)} title={locale === 'tr' ? 'Sahadan sonuçlar' : 'Results from the field'} />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {references.slice(0, 3).map((item) => (
            <Card
              key={item.id}
              href={sectionPath('references', locale, item.slug)}
              eyebrow={item.sector}
              title={item.title}
              body={item.challenge}
              footer={item.results?.[0] ? `${item.results[0].metric} — ${item.results[0].label}` : undefined}
            />
          ))}
        </div>
      </Section>
    ) : null}

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
  title,
  lead,
  items,
  emptyText,
  hrefFor,
  eyebrowOf,
  bodyOf,
  imageOf,
}: {
  title: string
  lead?: string
  items: any[]
  emptyText: string
  hrefFor: (item: any) => string
  eyebrowOf?: (item: any) => string | undefined
  bodyOf?: (item: any) => string | undefined
  imageOf?: (item: any) => string | undefined
}) => (
  <Section>
    <SectionHeading title={title} lead={lead} as="h1" />
    {items.length ? (
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card
            key={item.id}
            href={hrefFor(item)}
            eyebrow={eyebrowOf?.(item)}
            title={item.title}
            body={bodyOf?.(item)}
            image={imageOf?.(item)}
          />
        ))}
      </div>
    ) : (
      <p className="mt-10 text-muted">{emptyText}</p>
    )}
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
          <p className="text-sm font-semibold uppercase tracking-widest text-signal-600">{product.model}</p>
        ) : null}
        <h1 className="mt-2 text-h1 font-semibold">{product.title}</h1>
        {product.excerpt ? <p className="mt-4 text-lead text-muted">{product.excerpt}</p> : null}

        {product.highlights?.length ? (
          <ul className="mt-8 space-y-2">
            {product.highlights.map((item: any, index: number) => (
              <li key={index} className="flex gap-3 text-sm">
                <span aria-hidden className="mt-1 text-signal-600">
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
                className="inline-flex items-center gap-2 rounded-lg border border-ink-200 px-5 py-3 text-sm font-semibold hover:border-signal-500 hover:text-signal-600 dark:border-ink-700"
              >
                {t('cta.datasheet', locale)}
              </a>
            ) : null,
          )}
        </div>
      </div>
      <div className="space-y-6">
        <Figure media={product.images?.[0]} priority />
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
            <p className="text-sm font-semibold uppercase tracking-widest text-signal-600">{solution.sector}</p>
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
              className="rounded-full border border-ink-900/10 px-4 py-2 text-sm font-medium dark:border-ink-100/15"
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

export const ReferenceDetail = ({ locale, item }: { locale: Locale; item: any }) => (
  <Section>
    <div className="mx-auto max-w-3xl">
      <Breadcrumbs
        items={[{ label: t('nav.references', locale), href: sectionPath('references', locale) }, { label: item.title }]}
      />
      <p className="text-sm font-semibold uppercase tracking-widest text-signal-600">{item.sector}</p>
      <h1 className="mt-2 text-h1 font-semibold">{item.title}</h1>
      {item.client ? <p className="mt-3 text-muted">{item.client}</p> : null}

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {item.results?.map((result: any, index: number) => (
          <StatTile key={index} metric={result.metric} label={result.label} />
        ))}
      </div>

      <h2 className="mt-12 text-h2 font-semibold">{t('label.challenge', locale)}</h2>
      <p className="mt-4 leading-relaxed text-muted">{item.challenge}</p>

      <h2 className="mt-10 text-h2 font-semibold">{t('label.approach', locale)}</h2>
      <p className="mt-4 leading-relaxed text-muted">{item.approach}</p>

      <div className="mt-12">
        <ButtonLink href={sectionPath('contact', locale)}>{t('cta.quote', locale)}</ButtonLink>
      </div>
    </div>
  </Section>
)
