import { type Locale } from '@/lib/i18n'

/**
 * Fixed contact shortcut. The number comes from the panel: the first phone with
 * the WhatsApp box ticked. Nothing renders when no phone is marked.
 */
export const WhatsAppButton = ({ number, locale }: { number: string; locale: Locale }) => {
  const digits = number.replace(/[^\d]/g, '')
  if (!digits) return null

  const label = locale === 'tr' ? 'WhatsApp ile yazın' : 'Message us on WhatsApp'
  const text =
    locale === 'tr'
      ? 'Merhaba, GUGA LABELTECH sitesinden yazıyorum.'
      : 'Hello, I am writing from the GUGA LABELTECH website.'

  return (
    <a
      href={`https://wa.me/${digits}?text=${encodeURIComponent(text)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition hover:brightness-105 focus-visible:brightness-105"
    >
      <svg viewBox="0 0 32 32" aria-hidden className="h-7 w-7 fill-current">
        <path d="M16.04 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.6 4.47 1.73 6.42L3.2 28.8l6.55-1.72a12.75 12.75 0 0 0 6.29 1.64h.01c7.05 0 12.79-5.74 12.79-12.8 0-3.42-1.33-6.63-3.75-9.05a12.7 12.7 0 0 0-9.05-3.67Zm0 23.33h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.03 1.06 1.07-3.93-.25-.4a10.6 10.6 0 0 1-1.63-5.67c0-5.87 4.78-10.64 10.65-10.64 2.84 0 5.51 1.11 7.52 3.12a10.57 10.57 0 0 1 3.12 7.53c0 5.87-4.78 10.64-10.65 10.64Zm5.84-7.97c-.32-.16-1.89-.93-2.19-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.18-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.73-.98-2.36-.26-.62-.52-.54-.71-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.66s1.14 3.08 1.3 3.29c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.15-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
      </svg>
    </a>
  )
}
