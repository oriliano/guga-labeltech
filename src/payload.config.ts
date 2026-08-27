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
import { Products } from './collections/Products'
import { References } from './collections/References'
import { Solutions } from './collections/Solutions'
import { Users } from './collections/Users'
import { Navigation } from './globals/Navigation'
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
  collections: [Products, Solutions, References, Projects, Posts, Media, Documents, Leads, LeadFiles, Events, Users],
  globals: [SiteSettings, Navigation],
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
    // bekleyen gocler acilista uygulaniyor.
    push: true,
    prodMigrations: migrations,
  }),
  cors: [serverURL],
  csrf: [serverURL],
  sharp,
  plugins: [
    ...storagePlugins,
  ],
})
