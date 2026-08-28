import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Ürün kategorileri koda gömülü bir seçim listesiydi; yeni kategori açmak
 * dağıtım gerektiriyordu. Kategori artık kendi koleksiyonu.
 *
 * Sıralama önemli: önce tablo açılıp mevcut dokuz kategori yazılıyor, panelde
 * girilmiş kategori metinleri eski `catalog_content` global'inden taşınıyor,
 * sonra ürünlerdeki eski enum değeri kategori kaydının kimliğine çevriliyor.
 * Ancak bunlar bittikten sonra eski sütun ve tablolar düşürülüyor, yoksa
 * eşleşmenin dayandığı veri ortadan kalkıyor.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1) Kategori koleksiyonunun tabloları.
  await db.execute(sql`
   CREATE TABLE "product_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "product_categories_locales" (
  	"title" varchar NOT NULL,
  	"lead" varchar,
  	"slug" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "product_categories_id" integer;
  ALTER TABLE "product_categories_locales" ADD CONSTRAINT "product_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "product_categories_key_idx" ON "product_categories" USING btree ("key");
  CREATE INDEX "product_categories_updated_at_idx" ON "product_categories" USING btree ("updated_at");
  CREATE INDEX "product_categories_created_at_idx" ON "product_categories" USING btree ("created_at");
  CREATE INDEX "product_categories_slug_idx" ON "product_categories_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "product_categories_locales_locale_parent_id_unique" ON "product_categories_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_product_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("product_categories_id");`)

  // 2) Koddaki dokuz kategori, sırası ve iki dildeki metinleriyle taşınıyor.
  await db.execute(sql`
  WITH seed("key", sort, tr_title, tr_slug, tr_lead, en_title, en_slug, en_lead) AS (
    VALUES
      ('label', 10, 'RFID Etiket', 'rfid-etiket', 'Depo, tekstil, kuyum ve demirbaş takibi için pasif UHF etiketler.', 'RFID Labels', 'rfid-labels', 'Passive UHF labels for warehouse, textile, jewellery and asset tracking.'),
      ('industrial-tag', 20, 'RFID Endüstriyel Tag', 'rfid-endustriyel-tag', 'Metal yüzey, dış ortam ve ağır koşullar için sert gövdeli taglar.', 'Industrial RFID Tags', 'industrial-tags', 'Hard-body tags for metal surfaces, outdoor use and demanding conditions.'),
      ('hardware', 30, 'RFID Donanım', 'rfid-donanim', 'El terminalleri, sabit okuyucular ve antenler.', 'RFID Hardware', 'rfid-hardware', 'Handheld terminals, fixed readers and antennas.'),
      ('industrial-label', 40, 'Endüstriyel Etiketler', 'endustriyel-etiketler', 'Yüksek sıcaklık, kimyasal ve dış ortam koşullarına dayanan etiketler.', 'Industrial Labels', 'industrial-labels', 'Labels that survive heat, chemicals and outdoor exposure.'),
      ('card', 50, 'Kart Ürünlerimiz', 'kart-urunleri', 'Personel, üyelik ve geçiş kartları; HF, UHF ve temassız çip seçenekleri.', 'Cards', 'cards', 'Staff, membership and access cards with HF, UHF and contactless chip options.'),
      ('ribbon', 60, 'Ribon', 'ribon', 'Termal transfer yazıcılar için wax, wax-resin ve resin ribonlar.', 'Ribbons', 'ribbons', 'Wax, wax-resin and resin ribbons for thermal transfer printers.'),
      ('lanyard', 70, 'Yaka İpleri', 'yaka-ipleri', 'Kurumsal baskılı yaka ipleri ve kart aksesuarları.', 'Lanyards', 'lanyards', 'Branded lanyards and card accessories.'),
      ('library', 80, 'Kütüphane Ürünlerimiz', 'kutuphane-urunleri', 'Kütüphane ve arşivlerde kitap etiketleme, güvenlik ve raf okuma ürünleri.', 'Library Products', 'library-products', 'Book tagging, security and shelf-reading products for libraries and archives.'),
      ('retail', 90, 'Perakende Ürünlerimiz', 'perakende-urunleri', 'Mağaza sayımı, kasa okuma ve kapı geçiş sistemleri.', 'Retail Products', 'retail-products', 'Store counting, point-of-sale reading and gate systems.')
  ), inserted AS (
    INSERT INTO "product_categories" ("key", "order", updated_at, created_at)
    SELECT s."key", s.sort, now(), now() FROM seed s
    RETURNING id, "key"
  )
  INSERT INTO "product_categories_locales" (title, lead, slug, _locale, _parent_id)
  SELECT s.tr_title, s.tr_lead, s.tr_slug, 'tr'::"_locales", i.id
  FROM seed s JOIN inserted i ON i."key" = s."key"
  UNION ALL
  SELECT s.en_title, s.en_lead, s.en_slug, 'en'::"_locales", i.id
  FROM seed s JOIN inserted i ON i."key" = s."key";`)

  // 3a) Panelde eski "Kategori Sayfa Metinleri" global'ine yazılmış metinler
  // varsa taşınıyor. Alanlar kategori başına ayrı sütundu, dinamik SQL ile
  // dolaşılıyor; sütun yoksa atlanıyor.
  await db.execute(sql`
  DO $$
  DECLARE
    k text;
    label_col text;
    lead_col text;
  BEGIN
    IF to_regclass('public.catalog_content_locales') IS NULL THEN RETURN; END IF;
    FOREACH k IN ARRAY ARRAY['label','industrial-tag','hardware','industrial-label','card','ribbon','lanyard','library','retail'] LOOP
      label_col := 'category_' || replace(k, '-', '_') || '_label';
      lead_col := 'category_' || replace(k, '-', '_') || '_lead';
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'catalog_content_locales' AND column_name = label_col
      ) THEN
        EXECUTE format(
          'UPDATE product_categories_locales pcl
             SET title = COALESCE(NULLIF(TRIM(ccl.%I), %L), pcl.title),
                 lead = COALESCE(NULLIF(TRIM(ccl.%I), %L), pcl.lead)
           FROM catalog_content_locales ccl
           JOIN product_categories pc ON pc.key = %L
           WHERE pcl._parent_id = pc.id AND pcl._locale = ccl._locale',
          label_col, '', lead_col, '', k
        );
      END IF;
    END LOOP;
  END $$;`)

  // 3b) Aynı global'in yeni dizi alanına girilmiş metinler daha günceldir,
  // en son onlar uygulanıyor.
  await db.execute(sql`
  DO $$
  BEGIN
    IF to_regclass('public.catalog_content_categories') IS NULL THEN RETURN; END IF;
    UPDATE product_categories_locales pcl
       SET title = COALESCE(NULLIF(TRIM(ccl.label), ''), pcl.title),
           lead = COALESCE(NULLIF(TRIM(ccl.lead), ''), pcl.lead)
      FROM catalog_content_categories cc
      JOIN catalog_content_categories_locales ccl ON ccl._parent_id = cc.id
      JOIN product_categories pc ON pc.key = cc.category::text
     WHERE pcl._parent_id = pc.id AND pcl._locale = ccl._locale;
  END $$;`)

  // 4) Ürün kaydındaki ilişki sütunu.
  await db.execute(sql`
   ALTER TABLE "products" ADD COLUMN "category_id" integer;
  ALTER TABLE "_products_v" ADD COLUMN "version_category_id" integer;
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_category_id_product_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE INDEX "_products_v_version_version_category_idx" ON "_products_v" USING btree ("version_category_id");`)

  // 5) Eski enum değeri kategori kaydına bağlanıyor.
  await db.execute(sql`
   UPDATE "products" p SET category_id = pc.id FROM "product_categories" pc WHERE pc."key" = p.category::text;
  UPDATE "_products_v" v SET version_category_id = pc.id FROM "product_categories" pc WHERE pc."key" = v.version_category::text;`)

  // 6) Eski sütun ve tipler.
  await db.execute(sql`
   ALTER TABLE "products" DROP COLUMN "category";
  ALTER TABLE "_products_v" DROP COLUMN "version_category";
  DROP TYPE "public"."enum_products_category";
  DROP TYPE "public"."enum__products_v_version_category";`)

  // 7) Kategori metinleri artık koleksiyonda; eski global düşürülüyor.
  await db.execute(sql`
   DROP TABLE "catalog_content_categories" CASCADE;
  DROP TABLE "catalog_content_categories_locales" CASCADE;
  DROP TABLE "catalog_content" CASCADE;
  DROP TABLE "catalog_content_locales" CASCADE;
  DROP TYPE "public"."enum_catalog_content_categories_category";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_catalog_content_categories_category" AS ENUM('label', 'industrial-tag', 'hardware', 'industrial-label', 'card', 'ribbon', 'lanyard', 'library', 'retail');
  CREATE TABLE "catalog_content_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category" "enum_catalog_content_categories_category" NOT NULL
  );

  CREATE TABLE "catalog_content_categories_locales" (
  	"label" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  CREATE TABLE "catalog_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "catalog_content_locales" (
  	"category_label_label" varchar,
  	"category_label_lead" varchar,
  	"category_industrial_tag_label" varchar,
  	"category_industrial_tag_lead" varchar,
  	"category_hardware_label" varchar,
  	"category_hardware_lead" varchar,
  	"category_industrial_label_label" varchar,
  	"category_industrial_label_lead" varchar,
  	"category_card_label" varchar,
  	"category_card_lead" varchar,
  	"category_ribbon_label" varchar,
  	"category_ribbon_lead" varchar,
  	"category_lanyard_label" varchar,
  	"category_lanyard_lead" varchar,
  	"category_library_label" varchar,
  	"category_library_lead" varchar,
  	"category_retail_label" varchar,
  	"category_retail_lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  ALTER TABLE "catalog_content_categories" ADD CONSTRAINT "catalog_content_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."catalog_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "catalog_content_categories_locales" ADD CONSTRAINT "catalog_content_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."catalog_content_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "catalog_content_locales" ADD CONSTRAINT "catalog_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."catalog_content"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "catalog_content_categories_order_idx" ON "catalog_content_categories" USING btree ("_order");
  CREATE INDEX "catalog_content_categories_parent_id_idx" ON "catalog_content_categories" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "catalog_content_categories_locales_locale_parent_id_unique" ON "catalog_content_categories_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "catalog_content_locales_locale_parent_id_unique" ON "catalog_content_locales" USING btree ("_locale","_parent_id");

  CREATE TYPE "public"."enum_products_category" AS ENUM('hardware', 'label', 'industrial-tag', 'industrial-label', 'card', 'ribbon', 'lanyard', 'library', 'retail');
  CREATE TYPE "public"."enum__products_v_version_category" AS ENUM('hardware', 'label', 'industrial-tag', 'industrial-label', 'card', 'ribbon', 'lanyard', 'library', 'retail');
  ALTER TABLE "products" ADD COLUMN "category" "enum_products_category";
  ALTER TABLE "_products_v" ADD COLUMN "version_category" "enum__products_v_version_category";`)

  // Kategori bilgisi geri yazılıyor; ilişki sütunu ancak ondan sonra düşüyor.
  await db.execute(sql`
   UPDATE "products" p SET category = pc."key"::"enum_products_category" FROM "product_categories" pc WHERE pc.id = p.category_id;
  UPDATE "_products_v" v SET version_category = pc."key"::"enum__products_v_version_category" FROM "product_categories" pc WHERE pc.id = v.version_category_id;`)

  await db.execute(sql`
   ALTER TABLE "products" DROP CONSTRAINT "products_category_id_product_categories_id_fk";
  ALTER TABLE "_products_v" DROP CONSTRAINT "_products_v_version_category_id_product_categories_id_fk";
  DROP INDEX "products_category_idx";
  DROP INDEX "_products_v_version_version_category_idx";
  ALTER TABLE "products" DROP COLUMN "category_id";
  ALTER TABLE "_products_v" DROP COLUMN "version_category_id";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_product_categories_fk";
  DROP INDEX "payload_locked_documents_rels_product_categories_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "product_categories_id";
  DROP TABLE "product_categories_locales" CASCADE;
  DROP TABLE "product_categories" CASCADE;`)
}
