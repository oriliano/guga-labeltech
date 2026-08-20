import { NextResponse } from 'next/server'

import {
  LEAD_FILE_MAX_BYTES,
  LEAD_FILE_MAX_COUNT,
  LEAD_FILE_MIME_TYPES,
} from '@/collections/LeadFiles'
import { payloadClient } from '@/lib/data'
import { sendLeadMail } from '@/lib/mail'

/**
 * Public quote form endpoint. The Leads collection itself denies anonymous
 * creation, so writes go through Payload's local API with `overrideAccess`.
 */
export const POST = async (request: Request) => {
  // Form dışı bir gövde geldiğinde formData() hata fırlatıyor ve uç 500 dönüyordu;
  // hatalı istek sunucu hatası değil.
  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 })
  }

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

  // Ekler talep kaydından önce yazılıyor ki kayıt onlara baştan bağlanabilsin.
  // Sınırı aşan ya da tür olarak kabul edilmeyen dosya sessizce atılıyor: form
  // aynı sınırları zaten uyguluyor, buraya düşen istek tarayıcıyı atlamış demek.
  const uploads = form
    .getAll('files')
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)
    .filter((file) => file.size <= LEAD_FILE_MAX_BYTES && LEAD_FILE_MIME_TYPES.includes(file.type))
    .slice(0, LEAD_FILE_MAX_COUNT)

  const attachments: { id: number; name: string; mimetype: string; data: Buffer }[] = []
  for (const file of uploads) {
    const data = Buffer.from(await file.arrayBuffer())
    try {
      const saved = await payload.create({
        collection: 'lead-files',
        overrideAccess: true,
        data: {},
        file: { data, mimetype: file.type, name: file.name, size: file.size },
      })
      attachments.push({ id: saved.id as number, name: file.name, mimetype: file.type, data })
    } catch (error) {
      // Tek bir ek yüklenemediğinde talebin tamamını düşürmek en kötüsü olurdu.
      payload.logger.warn(`teklif eki kaydedilemedi (${file.name}): ${(error as Error).message}`)
    }
  }

  const lead = await payload.create({
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
      attachments: attachments.map((file) => file.id),
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

  // Bildirim kaydın ardından gidiyor: e-posta gönderilemese de talep kaybolmuyor.
  const mail = await sendLeadMail({
    name,
    email,
    company: value('company') || undefined,
    phone: value('phone') || undefined,
    country: value('country') || undefined,
    message: value('message') || undefined,
    locale: value('locale') === 'en' ? 'en' : 'tr',
    sourcePath: sourcePath || undefined,
    adminUrl: `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/admin/collections/leads/${lead.id}`,
    attachments: attachments.map(({ name, mimetype, data }) => ({ name, mimetype, data })),
  })
  if (!mail.sent) payload.logger.warn(`teklif bildirimi gonderilemedi: ${mail.reason}`)

  return NextResponse.json({ ok: true })
}
