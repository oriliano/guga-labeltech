import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

import * as kategoriKurumsalSertifikalar from './20260828_072201_kategori_kurumsal_sertifikalar'
import * as urunKategorileriKoleksiyonu from './20260828_100953_urun_kategorileri_koleksiyonu'
import * as cozumKategorileriKoleksiyonu from './20260828_104258_cozum_kategorileri_koleksiyonu'

/**
 * Üretimde çalıştırılacak şema göçleri.
 *
 * Payload şemayı yalnızca `NODE_ENV` production değilken kendi eşitliyor
 * (`@payloadcms/db-postgres/dist/connect.js:110`). Railway'de production
 * çalıştığı için, koda yeni bir koleksiyon veya alan eklendiğinde tablosunu
 * kimse oluşturmuyordu; panel olmayan sütunu sorgulayıp 500 veriyordu. Buradaki
 * dizi `prodMigrations` olarak bağlı, yani her dağıtımda bekleyen göçler
 * açılışta uygulanıyor ve bu tuzak bir daha çıkmıyor.
 *
 * Şema değiştiren bir iş yaptıktan sonra:
 *   node .tmp-db/goc-uret.mjs "kisa-ad"
 * komutu göç dosyasını üretir; dosyayı bu listeye ekleyip commit'lemek yeterli.
 *
 * Not: İlk göç dosyası yazılırken veritabanında zaten 94 tablo vardı (şema o
 * güne kadar dev modunda push edilmişti). Bu yüzden `payload migrate:create`
 * önce eski şemayı anlatan bir "baseline" göçü üretildi, SQL'i silinip yalnızca
 * aradaki fark burada bırakıldı. Aşağıdaki göç, canlıda var olan tablolara
 * dokunmaz; sadece kategori/çözüm/kurumsal içerik tablolarını ekler.
 */
export type Migration = {
  name: string
  up: (args: MigrateUpArgs) => Promise<void>
  down: (args: MigrateDownArgs) => Promise<void>
}

export const migrations: Migration[] = [
  {
    name: '20260828_072201_kategori_kurumsal_sertifikalar',
    up: kategoriKurumsalSertifikalar.up,
    down: kategoriKurumsalSertifikalar.down,
  },
  {
    name: '20260828_100953_urun_kategorileri_koleksiyonu',
    up: urunKategorileriKoleksiyonu.up,
    down: urunKategorileriKoleksiyonu.down,
  },
  {
    name: '20260828_104258_cozum_kategorileri_koleksiyonu',
    up: cozumKategorileriKoleksiyonu.up,
    down: cozumKategorileriKoleksiyonu.down,
  },
]
