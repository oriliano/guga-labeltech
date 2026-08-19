'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

/**
 * Görünür alana girince yumuşak yukarı açılış. Framer Motion yerine
 * IntersectionObserver kullanıyor: aynı hareket, paket boyutuna eklenen 0 kilobayt.
 * Hareket azaltma tercihi açıkken içerik doğrudan görünür halde başlıyor.
 */
export const Reveal = ({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
}: {
  children: ReactNode
  delay?: number
  as?: ElementType
  className?: string
}) => {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: '-8% 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-7 opacity-0'
      } ${className}`}
    >
      {children}
    </Tag>
  )
}

/** Kelime kelime yükselen başlık. Sayfa açılışında bir kez çalışır. */
export const TextReveal = ({ text, className = '' }: { text: string; className?: string }) => {
  const words = text.split(' ')

  return (
    <span className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
          <span
            className="word-rise inline-block"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            {word}
            {index < words.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </span>
  )
}
