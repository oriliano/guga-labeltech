export type Media = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

/**
 * Payload görsel adresini tam adres olarak veriyor; next/image tam adresleri
 * remotePatterns olmadan reddediyor ve görsel kırık çıkıyor. Kendi alan
 * adımızdaki adresi göreli yola çevirmek alan adı değiştiğinde de çalışır.
 */
export const mediaOf = (value: unknown): Media | null => {
  if (!value || typeof value !== 'object' || !('url' in (value as Media))) return null
  const media = value as Media
  if (!media.url?.startsWith('http')) return media
  try {
    const parsed = new URL(media.url)
    return { ...media, url: `${parsed.pathname}${parsed.search}` }
  } catch {
    return media
  }
}

/** Panelden yüklenen görsel her zaman önce gelir, depodaki statik görsel yedektir. */
export const imageUrl = (value: unknown, fallback?: string): string | undefined =>
  mediaOf(value)?.url ?? fallback
