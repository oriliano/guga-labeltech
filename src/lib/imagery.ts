/**
 * Static imagery carried over from the legacy site, kept in the repo rather than
 * the media library: the media library writes to the container disk until the R2
 * variables are set, so anything uploaded there disappears on the next deploy.
 *
 * These are fallbacks. A picture set on the record in the panel always wins, so
 * this file can be emptied once real product photography is uploaded.
 */

export const HOME_HERO = '/img/hero-iot.jpg'
export const ABOUT_IMAGE = '/img/about.jpg'

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

/** Product photography is still missing, so products fall back per category. */
export const CATEGORY_IMAGES: Record<string, string> = {}

export const solutionImage = (slug?: string | null) => (slug ? SOLUTION_IMAGES[slug] : undefined)
export const postImage = (slug?: string | null) => (slug ? POST_IMAGES[slug] : undefined)
export const productImage = (category?: string | null) => (category ? CATEGORY_IMAGES[category] : undefined)
