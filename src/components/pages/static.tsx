import { RichText } from '@/components/site/RichText'
import { Section, SectionHeading, StatTile } from '@/components/site/ui'
import { t, type Locale } from '@/lib/i18n'

import { QuoteForm } from './QuoteForm'

export const AboutPage = ({ locale, settings }: { locale: Locale; settings: any }) => (
  <>
    <Section>
      <SectionHeading
        eyebrow={t('nav.about', locale)}
        title={locale === 'tr' ? 'RFID ve IoT teknolojilerinde yerli üretim' : 'Turkish-made RFID and IoT technology'}
        lead={settings?.tagline ?? undefined}
      />
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="prose-guga max-w-none">
          <p>
            {locale === 'tr'
              ? 'GUGA Bilişim Teknoloji, RFID etiket, kart ve donanım üretiminden yazılım entegrasyonuna kadar uçtan uca çözümler sunar. GUGALABELTECH® markası Türk Patent ve Marka Kurumu tarafından tescillenmiştir.'
              : 'GUGA Bilişim Teknoloji delivers end-to-end solutions, from RFID tag, card and hardware manufacturing through to software integration. GUGALABELTECH® is a trademark registered with the Turkish Patent and Trademark Office.'}
          </p>
          <p>
            {locale === 'tr'
              ? 'Donanım tarafında uluslararası üretici TENHANYUN ile resmi distribütörlük ve proje bazlı özel üretim yürütüyoruz; yazılım tarafında RFID, RTLS ve IoT verisini ERP ve WMS sistemlerine bağlıyoruz.'
              : 'On the hardware side we operate an official distributorship with international manufacturer TENHANYUN, including project-specific production; on the software side we connect RFID, RTLS and IoT data to ERP and WMS systems.'}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <StatTile metric="RFID" label={locale === 'tr' ? 'Etiket ve donanım üretimi' : 'Tag and hardware production'} />
          <StatTile metric="IoT" label={locale === 'tr' ? 'Sensör ve veri toplama' : 'Sensors and data capture'} />
          <StatTile metric="RTLS" label={locale === 'tr' ? 'Gerçek zamanlı konumlama' : 'Real-time location'} />
          <StatTile metric="ERP" label={locale === 'tr' ? 'WMS ve ERP entegrasyonu' : 'WMS and ERP integration'} />
        </div>
      </div>
    </Section>
  </>
)

export const ExportPage = ({ locale, settings }: { locale: Locale; settings: any }) => (
  <>
    <Section>
      <SectionHeading
        eyebrow={t('nav.export', locale)}
        title={locale === 'tr' ? 'İhracat ve distribütörlük' : 'Export and distribution'}
        lead={
          settings?.exportIntro ??
          (locale === 'tr'
            ? 'Projeye özel üretim, OEM etiketleme ve distribütörlük iş birlikleri için doğrudan ihracat ekibimizle çalışın.'
            : 'Work directly with our export team for project-specific production, OEM labelling and distribution partnerships.')
        }
      />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          {
            title: locale === 'tr' ? 'Projeye özel üretim' : 'Custom manufacturing',
            body:
              locale === 'tr'
                ? 'Etiket boyutu, çip seçimi, yapışkan tipi ve frekans bandı projeye göre belirlenir.'
                : 'Tag dimensions, chip choice, adhesive type and frequency band are specified per project.',
          },
          {
            title: locale === 'tr' ? 'OEM ve beyaz etiket' : 'OEM and white label',
            body:
              locale === 'tr'
                ? 'Kendi markanızla üretim ve ambalajlama seçenekleri sunulur.'
                : 'Production and packaging under your own brand are available.',
          },
          {
            title: locale === 'tr' ? 'Teknik destek' : 'Technical support',
            body:
              locale === 'tr'
                ? 'Kurulum, saha testi ve entegrasyon desteği uzaktan veya yerinde sağlanır.'
                : 'Commissioning, field testing and integration support, remote or on site.',
          },
        ].map((item) => (
          <div key={item.title} className="card-surface p-6">
            <h3 className="text-h3 font-semibold">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
          </div>
        ))}
      </div>

      {settings?.incoterms?.length || settings?.certifications?.length || settings?.shippedCountries?.length ? (
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {settings?.incoterms?.length ? (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">Incoterms</h3>
              <p className="mt-2 text-sm">{settings.incoterms.map((i: any) => i.term).join(' · ')}</p>
            </div>
          ) : null}
          {settings?.certifications?.length ? (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
                {locale === 'tr' ? 'Sertifikalar' : 'Certifications'}
              </h3>
              <p className="mt-2 text-sm">{settings.certifications.map((c: any) => c.name).join(' · ')}</p>
            </div>
          ) : null}
          {settings?.shippedCountries?.length ? (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
                {locale === 'tr' ? 'İhracat yapılan ülkeler' : 'Countries served'}
              </h3>
              <p className="mt-2 text-sm">{settings.shippedCountries.map((c: any) => c.country).join(' · ')}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </Section>

    <Section tone="tint">
      <div className="mx-auto max-w-2xl">
        <SectionHeading title={locale === 'tr' ? 'İhracat talebi' : 'Export enquiry'} align="center" />
        <div className="mt-8">
          <QuoteForm locale={locale} sourcePath="export" />
        </div>
      </div>
    </Section>
  </>
)

export const ContactPage = ({ locale, settings }: { locale: Locale; settings: any }) => (
  <Section>
    <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <SectionHeading
          eyebrow={t('nav.contact', locale)}
          title={locale === 'tr' ? 'Teklif alın' : 'Request a quote'}
          lead={
            locale === 'tr'
              ? 'Projenizi anlatın; ürün seçimi, adet ve teslim süresiyle birlikte fiyat çalışalım.'
              : 'Tell us about your project and we will come back with product selection, quantities and lead time.'
          }
        />
        <dl className="mt-10 space-y-6 text-sm">
          {settings?.offices?.map((office: any) => (
            <div key={office.street}>
              <dt className="font-semibold">{office.label ?? office.city}</dt>
              <dd className="mt-1 text-muted">
                {office.street}, {office.postalCode ? `${office.postalCode} ` : ''}
                {office.district ? `${office.district}/` : ''}
                {office.city}, {office.country}
              </dd>
            </div>
          ))}
          {settings?.phones?.map((phone: any) => (
            <div key={phone.number}>
              <dt className="font-semibold">{phone.label ?? t('form.phone', locale)}</dt>
              <dd className="mt-1">
                <a href={`tel:${phone.number.replace(/\s/g, '')}`} className="text-signal-600 hover:underline">
                  {phone.number}
                </a>
              </dd>
            </div>
          ))}
          <div>
            <dt className="font-semibold">{t('form.email', locale)}</dt>
            <dd className="mt-1">
              <a href={`mailto:${settings?.email}`} className="text-signal-600 hover:underline">
                {settings?.email}
              </a>
            </dd>
          </div>
        </dl>
      </div>
      <div className="card-surface p-6 md:p-8">
        <QuoteForm locale={locale} sourcePath="contact" />
      </div>
    </div>
  </Section>
)

export const RichTextPage = ({ title, body }: { title: string; body: any }) => (
  <Section>
    <div className="mx-auto max-w-3xl">
      <h1 className="text-h1 font-semibold">{title}</h1>
      <div className="mt-8">
        <RichText data={body} />
      </div>
    </div>
  </Section>
)
