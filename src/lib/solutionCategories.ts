import { slugify } from '@/fields/slug'

import type { Locale } from './i18n'
import { contentCategoryPath } from './routes'

export const SOLUTION_CATEGORY_DEFINITIONS = [
  { value: 'depo', label: { tr: 'Depo', en: 'Warehousing' } },
  { value: 'lojistik', label: { tr: 'Lojistik', en: 'Logistics' } },
  { value: 'perakende', label: { tr: 'Perakende', en: 'Retail' } },
  { value: 'tekstil', label: { tr: 'Tekstil', en: 'Textiles' } },
  { value: 'saglik', label: { tr: 'Sağlık', en: 'Healthcare' } },
  { value: 'kuyum', label: { tr: 'Kuyum', en: 'Jewellery' } },
  { value: 'demirbas', label: { tr: 'Demirbaş', en: 'Fixed assets' } },
  { value: 'personel', label: { tr: 'Personel', en: 'Workforce' } },
  { value: 'otopark', label: { tr: 'Otopark', en: 'Parking' } },
  { value: 'soguk-zincir', label: { tr: 'Soğuk zincir', en: 'Cold chain' } },
  { value: 'uretim', label: { tr: 'Üretim', en: 'Manufacturing' } },
  { value: 'havacilik', label: { tr: 'Havacılık', en: 'Aviation' } },
  { value: 'bt', label: { tr: 'BT', en: 'IT' } },
] as const

export const SOLUTION_CATEGORIES: Record<Locale, string[]> = {
  tr: SOLUTION_CATEGORY_DEFINITIONS.map((category) => category.label.tr),
  en: SOLUTION_CATEGORY_DEFINITIONS.map((category) => category.label.en),
}

export type SolutionCategoryEntry = {
  key: string
  label: string
  lead: string
}

export const solutionCategoryEntries = (
  content: object | null | undefined,
  locale: Locale,
): SolutionCategoryEntry[] => {
  const stored =
    (content as {
      categories?: { key?: string | null; label?: string | null; lead?: string | null }[] | null
    } | null)?.categories ?? []
  const fallbackLead =
    locale === 'tr'
      ? 'RFID tabanlı sistemlerle süreçleri otomatikleştiren, izlenebilirliği ve operasyonel verimliliği artıran çözümler.'
      : 'RFID-based solutions that automate processes and improve traceability and operational efficiency.'

  const defaults = SOLUTION_CATEGORY_DEFINITIONS.map((category) => {
    const saved = stored.find((item) => item.key === category.value)
    return {
      key: category.value,
      label: saved?.label?.trim() || category.label[locale],
      lead: saved?.lead?.trim() || fallbackLead,
    }
  })
  const defaultKeys = new Set<string>(defaults.map((category) => category.key))
  const additional = stored
    .filter((item) => item.key && !defaultKeys.has(item.key) && item.label?.trim())
    .map((item) => ({
      key: item.key as string,
      label: item.label!.trim(),
      lead: item.lead?.trim() || fallbackLead,
    }))

  return [...defaults, ...additional]
}

export const solutionCategoryPath = (locale: Locale, label: string) =>
  contentCategoryPath('solutions', locale, slugify(label))
