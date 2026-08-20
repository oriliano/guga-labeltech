import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

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
 * Liste boş olması bir sorun değil: veritabanı şu an kodla birebir aynı, bu
 * dosya bundan sonrasını kayıt altına almak için duruyor.
 */
export type Migration = {
  name: string
  up: (args: MigrateUpArgs) => Promise<void>
  down: (args: MigrateDownArgs) => Promise<void>
}

export const migrations: Migration[] = []
