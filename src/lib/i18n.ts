export const LOCALES = ['tr', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'tr'

export const isLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value)

/** TR lives at the root; EN is prefixed. `/urunler` and `/en/products`. */
export const localePrefix = (locale: Locale) => (locale === DEFAULT_LOCALE ? '' : `/${locale}`)

type Dictionary = Record<string, { tr: string; en: string }>

const strings: Dictionary = {
  'nav.products': { tr: 'Ürünler', en: 'Products' },
  'nav.solutions': { tr: 'Çözümler', en: 'Solutions' },
  'nav.references': { tr: 'Referanslar', en: 'References' },
  'nav.insights': { tr: 'Bilgi Merkezi', en: 'Insights' },
  'nav.about': { tr: 'Kurumsal', en: 'Company' },
  'nav.export': { tr: 'İhracat', en: 'Export' },
  'nav.contact': { tr: 'İletişim', en: 'Contact' },
  'cta.quote': { tr: 'Teklif Al', en: 'Request a Quote' },
  'cta.explore': { tr: 'Ürünleri İncele', en: 'Browse Products' },
  'cta.allProducts': { tr: 'Tüm ürünler', en: 'All products' },
  'cta.allSolutions': { tr: 'Tüm çözümler', en: 'All solutions' },
  'cta.readMore': { tr: 'Devamını oku', en: 'Read more' },
  'cta.datasheet': { tr: 'Teknik föy (PDF)', en: 'Datasheet (PDF)' },
  'cta.contactUs': { tr: 'Bize ulaşın', en: 'Contact us' },
  'label.specs': { tr: 'Teknik özellikler', en: 'Specifications' },
  'label.highlights': { tr: 'Öne çıkanlar', en: 'Highlights' },
  'label.model': { tr: 'Model', en: 'Model' },
  'label.category': { tr: 'Kategori', en: 'Category' },
  'label.relatedProducts': { tr: 'Kullanılan ürünler', en: 'Products used' },
  'label.relatedSolutions': { tr: 'İlgili çözümler', en: 'Related solutions' },
  'label.outcomes': { tr: 'Ölçülebilir kazanımlar', en: 'Measurable outcomes' },
  'label.capabilities': { tr: 'Sistem yetenekleri', en: 'What the system does' },
  'label.integrations': { tr: 'Entegrasyonlar', en: 'Integrations' },
  'label.challenge': { tr: 'Sorun', en: 'Challenge' },
  'label.approach': { tr: 'Çözüm', en: 'Approach' },
  'label.results': { tr: 'Sonuç', en: 'Results' },
  'label.sector': { tr: 'Sektör', en: 'Sector' },
  'label.published': { tr: 'Yayın tarihi', en: 'Published' },
  'form.name': { tr: 'Ad Soyad', en: 'Full name' },
  'form.company': { tr: 'Firma', en: 'Company' },
  'form.email': { tr: 'E-posta', en: 'Email' },
  'form.phone': { tr: 'Telefon', en: 'Phone' },
  'form.country': { tr: 'Ülke', en: 'Country' },
  'form.message': { tr: 'Mesaj', en: 'Message' },
  'form.submit': { tr: 'Talebi Gönder', en: 'Send Request' },
  'form.sending': { tr: 'Gönderiliyor…', en: 'Sending…' },
  'form.success': {
    tr: 'Talebiniz bize ulaştı. Bir iş günü içinde dönüş yapıyoruz.',
    en: 'We received your request and will reply within one business day.',
  },
  'form.error': {
    tr: 'Gönderilemedi. Lütfen tekrar deneyin veya bize e-posta yazın.',
    en: 'Could not send. Please try again or email us directly.',
  },
  'form.required': { tr: 'Zorunlu alan', en: 'Required' },
  'empty.products': { tr: 'Bu kategoride henüz ürün yok.', en: 'No products in this category yet.' },
  'empty.references': {
    tr: 'Referans çalışmalarımız yakında burada yayınlanacak.',
    en: 'Case studies will be published here soon.',
  },
  'empty.posts': { tr: 'Yakında yeni yazılar eklenecek.', en: 'New articles are coming soon.' },
  'footer.rights': { tr: 'Tüm hakları saklıdır.', en: 'All rights reserved.' },
  'footer.legalNote': {
    tr: 'GUGALABELTECH®, GUGA Bilişim Teknoloji Ltd. Şti.’nin tescilli markasıdır.',
    en: 'GUGALABELTECH® is a registered trademark of GUGA Bilişim Teknoloji Ltd. Şti.',
  },
  'a11y.skipToContent': { tr: 'İçeriğe geç', en: 'Skip to content' },
  'a11y.languageSwitch': { tr: 'Dili değiştir', en: 'Switch language' },
}

export const t = (key: keyof typeof strings | string, locale: Locale): string => {
  const entry = strings[key]
  if (!entry) return key
  return entry[locale]
}
