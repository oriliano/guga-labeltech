import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

/**
 * Eski (2024 öncesi) site adresleri → yeni bölüm adresleri.
 *
 * Anahtar: legacy slug (src/seed/scraped.json içindeki pages[].slug ile birebir).
 * Değer: yeni yol (src/lib/routes.ts SECTION_SLUGS.tr karşılıkları).
 *
 * Eski ürün sayfaları kategori listeleriydi ve yeni sitede karşılıkları var, bu
 * yüzden her biri kendi kategori sayfasına gider. Çözüm ve blog yazıları kendi
 * detay sayfalarına gider.
 */
const LEGACY_ROUTES: Record<string, string> = {
  // Ana sayfa
  home: '/',

  // Kurumsal / iletişim
  'i̇leti̇şi̇m': '/iletisim',

  // Ürün kategorileri → tek ürün listesi
  'rfid-donanım': '/urunler/kategori/rfid-donanim',
  'rfid-etiket-1': '/urunler/kategori/rfid-etiket',
  'rfid-endüstriyel-tag': '/urunler/kategori/rfid-endustriyel-tag',
  'endüstriyel-etiketler': '/urunler/kategori/endustriyel-etiketler',
  'kart-ürünlerimiz': '/urunler/kategori/kart-urunleri',
  ribon: '/urunler/kategori/ribon',
  'yaka-i̇pleri': '/urunler/kategori/yaka-ipleri',
  'kütüphane-ürünlerimiz': '/urunler/kategori/kutuphane-urunleri',
  'perakende-ürünlerimiz': '/urunler/kategori/perakende-urunleri',

  // Çözümler (yeni slug'lar src/seed/solutions.ts'ten)
  'rfid-depo-yönetimi': '/cozumler/rfid-depo-yonetimi',
  'rfid-lojistik-yönetimi': '/cozumler/rfid-lojistik-yonetimi',
  'rfid-perakende-yönetimi': '/cozumler/rfid-perakende-yonetimi',
  'rfid-tekstil-yönetimi': '/cozumler/rfid-tekstil-yonetimi',
  'rfid-medikal-yönetimi': '/cozumler/rfid-medikal-yonetimi',
  'rfid-kuyum-yönetimi': '/cozumler/rfid-kuyum-yonetimi',
  'rfid-demirbaş-yönetimi': '/cozumler/rfid-demirbas-yonetimi',
  'rfid-personel-yönetimi': '/cozumler/rfid-personel-takip',
  'rfid-otopark-yönetimi': '/cozumler/rfid-otopark-arac-yonetimi',
  'soğuk-zincir-yönetimi': '/cozumler/soguk-zincir-takibi',
  'medikal-kabin-yönetimi': '/cozumler/akilli-medikal-kabin',
  'el-aletleri-yönetimi': '/cozumler/uhf-rfid-alet-yonetimi',
  'hastane-takip-yönetim': '/cozumler/hastane-rtls-takip',
  'perakende-takip-yönetimi': '/cozumler/perakende-rtls-takip',
  'havacılık-takip-yönetimi-1': '/cozumler/havacilik-bakim-takip',
  'mobil-cihaz-yönetimimdm': '/cozumler/mobil-cihaz-yonetimi',

  // Blog: eski /f/<slug> → /bilgi-merkezi/<yeni-slug> (src/seed/posts.ts)
  'f/rfid-teknoloji̇si̇-nedi̇': '/bilgi-merkezi/rfid-nedir-hangi-isi-gercekten-cozer',
  'f/nfc-vs-rfid': '/bilgi-merkezi/nfc-ile-rfid-ayni-sey-mi',
  'f/impinj-m800-rfid-etiketleri-—-üstün-performansla-akıllı-yönetimi':
    '/bilgi-merkezi/impinj-m800-nesli-etiket-seciminde-neyi-degistiriyor',
  'f/liderler-endüstri-40a-nasıl-ayak-uydurabilir':
    '/bilgi-merkezi/endustri-4-0-a-ayak-uydurmak-soylemi-birakip-neyi-olceceginize-karar-verin',
  'f/rfid-projelerinde-başarının-anahtarı-doğru-etiket-teknolojisini':
    '/bilgi-merkezi/rfid-projelerinde-etiket-secimi-yuzey-mesafe-ortam',
}

/**
 * Eski slug'lar Türkçe karakter içeriyor ve gelen istekler ya ham UTF-8 ya da
 * percent-encoded olarak düşüyor. Next.js source eşleşmesinin hangi biçimi
 * gördüğü sunucu/proxy'ye göre değişebildiği için her iki varyantı da kaydediyoruz;
 * ASCII slug'larda encodeURI aynı dizeyi ürettiğinden Set ile tekilleştiriyoruz.
 *
 * Not: `i̇` (i + U+0307 birleşik nokta) tek karakter değil; encodeURI bunu
 * `i%CC%87` olarak açar, ham hali de ayrıca kural olarak duruyor.
 */
const legacyRedirects = Object.entries(LEGACY_ROUTES).flatMap(([slug, destination]) => {
  const sources = new Set([`/${slug}`, encodeURI(`/${slug}`)])
  return [...sources].map((source) => ({ source, destination, permanent: true }))
})

// R2 public origin is optional; when absent media remains on the app origin.
const r2PublicUrl = process.env.R2_PUBLIC_URL?.replace(/\/+$/, '')

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/ihracat', destination: '/projeler', permanent: true },
      { source: '/en/export', destination: '/en/projects', permanent: true },
      ...legacyRedirects,
      // Eşleşmeyen eski blog adresleri 404 yerine listeye düşsün.
      { source: '/f/:slug*', destination: '/bilgi-merkezi', permanent: true },
    ]
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        // Marka varliklari public/ altinda duruyor, medya kutuphanesinde degil.
        pathname: '/logo.png',
      },
      {
        // Eski siteden tasinan gorseller; R2 baglanana kadar depo icinde duruyorlar.
        pathname: '/img/**',
      },
    ],
    remotePatterns: r2PublicUrl ? [new URL(`${r2PublicUrl}/**`)] : [],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
