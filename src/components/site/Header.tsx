'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { t, type Locale } from '@/lib/i18n'

export type NavItem = {
  label: string
  href: string
  children?: { label: string; href: string; description?: string }[]
}

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
    <header className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--page-bg)]/85 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded focus:bg-signal-500 focus:px-3 focus:py-2 focus:text-ink-950"
      >
        {t('a11y.skipToContent', locale)}
      </a>
      <div className="container-page flex h-20 items-center justify-between gap-4">
        {/* The mark is gold, which needs the brand green behind it to hold up on a light header. */}
        <Link
          href={locale === 'tr' ? '/' : '/en'}
          className="flex items-center"
          aria-label={brand}
        >
          <Image src="/logo.png" alt={brand} width={475} height={200} priority className="h-9 w-auto" />
        </Link>

        <nav aria-label="primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="relative inline-block px-3 py-2 text-sm font-medium after:absolute after:bottom-1 after:left-3 after:h-px after:w-0 after:bg-signal-500 after:transition-all after:duration-300 hover:text-signal-400 group-hover:after:w-[calc(100%-1.5rem)]"
                >
                  {item.label}
                </Link>
                {item.children?.length ? (
                  <div className="invisible absolute left-1/2 top-full z-50 w-[42rem] -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <div className="overflow-hidden rounded-2xl border border-signal-500/20 bg-ink-900 shadow-[0_28px_60px_-28px_rgba(2,26,16,0.85)]">
                      <ul className="grid grid-cols-2 gap-1 p-3">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="group/item block rounded-xl px-4 py-3 transition hover:bg-ink-800"
                            >
                              <span className="block text-sm font-medium text-ink-100 group-hover/item:text-signal-400">
                                {child.label}
                              </span>
                              {child.description ? (
                                <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-ink-400">
                                  {child.description}
                                </span>
                              ) : null}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={item.href}
                        className="flex items-center justify-between border-t border-ink-800 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-signal-400 transition hover:bg-ink-800"
                      >
                        {item.label}
                        <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={alternateHref}
            hrefLang={locale === 'tr' ? 'en' : 'tr'}
            // Görünen metin "EN"; erişilebilir ad da onunla başlamalı, yoksa sesle
            // kontrol kullananlar düğmeyi adıyla çağıramıyor.
            aria-label={`${locale === 'tr' ? 'EN' : 'TR'} — ${t('a11y.languageSwitch', locale)}`}
            className="rounded px-2 py-2 text-sm font-semibold uppercase hover:text-signal-400"
          >
            {locale === 'tr' ? 'EN' : 'TR'}
          </Link>
          <Link
            href={quoteHref}
            className="hidden rounded-xl bg-signal-500 px-5 py-2.5 text-sm font-semibold text-ink-950 shadow-[0_10px_24px_-14px_rgba(201,162,39,0.9)] transition hover:-translate-y-px hover:bg-signal-400 sm:inline-block"
          >
            {t('cta.quote', locale)}
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
            className="rounded border border-[var(--card-border)] p-2 lg:hidden"
          >
            <span className="sr-only">Menu</span>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M4 4l12 12M16 4L4 16" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" aria-label="mobile" className="border-t border-[var(--card-border)] lg:hidden">
          <ul className="container-page py-4">
            {items.map((item) => (
              <li key={item.href} className="border-b border-[var(--card-border)] py-1 last:border-0">
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
