'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { t, type Locale } from '@/lib/i18n'
import { HERO_READER, HERO_READER_MP4, HERO_READER_WEBM } from '@/lib/imagery'
import { sectionPath } from '@/lib/routes'

const TICKER: Record<Locale, string[]> = {
  tr: ['RFID', 'RTLS', 'IoT', 'Depo', 'Perakende', 'Tekstil', 'Sağlık', 'Lojistik', 'Kuyum', 'Projeler'],
  en: ['RFID', 'RTLS', 'IoT', 'Warehouse', 'Retail', 'Textile', 'Healthcare', 'Logistics', 'Jewellery', 'Projects'],
}

/** Maskeli kelime kayışı: her kelime kendi kutusunda aşağıdan yukarı geliyor. */
const Words = ({ text, delay = 0, className = '' }: { text: string; delay?: number; className?: string }) => (
  <span className="block">
    {text.split(' ').map((word, index) => (
      <span
        key={`${word}-${index}`}
        className="inline-block overflow-hidden pb-[0.08em] align-top [&:not(:last-child)]:mr-[0.22em]"
      >
        <span className={`word-rise inline-block ${className}`} style={{ animationDelay: `${delay + index * 60}ms` }}>
          {word}
        </span>
      </span>
    ))}
  </span>
)

export const Hero = ({ locale, tagline }: { locale: Locale; tagline: string }) => {
  const section = useRef<HTMLElement>(null)
  const [drift, setDrift] = useState(0)
  const [motion, setMotion] = useState(false)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)')
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setMotion(wide.matches && !calm.matches)
    update()
    wide.addEventListener('change', update)
    calm.addEventListener('change', update)

    // Bölüm görünümden çıkarken içerik yukarı süzülüp soluyor. Yalnız transform
    // ve opaklık değişiyor, kaydırma sırasında yeniden yerleşim olmuyor.
    if (calm.matches) return () => {
      wide.removeEventListener('change', update)
      calm.removeEventListener('change', update)
    }

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const height = section.current?.offsetHeight ?? 1
        setDrift(Math.min(1, Math.max(0, window.scrollY / height)))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
      wide.removeEventListener('change', update)
      calm.removeEventListener('change', update)
    }
  }, [])

  // CSS uppercase Türkçe noktalı İ'yi bozuyor; satırlar doğrudan büyük harfle
  // yazılıyor ve dönüşüm kapalı.
  const line = locale === 'tr' ? ['ETİKETTEN YAZILIMA', 'TEK ELDEN'] : ['FROM THE TAG', 'TO THE SOFTWARE']
  const accent = locale === 'tr' ? 'izlenebilirlik' : 'traceability'

  return (
    <section
      ref={section}
      className="relative flex min-h-[100svh] flex-col overflow-hidden border-b border-ink-800 bg-ink-950 text-ink-100"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image src={HERO_READER} alt="" fill priority sizes="100vw" className="object-cover opacity-[0.14]" />
        {motion ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
            ref={(node) => {
              void node?.play().catch(() => {})
            }}
            className="absolute inset-0 h-full w-full object-cover opacity-[0.18]"
          >
            <source src={HERO_READER_WEBM} type="video/webm" />
            <source src={HERO_READER_MP4} type="video/mp4" />
          </video>
        ) : null}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-ink-950/70 via-ink-950/45 to-ink-950/85"
      />
      <div className="pointer-events-none absolute inset-0 z-0 bg-stage-spot" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-stage-glow" />
      <div className="grain-dark" aria-hidden />

      <div
        style={{ transform: `translateY(${-drift * 90}px)`, opacity: Math.max(0, 1 - drift / 0.65) }}
        className="container-page relative z-20 flex flex-1 flex-col items-center justify-center pt-28 pb-10 text-center"
      >
        <p className="eyebrow text-signal-400">RFID · RTLS · IoT</p>

        <h1 className="mt-6 font-sans text-h1 font-extrabold tracking-[-0.03em]">
          <Words text={line[0]} delay={80} />
          <Words text={line[1]} delay={260} />
          <Words text={accent} delay={440} className="font-display text-shimmer lowercase italic tracking-normal" />
        </h1>

        <p className="fade-up-slow mt-7 max-w-xl text-base text-ink-200">{tagline}</p>

        <div className="fade-up-slow mt-9 flex w-full flex-col items-stretch justify-center gap-4 sm:w-auto sm:flex-row sm:items-center">
          <Link href={sectionPath('contact', locale)} className="btn-pill btn-pill-brand hover:brightness-110">
            {t('cta.quote', locale)}
          </Link>
          <Link
            href={sectionPath('products', locale)}
            className="btn-pill btn-pill-ghost hover:border-signal-400 hover:text-signal-400"
          >
            {t('cta.explore', locale)}
          </Link>
        </div>
      </div>

      <div className="marquee-pause relative z-20 overflow-hidden border-t border-ink-800/80 py-4">
        <div className="animate-marquee flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {TICKER[locale].map((word) => (
                <span
                  key={`${copy}-${word}`}
                  className="mx-7 font-display text-lg font-semibold uppercase tracking-tight text-ink-100/25 sm:text-xl"
                >
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
