import { getPayload } from 'payload'
import configPromise from '@payload-config'

const DAYS = 30

const since = () => {
  const date = new Date()
  date.setDate(date.getDate() - DAYS)
  return date.toISOString()
}

const Tile = ({ value, label }: { value: string | number; label: string }) => (
  <div
    style={{
      border: '1px solid var(--theme-elevation-150)',
      borderRadius: '.5rem',
      padding: '1rem 1.25rem',
      minWidth: '10rem',
    }}
  >
    <div style={{ fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.1 }}>{value}</div>
    <div style={{ fontSize: '.8125rem', color: 'var(--theme-elevation-600)', marginTop: '.25rem' }}>{label}</div>
  </div>
)

const List = ({ title, rows }: { title: string; rows: { label: string; count: number }[] }) => (
  <div style={{ flex: '1 1 18rem' }}>
    <h3 style={{ fontSize: '.875rem', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '.75rem' }}>
      {title}
    </h3>
    {rows.length === 0 ? (
      <p style={{ color: 'var(--theme-elevation-600)', fontSize: '.875rem' }}>Henüz veri yok.</p>
    ) : (
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '.875rem' }}>
        {rows.map((row) => (
          <li
            key={row.label}
            style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '.35rem 0' }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.label}</span>
            <strong style={{ fontVariantNumeric: 'tabular-nums' }}>{row.count}</strong>
          </li>
        ))}
      </ol>
    )}
  </div>
)

const tally = (values: (string | null | undefined)[], top = 8) => {
  const counts = new Map<string, number>()
  for (const value of values) {
    if (!value) continue
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([label, count]) => ({ label, count }))
}

/**
 * Panel summary shown above the collection list. Aggregates the first-party
 * `events` rows rather than calling any external analytics service.
 */
export const Dashboard = async () => {
  const payload = await getPayload({ config: configPromise })
  const createdAfter = since()

  const [events, leads, newLeads] = await Promise.all([
    payload.find({
      collection: 'events',
      limit: 5000,
      depth: 0,
      where: { createdAt: { greater_than: createdAfter } },
      sort: '-createdAt',
    }),
    payload.count({ collection: 'leads', where: { createdAt: { greater_than: createdAfter } } }),
    payload.count({ collection: 'leads', where: { status: { equals: 'new' } } }),
  ])

  const docs = events.docs as { type: string; path: string; country?: string | null }[]
  const pageviews = docs.filter((event) => event.type === 'pageview')
  const downloads = docs.filter((event) => event.type === 'download')
  const conversion = pageviews.length ? ((leads.totalDocs / pageviews.length) * 100).toFixed(2) : '0.00'

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ marginBottom: '.25rem' }}>Son {DAYS} gün</h2>
      <p style={{ color: 'var(--theme-elevation-600)', fontSize: '.875rem', marginBottom: '1rem' }}>
        Kendi kayıtlarımızdan üretilir; çerez kullanılmaz.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem', marginBottom: '2rem' }}>
        <Tile value={pageviews.length} label="Sayfa görüntüleme" />
        <Tile value={leads.totalDocs} label="Teklif talebi" />
        <Tile value={newLeads.totalDocs} label="Bekleyen talep" />
        <Tile value={downloads.length} label="Doküman indirme" />
        <Tile value={`%${conversion}`} label="Form dönüşümü" />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        <List title="En çok görüntülenen sayfalar" rows={tally(pageviews.map((event) => event.path))} />
        <List title="Ülkeler" rows={tally(docs.map((event) => event.country))} />
      </div>
    </div>
  )
}
