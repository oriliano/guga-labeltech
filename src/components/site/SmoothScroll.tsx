'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'

/**
 * Akıcı kaydırma. Hareket azaltma tercihi açıkken hiç devreye girmiyor, o zaman
 * tarayıcının kendi kaydırması kalıyor. Sayfa içi bağlantılar da yumuşatılıyor.
 */
export const SmoothScroll = () => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]')
      const id = anchor?.getAttribute('href')
      if (!id || id.length < 2) return
      const target = document.querySelector(id)
      if (!target) return
      event.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: -80 })
    }

    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])

  return null
}
