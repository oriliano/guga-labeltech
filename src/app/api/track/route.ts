import { NextResponse } from 'next/server'

import { payloadClient } from '@/lib/data'

const safeHost = (value: string | null) => {
  if (!value) return undefined
  try {
    return new URL(value).host
  } catch {
    return undefined
  }
}

/**
 * Cookie-free pageview beacon. Stores no visitor identifier — only path, locale,
 * coarse device type and the country header the edge already provides — so it
 * needs no consent banner.
 */
export const POST = async (request: Request) => {
  const body = await request.json().catch(() => null)
  if (!body?.path || typeof body.path !== 'string') {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const userAgent = request.headers.get('user-agent') ?? ''
  const payload = await payloadClient()

  await payload.create({
    collection: 'events',
    overrideAccess: true,
    data: {
      type: 'pageview',
      path: body.path.slice(0, 300),
      locale: typeof body.locale === 'string' ? body.locale : undefined,
      country:
        request.headers.get('cf-ipcountry') ??
        request.headers.get('x-vercel-ip-country') ??
        undefined,
      referrerHost: safeHost(typeof body.referrer === 'string' ? body.referrer : null),
      deviceType: /mobile|android|iphone/i.test(userAgent) ? 'mobile' : 'desktop',
    },
  })

  return NextResponse.json({ ok: true })
}
