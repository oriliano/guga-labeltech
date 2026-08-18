# GUGA LABELTECH

Kurumsal web sitesi ve yönetim paneli. Next.js 16 + Payload CMS 3, tek uygulama.
Site TR/EN çift dilli; panel `/admin` altında çalışır.

## Gereksinimler

- Node.js 20.9+ (geliştirme 24.x ile yapıldı)
- PostgreSQL 14+
- Cloudflare R2 (isteğe bağlı; boş bırakılırsa yüklemeler yerel diske düşer)

## Kurulum

```bash
npm install
cp .env.example .env    # değerleri doldurun
npm run dev
```

İlk açılışta Payload şemayı otomatik oluşturur. Ardından içeriği eski siteden tohumlayın:

```bash
npm run seed
```

`seed`, `src/seed/scraped.json` dosyasındaki eski site içeriğini okur ve ürün/çözüm
kayıtlarını üretir. Tekrar çalıştırılabilir: kayıtlar `slug` üzerinden eşleşip güncellenir.
İçeriği yeniden çekmek için `node src/seed/scrape.mjs`.

## Ortam değişkenleri

| Değişken | Zorunlu | Açıklama |
| --- | --- | --- |
| `DATABASE_URI` | evet | PostgreSQL bağlantı adresi. Railway'de eklenti otomatik sağlar. |
| `PAYLOAD_SECRET` | evet | Oturum imzalama anahtarı. `openssl rand -base64 32` |
| `NEXT_PUBLIC_SERVER_URL` | evet | Yayın adresi; canonical, hreflang ve sitemap için kullanılır. |
| `R2_BUCKET` | hayır | Boşsa yüklemeler yerel diske yazılır. |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` | R2 kullanılıyorsa | Cloudflare R2 kimlik bilgileri. |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | ilk tohumlamada | İlk yönetici hesabı. |

## Yapı

```
src/
  app/(frontend)/[[...segments]]   TR/EN yönlendirici — tek giriş noktası
  app/(payload)                    Payload panel ve REST/GraphQL uçları
  app/api/quote                    Teklif formu
  app/api/download/[id]            PDF indirme + sayaç
  app/api/track                    Çerezsiz sayfa görüntüleme kaydı
  collections/                     Ürün, çözüm, referans, yazı, doküman, talep, olay
  globals/                         Site ayarları, menüler
  components/pages                 Sayfa şablonları
  components/site                  Başlık, alt bilgi, ortak arayüz parçaları
  components/admin/Dashboard.tsx   Panel özet grafikleri
  seed/                            Eski site kazıyıcı ve tohumlama
```

## Dil yapısı

Türkçe kökte (`/urunler`), İngilizce ön ekli (`/en/products`). Bölüm adları da
çevrilidir; eşleme `src/lib/routes.ts` içindeki `SECTION_SLUGS` tablosundadır.
Panelde bir kayıt tek kez girilir, dil sekmeleriyle çevrilir; İngilizce boşsa
Türkçe içerik gösterilir.

## Analitik

Ziyaretçi kimliği saklanmaz; yalnızca yol, dil, ülke başlığı ve kaba cihaz türü
kaydedilir. Bu nedenle çerez onayı gerekmez. Özet panel ana sayfasındadır.

## Dağıtım (Railway)

```bash
railway init --name guga-labeltech
railway add --database postgres
railway variables --set PAYLOAD_SECRET=... --set NEXT_PUBLIC_SERVER_URL=https://...
railway up
```

`railway.json` derleme ve başlatma komutlarını içerir. `DATABASE_URI` değişkenini
Postgres eklentisinin `DATABASE_URL` değerine bağlayın.

### Şema değişikliği yapıldığında

Payload şemayı yalnızca geliştirme modunda otomatik oluşturur; üretim konteyneri bunu
yapmaz. Koleksiyon veya alan eklediğinizde şemayı dışarıdan senkronlayın:

```bash
railway tcp-proxy create --port 5432 --service Postgres
```

Proxy adresiyle bir bağlantı dizesi kurup `NODE_ENV=development npx tsx src/seed/run.ts`
çalıştırın; Payload eksik tabloları oluşturur. **Bittiğinde proxy'yi silin** —
`railway tcp-proxy delete --service Postgres <id>` — açık bırakmak veritabanını
internete açar.

Kalıcı çözüm ikinci bir ortam eklendiğinde: `payload migrate:create` ile göç
dosyaları üretip başlatma komutuna `payload migrate` ekleyin.
