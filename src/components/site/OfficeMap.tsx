import { type Locale } from '@/lib/i18n'

/** Ofis haritası. Gömülü çerçeve sayfayla birlikte yükleniyor. */
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
  const query = encodeURIComponent(address)
  const directions = mapUrl || `https://www.google.com/maps/dir/?api=1&destination=${query}`

  return (
    <div className="card-surface overflow-hidden">
      <div className="relative aspect-[16/10] w-full bg-ink-900">
        <iframe
          title={label ? `${label} — ${address}` : address}
          src={`https://www.google.com/maps?q=${query}&hl=${locale}&z=16&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
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
          className="text-sm font-medium text-signal-400 hover:underline"
        >
          {locale === 'tr' ? 'Yol tarifi' : 'Directions'} →
        </a>
      </div>
    </div>
  )
}
