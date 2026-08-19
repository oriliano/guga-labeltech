/**
 * Panelde boş kalan yapısal alanları doldurur: menüler, SEO başlık ve
 * açıklamaları, ihracat giriş metni.
 *
 * Buraya yalnızca elimizdeki bilgiden türetilebilen şeyler yazılıyor. Kuruluş
 * yılı, sertifikalar, ihracat yapılan ülkeler, Incoterms ve kazanım rakamları
 * bilerek boş bırakıldı: bunlar firmadan gelmeden yazılırsa site yanlış bilgi
 * yayınlamış olur.
 *
 * Çalıştırma: NODE_ENV=development npx tsx src/seed/panel.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../payload.config'
import { CATEGORIES, categoryPath } from '../lib/categories'
import { sectionPath } from '../lib/routes'
import type { Locale } from '../lib/i18n'

const NAV_LABELS = {
  products: { tr: 'Ürünler', en: 'Products' },
  solutions: { tr: 'Çözümler', en: 'Solutions' },
  references: { tr: 'Referanslar', en: 'References' },
  export: { tr: 'İhracat', en: 'Export' },
  insights: { tr: 'Bilgi Merkezi', en: 'Insights' },
  about: { tr: 'Kurumsal', en: 'Company' },
  contact: { tr: 'İletişim', en: 'Contact' },
} as const

const FOOTER_TITLES = {
  catalog: { tr: 'Katalog', en: 'Catalogue' },
  company: { tr: 'Kurumsal', en: 'Company' },
} as const

const EXPORT_INTRO = {
  tr: 'RFID etiket, tag ve kart üretimini kendi hattımızda yapıyoruz; siparişi ürün bazında değil proje bazında ele alıyoruz. Numune, seri üretim ve sevkiyat sürecini tek muhatapla yürütürsünüz. Talebinizi ürün kodu, adet ve kullanım ortamıyla iletin, teknik uygunluğu birlikte netleştirelim.',
  en: 'We manufacture RFID labels, tags and cards on our own line and take orders project by project rather than item by item. Sampling, production and shipping run through a single point of contact. Send us the product code, quantity and the environment it will work in, and we will confirm technical fit together.',
}

const navigation = (locale: Locale) => ({
  header: [
    {
      label: NAV_LABELS.products[locale],
      href: sectionPath('products', locale),
      children: CATEGORIES.map((category) => ({
        label: category.label[locale],
        href: categoryPath(category, locale),
      })),
    },
    { label: NAV_LABELS.solutions[locale], href: sectionPath('solutions', locale) },
    { label: NAV_LABELS.references[locale], href: sectionPath('references', locale) },
    { label: NAV_LABELS.export[locale], href: sectionPath('export', locale) },
    { label: NAV_LABELS.insights[locale], href: sectionPath('insights', locale) },
    { label: NAV_LABELS.about[locale], href: sectionPath('about', locale) },
  ],
  footerColumns: [
    {
      title: FOOTER_TITLES.catalog[locale],
      links: [
        { label: NAV_LABELS.products[locale], href: sectionPath('products', locale) },
        ...CATEGORIES.slice(0, 4).map((category) => ({
          label: category.label[locale],
          href: categoryPath(category, locale),
        })),
      ],
    },
    {
      title: FOOTER_TITLES.company[locale],
      links: [
        { label: NAV_LABELS.solutions[locale], href: sectionPath('solutions', locale) },
        { label: NAV_LABELS.references[locale], href: sectionPath('references', locale) },
        { label: NAV_LABELS.export[locale], href: sectionPath('export', locale) },
        { label: NAV_LABELS.insights[locale], href: sectionPath('insights', locale) },
        { label: NAV_LABELS.about[locale], href: sectionPath('about', locale) },
        { label: NAV_LABELS.contact[locale], href: sectionPath('contact', locale) },
      ],
    },
  ],
})

/** Arama sonucunda kesilmesin diye açıklama 155 karakterde, kelime sonunda biter. */
const clamp = (value: string, limit = 155) => {
  const text = value.replace(/\s+/g, ' ').trim()
  if (text.length <= limit) return text
  const cut = text.slice(0, limit)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

const main = async () => {
  const payload = await getPayload({ config })
  const locales: Locale[] = ['tr', 'en']

  // Menü etiketleri dile bağlı dizi satırlarında duruyor. İkinci dil satır
  // kimliği olmadan yazılırsa Payload satırları yeniden oluşturuyor ve ilk dilin
  // etiketleri siliniyor; kimlikler ilk yazımdan okunup taşınıyor.
  await payload.updateGlobal({ slug: 'navigation', locale: 'tr', data: navigation('tr') as never })
  const written: any = await payload.findGlobal({ slug: 'navigation', locale: 'tr', depth: 0 })
  const english: any = navigation('en')

  english.header = english.header.map((item: any, index: number) => ({
    ...item,
    id: written.header?.[index]?.id,
    children: item.children?.map((child: any, childIndex: number) => ({
      ...child,
      id: written.header?.[index]?.children?.[childIndex]?.id,
    })),
  }))
  english.footerColumns = english.footerColumns.map((column: any, index: number) => ({
    ...column,
    id: written.footerColumns?.[index]?.id,
    links: column.links?.map((link: any, linkIndex: number) => ({
      ...link,
      id: written.footerColumns?.[index]?.links?.[linkIndex]?.id,
    })),
  }))

  await payload.updateGlobal({ slug: 'navigation', locale: 'en', data: english as never })

  for (const locale of locales) {
    await payload.updateGlobal({
      slug: 'site-settings',
      locale,
      data: { exportIntro: EXPORT_INTRO[locale] } as never,
    })
  }
  console.log('menuler ve ihracat girisi yazildi')

  const collections = ['products', 'solutions', 'posts'] as const
  for (const collection of collections) {
    let written = 0
    for (const locale of locales) {
      const found = await payload.find({ collection, limit: 500, locale, depth: 0 })
      for (const doc of found.docs as Record<string, any>[]) {
        if (doc.metaTitle && doc.metaDescription) continue
        const description = doc.excerpt || doc.challenge || ''
        try {
          await payload.update({
            collection,
            id: doc.id,
            locale,
            data: {
              metaTitle: doc.metaTitle || doc.title,
              metaDescription: doc.metaDescription || (description ? clamp(description) : undefined),
            } as never,
          })
          written++
        } catch (error) {
          // Zorunlu ve dile bagli dizi alanlari olan kayitlarda (yazilardaki
          // etiketler gibi) kismi guncelleme dogrulamaya takiliyor. Tek tek
          // panelden doldurmak yerine kaydi atlayip listeliyoruz.
          console.warn(`atlandi: ${collection}#${doc.id} (${locale}) — ${(error as Error).message}`)
        }
      }
    }
    console.log(`${collection}: ${written} kayitta SEO alani dolduruldu`)
  }

  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
