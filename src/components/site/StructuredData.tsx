import { t, type Locale } from '@/lib/i18n'
import { absoluteUrl, homePath, sectionPath, type Section } from '@/lib/routes'

/**
 * Schema.org markup for search engines. Nothing here invents data: a field that
 * is empty in the panel is left out of the graph rather than filled with a guess,
 * because a wrong price or rating is worse than no markup at all.
 */

type Doc = Record<string, any>

const imageUrl = (value: unknown): string | undefined => {
  const url = value && typeof value === 'object' ? (value as { url?: string | null }).url : null
  if (!url) return undefined
  return url.startsWith('http') ? url : absoluteUrl(url)
}

const firstImage = (value: unknown): string | undefined =>
  Array.isArray(value) ? imageUrl(value[0]) : imageUrl(value)

/** `</script>` inside a JSON string would close the tag early. */
const JsonLd = ({ data }: { data: Record<string, unknown> }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
  />
)

export const OrganizationJsonLd = ({ locale, settings }: { locale: Locale; settings: Doc | null }) => {
  if (!settings) return null

  const office = settings.offices?.[0]
  const phones = (settings.phones ?? []).map((phone: Doc) => phone.number).filter(Boolean)
  const socials = (settings.social ?? []).map((item: Doc) => item.url).filter(Boolean)
  const logo = imageUrl(settings.logo)

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization'),
    name: settings.brandName ?? 'GUGA LABELTECH',
    url: absoluteUrl(homePath(locale)),
  }

  if (settings.legalName) data.legalName = settings.legalName
  if (settings.tagline) data.description = settings.tagline
  if (logo) data.logo = logo
  if (settings.foundedYear) data.foundingDate = String(settings.foundedYear)
  if (settings.email) data.email = settings.email
  if (phones.length) data.telephone = phones[0]
  if (socials.length) data.sameAs = socials

  if (office?.city) {
    data.address = {
      '@type': 'PostalAddress',
      streetAddress: office.street ?? undefined,
      addressLocality: office.district ?? office.city,
      addressRegion: office.city,
      postalCode: office.postalCode ?? undefined,
      addressCountry: office.country ?? 'Türkiye',
    }
  }

  if (phones.length || settings.email) {
    data.contactPoint = [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: phones[0] ?? undefined,
        email: settings.email ?? undefined,
        availableLanguage: ['tr', 'en'],
      },
    ]
  }

  return <JsonLd data={data} />
}

export const BreadcrumbJsonLd = ({
  locale,
  section,
  title,
}: {
  locale: Locale
  section: Section
  title?: string
}) => {
  const items = [
    { name: t('nav.home', locale), item: absoluteUrl(homePath(locale)) },
    { name: t(`nav.${section}`, locale), item: absoluteUrl(sectionPath(section, locale)) },
  ]
  if (title) items.push({ name: title, item: '' })

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((entry, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: entry.name,
          ...(entry.item ? { item: entry.item } : {}),
        })),
      }}
    />
  )
}

export const ProductJsonLd = ({ locale, product }: { locale: Locale; product: Doc }) => {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    url: absoluteUrl(sectionPath('products', locale, product.slug)),
    brand: { '@type': 'Brand', name: 'GUGA LABELTECH' },
    manufacturer: { '@id': absoluteUrl('/#organization') },
  }

  const image = firstImage(product.images)
  if (image) data.image = image
  if (product.excerpt) data.description = product.excerpt
  if (product.model) {
    data.sku = product.model
    data.mpn = product.model
  }

  // Specs become properties rather than a description blob, so a crawler can read
  // frequency or IP rating as a value. Prices are deliberately absent: the site
  // quotes per project, so there is no offer to declare.
  const specs = (product.specs ?? []).filter((spec: Doc) => spec.label && spec.value)
  if (specs.length) {
    data.additionalProperty = specs.map((spec: Doc) => ({
      '@type': 'PropertyValue',
      name: spec.label,
      value: spec.value,
    }))
  }

  return <JsonLd data={data} />
}

export const ArticleJsonLd = ({ locale, post }: { locale: Locale; post: Doc }) => {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    mainEntityOfPage: absoluteUrl(sectionPath('insights', locale, post.slug)),
    inLanguage: locale,
    author: { '@id': absoluteUrl('/#organization') },
    publisher: { '@id': absoluteUrl('/#organization') },
  }

  const image = imageUrl(post.coverImage)
  if (image) data.image = image
  if (post.excerpt) data.description = post.excerpt
  if (post.publishedAt) data.datePublished = post.publishedAt
  if (post.updatedAt) data.dateModified = post.updatedAt

  return <JsonLd data={data} />
}
