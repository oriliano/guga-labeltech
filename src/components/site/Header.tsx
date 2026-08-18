'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { t, type Locale } from '@/lib/i18n'

export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] }

export const Header = ({
  locale,
  items,
  alternateHref,
  quoteHref,
  brand,
}: {
  locale: Locale
  items: NavItem[]
  alternateHref: string
  quoteHref: string
  brand: string
}) => {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-[var(--page-bg)]/90 backdrop-blur dark:border-ink-800">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded focus:bg-signal-500 focus:px-3 focus:py-2 focus:text-ink-950"
      >
        {t('a11y.skipToContent', locale)}
      </a>
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href={locale === 'tr' ? '/' : '/en'} className="flex items-center" aria-label={brand}>
          <Image src="/logo.png" alt={brand} width={475} height={200} priority className="h-9 w-auto" />
        </Link>

        <nav aria-label="primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="inline-block rounded px-3 py-2 text-sm font-medium hover:text-signal-600"
                >
                  {item.label}
                </Link>
                {item.children?.length ? (
                  <ul className="invisible absolute left-0 top-full w-64 rounded-lg border border-ink-100 bg-[var(--card-bg)] p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 dark:border-ink-800">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block rounded px-3 py-2 text-sm hover:bg-signal-100 hover:text-ink-900 dark:hover:bg-ink-800 dark:hover:text-ink-100"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={alternateHref}
            hrefLang={locale === 'tr' ? 'en' : 'tr'}
            aria-label={t('a11y.languageSwitch', locale)}
            className="rounded px-2 py-2 text-sm font-semibold uppercase hover:text-signal-600"
          >
            {locale === 'tr' ? 'EN' : 'TR'}
          </Link>
          <Link
            href={quoteHref}
            className="hidden rounded-lg bg-signal-500 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-signal-400 sm:inline-block"
          >
            {t('cta.quote', locale)}
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
            className="rounded border border-ink-200 p-2 lg:hidden dark:border-ink-700"
          >
            <span className="sr-only">Menu</span>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M4 4l12 12M16 4L4 16" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" aria-label="mobile" className="border-t border-ink-100 lg:hidden dark:border-ink-800">
          <ul className="container-page py-4">
            {items.map((item) => (
              <li key={item.href} className="border-b border-ink-100 py-1 last:border-0 dark:border-ink-800">
                <Link href={item.href} className="block py-2 font-medium" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
                {item.children?.length ? (
                  <ul className="pb-2 pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block py-1.5 text-sm text-muted"
                          onClick={() => setOpen(false)}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
