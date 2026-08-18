import { NextResponse } from 'next/server'

import type { Lead } from '@/payload-types'
import { payloadClient } from '@/lib/data'

const PAGE_SIZE = 500
const MAX_ROWS = 20000

const STATUS_LABELS: Record<Lead['status'], string> = {
  new: 'Yeni',
  'in-progress': 'Görüşülüyor',
  quoted: 'Teklif verildi',
  won: 'Kazanıldı',
  lost: 'Kaybedildi',
  spam: 'Spam',
}

// Excel bu önekleri formül sayar; tek tırnak bunu durdurur. `+90 555…` gibi
// telefonlar bozulmasın diye + ve - yalnızca rakam/boşluk gelmiyorsa kaçırılır.
const FORMULA_PREFIX = /^[=@]|^[+-](?![\d\s])/

/** RFC 4180: her alan tırnak içinde, içerideki tırnak ikileniyor. */
const csvCell = (value: string) => {
  const safe = FORMULA_PREFIX.test(value) ? `'${value}` : value
  return `"${safe.replace(/"/g, '""')}"`
}

const parseDate = (value: string | null, endOfDay = false) => {
  if (!value) return undefined
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return undefined
  // Saatsiz `to` değeri o günün tamamını kapsamalı, ilk milisaniyesini değil.
  if (endOfDay && /^\d{4}-\d{2}-\d{2}$/.test(value)) parsed.setUTCHours(23, 59, 59, 999)
  return parsed.toISOString()
}

const formatDate = (value: string) =>
  new Date(value).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })

const productNames = (items: Lead['productInterest']) =>
  (items ?? [])
    .map((item) => (typeof item === 'object' ? item.title : String(item)))
    .join(' | ')

const assignee = (user: Lead['assignedTo']) => {
  if (!user || typeof user !== 'object') return ''
  return user.name || user.email
}

const COLUMNS: { label: string; value: (lead: Lead) => string }[] = [
  { label: 'Talep No', value: (lead) => String(lead.id) },
  { label: 'Tarih', value: (lead) => formatDate(lead.createdAt) },
  { label: 'Ad Soyad', value: (lead) => lead.name },
  { label: 'Firma', value: (lead) => lead.company ?? '' },
  { label: 'E-posta', value: (lead) => lead.email },
  { label: 'Telefon', value: (lead) => lead.phone ?? '' },
  { label: 'Ülke', value: (lead) => lead.country ?? '' },
  {
    label: 'Form dili',
    value: (lead) => (lead.locale === 'en' ? 'English' : lead.locale === 'tr' ? 'Türkçe' : ''),
  },
  { label: 'Mesaj', value: (lead) => lead.message ?? '' },
  { label: 'İlgilendiği ürünler', value: (lead) => productNames(lead.productInterest) },
  { label: 'Geldiği sayfa', value: (lead) => lead.sourcePath ?? '' },
  { label: 'Durum', value: (lead) => STATUS_LABELS[lead.status] ?? lead.status },
  { label: 'Sorumlu', value: (lead) => assignee(lead.assignedTo) },
  { label: 'İç notlar', value: (lead) => lead.notes ?? '' },
]

/**
 * Teklif taleplerini CSV olarak indirir. Panel oturumunun çerezi şart — Leads
 * içeriği (mesaj, iletişim bilgisi, iç notlar) anonim istekle dışarı çıkmaz.
 * İsteğe bağlı `?from=` / `?to=` ISO tarih süzgeci; geçersiz değer yok sayılır.
 */
export const GET = async (request: Request) => {
  const payload = await payloadClient()
  const { user } = await payload.auth({ headers: request.headers })

  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  if (user.role !== 'admin' && user.role !== 'editor') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const from = parseDate(searchParams.get('from'))
  const to = parseDate(searchParams.get('to'), true)
  const createdAt: Record<string, string> = {}
  if (from) createdAt.greater_than_equal = from
  if (to) createdAt.less_than_equal = to
  const where = Object.keys(createdAt).length ? { createdAt } : undefined

  const rows: Lead[] = []
  let page = 1

  try {
    for (;;) {
      const result = await payload.find({
        collection: 'leads',
        user,
        overrideAccess: false,
        where,
        depth: 1,
        limit: PAGE_SIZE,
        page,
        sort: '-createdAt',
      })

      // Tümünü belleğe almadan önce sınırı kontrol et; aşılırsa aralık daraltılsın.
      if (page === 1 && result.totalDocs > MAX_ROWS) {
        return NextResponse.json(
          {
            error: 'too-many-rows',
            totalDocs: result.totalDocs,
            max: MAX_ROWS,
            hint: 'from / to ile tarih aralığını daraltın.',
          },
          { status: 413 },
        )
      }

      rows.push(...result.docs)
      if (!result.hasNextPage) break
      page += 1
    }
  } catch (error) {
    payload.logger.error({ err: error }, 'leads CSV export failed')
    return NextResponse.json({ error: 'export-failed' }, { status: 500 })
  }

  const lines = [
    COLUMNS.map((column) => csvCell(column.label)).join(','),
    ...rows.map((lead) => COLUMNS.map((column) => csvCell(column.value(lead))).join(',')),
  ]

  // BOM olmadan Excel dosyayı ANSI sanıp Türkçe karakterleri bozuyor.
  const csv = `\uFEFF${lines.join('\r\n')}\r\n`
  const stamp = new Date().toISOString().slice(0, 10)

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="teklif-talepleri-${stamp}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
