import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
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
  
  CREATE TABLE "solution_category_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "corporate_content_intro_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "corporate_content_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"metric" varchar NOT NULL
  );
  
  CREATE TABLE "corporate_content_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "corporate_content_mission_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "corporate_content_reasons_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "corporate_content_policy_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "corporate_content_certificates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"existing_image" varchar,
  	"standard" varchar NOT NULL,
  	"number" varchar,
  	"valid_until" timestamp(3) with time zone,
  	"enabled" boolean DEFAULT true
  );
  
  CREATE TABLE "corporate_content_certificates_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "corporate_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"distributorship_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "corporate_content_locales" (
  	"hero_eyebrow" varchar,
  	"hero_title" varchar,
  	"hero_lead" varchar,
  	"vision_eyebrow" varchar,
  	"vision_title" varchar,
  	"vision_body" varchar,
  	"mission_eyebrow" varchar,
  	"mission_title" varchar,
  	"reasons_eyebrow" varchar,
  	"reasons_title" varchar,
  	"policy_eyebrow" varchar,
  	"policy_title" varchar,
  	"policy_body" varchar,
  	"certificate_eyebrow" varchar,
  	"certificate_title" varchar,
  	"certificate_lead" varchar,
  	"trademark_eyebrow" varchar,
  	"trademark_title" varchar,
  	"trademark_body" varchar,
  	"distributorship_eyebrow" varchar,
  	"distributorship_title" varchar,
  	"distributorship_body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "catalog_content_categories" ADD CONSTRAINT "catalog_content_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."catalog_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "catalog_content_categories_locales" ADD CONSTRAINT "catalog_content_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."catalog_content_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solution_category_content_categories" ADD CONSTRAINT "solution_category_content_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solution_category_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solution_category_content_categories_locales" ADD CONSTRAINT "solution_category_content_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solution_category_content_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "corporate_content_intro_paragraphs" ADD CONSTRAINT "corporate_content_intro_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."corporate_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "corporate_content_stats" ADD CONSTRAINT "corporate_content_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."corporate_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "corporate_content_stats_locales" ADD CONSTRAINT "corporate_content_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."corporate_content_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "corporate_content_mission_items" ADD CONSTRAINT "corporate_content_mission_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."corporate_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "corporate_content_reasons_items" ADD CONSTRAINT "corporate_content_reasons_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."corporate_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "corporate_content_policy_items" ADD CONSTRAINT "corporate_content_policy_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."corporate_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "corporate_content_certificates" ADD CONSTRAINT "corporate_content_certificates_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "corporate_content_certificates" ADD CONSTRAINT "corporate_content_certificates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."corporate_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "corporate_content_certificates_locales" ADD CONSTRAINT "corporate_content_certificates_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."corporate_content_certificates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "corporate_content" ADD CONSTRAINT "corporate_content_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "corporate_content" ADD CONSTRAINT "corporate_content_distributorship_image_id_media_id_fk" FOREIGN KEY ("distributorship_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "corporate_content_locales" ADD CONSTRAINT "corporate_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."corporate_content"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "catalog_content_categories_order_idx" ON "catalog_content_categories" USING btree ("_order");
  CREATE INDEX "catalog_content_categories_parent_id_idx" ON "catalog_content_categories" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "catalog_content_categories_locales_locale_parent_id_unique" ON "catalog_content_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solution_category_content_categories_order_idx" ON "solution_category_content_categories" USING btree ("_order");
  CREATE INDEX "solution_category_content_categories_parent_id_idx" ON "solution_category_content_categories" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solution_category_content_categories_locales_locale_parent_i" ON "solution_category_content_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "corporate_content_intro_paragraphs_order_idx" ON "corporate_content_intro_paragraphs" USING btree ("_order");
  CREATE INDEX "corporate_content_intro_paragraphs_parent_id_idx" ON "corporate_content_intro_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "corporate_content_intro_paragraphs_locale_idx" ON "corporate_content_intro_paragraphs" USING btree ("_locale");
  CREATE INDEX "corporate_content_stats_order_idx" ON "corporate_content_stats" USING btree ("_order");
  CREATE INDEX "corporate_content_stats_parent_id_idx" ON "corporate_content_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "corporate_content_stats_locales_locale_parent_id_unique" ON "corporate_content_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "corporate_content_mission_items_order_idx" ON "corporate_content_mission_items" USING btree ("_order");
  CREATE INDEX "corporate_content_mission_items_parent_id_idx" ON "corporate_content_mission_items" USING btree ("_parent_id");
  CREATE INDEX "corporate_content_mission_items_locale_idx" ON "corporate_content_mission_items" USING btree ("_locale");
  CREATE INDEX "corporate_content_reasons_items_order_idx" ON "corporate_content_reasons_items" USING btree ("_order");
  CREATE INDEX "corporate_content_reasons_items_parent_id_idx" ON "corporate_content_reasons_items" USING btree ("_parent_id");
  CREATE INDEX "corporate_content_reasons_items_locale_idx" ON "corporate_content_reasons_items" USING btree ("_locale");
  CREATE INDEX "corporate_content_policy_items_order_idx" ON "corporate_content_policy_items" USING btree ("_order");
  CREATE INDEX "corporate_content_policy_items_parent_id_idx" ON "corporate_content_policy_items" USING btree ("_parent_id");
  CREATE INDEX "corporate_content_policy_items_locale_idx" ON "corporate_content_policy_items" USING btree ("_locale");
  CREATE INDEX "corporate_content_certificates_order_idx" ON "corporate_content_certificates" USING btree ("_order");
  CREATE INDEX "corporate_content_certificates_parent_id_idx" ON "corporate_content_certificates" USING btree ("_parent_id");
  CREATE INDEX "corporate_content_certificates_image_idx" ON "corporate_content_certificates" USING btree ("image_id");
  CREATE UNIQUE INDEX "corporate_content_certificates_locales_locale_parent_id_uniq" ON "corporate_content_certificates_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "corporate_content_hero_image_idx" ON "corporate_content" USING btree ("hero_image_id");
  CREATE INDEX "corporate_content_distributorship_distributorship_image_idx" ON "corporate_content" USING btree ("distributorship_image_id");
  CREATE UNIQUE INDEX "corporate_content_locales_locale_parent_id_unique" ON "corporate_content_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "catalog_content_categories" CASCADE;
  DROP TABLE "catalog_content_categories_locales" CASCADE;
  DROP TABLE "solution_category_content_categories" CASCADE;
  DROP TABLE "solution_category_content_categories_locales" CASCADE;
  DROP TABLE "solution_category_content" CASCADE;
  DROP TABLE "corporate_content_intro_paragraphs" CASCADE;
  DROP TABLE "corporate_content_stats" CASCADE;
  DROP TABLE "corporate_content_stats_locales" CASCADE;
  DROP TABLE "corporate_content_mission_items" CASCADE;
  DROP TABLE "corporate_content_reasons_items" CASCADE;
  DROP TABLE "corporate_content_policy_items" CASCADE;
  DROP TABLE "corporate_content_certificates" CASCADE;
  DROP TABLE "corporate_content_certificates_locales" CASCADE;
  DROP TABLE "corporate_content" CASCADE;
  DROP TABLE "corporate_content_locales" CASCADE;
  DROP TYPE "public"."enum_catalog_content_categories_category";`)
}
