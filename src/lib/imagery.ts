/**
 * Static imagery carried over from the legacy site, kept in the repo rather than
 * the media library: the media library writes to the container disk until the R2
 * variables are set, so anything uploaded there disappears on the next deploy.
 *
 * These are fallbacks. A picture set on the record in the panel always wins, so
 * this file can be emptied once real product photography is uploaded.
 */

export const HOME_HERO = '/img/hero-iot.jpg'
export const HERO_READER = '/img/hero-reader.jpg'
export const HERO_READER_MP4 = '/img/hero-reader.mp4'
export const HERO_READER_WEBM = '/img/hero-reader.webm'
export const ABOUT_IMAGE = '/img/about.jpg'
export const DISTRIBUTORSHIP_CERTIFICATE = '/img/tenhanyun-sertifika.jpg'

export const SOLUTION_IMAGES: Record<string, string> = {
  'rfid-depo-yonetimi': '/img/solution-rfid-depo-yonetimi.jpg',
  'rfid-lojistik-yonetimi': '/img/solution-rfid-lojistik-takibi.jpg',
  'rfid-perakende-yonetimi': '/img/solution-rfid-perakende-yonetimi.jpg',
  'rfid-tekstil-yonetimi': '/img/solution-rfid-tekstil-takibi.jpg',
  'rfid-medikal-yonetimi': '/img/solution-rfid-medikal-takibi.jpg',
  'rfid-kuyum-yonetimi': '/img/solution-rfid-kuyum-takibi.jpg',
  'rfid-demirbas-yonetimi': '/img/solution-rfid-demirbas-takibi.jpg',
  'rfid-personel-takip': '/img/solution-rfid-personel-takibi.jpg',
  'rfid-otopark-arac-yonetimi': '/img/solution-rfid-otopark-yonetimi.jpg',
  'soguk-zincir-takibi': '/img/solution-rfid-lojistik-takibi-2.jpg',
  'akilli-medikal-kabin': '/img/solution-rfid-medikal-takibi-2.jpg',
  'uhf-rfid-alet-yonetimi': '/img/solution-rfid-demirbas-takibi-2.jpg',
  'hastane-rtls-takip': '/img/solution-rfid-medikal-takibi-3.jpg',
  'perakende-rtls-takip': '/img/solution-rfid-perakende-yonetimi-2.jpg',
  'havacilik-bakim-takip': '/img/solution-rfid-lojistik-takibi-3.jpg',
  'mobil-cihaz-yonetimi': '/img/solution-rfid-personel-takibi-2.jpg',
}

export const POST_IMAGES: Record<string, string> = {
  'rfid-projelerinde-etiket-secimi-yuzey-mesafe-ortam': '/img/post-etiket-secimi.jpg',
  'endustri-4-0-a-ayak-uydurmak-soylemi-birakip-neyi-olceceginize-karar-verin': '/img/post-endustri-40.jpg',
  'impinj-m800-nesli-etiket-seciminde-neyi-degistiriyor': '/img/post-impinj-m800.jpg',
  'nfc-ile-rfid-ayni-sey-mi': '/img/post-nfc-rfid.jpg',
  'rfid-nedir-hangi-isi-gercekten-cozer': '/img/post-rfid-nedir.jpg',
}

/** Eski siteden taşınan ürün fotoğrafları; dosya adı ürün slug'ı.  */
export const PRODUCT_PHOTOS = new Set<string>([
  'a5-pvc-yaka-karti',
  'cift-kancali-yaka-ipi',
  'dosya-toplama-ve-dagitma-arabasi',
  'endustriyel-dayanikli-kart',
  'guclu-yapiskanli-endustriyel-etiket',
  'guga-th320n-uhf-anten',
  'guga-ty624-4-port-sabit-uhf-okuyucu',
  'guga-ty628-8-port-sabit-uhf-okuyucu',
  'guga-ty850-rfid-el-terminali',
  'guga050405-metal-uzeri-rfid-tag',
  'guga060302-ultra-kucuk-rfid-tag',
  'guga060304-anti-metal-rfid-tag',
  'guga1001-rfid-tekstil-etiketi',
  'guga100402-metal-alet-tag',
  'guga1010-rfid-lojistik-etiketi',
  'guga1257-rfid-kutuphane-etiketi',
  'guga20250001-wax-ribon',
  'guga20250002-wax-resin-ribon',
  'guga20250003-resin-ribon',
  'guga20250004-renkli-ribon',
  'guga361303-varlik-takip-tag',
  'guga4318-rfid-demirbas-ve-depo-etiketi',
  'guga5434-rfid-tekstil-ve-hazir-giyim-etiketi',
  'guga660403-ince-anti-metal-rfid-tag',
  'guga6826-rfid-kuyum-etiketi',
  'guga702003-atex-sertifikali-rfid-tag',
  'guga7320-rfid-demirbas-etiketi',
  'guga902003-uzun-menzilli-rfid-tag',
  'guga9654-rfid-arac-cam-etiketi',
  'hf-rfid-kart',
  'hibrit-ve-kombi-kart',
  'kart-kilifi-yoyo-aparat-ve-klips',
  'kitap-toplama-ve-dagitma-arabasi',
  'kitap-ve-dosya-destegi',
  'lf-rfid-kart',
  'ozel-amacli-kartlar',
  'ozel-tasarim-ve-kesim-kart',
  'pvc-kart-cipsiz',
  'pvc-yaka-karti-85x54mm',
  'rfid-entegreli-konveyor-sistemi',
  'rfid-kapi-gecis-ve-alarm-sistemi',
  'rfid-kasa-okuyucu',
  'rfid-perakende-uhf-etiketi',
  'rfid-self-check-kasa-sistemi',
  'tek-kancali-yaka-ipi',
  'uhf-rfid-kart',
  'yapiskanli-yuksek-sicaklik-etiketi',
  'yapiskansiz-yuksek-sicaklik-etiketi',
])

export const productPhoto = (slug?: string | null) =>
  slug && PRODUCT_PHOTOS.has(slug) ? `/img/urun/${slug}.jpg` : undefined

/**
 * Panelden açılan yeni bir çözümün slug'ı bu listede olmuyor. Görsel de
 * yüklenmediyse kart fotoğrafsız kalıyordu; bu yüzden nötr bir depo fotoğrafı
 * son çare olarak devrede.
 */
export const SOLUTION_FALLBACK_IMAGE = '/img/solution-rfid-depo-yonetimi.jpg'

export const solutionImage = (slug?: string | null) =>
  (slug ? SOLUTION_IMAGES[slug] : undefined) ?? SOLUTION_FALLBACK_IMAGE
/** Kapak görseli girilmemiş yazı kartsız kalmasın diye nötr bir yedek. */
export const POST_FALLBACK_IMAGE = '/img/hero-iot.jpg'

export const postImage = (slug?: string | null) =>
  (slug ? POST_IMAGES[slug] : undefined) ?? POST_FALLBACK_IMAGE
