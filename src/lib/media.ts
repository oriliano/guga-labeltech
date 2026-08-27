export type Media = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

/**
 * Payload can return an absolute URL. Keep a different public origin (such as
 * R2) intact; turning it into a local path would make the image return 404.
 */
export const mediaOf = (value: unknown): Media | null => {
  if (!value || typeof value !== 'object' || !('url' in (value as Media))) return null
  const media = value as Media
  if (!media.url?.startsWith('http')) return media
  try {
    const parsed = new URL(media.url)
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
    const serverOrigin = serverUrl ? new URL(serverUrl).origin : undefined
    return parsed.origin === serverOrigin ? { ...media, url: `${parsed.pathname}${parsed.search}` } : media
  } catch {
    return media
  }
}

/** Panelden yüklenen görsel her zaman önce gelir, depodaki statik görsel yedektir. */
export const imageUrl = (value: unknown, fallback?: string): string | undefined =>
  mediaOf(value)?.url ?? fallback
