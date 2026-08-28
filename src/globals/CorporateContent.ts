import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'

const existingCertificates = [
  {
    standard: 'ISO 45001:2018',
    number: 'A1593255',
    validUntil: '2026-10-07T00:00:00.000Z',
    existingImage: '/img/sertifika-iso-45001.jpg',
    enabled: true,
  },
  {
    standard: 'ISO 14001:2015',
    number: 'A1593254',
    validUntil: '2026-10-07T00:00:00.000Z',
    existingImage: '/img/sertifika-iso-14001.jpg',
    enabled: true,
  },
  {
    standard: 'ISO 26000:2021',
    number: 'A1593250',
    validUntil: '2026-10-07T00:00:00.000Z',
    existingImage: '/img/sertifika-iso-26000.jpg',
    enabled: true,
  },
]

export const CorporateContent: GlobalConfig = {
  slug: 'corporate-content',
  label: 'Kurumsal Sayfa Düzenleme',
  admin: {
    group: 'İçerik',
    description:
      'Kurumsal sayfadaki metinleri, kutuları ve sertifikaları buradan düzenleyebilirsiniz. Boş alanlarda mevcut site metni korunur.',
  },
  access: { read: anyone, update: authenticated },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hakkımızda',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Üst kapak görseli',
              admin: { description: 'En iyi sonuç için 21:9 oranında yatay görsel kullanın.' },
            },
            { name: 'heroEyebrow', type: 'text', localized: true, label: 'Üst küçük başlık' },
            { name: 'heroTitle', type: 'text', localized: true, label: 'Sayfa başlığı' },
            { name: 'heroLead', type: 'textarea', localized: true, label: 'Başlık altı açıklama' },
            {
              name: 'introParagraphs',
              type: 'array',
              localized: true,
              label: 'Hakkımızda paragrafları',
              labels: { singular: 'Paragraf', plural: 'Paragraflar' },
              fields: [{ name: 'text', type: 'textarea', required: true, label: 'Metin' }],
            },
            {
              name: 'stats',
              type: 'array',
              label: 'Teknoloji kutuları',
              labels: { singular: 'Kutu', plural: 'Kutular' },
              fields: [
                { name: 'metric', type: 'text', required: true, label: 'Kısa başlık (RFID gibi)' },
                { name: 'label', type: 'text', required: true, localized: true, label: 'Açıklama' },
              ],
            },
          ],
        },
        {
          label: 'Vizyon & Misyon',
          fields: [
            {
              name: 'vision',
              type: 'group',
              label: 'Vizyon',
              fields: [
                { name: 'eyebrow', type: 'text', localized: true, label: 'Küçük başlık' },
                { name: 'title', type: 'text', localized: true, label: 'Başlık' },
                { name: 'body', type: 'textarea', localized: true, label: 'Metin' },
              ],
            },
            {
              name: 'mission',
              type: 'group',
              label: 'Misyon',
              fields: [
                { name: 'eyebrow', type: 'text', localized: true, label: 'Küçük başlık' },
                { name: 'title', type: 'text', localized: true, label: 'Başlık' },
                {
                  name: 'items',
                  type: 'array',
                  localized: true,
                  label: 'Misyon maddeleri',
                  fields: [{ name: 'text', type: 'textarea', required: true, label: 'Madde' }],
                },
              ],
            },
          ],
        },
        {
          label: 'Fark & Politika',
          fields: [
            {
              name: 'reasons',
              type: 'group',
              label: 'Neden GUGA?',
              fields: [
                { name: 'eyebrow', type: 'text', localized: true, label: 'Küçük başlık' },
                { name: 'title', type: 'text', localized: true, label: 'Bölüm başlığı' },
                {
                  name: 'items',
                  type: 'array',
                  localized: true,
                  label: 'Fark kutuları',
                  fields: [
                    { name: 'title', type: 'text', required: true, label: 'Başlık' },
                    { name: 'body', type: 'textarea', required: true, label: 'Açıklama' },
                  ],
                },
              ],
            },
            {
              name: 'policy',
              type: 'group',
              label: 'Kalite politikası',
              fields: [
                { name: 'eyebrow', type: 'text', localized: true, label: 'Küçük başlık' },
                { name: 'title', type: 'text', localized: true, label: 'Bölüm başlığı' },
                { name: 'body', type: 'textarea', localized: true, label: 'Giriş metni' },
                {
                  name: 'items',
                  type: 'array',
                  localized: true,
                  label: 'Politika maddeleri',
                  fields: [{ name: 'text', type: 'textarea', required: true, label: 'Madde' }],
                },
              ],
            },
          ],
        },
        {
          label: 'Sertifikalar',
          fields: [
            { name: 'certificateEyebrow', type: 'text', localized: true, label: 'Küçük başlık' },
            { name: 'certificateTitle', type: 'text', localized: true, label: 'Bölüm başlığı' },
            { name: 'certificateLead', type: 'textarea', localized: true, label: 'Bölüm açıklaması' },
            {
              name: 'certificates',
              type: 'array',
              label: 'Sertifikalar',
              labels: { singular: 'Sertifika', plural: 'Sertifikalar' },
              maxRows: 50,
              defaultValue: existingCertificates,
              admin: {
                description:
                  'Yeni sertifika ekleyebilir, sürükleyerek sırasını değiştirebilir veya yayından kaldırabilirsiniz.',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Sertifika görseli',
                  admin: { description: 'JPG, PNG veya WebP belge görseli yükleyin.' },
                },
                {
                  name: 'existingImage',
                  type: 'text',
                  label: 'Mevcut sertifika görseli',
                  admin: { readOnly: true, description: 'Eski sertifikanın mevcut dosyası. Yeni görsel yüklenirse onun yerine geçer.' },
                },
                { name: 'standard', type: 'text', required: true, label: 'Standart / kısa ad' },
                { name: 'title', type: 'text', localized: true, label: 'Sertifika adı' },
                { name: 'number', type: 'text', label: 'Belge numarası' },
                { name: 'validUntil', type: 'date', label: 'Geçerlilik tarihi' },
                { name: 'enabled', type: 'checkbox', defaultValue: true, label: 'Sitede göster' },
              ],
            },
          ],
        },
        {
          label: 'Marka & Distribütörlük',
          fields: [
            {
              name: 'trademark',
              type: 'group',
              label: 'Tescilli marka',
              fields: [
                { name: 'eyebrow', type: 'text', localized: true, label: 'Küçük başlık' },
                { name: 'title', type: 'text', localized: true, label: 'Başlık' },
                { name: 'body', type: 'textarea', localized: true, label: 'Metin' },
              ],
            },
            {
              name: 'distributorship',
              type: 'group',
              label: 'Distribütörlük',
              fields: [
                { name: 'eyebrow', type: 'text', localized: true, label: 'Küçük başlık' },
                { name: 'title', type: 'text', localized: true, label: 'Başlık' },
                { name: 'body', type: 'textarea', localized: true, label: 'Metin' },
                { name: 'image', type: 'upload', relationTo: 'media', label: 'Distribütörlük belgesi' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
