'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Loads GA4 only when a measurement ID is set in the panel. The initial pageview
 * comes from the config call; client-side navigations are sent here, since the
 * app router never reloads the document.
 */
export const GoogleAnalytics = ({ measurementId }: { measurementId: string }) => {
  const pathname = usePathname()
  const firstPath = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname) return
    if (firstPath.current === null) {
      firstPath.current = pathname
      return
    }
    if (firstPath.current === pathname) return
    firstPath.current = pathname
    window.gtag?.('event', 'page_view', { page_path: pathname })
  }, [pathname])

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config',${JSON.stringify(
          measurementId,
        )});`}
      </Script>
    </>
  )
}
