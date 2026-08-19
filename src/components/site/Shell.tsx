import type { ReactNode } from 'react'

import { getNavigation, getSiteSettings } from '@/lib/data'
import { CATEGORIES, categoryPath } from '@/lib/categories'
import { t, type Locale } from '@/lib/i18n'
import { sectionPath } from '@/lib/routes'

import { Analytics } from './Analytics'
import { Footer } from './Footer'
import { GoogleAnalytics } from './GoogleAnalytics'
import { Header, type NavItem } from './Header'
import { SmoothScroll } from './SmoothScroll'
import { OrganizationJsonLd } from './StructuredData'
import { WhatsAppButton } from './WhatsAppButton'

/** Falls back to a generated menu when the Navigation global has not been filled in. */
const defaultNav = (locale: Locale): NavItem[] => [
  {
    label: t('nav.products', locale),
    href: sectionPath('products', locale),
    children: CATEGORIES.map((category) => ({
      label: category.label[locale],
      href: categoryPath(category, locale),
      description: category.lead[locale],
    })),
  },
  { label: t('nav.solutions', locale), href: sectionPath('solutions', locale) },
  { label: t('nav.references', locale), href: sectionPath('references', locale) },
  { label: t('nav.export', locale), href: sectionPath('export', locale) },
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
  const [settings, navigation] = await Promise.all([getSiteSettings(locale), getNavigation(locale)])

  const headerItems: NavItem[] = navigation?.header?.length
    ? navigation.header.map((item) => ({
        label: item.label,
        href: item.href,
        children: item.children?.map((child) => ({ label: child.label, href: child.href })),
      }))
    : defaultNav(locale)

  const footerColumns = navigation?.footerColumns?.length
    ? navigation.footerColumns.map((column) => ({
        title: column.title,
        links: column.links?.map((link) => ({ label: link.label, href: link.href })),
      }))
    : [{ title: t('nav.solutions', locale), links: defaultNav(locale).map(({ label, href }) => ({ label, href })) }]

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
