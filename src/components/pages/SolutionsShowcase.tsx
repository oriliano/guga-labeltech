'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import type { Locale } from '@/lib/i18n'
import { sectionPath } from '@/lib/routes'

type Item = {
  id: string | number
  title: string
  slug: string
  sector?: string
  excerpt?: string
  image?: string
}

export const SolutionsShowcase = ({
  locale,
  items,
  headingLevel = 'h1',
}: {
  locale: Locale
  items: Item[]
  headingLevel?: 'h1' | 'h2'
}) => {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const distanceRef = useRef(0)
  const [distance, setDistance] = useState(0)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const desktop = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)')
    let frame = 0

    const render = () => {
      frame = 0
      const total = distanceRef.current
      if (!desktop.matches || total <= 0) {
        track.style.transform = ''
        progressRef.current?.style.setProperty('transform', 'scaleX(0)')
        setActive(0)
        return
      }
      const top = window.scrollY + section.getBoundingClientRect().top - 80
      const progress = Math.min(1, Math.max(0, (window.scrollY - top) / total))
      track.style.transform = `translate3d(${-total * progress}px,0,0)`
      progressRef.current?.style.setProperty('transform', `scaleX(${progress})`)
      setActive(Math.min(items.length, Math.round(progress * items.length)))
    }

    const requestRender = () => {
      if (!frame) frame = requestAnimationFrame(render)
    }
    const measure = () => {
      const next = desktop.matches ? Math.max(0, track.scrollWidth - window.innerWidth) : 0
      distanceRef.current = next
      setDistance(next)
      requestRender()
    }

    const observer = new ResizeObserver(measure)
    observer.observe(track)
    desktop.addEventListener('change', measure)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', requestRender, { passive: true })
    measure()

    return () => {
      observer.disconnect()
      desktop.removeEventListener('change', measure)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', requestRender)
      cancelAnimationFrame(frame)
    }
  }, [items.length])

  const href = (slug: string) => sectionPath('solutions', locale, slug)
  const Heading = headingLevel

  return (
    <section
      ref={sectionRef}
      className="relative overflow-clip border-b border-ink-800 bg-ink-950 text-ink-100"
      style={distance ? { height: `calc(100svh - 5rem + ${distance}px)` } : undefined}
    >
      <div className="lg:sticky lg:top-20 lg:h-[calc(100svh-5rem)] lg:overflow-hidden motion-reduce:lg:relative motion-reduce:lg:top-auto motion-reduce:lg:h-auto motion-reduce:lg:overflow-visible">
        <div ref={trackRef} className="flex flex-col gap-16 py-24 will-change-transform lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-0 lg:py-0 motion-reduce:lg:h-auto motion-reduce:lg:w-auto motion-reduce:lg:flex-col motion-reduce:lg:gap-16 motion-reduce:lg:py-24">
          <div className="container-page flex shrink-0 flex-col justify-center lg:mx-0 lg:h-full lg:w-[42vw] lg:min-w-[32rem] lg:pl-12 lg:pr-10">
            <span className="eyebrow text-signal-400">{locale === 'tr' ? 'Çözümler' : 'Solutions'}</span>
            <Heading className="mt-4 max-w-xl text-h1 font-semibold leading-[0.95]">
              {locale === 'tr' ? 'Sektörünüze göre çözümler' : 'Solutions built for your sector'}
            </Heading>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-300">
              {locale === 'tr'
                ? 'Aynı teknoloji, sektöre göre farklı kurgu. Çözümleri keşfetmek için kaydırın.'
                : 'One technology, configured for each sector. Scroll to explore the solutions.'}
            </p>
            <div className="mt-8 hidden items-center gap-3 text-ink-400 lg:flex">
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                {locale === 'tr' ? 'Kaydır' : 'Scroll'}
              </span>
              <span aria-hidden className="text-xl">→</span>
            </div>
          </div>

          {items.map((item, index) => (
            <article
              key={item.id}
              className="container-page relative flex shrink-0 flex-col justify-center gap-8 lg:mx-0 lg:h-full lg:w-[78vw] lg:max-w-[1050px] lg:flex-row lg:items-center lg:gap-12 lg:px-12"
            >
              <Link href={href(item.slug)} className="group relative block lg:w-[58%]">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-4 -top-16 z-0 text-[8rem] font-extrabold leading-none text-ink-100/5 lg:-top-24 lg:text-[13rem]"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="relative z-10 aspect-[16/11] overflow-hidden rounded-2xl border border-ink-700 shadow-2xl transition-colors duration-500 group-hover:border-signal-500/60">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 46vw, 100vw"
                      className="object-cover saturate-[0.68] brightness-[1.02] contrast-[1.04] transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  ) : null}
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/65 to-transparent" />
                </div>
              </Link>

              <div className="lg:w-[42%]">
                {item.sector ? <p className="eyebrow text-signal-400">{item.sector}</p> : null}
                <h2 className="mt-4 text-4xl font-semibold leading-[0.98] sm:text-5xl">{item.title}</h2>
                {item.excerpt ? (
                  <p className="mt-5 max-w-md text-base leading-relaxed text-ink-300">{item.excerpt}</p>
                ) : null}
                <Link
                  href={href(item.slug)}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] transition-colors hover:text-signal-400"
                >
                  {locale === 'tr' ? 'Detaylara bak' : 'View details'} <span aria-hidden>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden lg:block motion-reduce:lg:hidden">
          <div className="container-page flex items-center gap-5 pb-7">
            <span className="text-sm tabular-nums text-signal-400">{String(active + 1).padStart(2, '0')}</span>
            <div className="relative h-px flex-1 overflow-hidden bg-ink-700">
              <div
                ref={progressRef}
                className="absolute inset-0 origin-left bg-gradient-to-r from-signal-500 to-signal-300"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
            <span className="text-sm tabular-nums text-ink-400">{String(items.length + 1).padStart(2, '0')}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
