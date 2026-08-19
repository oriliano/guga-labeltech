'use client'

import { useState } from 'react'

import { type Locale } from '@/lib/i18n'

/**
 * Ofis haritası. Google'ın çerçevesi sayfa açılır açılmaz yüklenmiyor: gömülü
 * harita Google'a istek atar ve çerez bırakır, bizim analitiğimiz ise çerezsiz.
 * Ziyaretçi tıklayana kadar yalnızca adres ve iki bağlantı duruyor.
 */
export const OfficeMap = ({
  locale,
  address,
  label,
  mapUrl,
}: {
  locale: Locale
  address: string
  label?: string
  mapUrl?: string
}) => {
  const [shown, setShown] = useState(false)
  const query = encodeURIComponent(address)
  const directions = mapUrl || `https://www.google.com/maps/dir/?api=1&destination=${query}`

  return (
    <div className="card-surface overflow-hidden">
      <div className="relative aspect-[16/10] w-full bg-ink-900">
        {shown ? (
          <iframe
            title={label ? `${label} — ${address}` : address}
            src={`https://www.google.com/maps?q=${query}&hl=${locale}&z=16&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setShown(true)}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
          >
            {/* Basit bir konum işareti; harita yüklenmeden önce yer tutuyor. */}
            <svg viewBox="0 0 24 24" aria-hidden className="h-10 w-10 fill-none stroke-signal-500" strokeWidth="1.4">
              <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.6" />
            </svg>
            <span className="text-sm font-semibold text-ink-100">
              {locale === 'tr' ? 'Haritayı göster' : 'Show the map'}
            </span>
            <span className="max-w-xs text-xs leading-relaxed text-ink-400">
              {locale === 'tr'
                ? 'Harita Google üzerinden yüklenir. Tıklayana kadar hiçbir istek gitmez.'
                : 'The map loads from Google. Nothing is requested until you click.'}
            </span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--card-border)] p-5">
        <div className="text-sm">
          {label ? <p className="font-semibold">{label}</p> : null}
          <p className="mt-1 text-muted">{address}</p>
        </div>
        <a
          href={directions}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-signal-600 hover:underline"
        >
          {locale === 'tr' ? 'Yol tarifi' : 'Directions'} →
        </a>
      </div>
    </div>
  )
}
