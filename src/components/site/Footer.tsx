import Link from 'next/link'

import { t, type Locale } from '@/lib/i18n'

type Office = {
  label?: string | null
  street: string
  postalCode?: string | null
  district?: string | null
  city: string
  country: string
}
type Phone = { label?: string | null; number: string; whatsapp?: boolean | null }
type Column = { title: string; links?: { label: string; href: string }[] | null }

export const Footer = ({
  locale,
  brand,
  legalName,
  email,
  offices,
  phones,
  columns,
}: {
  locale: Locale
  brand: string
  legalName: string
  email: string
  offices: Office[]
  phones: Phone[]
  columns: Column[]
}) => (
  <footer className="border-t border-ink-100 bg-ink-900 text-ink-100 dark:border-ink-800">
    <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
      <div>
        <p className="text-lg font-bold">{brand}</p>
        <p className="mt-2 text-sm text-ink-400">{legalName}</p>
        <address className="mt-4 space-y-3 text-sm not-italic text-ink-200">
          {offices.map((office) => (
            <div key={`${office.street}-${office.city}`}>
              {office.label ? <p className="font-medium text-ink-100">{office.label}</p> : null}
              <p>{office.street}</p>
              <p>
                {office.postalCode ? `${office.postalCode} ` : ''}
                {office.district ? `${office.district}/` : ''}
                {office.city}
              </p>
              <p>{office.country}</p>
            </div>
          ))}
        </address>
      </div>

      {columns.map((column) => (
        <nav key={column.title} aria-label={column.title}>
          <p className="text-sm font-semibold uppercase tracking-wider text-ink-400">{column.title}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {column.links?.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ink-200 hover:text-signal-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}

      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-ink-400">{t('nav.contact', locale)}</p>
        <ul className="mt-4 space-y-2 text-sm">
          {phones.map((phone) => (
            <li key={phone.number}>
              <a href={`tel:${phone.number.replace(/\s/g, '')}`} className="text-ink-200 hover:text-signal-400">
                {phone.number}
              </a>
              {phone.whatsapp ? <span className="ml-2 text-xs text-ink-400">WhatsApp</span> : null}
            </li>
          ))}
          <li>
            <a href={`mailto:${email}`} className="text-ink-200 hover:text-signal-400">
              {email}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-ink-800">
      <div className="container-page flex flex-col gap-2 py-6 text-xs text-ink-400 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {legalName}. {t('footer.rights', locale)}
        </p>
        <p>{t('footer.legalNote', locale)}</p>
      </div>
    </div>
  </footer>
)
