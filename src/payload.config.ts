import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { en } from '@payloadcms/translations/languages/en'
import { tr } from '@payloadcms/translations/languages/tr'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Documents } from './collections/Documents'
import { Events } from './collections/Events'
import { LeadFiles } from './collections/LeadFiles'
import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'
import { ProductCategories } from './collections/ProductCategories'
import { Products } from './collections/Products'
import { References } from './collections/References'
import { SolutionCategories } from './collections/SolutionCategories'
import { Solutions } from './collections/Solutions'
import { Users } from './collections/Users'
import { Navigation } from './globals/Navigation'
import { CorporateContent } from './globals/CorporateContent'
import { migrations } from './migrations'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const r2PublicURL = process.env.R2_PUBLIC_URL?.replace(/\/+$/, '')

const r2FileUrl = ({ filename, prefix }: { filename: string; prefix?: string }) => {
  if (!r2PublicURL) return filename
  const path = [prefix, filename]
    .filter((part): part is string => Boolean(part))
    .flatMap((part) => part.split('/').map(encodeURIComponent))
    .join('/')
  return `${r2PublicURL}/${path}`
}

/**
 * R2 is S3-compatible. Without a bucket configured (fresh clone, local dev) uploads
 * fall back to Payload's local disk adapter so the project runs with no cloud setup.
 */
const storagePlugins = process.env.R2_BUCKET
  ? [
      s3Storage({
        collections: {
          media: { prefix: 'media', ...(r2PublicURL ? { generateFileURL: r2FileUrl } : {}) },
          documents: { prefix: 'documents', ...(r2PublicURL ? { generateFileURL: r2FileUrl } : {}) },
        },
        bucket: process.env.R2_BUCKET,
        config: {
          region: 'auto',
          endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
          credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
          },
        },
      }),
    ]
  : []

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' · GUGA LABELTECH',
    },
    components: {
      beforeDashboard: ['@/components/admin/Dashboard#Dashboard'],
    },
  },
  collections: [ProductCategories, Products, SolutionCategories, Solutions, References, Projects, Posts, Media, Documents, Leads, LeadFiles, Events, Users],
  globals: [SiteSettings, Navigation, CorporateContent],
  i18n: {
    supportedLanguages: { tr, en },
    fallbackLanguage: 'tr',
  },
  localization: {
    locales: [
      { label: 'Türkçe', code: 'tr' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'tr',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || '',
    },
    // Gelistirmede sema config'ten dogrudan esitleniyor. Uretimde Payload bunu
    // yapmiyor (NODE_ENV production ise pushDevSchema atlaniyor), o yuzden orada
    // bekleyen gocler asagidaki onInit icinde uygulaniyor.
    push: true,
  }),
  /**
   * Uretimde bekleyen gocler burada uygulaniyor; adapter'in `prodMigrations`
   * secenegi kullanilmiyor.
   *
   * Sebep: `payload_migrations` tablosunda `batch = -1` olan "dev" satiri
   * varken Payload gocleri calistirmadan once terminalden onay istiyor
   * (`@payloadcms/drizzle/dist/migrate.js:31`). Railway'de o soruyu kimse
   * cevaplayamadigi icin konteyner acilista takiliyor ve healthcheck dusuyor.
   * Satir yalnizca "sema bir zamanlar dev modunda push edildi" isareti; sema ya
   * da icerik verisi tasimiyor. Gocler devreye girdigi icin siliniyor, ardindan
   * goc calistiriliyor. Ikisi de tekrar calistirmaya karsi guvenli.
   */
  onInit: async (payload) => {
    if (process.env.NODE_ENV !== 'production') return
    const db = payload.db as unknown as {
      pool: { query: (text: string) => Promise<unknown> }
      migrate: (args: { migrations: typeof migrations }) => Promise<void>
    }
    // Tablo ilk kurulumda henuz yok olabilir, o yuzden varlik kontrolu ile.
    await db.pool.query(
      "DO $$ BEGIN IF to_regclass('public.payload_migrations') IS NOT NULL THEN DELETE FROM payload_migrations WHERE batch = -1; END IF; END $$;",
    )
    await db.migrate({ migrations })
  },
  cors: [serverURL],
  csrf: [serverURL],
  sharp,
  plugins: [
    ...storagePlugins,
  ],
})
