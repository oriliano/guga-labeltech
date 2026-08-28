import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Çözüm kategorileri de ürün kategorileri gibi kendi koleksiyonuna taşınıyor.
 * Önceden hangi çözümün hangi grupta çıkacağı, çözüm kaydındaki serbest metin
 * "sektör etiketi"nin ilk kelimesine bakılarak bulunuyordu; kategori listesi ve
 * metinleri de ayrı bir global'de duruyordu.
 *
 * Sıralama önemli: önce tablo ve on üç kategori yazılıyor, ilişki sütunu
 * açılıyor, çözümler eski sektör metnine bakılarak kategorilere bağlanıyor,
 * ancak ondan sonra panelde düzenlenmiş kategori başlıkları uygulanıyor —
 * eşleşme özgün adlara dayandığı için sıra tersine çevrilirse bozulur.
 *
 * `sector` alanı duruyor: artık yalnızca kart rozeti, gruplama ona bakmıyor.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1) Kategori koleksiyonunun tabloları.
  await db.execute(sql`
   CREATE TABLE "solution_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "solution_categories_locales" (
  	"title" varchar NOT NULL,
  	"lead" varchar,
  	"slug" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "solution_categories_id" integer;
  ALTER TABLE "solution_categories_locales" ADD CONSTRAINT "solution_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solution_categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "solution_categories_key_idx" ON "solution_categories" USING btree ("key");
  CREATE INDEX "solution_categories_updated_at_idx" ON "solution_categories" USING btree ("updated_at");
  CREATE INDEX "solution_categories_created_at_idx" ON "solution_categories" USING btree ("created_at");
  CREATE INDEX "solution_categories_slug_idx" ON "solution_categories_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "solution_categories_locales_locale_parent_id_unique" ON "solution_categories_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_solution_categories_fk" FOREIGN KEY ("solution_categories_id") REFERENCES "public"."solution_categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_solution_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("solution_categories_id");`)

  // 2) Koddaki on üç kategori, adresleri eski bağlantılarla aynı kalacak
  // şekilde (slug, etiketin sadeleştirilmiş hâli) yazılıyor.
  await db.execute(sql`
  WITH seed("key", sort, tr_title, tr_slug, en_title, en_slug) AS (
    VALUES
      ('depo', 10, 'Depo', 'depo', 'Warehousing', 'warehousing'),
      ('lojistik', 20, 'Lojistik', 'lojistik', 'Logistics', 'logistics'),
      ('perakende', 30, 'Perakende', 'perakende', 'Retail', 'retail'),
      ('tekstil', 40, 'Tekstil', 'tekstil', 'Textiles', 'textiles'),
      ('saglik', 50, 'Sağlık', 'saglik', 'Healthcare', 'healthcare'),
      ('kuyum', 60, 'Kuyum', 'kuyum', 'Jewellery', 'jewellery'),
      ('demirbas', 70, 'Demirbaş', 'demirbas', 'Fixed assets', 'fixed-assets'),
      ('personel', 80, 'Personel', 'personel', 'Workforce', 'workforce'),
      ('otopark', 90, 'Otopark', 'otopark', 'Parking', 'parking'),
      ('soguk-zincir', 100, 'Soğuk zincir', 'soguk-zincir', 'Cold chain', 'cold-chain'),
      ('uretim', 110, 'Üretim', 'uretim', 'Manufacturing', 'manufacturing'),
      ('havacilik', 120, 'Havacılık', 'havacilik', 'Aviation', 'aviation'),
      ('bt', 130, 'BT', 'bt', 'IT', 'it')
  ), inserted AS (
    INSERT INTO "solution_categories" ("key", "order", updated_at, created_at)
    SELECT s."key", s.sort, now(), now() FROM seed s
    RETURNING id, "key"
  )
  INSERT INTO "solution_categories_locales" (title, lead, slug, _locale, _parent_id)
  SELECT s.tr_title, 'RFID tabanlı sistemlerle süreçleri otomatikleştiren, izlenebilirliği ve operasyonel verimliliği artıran çözümler.', s.tr_slug, 'tr'::"_locales", i.id
  FROM seed s JOIN inserted i ON i."key" = s."key"
  UNION ALL
  SELECT s.en_title, 'RFID-based solutions that automate processes and improve traceability and operational efficiency.', s.en_slug, 'en'::"_locales", i.id
  FROM seed s JOIN inserted i ON i."key" = s."key";`)

  // 3) Çözüm kaydındaki ilişki sütunu.
  await db.execute(sql`
   ALTER TABLE "solutions" ADD COLUMN "category_id" integer;
  ALTER TABLE "_solutions_v" ADD COLUMN "version_category_id" integer;
  ALTER TABLE "solutions" ADD CONSTRAINT "solutions_category_id_solution_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."solution_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v" ADD CONSTRAINT "_solutions_v_version_category_id_solution_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."solution_categories"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "solutions_category_idx" ON "solutions" USING btree ("category_id");
  CREATE INDEX "_solutions_v_version_version_category_idx" ON "_solutions_v" USING btree ("version_category_id");`)

  // 4) Eski sektör metninden kategoriye bağlanıyor. Metin "Havacılık • MRO •
  // Havalimanları" gibi olabildiği için yalnızca ilk parça karşılaştırılıyor;
  // önce Türkçe, kalanlar için İngilizce ad deneniyor.
  await db.execute(sql`
   UPDATE "solutions" s SET category_id = scl._parent_id
    FROM "solutions_locales" sl
    JOIN "solution_categories_locales" scl
      ON scl._locale = 'tr'
     AND lower(btrim(scl.title)) = lower(btrim(split_part(regexp_replace(sl.sector, '[|,/]', '•', 'g'), '•', 1)))
   WHERE sl._parent_id = s.id AND sl._locale = 'tr' AND sl.sector IS NOT NULL AND s.category_id IS NULL;

  UPDATE "solutions" s SET category_id = scl._parent_id
    FROM "solutions_locales" sl
    JOIN "solution_categories_locales" scl
      ON scl._locale = 'en'
     AND lower(btrim(scl.title)) = lower(btrim(split_part(regexp_replace(sl.sector, '[|,/]', '•', 'g'), '•', 1)))
   WHERE sl._parent_id = s.id AND sl._locale = 'en' AND sl.sector IS NOT NULL AND s.category_id IS NULL;

  UPDATE "_solutions_v" v SET version_category_id = s.category_id
    FROM "solutions" s
   WHERE v.parent_id = s.id AND v.version_category_id IS NULL;`)

  // 5) Panelde "Çözümlerin Kategori Sayfa Metinleri" bölümüne girilmiş başlık
  // ve açıklamalar uygulanıyor; orada açılmış ek kategoriler de taşınıyor.
  await db.execute(sql`
  DO $$
  BEGIN
    IF to_regclass('public.solution_category_content_categories') IS NULL THEN RETURN; END IF;

    INSERT INTO "solution_categories" ("key", "order", updated_at, created_at)
    SELECT cc.key, 200 + min(cc._order), now(), now()
      FROM solution_category_content_categories cc
     WHERE cc.key IS NOT NULL
       AND btrim(cc.key) <> ''
       AND NOT EXISTS (SELECT 1 FROM solution_categories sc WHERE sc.key = cc.key)
       AND EXISTS (
         SELECT 1 FROM solution_category_content_categories_locales l
          WHERE l._parent_id = cc.id AND btrim(COALESCE(l.label, '')) <> ''
       )
     GROUP BY cc.key;

    INSERT INTO "solution_categories_locales" (title, lead, slug, _locale, _parent_id)
    SELECT COALESCE(NULLIF(btrim(l.label), ''), cc.key), NULLIF(btrim(COALESCE(l.lead, '')), ''), cc.key, l._locale, sc.id
      FROM solution_category_content_categories cc
      JOIN solution_category_content_categories_locales l ON l._parent_id = cc.id
      JOIN solution_categories sc ON sc.key = cc.key
     WHERE NOT EXISTS (
       SELECT 1 FROM solution_categories_locales existing
        WHERE existing._parent_id = sc.id AND existing._locale = l._locale
     );

    UPDATE solution_categories_locales scl
       SET title = COALESCE(NULLIF(btrim(l.label), ''), scl.title),
           lead = COALESCE(NULLIF(btrim(COALESCE(l.lead, '')), ''), scl.lead)
      FROM solution_category_content_categories cc
      JOIN solution_category_content_categories_locales l ON l._parent_id = cc.id
      JOIN solution_categories sc ON sc.key = cc.key
     WHERE scl._parent_id = sc.id AND scl._locale = l._locale;
  END $$;`)

  // 6) Kategori listesi artık koleksiyonda; eski global düşürülüyor.
  await db.execute(sql`
   DROP TABLE "solution_category_content_categories" CASCADE;
  DROP TABLE "solution_category_content_categories_locales" CASCADE;
  DROP TABLE "solution_category_content" CASCADE;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "solution_category_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "solution_category_content_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL
  );

  CREATE TABLE "solution_category_content_categories_locales" (
  	"label" varchar,
  	"lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  ALTER TABLE "solution_category_content_categories" ADD CONSTRAINT "solution_category_content_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solution_category_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solution_category_content_categories_locales" ADD CONSTRAINT "solution_category_content_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solution_category_content_categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "solution_category_content_categories_order_idx" ON "solution_category_content_categories" USING btree ("_order");
  CREATE INDEX "solution_category_content_categories_parent_id_idx" ON "solution_category_content_categories" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solution_category_content_categories_locales_locale_parent_i" ON "solution_category_content_categories_locales" USING btree ("_locale","_parent_id");

  ALTER TABLE "solutions" DROP CONSTRAINT "solutions_category_id_solution_categories_id_fk";
  ALTER TABLE "_solutions_v" DROP CONSTRAINT "_solutions_v_version_category_id_solution_categories_id_fk";
  DROP INDEX "solutions_category_idx";
  DROP INDEX "_solutions_v_version_version_category_idx";
  ALTER TABLE "solutions" DROP COLUMN "category_id";
  ALTER TABLE "_solutions_v" DROP COLUMN "version_category_id";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_solution_categories_fk";
  DROP INDEX "payload_locked_documents_rels_solution_categories_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "solution_categories_id";
  DROP TABLE "solution_categories_locales" CASCADE;
  DROP TABLE "solution_categories" CASCADE;`)
}
