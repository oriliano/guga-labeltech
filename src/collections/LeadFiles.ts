import path from 'path'
import type { CollectionConfig } from 'payload'

import { authenticated } from '../access'

/** Tek dosya sınırı. Form da aynı sınırı kullanıcıya gönderim öncesi söylüyor. */
export const LEAD_FILE_MAX_BYTES = 8 * 1024 * 1024

/** Bir talebe iliştirilebilecek en fazla dosya sayısı. */
export const LEAD_FILE_MAX_COUNT = 3

export const LEAD_FILE_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/csv',
  'text/plain',
]

/**
 * Teklif formundan gelen ekler.
 *
 * Ayrı bir koleksiyon: `documents` herkese açık okunuyor, oysa müşterinin
 * gönderdiği şartname panelde kalmalı. Yazma yetkisi kimseye verilmiyor; kayıtlar
 * yalnızca teklif ucundan `overrideAccess` ile açılıyor, yani yükleme ucu formdan
 * bağımsız olarak dışarıya açılmış olmuyor.
 *
 * Dosyalar kalıcı Railway diskine yazılıyor; koleksiyonun kendi klasörü olmasa
 * her dağıtımda silinirlerdi.
 */
export const LeadFiles: CollectionConfig = {
  slug: 'lead-files',
  labels: { singular: 'Talep Eki', plural: 'Talep Ekleri' },
  admin: {
    group: 'Satış',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'mimeType', 'filesize', 'createdAt'],
    description: 'Teklif formuyla gönderilen dosyalar. Talebin kendi kaydından da açılabilir.',
  },
  access: {
    create: () => false,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  upload: {
    staticDir: process.env.MEDIA_DIR ? path.join(process.env.MEDIA_DIR, 'lead-files') : undefined,
    mimeTypes: LEAD_FILE_MIME_TYPES,
  },
  fields: [],
}
