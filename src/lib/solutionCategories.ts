import type { Locale } from './i18n'
import { contentCategoryPath } from './routes'

/**
 * Çözüm kategorileri artık `solution-categories` koleksiyonunda; buradaki tip
 * koleksiyondan okunan kaydın iki dilli hâli. Ürün kategorileriyle aynı şekil.
 */
export type SolutionCategory = {
  id: number | string
  value: string
  slug: Record<Locale, string>
  label: Record<Locale, string>
  lead: Record<Locale, string>
}

const FALLBACK_LEAD: Record<Locale, string> = {
  tr: 'RFID tabanlı sistemlerle süreçleri otomatikleştiren, izlenebilirliği ve operasyonel verimliliği artıran çözümler.',
  en: 'RFID-based solutions that automate processes and improve traceability and operational efficiency.',
}

const DEFINITIONS: { value: string; label: Record<Locale, string>; slug: Record<Locale, string> }[] = [
  { value: 'depo', label: { tr: 'Depo', en: 'Warehousing' }, slug: { tr: 'depo', en: 'warehousing' } },
  { value: 'lojistik', label: { tr: 'Lojistik', en: 'Logistics' }, slug: { tr: 'lojistik', en: 'logistics' } },
  { value: 'perakende', label: { tr: 'Perakende', en: 'Retail' }, slug: { tr: 'perakende', en: 'retail' } },
  { value: 'tekstil', label: { tr: 'Tekstil', en: 'Textiles' }, slug: { tr: 'tekstil', en: 'textiles' } },
  { value: 'saglik', label: { tr: 'Sağlık', en: 'Healthcare' }, slug: { tr: 'saglik', en: 'healthcare' } },
  { value: 'kuyum', label: { tr: 'Kuyum', en: 'Jewellery' }, slug: { tr: 'kuyum', en: 'jewellery' } },
  { value: 'demirbas', label: { tr: 'Demirbaş', en: 'Fixed assets' }, slug: { tr: 'demirbas', en: 'fixed-assets' } },
  { value: 'personel', label: { tr: 'Personel', en: 'Workforce' }, slug: { tr: 'personel', en: 'workforce' } },
  { value: 'otopark', label: { tr: 'Otopark', en: 'Parking' }, slug: { tr: 'otopark', en: 'parking' } },
  {
    value: 'soguk-zincir',
    label: { tr: 'Soğuk zincir', en: 'Cold chain' },
    slug: { tr: 'soguk-zincir', en: 'cold-chain' },
  },
  { value: 'uretim', label: { tr: 'Üretim', en: 'Manufacturing' }, slug: { tr: 'uretim', en: 'manufacturing' } },
  { value: 'havacilik', label: { tr: 'Havacılık', en: 'Aviation' }, slug: { tr: 'havacilik', en: 'aviation' } },
  { value: 'bt', label: { tr: 'BT', en: 'IT' }, slug: { tr: 'bt', en: 'it' } },
]

/** Koleksiyon boşken (temiz kurulum) kullanılan liste. */
export const FALLBACK_SOLUTION_CATEGORIES: SolutionCategory[] = DEFINITIONS.map((category) => ({
  id: category.value,
  value: category.value,
  slug: category.slug,
  label: category.label,
  lead: FALLBACK_LEAD,
}))

export const solutionCategoryPath = (category: SolutionCategory, locale: Locale) =>
  contentCategoryPath('solutions', locale, category.slug[locale])

/**
 * Çözüm kaydındaki kategori, ilişki alanı olduğu için `depth` 1 ile tam kayıt,
 * `depth` 0 ile yalnızca kimlik dönüyor. İki durumu da aynı kategoriye eşliyor.
 */
export const categoryOfSolution = (
  categories: SolutionCategory[],
  solution: { category?: unknown },
): SolutionCategory | undefined => {
  const value = solution.category
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
