'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

/**
 * Masaüstünde kısa bir döngü videosu, mobilde yalnızca fotoğraf.
 *
 * Video etiketi ekran dar olduğunda hiç basılmıyor; `hidden` sınıfı kullanılsaydı
 * tarayıcı dosyayı yine de indirirdi. Fotoğraf her durumda basılıyor, video onun
 * üstüne yüklendikçe açılıyor: en büyük içerik boyaması fotoğraf olarak kalıyor
 * ve yer değiştirme yaşanmıyor.
 */
export const HeroVisual = ({
  poster,
  mp4,
  webm,
  alt,
}: {
  poster: string
  mp4: string
  webm: string
  alt: string
}) => {
  const [playable, setPlayable] = useState(false)
  const [visible, setVisible] = useState(false)
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)')
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPlayable(wide.matches && !calm.matches)

    update()
    wide.addEventListener('change', update)
    calm.addEventListener('change', update)
    return () => {
      wide.removeEventListener('change', update)
      calm.removeEventListener('change', update)
    }
  }, [])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-signal-500/15 shadow-[0_30px_80px_-40px_rgba(2,26,16,0.9)]">
      <Image src={poster} alt={alt} width={1400} height={866} priority sizes="(min-width: 1024px) 46vw, 100vw" className="w-full" />
      {playable ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          ref={video}
          onCanPlay={() => {
            setVisible(true)
            // Oge hidrasyondan sonra eklendigi icin autoplay niteligi her zaman
            // tetiklenmiyor; sessiz oynatmayi burada baslatiyoruz.
            void video.current?.play().catch(() => {})
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </video>
      ) : null}
    </div>
  )
}
