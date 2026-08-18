'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import type { Locale } from '@/lib/i18n'

/** Fires one pageview per path change. Failures are ignored — analytics never blocks a visit. */
export const Analytics = ({ locale }: { locale: Locale }) => {
  const pathname = usePathname()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname || lastPath.current === pathname) return
    lastPath.current = pathname
    void fetch('/api/track', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path: pathname, locale, referrer: document.referrer }),
      keepalive: true,
    }).catch(() => {})
  }, [pathname, locale])

  return null
}
