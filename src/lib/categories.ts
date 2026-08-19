import { localePrefix, type Locale } from './i18n'
import { SECTION_SLUGS } from './routes'

/**
 * Product categories as their own pages, the way the legacy site listed them in
 * its menu. `value` matches the select stored on the product record; the slugs
 * are localized so the URL reads naturally in both languages.
 */
export type ProductCategory = {
  value: string
  slug: Record<Locale, string>
  label: Record<Locale, string>
  lead: Record<Locale, string>
}

export const CATEGORIES: ProductCategory[] = [
  {
    value: 'label',
    slug: { tr: 'rfid-etiket', en: 'rfid-labels' },
    label: { tr: 'RFID Etiket', en: 'RFID Labels' },
    lead: {
      tr: 'Depo, tekstil, kuyum ve demirbaş takibi için pasif UHF etiketler.',
      en: 'Passive UHF labels for warehouse, textile, jewellery and asset tracking.',
    },
  },
  {
    value: 'industrial-tag',
    slug: { tr: 'rfid-endustriyel-tag', en: 'industrial-tags' },
    label: { tr: 'RFID Endüstriyel Tag', en: 'Industrial RFID Tags' },
    lead: {
      tr: 'Metal yüzey, dış ortam ve ağır koşullar için sert gövdeli taglar.',
      en: 'Hard-body tags for metal surfaces, outdoor use and demanding conditions.',
    },
  },
  {
    value: 'hardware',
    slug: { tr: 'rfid-donanim', en: 'rfid-hardware' },
    label: { tr: 'RFID Donanım', en: 'RFID Hardware' },
    lead: {
      tr: 'El terminalleri, sabit okuyucular ve antenler.',
      en: 'Handheld terminals, fixed readers and antennas.',
    },
  },
  {
    value: 'industrial-label',
    slug: { tr: 'endustriyel-etiketler', en: 'industrial-labels' },
    label: { tr: 'Endüstriyel Etiketler', en: 'Industrial Labels' },
    lead: {
      tr: 'Yüksek sıcaklık, kimyasal ve dış ortam koşullarına dayanan etiketler.',
      en: 'Labels that survive heat, chemicals and outdoor exposure.',
    },
  },
  {
    value: 'card',
    slug: { tr: 'kart-urunleri', en: 'cards' },
    label: { tr: 'Kart Ürünlerimiz', en: 'Cards' },
    lead: {
      tr: 'Personel, üyelik ve geçiş kartları; HF, UHF ve temassız çip seçenekleri.',
      en: 'Staff, membership and access cards with HF, UHF and contactless chip options.',
    },
  },
  {
    value: 'ribbon',
    slug: { tr: 'ribon', en: 'ribbons' },
    label: { tr: 'Ribon', en: 'Ribbons' },
    lead: {
      tr: 'Termal transfer yazıcılar için wax, wax-resin ve resin ribonlar.',
      en: 'Wax, wax-resin and resin ribbons for thermal transfer printers.',
    },
  },
  {
    value: 'lanyard',
    slug: { tr: 'yaka-ipleri', en: 'lanyards' },
    label: { tr: 'Yaka İpleri', en: 'Lanyards' },
    lead: {
      tr: 'Kurumsal baskılı yaka ipleri ve kart aksesuarları.',
      en: 'Branded lanyards and card accessories.',
    },
  },
  {
    value: 'library',
    slug: { tr: 'kutuphane-urunleri', en: 'library-products' },
    label: { tr: 'Kütüphane Ürünlerimiz', en: 'Library Products' },
    lead: {
      tr: 'Kütüphane ve arşivlerde kitap etiketleme, güvenlik ve raf okuma ürünleri.',
      en: 'Book tagging, security and shelf-reading products for libraries and archives.',
    },
  },
  {
    value: 'retail',
    slug: { tr: 'perakende-urunleri', en: 'retail-products' },
    label: { tr: 'Perakende Ürünlerimiz', en: 'Retail Products' },
    lead: {
      tr: 'Mağaza sayımı, kasa okuma ve kapı geçiş sistemleri.',
      en: 'Store counting, point-of-sale reading and gate systems.',
    },
  },
]

/** URL segment that separates a category page from a product page. */
export const CATEGORY_SEGMENT: Record<Locale, string> = { tr: 'kategori', en: 'category' }

export const categoryBySlug = (locale: Locale, slug: string) =>
  CATEGORIES.find((category) => category.slug[locale] === slug)

export const categoryByValue = (value?: string | null) =>
  value ? CATEGORIES.find((category) => category.value === value) : undefined

export const categoryPath = (category: ProductCategory, locale: Locale) =>
  `${localePrefix(locale)}/${SECTION_SLUGS.products[locale]}/${CATEGORY_SEGMENT[locale]}/${category.slug[locale]}`
