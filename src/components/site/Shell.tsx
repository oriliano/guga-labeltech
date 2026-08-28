import type { ReactNode } from 'react'

import { getCatalogContent, getNavigation, getSiteSettings, getSolutionCategoryContent } from '@/lib/data'
import { CATEGORIES, categoryCopy, categoryPath } from '@/lib/categories'
import { t, type Locale } from '@/lib/i18n'
import { sectionPath } from '@/lib/routes'
import { solutionCategoryEntries, solutionCategoryPath } from '@/lib/solutionCategories'

import { Analytics } from './Analytics'
import { Footer } from './Footer'
import { GoogleAnalytics } from './GoogleAnalytics'
import { Header, type NavItem } from './Header'
import { SmoothScroll } from './SmoothScroll'
import { OrganizationJsonLd } from './StructuredData'
import { WhatsAppButton } from './WhatsAppButton'

/** Falls back to a generated menu when the Navigation global has not been filled in. */
const defaultNav = (
  locale: Locale,
  catalog?: object | null,
  solutionContent?: object | null,
): NavItem[] => [
  {
    label: t('nav.products', locale),
    href: sectionPath('products', locale),
    children: CATEGORIES.map((category) => ({
      label: categoryCopy(catalog, category, locale).label,
      href: categoryPath(category, locale),
      description: category.lead[locale],
    })),
  },
  {
    label: t('nav.solutions', locale),
    href: sectionPath('solutions', locale),
    children: solutionCategoryEntries(solutionContent, locale).map((category) => ({
      label: category.label,
      href: solutionCategoryPath(locale, category.label),
      description: category.lead,
    })),
  },
  { label: t('nav.references', locale), href: sectionPath('references', locale) },
  { label: t('nav.projects', locale), href: sectionPath('projects', locale) },
  { label: t('nav.insights', locale), href: sectionPath('insights', locale) },
  { label: t('nav.about', locale), href: sectionPath('about', locale) },
]

export const Shell = async ({
  locale,
  alternateHref,
  children,
}: {
  locale: Locale
  alternateHref: string
  children: ReactNode
}) => {
  const [settings, navigation, catalog, solutionContent] = await Promise.all([
    getSiteSettings(locale),
    getNavigation(locale),
    getCatalogContent(locale),
    getSolutionCategoryContent(locale),
  ])

  const legacyProjectPath = sectionPath('export', locale)
  const projectPath = sectionPath('projects', locale)
  const normalizeHref = (href: string) => (href === legacyProjectPath ? projectPath : href)

  let headerItems: NavItem[] = navigation?.header?.length
    ? navigation.header.map((item) => ({
        label: item.href === legacyProjectPath ? t('nav.projects', locale) : item.label,
        href: normalizeHref(item.href),
        children: item.children?.map((child) => ({ label: child.label, href: normalizeHref(child.href) })),
      }))
    : defaultNav(locale, catalog, solutionContent)

  // Eski/panelden kaydedilmiş menüde kategori çocukları bulunmasa bile
  // çözümler ürünlerle aynı hover menüsünü kullanır. Referanslar ve projeler
  // kategori menüsü taşımaz.
  headerItems = headerItems.map((item) => {
    if (item.href === sectionPath('products', locale)) {
      return {
        ...item,
        children: CATEGORIES.map((category) => ({
          label: categoryCopy(catalog, category, locale).label,
          href: categoryPath(category, locale),
          description: categoryCopy(catalog, category, locale).lead,
        })),
      }
    }
    if (item.href === sectionPath('solutions', locale)) {
      return {
        ...item,
        children: solutionCategoryEntries(solutionContent, locale).map((category) => ({
          label: category.label,
          href: solutionCategoryPath(locale, category.label),
          description: category.lead,
        })),
      }
    }
    if (item.href === sectionPath('references', locale) || item.href === sectionPath('projects', locale)) {
      return { ...item, children: undefined }
    }
    return item
  })

  if (!headerItems.some((item) => item.href === sectionPath('references', locale))) {
    const insertAt = Math.min(2, headerItems.length)
    headerItems = [
      ...headerItems.slice(0, insertAt),
      { label: t('nav.references', locale), href: sectionPath('references', locale) },
      ...headerItems.slice(insertAt),
    ]
  }

  let footerColumns = navigation?.footerColumns?.length
    ? navigation.footerColumns.map((column) => ({
        title: column.title,
        links: column.links?.map((link) => ({
          label: link.href === legacyProjectPath ? t('nav.projects', locale) : link.label,
          href: normalizeHref(link.href),
        })),
      }))
    : [{
        title: t('nav.solutions', locale),
        links: defaultNav(locale, catalog, solutionContent).map(({ label, href }) => ({ label, href })),
      }]

  if (!footerColumns.some((column) => column.links?.some((link) => link.href === sectionPath('references', locale)))) {
    const lastIndex = footerColumns.length - 1
    footerColumns = footerColumns.map((column, index) =>
      index === lastIndex
        ? {
            ...column,
            links: [
              ...(column.links ?? []),
              { label: t('nav.references', locale), href: sectionPath('references', locale) },
            ],
          }
        : column,
    )
  }

  const whatsappNumber = settings?.phones?.find((phone) => phone.whatsapp)?.number

  return (
    <>
      <SmoothScroll />
      <Header
        locale={locale}
        items={headerItems}
        alternateHref={alternateHref}
        quoteHref={sectionPath('contact', locale)}
        brand={settings?.brandName ?? 'GUGA LABELTECH'}
      />
      <main id="main">{children}</main>
      <OrganizationJsonLd locale={locale} settings={settings} />
      <Analytics locale={locale} />
      {settings?.gaMeasurementId ? <GoogleAnalytics measurementId={settings.gaMeasurementId} /> : null}
      <Footer
        locale={locale}
        brand={settings?.brandName ?? 'GUGA LABELTECH'}
        legalName={settings?.legalName ?? 'GUGA Bilişim Teknoloji Ltd. Şti.'}
        email={settings?.email ?? 'info@gugalabeltech.com'}
        offices={settings?.offices ?? []}
        phones={settings?.phones ?? []}
        columns={footerColumns}
        social={settings?.social ?? []}
      />
      {whatsappNumber ? <WhatsAppButton number={whatsappNumber} locale={locale} /> : null}
    </>
  )
}
