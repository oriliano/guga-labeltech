import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Documents } from './collections/Documents'
import { Events } from './collections/Events'
import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Products } from './collections/Products'
import { References } from './collections/References'
import { Solutions } from './collections/Solutions'
import { Users } from './collections/Users'
import { Navigation } from './globals/Navigation'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/**
 * R2 is S3-compatible. Without a bucket configured (fresh clone, local dev) uploads
 * fall back to Payload's local disk adapter so the project runs with no cloud setup.
 */
const storagePlugins = process.env.R2_BUCKET
  ? [
      s3Storage({
        collections: {
          media: { prefix: 'media' },
          documents: { prefix: 'documents' },
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
  collections: [Products, Solutions, References, Posts, Media, Documents, Leads, Events, Users],
  globals: [SiteSettings, Navigation],
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
    // Schema is synced from the config on boot instead of through migration files.
    // Fine while this is a single-owner CMS; switch to `payload migrate` before any
    // second environment starts sharing the database.
    push: true,
  }),
  cors: [serverURL],
  csrf: [serverURL],
  sharp,
  plugins: [
    ...storagePlugins,
  ],
})
