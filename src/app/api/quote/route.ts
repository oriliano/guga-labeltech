import { NextResponse } from 'next/server'

import { payloadClient } from '@/lib/data'

/**
 * Public quote form endpoint. The Leads collection itself denies anonymous
 * creation, so writes go through Payload's local API with `overrideAccess`.
 */
export const POST = async (request: Request) => {
  const form = await request.formData()

  // Honeypot — a filled hidden field means a bot; answer 200 so it stops retrying.
  if (form.get('website')) return NextResponse.json({ ok: true })

  const value = (key: string) => {
    const raw = form.get(key)
    return typeof raw === 'string' ? raw.trim() : ''
  }

  const name = value('name')
  const email = value('email')
  if (!name || !email || !email.includes('@')) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 })
  }

  const payload = await payloadClient()
  const sourcePath = value('sourcePath')

  await payload.create({
    collection: 'leads',
    overrideAccess: true,
    data: {
      name,
      email,
      company: value('company') || undefined,
      phone: value('phone') || undefined,
      country: value('country') || undefined,
      message: value('message') || undefined,
      locale: value('locale') === 'en' ? 'en' : 'tr',
      sourcePath: sourcePath || undefined,
      status: 'new',
    },
  })

  await payload.create({
    collection: 'events',
    overrideAccess: true,
    data: {
      type: 'lead',
      path: sourcePath || '/',
      locale: value('locale') || 'tr',
      country: value('country') || undefined,
    },
  })

  return NextResponse.json({ ok: true })
}
