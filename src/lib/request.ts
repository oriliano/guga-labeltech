import { headers } from 'next/headers'

import { DEFAULT_LOCALE, isLocale, type Locale } from './i18n'

/**
 * Reads the locale out of the path header set by the middleware. Used where the
 * route params are not available: the root layout and the not-found boundary.
 */
export const localeFromRequest = async (): Promise<Locale> => {
  const pathname = (await headers()).get('x-pathname') ?? '/'
  const first = pathname.split('/')[1] ?? ''
  return isLocale(first) ? first : DEFAULT_LOCALE
}
