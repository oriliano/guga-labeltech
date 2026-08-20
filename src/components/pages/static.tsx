import Image from 'next/image'
import { RichText } from '@/components/site/RichText'
import { Section, SectionHeading, StatTile } from '@/components/site/ui'
import { t, type Locale } from '@/lib/i18n'
import { OfficeMap } from '@/components/site/OfficeMap'
import { directionsUrl, officeAddress } from '@/lib/office'

import { QuoteForm } from './QuoteForm'

export const ExportPage = ({ locale, settings }: { locale: Locale; settings: any }) => (
  <>
    <Section>
      <SectionHeading
        eyebrow={t('nav.export', locale)}
        title={locale === 'tr' ? 'Projeler ve distribütörlük' : 'Projects and distribution'}
        as="h1"
        lead={
          settings?.exportIntro ??
          (locale === 'tr'
            ? 'Projeye özel üretim, OEM etiketleme ve distribütörlük iş birlikleri için doğrudan proje ekibimizle çalışın.'
            : 'Work directly with our project team for project-specific production, OEM labelling and distribution partnerships.')
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
                {locale === 'tr' ? 'Hizmet verilen ülkeler' : 'Countries served'}
              </h3>
              <p className="mt-2 text-sm">{settings.shippedCountries.map((c: any) => c.country).join(' · ')}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </Section>

    <Section tone="tint">
      <div className="mx-auto max-w-2xl">
        <SectionHeading title={locale === 'tr' ? 'Proje talebi' : 'Project enquiry'} align="center" />
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
          as="h1"
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
                <a href={`tel:${phone.number.replace(/\s/g, '')}`} className="text-signal-400 hover:underline">
                  {phone.number}
                </a>
              </dd>
            </div>
          ))}
          <div>
            <dt className="font-semibold">{t('form.email', locale)}</dt>
            <dd className="mt-1">
              <a href={`mailto:${settings?.email}`} className="text-signal-400 hover:underline">
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

    {settings?.offices?.length ? (
      <div className="mt-16 grid gap-8 lg:grid-cols-2">
        {settings.offices.map((office: any) => (
          <OfficeMap
            key={office.street}
            locale={locale}
            label={office.label ?? office.city}
            address={officeAddress(office)}
            mapUrl={directionsUrl(office)}
          />
        ))}
      </div>
    ) : null}
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
