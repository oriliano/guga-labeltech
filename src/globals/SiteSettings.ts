import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Ayarları',
  admin: { group: 'Sistem' },
  access: { read: anyone, update: authenticated },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Kurum',
          fields: [
            { name: 'legalName', type: 'text', required: true, label: 'Ticari unvan' },
            { name: 'brandName', type: 'text', required: true, label: 'Marka adı' },
            {
              name: 'tagline',
              type: 'text',
              localized: true,
              label: 'Slogan',
              admin: { description: 'Ana sayfa başlığının altında ve paylaşımlarda görünür.' },
            },
            { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo' },
            {
              name: 'foundedYear',
              type: 'number',
              label: 'Kuruluş yılı',
            },
          ],
        },
        {
          label: 'İletişim',
          fields: [
            {
              name: 'offices',
              type: 'array',
              label: 'Ofisler',
              minRows: 1,
              admin: { description: 'İlk sıradaki adres merkez kabul edilir ve yapılandırılmış veride kullanılır.' },
              fields: [
                { name: 'label', type: 'text', required: true, localized: true, label: 'Ofis adı' },
                { name: 'street', type: 'text', required: true, label: 'Adres' },
                { name: 'district', type: 'text', label: 'İlçe' },
                { name: 'city', type: 'text', required: true, label: 'Şehir' },
                { name: 'country', type: 'text', required: true, defaultValue: 'Türkiye', label: 'Ülke' },
                { name: 'mapUrl', type: 'text', label: 'Harita bağlantısı' },
              ],
            },
            {
              name: 'phones',
              type: 'array',
              label: 'Telefonlar',
              fields: [
                { name: 'label', type: 'text', label: 'Etiket' },
                { name: 'number', type: 'text', required: true, label: 'Numara' },
                { name: 'whatsapp', type: 'checkbox', label: 'WhatsApp', defaultValue: false },
              ],
            },
            { name: 'email', type: 'email', required: true, label: 'E-posta' },
            { name: 'exportEmail', type: 'email', label: 'İhracat e-postası' },
          ],
        },
        {
          label: 'İhracat',
          fields: [
            {
              name: 'exportIntro',
              type: 'textarea',
              localized: true,
              label: 'İhracat tanıtım metni',
            },
            {
              name: 'incoterms',
              type: 'array',
              label: 'Teslim şekilleri (Incoterms)',
              fields: [{ name: 'term', type: 'text', required: true }],
            },
            {
              name: 'certifications',
              type: 'array',
              label: 'Sertifikalar',
              fields: [
                { name: 'name', type: 'text', required: true, label: 'Sertifika' },
                { name: 'document', type: 'upload', relationTo: 'documents', label: 'Belge' },
              ],
            },
            {
              name: 'shippedCountries',
              type: 'array',
              label: 'İhracat yapılan ülkeler',
              fields: [{ name: 'country', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'Sosyal & Takip',
          fields: [
            {
              name: 'social',
              type: 'array',
              label: 'Sosyal medya',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'X', value: 'x' },
                    { label: 'Facebook', value: 'facebook' },
                  ],
                },
                { name: 'url', type: 'text', required: true },
              ],
            },
            {
              name: 'gaMeasurementId',
              type: 'text',
              label: 'Google Analytics ölçüm kimliği',
              admin: { description: 'Örn. G-XXXXXXXXXX. Boş bırakılırsa GA yüklenmez; kendi analitiğimiz her hâlükârda çalışır.' },
            },
          ],
        },
      ],
    },
  ],
}
