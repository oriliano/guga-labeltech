import { localePrefix, type Locale } from './i18n'
import { SECTION_SLUGS } from './routes'

/**
 * Product categories as their own pages, the way the legacy site listed them in
 * its menu. Kategoriler artık `product-categories` koleksiyonunda duruyor;
 * buradaki tipler koleksiyondan okunan kaydın iki dilli hâlini temsil ediyor.
 * `value` ürün kaydındaki kategori anahtarı, slug'lar dile göre ayrı olduğu için
 * adres her iki dilde de doğal okunuyor.
 */
export type ProductCategory = {
  /** Koleksiyon kaydının kimliği; ürün sorgusunda ilişki eşleşmesi için. */
  id: number | string
  /** Sabit anahtar; ürün kaydında ve eski verilerde bu kullanılıyor. */
  value: string
  slug: Record<Locale, string>
  label: Record<Locale, string>
  lead: Record<Locale, string>
}

/**
 * Koleksiyon boşken (temiz kurulum, yerel geliştirme) kullanılan liste. Canlıda
 * bu dokuz kategori göç sırasında koleksiyona taşındı, oradan yönetiliyor.
 */
export const FALLBACK_CATEGORIES: ProductCategory[] = [
  {
    id: 'label',
    value: 'label',
    slug: { tr: 'rfid-etiket', en: 'rfid-labels' },
    label: { tr: 'RFID Etiket', en: 'RFID Labels' },
    lead: {
      tr: 'Depo, tekstil, kuyum ve demirbaş takibi için pasif UHF etiketler.',
      en: 'Passive UHF labels for warehouse, textile, jewellery and asset tracking.',
    },
  },
  {
    id: 'industrial-tag',
    value: 'industrial-tag',
    slug: { tr: 'rfid-endustriyel-tag', en: 'industrial-tags' },
    label: { tr: 'RFID Endüstriyel Tag', en: 'Industrial RFID Tags' },
    lead: {
      tr: 'Metal yüzey, dış ortam ve ağır koşullar için sert gövdeli taglar.',
      en: 'Hard-body tags for metal surfaces, outdoor use and demanding conditions.',
    },
  },
  {
    id: 'hardware',
    value: 'hardware',
    slug: { tr: 'rfid-donanim', en: 'rfid-hardware' },
    label: { tr: 'RFID Donanım', en: 'RFID Hardware' },
    lead: {
      tr: 'El terminalleri, sabit okuyucular ve antenler.',
      en: 'Handheld terminals, fixed readers and antennas.',
    },
  },
  {
    id: 'industrial-label',
    value: 'industrial-label',
    slug: { tr: 'endustriyel-etiketler', en: 'industrial-labels' },
    label: { tr: 'Endüstriyel Etiketler', en: 'Industrial Labels' },
    lead: {
      tr: 'Yüksek sıcaklık, kimyasal ve dış ortam koşullarına dayanan etiketler.',
      en: 'Labels that survive heat, chemicals and outdoor exposure.',
    },
  },
  {
    id: 'card',
    value: 'card',
    slug: { tr: 'kart-urunleri', en: 'cards' },
    label: { tr: 'Kart Ürünlerimiz', en: 'Cards' },
    lead: {
      tr: 'Personel, üyelik ve geçiş kartları; HF, UHF ve temassız çip seçenekleri.',
      en: 'Staff, membership and access cards with HF, UHF and contactless chip options.',
    },
  },
  {
    id: 'ribbon',
    value: 'ribbon',
    slug: { tr: 'ribon', en: 'ribbons' },
    label: { tr: 'Ribon', en: 'Ribbons' },
    lead: {
      tr: 'Termal transfer yazıcılar için wax, wax-resin ve resin ribonlar.',
      en: 'Wax, wax-resin and resin ribbons for thermal transfer printers.',
    },
  },
  {
    id: 'lanyard',
    value: 'lanyard',
    slug: { tr: 'yaka-ipleri', en: 'lanyards' },
    label: { tr: 'Yaka İpleri', en: 'Lanyards' },
    lead: {
      tr: 'Kurumsal baskılı yaka ipleri ve kart aksesuarları.',
      en: 'Branded lanyards and card accessories.',
    },
  },
  {
    id: 'library',
    value: 'library',
    slug: { tr: 'kutuphane-urunleri', en: 'library-products' },
    label: { tr: 'Kütüphane Ürünlerimiz', en: 'Library Products' },
    lead: {
      tr: 'Kütüphane ve arşivlerde kitap etiketleme, güvenlik ve raf okuma ürünleri.',
      en: 'Book tagging, security and shelf-reading products for libraries and archives.',
    },
  },
  {
    id: 'retail',
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

export const categoryBySlug = (categories: ProductCategory[], locale: Locale, slug: string) =>
  categories.find((category) => category.slug[locale] === slug)

export const categoryPath = (category: ProductCategory, locale: Locale) =>
  `${localePrefix(locale)}/${SECTION_SLUGS.products[locale]}/${CATEGORY_SEGMENT[locale]}/${category.slug[locale]}`

/**
 * Ürün kaydındaki kategori, ilişki alanı olduğu için `depth` 1 ile tam kayıt,
 * `depth` 0 ile yalnızca kimlik dönüyor. İki durumu da aynı kategoriye eşliyor.
 */
export const categoryOfProduct = (
  categories: ProductCategory[],
  product: { category?: unknown },
): ProductCategory | undefined => {
  const value = product.category
  if (value && typeof value === 'object') {
    const record = value as { id?: number | string; key?: string }
    return categories.find(
      (category) => category.id === record.id || (record.key ? category.value === record.key : false),
    )
  }
  if (typeof value === 'number' || typeof value === 'string') {
    return categories.find(
      (category) => String(category.id) === String(value) || category.value === value,
    )
  }
  return undefined
}
