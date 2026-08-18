import { NextResponse } from 'next/server'

import { payloadClient } from '@/lib/data'

/**
 * Redirects to a document's file and records the download. Counting happens here
 * rather than on the client so ad blockers cannot hide it from the panel.
 */
export const GET = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const payload = await payloadClient()

  const doc = await payload.findByID({ collection: 'documents', id, depth: 0 }).catch(() => null)
  if (!doc?.url) return NextResponse.json({ error: 'not found' }, { status: 404 })

  await payload.update({
    collection: 'documents',
    id,
    overrideAccess: true,
    data: { downloadCount: (doc.downloadCount ?? 0) + 1 },
  })

  await payload.create({
    collection: 'events',
    overrideAccess: true,
    data: {
      type: 'download',
      path: new URL(request.url).pathname,
      documentRef: Number(id),
      country: request.headers.get('x-vercel-ip-country') ?? undefined,
      referrerHost: safeHost(request.headers.get('referer')),
    },
  })

  return NextResponse.redirect(new URL(doc.url, request.url))
}

const safeHost = (value: string | null) => {
  if (!value) return undefined
  try {
    return new URL(value).host
  } catch {
    return undefined
  }
}
