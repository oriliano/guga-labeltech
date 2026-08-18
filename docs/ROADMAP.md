# GUGA LABELTECH — kalan işler

Son güncelleme: 18 Ağustos 2026

Canlı: https://web-production-b7141.up.railway.app
Repo: https://github.com/oriliano/guga-labeltech
Railway projesi: `guga-labeltech` (servisler: `web`, `Postgres`)

## Şu an ne durumda

Bitti:

- Next.js 16 + Payload 3 tek uygulama, Railway'de çalışıyor
- TR/EN çift dil altyapısı, dile göre bölüm adresleri, hreflang ve canonical
- 16 çözüm sayfası, iki dilde, elle yazılmış
- 5 blog yazısı, iki dilde
- Site ayarları: adres, telefon, e-posta
- Teklif formu, çerezsiz analitik, PDF indirme sayacı
- Panelde gösterge tablosu (30 günlük özet)
- sitemap.xml ve robots.txt
- Yapılandırılmış veri: Organization, Product, Article, BreadcrumbList
- Çözüm sayfasında entegrasyon listesi
- İki dilli 404 sayfası
- GA4 etiketi (site ayarlarında ölçüm kimliği doluysa yüklenir)
- Eski adreslerden 301 yönlendirmeleri
- Teklif taleplerinde CSV dışa aktarma
- 48 ürünün TR/EN metni, veritabanına yazıldı
- Marka paleti (koyu yeşil / altın), logo, favicon ve paylaşım görseli
- WhatsApp butonu, Instagram ve LinkedIn bağlantıları

Eksik olanlar aşağıda.

## Paralel çalışma kuralları

Aynı anda farklı Claude Code oturumlarında çalıştırılabilecek işler **hat** olarak
gruplandı. Aynı hattaki işler sırayla yapılmalı; farklı hatlar aynı anda
yürütülebilir, çünkü farklı dosyalara dokunuyorlar.

Şema değiştiren her iş (koleksiyona alan ekleme dahil) veritabanına dokunur.
İki hat aynı anda şema değiştirmesin. Şema değişikliği yordamı README'de.

| Hat | Konu | Dokunduğu yerler | Aynı anda çalışabilir mi |
| --- | --- | --- | --- |
| A | Ürün içeriği | `src/seed/`, veritabanı | B, C, D ile evet |
| B | Site şablonları ve SEO | `src/components/`, `src/app/(frontend)/` | A, C, D ile evet |
| C | Panel ve arka uç | `src/collections/`, `src/app/api/`, `payload.config.ts` | A, B, D ile evet |
| D | Altyapı ve yayın | Railway ayarları, `next.config.ts` | A, B, C ile evet |
| E | Hukuki ve kurumsal içerik | veritabanı, `src/components/pages/static.tsx` | Kullanıcı metni gerektirir |

---

## Hat A — ürün içeriği

### A3. Ürün görsellerini taşı

Eski sitenin görselleri hâlâ GoDaddy CDN'inde (`img1.wsimg.com`). Adresleri
`src/seed/scraped.json` içinde duruyor. Bunları indirip Payload media
koleksiyonuna yükleyin ve ürünlerle ilişkilendirin.

Önce D1 (R2 kurulumu) bitmiş olmalı, yoksa görseller konteyner diskine yazılır ve
her dağıtımda kaybolur.

---

## Hat B — site şablonları ve SEO

### B6. Erişilebilirlik ve performans denetimi

Lighthouse çalıştırıp renk kontrastı, odak sırası ve mobil düzen sorunlarını
kapat. Ürün ve çözüm görselleri eklendikten sonra yapılmalı (A3 sonrası).

---

## Hat C — panel ve arka uç

### C2. Yeni teklif geldiğinde e-posta bildirimi

Şu an talep sadece veritabanına düşüyor. Panele bakılmazsa fark edilmez.
Payload açılışta "no email adapter" uyarısı veriyor.

Yapılacak: bir e-posta sağlayıcısı (Resend, SendGrid ya da SMTP) bağla,
`src/app/api/quote/route.ts` içinde kayıt sonrası bildirim gönder. Ayrıca
talep sahibine otomatik teşekkür maili gönderilebilir.

### C3. Şema göçlerine geç

Şu an `payload.config.ts` içinde `push: true` var ve şema elle senkronlanıyor.
Tek geliştirici için sorun değil; ikinci bir ortam ya da ikinci geliştirici
girdiğinde `payload migrate:create` ile göç dosyalarına geçilmeli.

### C4. Yedekleme

Railway Postgres'in otomatik yedeği yapılandırılmalı. Şu an içerik tek kopya.

---

## Hat D — altyapı ve yayın

### D1. Cloudflare R2 bağla

`R2_BUCKET`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
değişkenleri Railway'e girilecek. Girilene kadar yüklenen her görsel ve PDF
konteyner diskinde durur, her dağıtımda silinir.

A3 bu işe bağlı.

### D2. PAYLOAD_SECRET değiştir

Kurulum sırasında CLI çıktısında göründü. Railway panelinden yeni bir değer
üretip kaydedin. Oturumlar sıfırlanır, veri etkilenmez.

### D3. Alan adını bağla

`gugalabeltech.com` Railway'e yönlendirildikten sonra
`NEXT_PUBLIC_SERVER_URL` güncellenmeli. Canonical, hreflang ve sitemap bu
değerden besleniyor, eski değerle kalırsa arama motorlarına yanlış adres gider.

### D5. GoDaddy'deki demo mağazayı kapat

Eski sitenin `sitemap.ols.xml` dosyası GoDaddy şablonundan kalma bir demo
mağazayı yayınlıyor (backpacks, socks, blankets kategorileri,
`mysimplestore.com` alt alan adı). Alan adı taşınmadan önce kapatılmalı, sonra
Search Console'dan kaldırma isteği gönderilmeli.

### D6. Search Console ve Bing Webmaster kaydı

Alan adı bağlandıktan sonra sitemap gönderilecek, eski adreslerin düşüşü ve yeni
adreslerin indekslenmesi izlenecek.

---

## Hat E — kullanıcıdan bilgi bekleyen işler

Bu maddeler için GUGA'dan içerik gelmesi gerekiyor, yazılımla çözülmüyor.

### E1. Referans ve vaka çalışmaları

Koleksiyon ve şablon hazır, tek kayıt yok. İhracat müşterisinin en çok baktığı
bölüm burası. Her vaka için gereken: sektör, sorun, uygulanan çözüm ve **rakamlı
sonuç**. Müşteri adı paylaşılamıyorsa sektör yeterli.

### E2. Çözüm sayfalarındaki kazanım rakamları

16 çözümün `outcomes` alanı bilerek boş bırakıldı. Gerçek proje verisi olmadan
rakam yazmak siteyi güvenilmez yapar. Elinizde ölçüm varsa panelden girilecek.

### E3. Ürün teknik verileri

A1'in tamamlanması için frekans, boyut, IP sınıfı, çalışma sıcaklığı ve çip
modeli bilgileri gerekiyor.

### E4. Sertifikalar ve ihracat bilgileri

Site ayarlarında Incoterms, sertifikalar ve ihracat yapılan ülkeler alanları
var, boş. Doldurulunca İhracat sayfasında görünür.

### E5. KVKK ve gizlilik metinleri

Form kişisel veri topluyor. Aydınlatma metni ve gizlilik politikası sayfaları
eklenmeli, form altına onay bağlantısı konmalı. Analitik çerezsiz olduğu için
çerez banner'ı gerekmiyor, ama form için aydınlatma gerekiyor.

---

## Önerilen sıra

Alan adı taşınmadan önce bitmesi gerekenler: D1, D2, D5, C2, E5.

Taşındıktan sonra: D3, D6, B6, A3, E1.

İstenildiği zaman: C3, C4, E2, E3, E4.

Sitede hâlâ tek bir ürün ya da saha fotoğrafı yok; görsel eksikliği en görünür
tasarım sorunu. Sırası D1 (R2) sonrası A3.
