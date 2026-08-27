import type { ReactNode } from 'react'
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

/**
 * Panelde sık sorulan işlerin yazılı karşılığı. Uzun bir duvar olmasın diye her
 * başlık kapalı açılıyor.
 */
const GuideSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <details style={{ borderTop: '1px solid var(--theme-elevation-100)', padding: '.75rem 0' }}>
    <summary style={{ cursor: 'pointer', fontSize: '.9375rem', fontWeight: 500 }}>{title}</summary>
    <div style={{ fontSize: '.875rem', lineHeight: 1.7, marginTop: '.5rem' }}>{children}</div>
  </details>
)

const PanelGuide = () => (
  <div
    style={{
      border: '1px solid var(--theme-elevation-150)',
      borderRadius: '.5rem',
      padding: '1.25rem 1.5rem',
      marginTop: '1rem',
    }}
  >
    <h3 style={{ fontSize: '1rem', marginBottom: '.25rem' }}>Panel rehberi</h3>
    <p style={{ color: 'var(--theme-elevation-600)', fontSize: '.875rem', marginBottom: '.5rem' }}>
      Başlığa tıklayınca açılır.
    </p>

    <GuideSection title="Taslak ve yayın">
      Her kayıt ya taslak ya da yayında. Sağdaki kutuda <strong>Taslağı kaydet</strong> ile
      kaydettiğin sürece kayıt sitede görünmez, yalnızca panelde durur. Ziyaretçinin görmesi için{' '}
      <strong>Yayınla</strong> demen gerekir. Yayındaki bir kaydı düzenlerken de aynısı geçerli:
      değişiklik yayına girene kadar sitede eski hâli kalır. Eski sürümler <strong>Sürümler</strong>{' '}
      sekmesinde duruyor, yanlış bir düzenlemeyi oradan geri alabilirsin.
    </GuideSection>

    <GuideSection title="İki dil: Türkçe ve İngilizce">
      Başlık, özet, içerik gibi alanlar her dil için ayrı yazılıyor. Sağ üstteki dil seçicisinden{' '}
      <strong>English</strong>'e geçip aynı kaydı bir de İngilizce doldur. İngilizcesini boş
      bırakırsan o alan İngilizce sayfada boş görünür, Türkçesi otomatik kopyalanmaz. Görsel, sıra
      ve ilişki alanları dilden bağımsız, bir kez girmen yeterli.
    </GuideSection>

    <GuideSection title="Sayfa adresi (slug)">
      Adres başlıktan otomatik üretiliyor: “RFID ile tekstil takibi” başlığı{' '}
      <code>/cozumler/rfid-ile-tekstil-takibi</code> adresine düşer. Yayına girmiş bir kaydın
      adresini sonradan değiştirirsen eski adres kırılır; arama motorundaki ve paylaşılmış
      bağlantılar 404 verir. Değiştirmen gerekirse haber ver, eski adresten yenisine yönlendirme
      ekleyelim.
    </GuideSection>

    <GuideSection title="Sektör alanı listeyi gruplar">
      Çözüm, referans ve projelerdeki <strong>sektör</strong> alanı yalnızca bir rozet değil: liste
      sayfasındaki grup başlığı ve üstteki filtre düğmesi buradan üretiliyor. Tek bir sektör yaz
      (Depo, Perakende, Sağlık gibi). Birden fazla sektör yazarsan başlık olarak yalnızca ilki
      kullanılır, gerisi görünmez.
    </GuideSection>

    <GuideSection title="Referans ve proje eklemek">
      Panelde hazır taslaklar var; müşteri adını, ülkeyi ve rakamları doldurup yayınlaman yeterli.
      Müşteri adı paylaşılamıyorsa <strong>Müşteri</strong> alanını boş bırak, kayıt yine yayına
      girer. <strong>Sonuçlar</strong> bölümü zorunlu değil: elde ölçülmüş bir rakam yoksa satır
      ekleme, uydurma sayı girme. <strong>İlgili çözüm</strong> alanını doldurursan vaka ile çözüm
      sayfası birbirine bağlanır.
    </GuideSection>

    <GuideSection title="Sıralama">
      Sağdaki <strong>Sıra</strong> alanında küçük sayı önce gelir. Liste sayfalarında her grubun
      ilk üç kaydı gösteriliyor, gerisi grubun kendi sayfasında. Bir kaydın öne çıkmasını istersen
      sırasını küçült.
    </GuideSection>

    <GuideSection title="Teklif talepleri">
      Siteden gelen form <strong>Teklif Talepleri</strong> altına düşer ve aynı anda e-posta
      bildirimi gider. Formla gönderilen dosyalar <strong>Talep Ekleri</strong> koleksiyonunda
      durur. Talebin durumunu panelden değiştirebilirsin, böylece hangisine dönüldüğü belli olur.
    </GuideSection>

    <GuideSection title="Analitik">
      Ana sayfadaki sayılar kendi kayıtlarımızdan üretiliyor, üçüncü taraf bir izleyici ve çerez
      yok. Sayfa görüntüleme ve doküman indirme olayları <strong>Analitik</strong> altında ham
      hâliyle duruyor.
    </GuideSection>
  </div>
)

/**
 * Görsel yükleme kuralı panelde yazılı dursun diye burada. Ön yüzdeki oran
 * kararı `src/lib/media.ts` içindeki `imageFitOf` ile aynı sayıları kullanıyor.
 */
const ImageRules = () => (
  <div
    style={{
      border: '1px solid var(--theme-elevation-150)',
      borderRadius: '.5rem',
      padding: '1.25rem 1.5rem',
      marginTop: '2rem',
    }}
  >
    <h3 style={{ fontSize: '1rem', marginBottom: '.25rem' }}>Görsel yükleme kuralı</h3>
    <p style={{ color: 'var(--theme-elevation-600)', fontSize: '.875rem', marginBottom: '1rem' }}>
      Kartlar ve detay sayfaları görseli 16:9 bir çerçevede gösterir. Çerçeve, yüklediğin dosyanın
      kendi ölçüsünü okuyup nasıl yerleşeceğine karar verir.
    </p>
    <ul style={{ fontSize: '.875rem', lineHeight: 1.7, paddingLeft: '1.1rem', margin: 0 }}>
      <li>
        Yatay bir görselin genişlik/yükseklik oranı 1.3 ile 2.1 arasındaysa çerçeveyi tamamen
        doldurur. 1600×900 bu aralığın tam ortasında, kapak görselleri için önerimiz bu.
      </li>
      <li>
        Kare, dikey ya da çok geniş bir görsel yüklersen kırpılmaz. Tamamı çerçevenin içine
        sığdırılır, kenarlarda boşluk kalır.
      </li>
      <li>
        Ürün fotoğrafı hiçbir zaman kırpılmaz. Beyaz ya da sade zeminde 1200×1200 civarı kare bir
        fotoğraf en iyi sonucu veriyor.
      </li>
      <li>
        Görsel yüklemezsen kart boş kalmaz, konuya uygun bir yedek fotoğraf devreye girer. Panelden
        yüklediğin fotoğraf her zaman yedeğin önüne geçer.
      </li>
      <li>
        Alternatif metin zorunlu. Görseli göremeyen ziyaretçi ve arama motorları bunu okur, bir
        cümle yeter.
      </li>
      <li>
        Dosyayı yüklemeden önce kırpmak istersen 16:9 kırp. Panelde kırpma aracı yok, yüklenen dosya
        olduğu gibi saklanır.
      </li>
    </ul>
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

      <ImageRules />
      <PanelGuide />
    </div>
  )
}
