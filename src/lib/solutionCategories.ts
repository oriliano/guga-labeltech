import { slugify } from '@/fields/slug'

import type { Locale } from './i18n'
import { contentCategoryPath } from './routes'

export const SOLUTION_CATEGORIES: Record<Locale, string[]> = {
  tr: [
    'Depo',
    'Lojistik',
    'Perakende',
    'Tekstil',
    'Sağlık',
    'Kuyum',
    'Demirbaş',
    'Personel',
    'Otopark',
    'Soğuk zincir',
    'Üretim',
    'Havacılık',
    'BT',
  ],
  en: [
    'Warehousing',
    'Logistics',
    'Retail',
    'Textiles',
    'Healthcare',
    'Jewellery',
    'Fixed assets',
    'Workforce',
    'Parking',
    'Cold chain',
    'Manufacturing',
    'Aviation',
    'IT',
  ],
}

export const solutionCategoryPath = (locale: Locale, label: string) =>
  contentCategoryPath('solutions', locale, slugify(label))
