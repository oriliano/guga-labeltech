import type { Metadata } from 'next'

import { Shell } from '@/components/site/Shell'
import { ButtonLink, Section } from '@/components/site/ui'
import { t } from '@/lib/i18n'
import { localeFromRequest } from '@/lib/request'
import { alternatePath, homePath, sectionPath, type Section as RouteSection } from '@/lib/routes'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '404',
  robots: { index: false, follow: true },
}

const SUGGESTED: RouteSection[] = ['products', 'solutions', 'insights', 'contact']

const NotFound = async () => {
  const locale = await localeFromRequest()

  return (
    <Shell locale={locale} alternateHref={alternatePath(locale, null)}>
      <Section>
        <div className="mx-auto max-w-2xl py-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-signal-600">
            {t('notFound.code', locale)}
          </p>
          <h1 className="mt-3 text-h1 font-semibold">{t('notFound.title', locale)}</h1>
          <p className="mt-4 text-lead text-muted">{t('notFound.body', locale)}</p>

          <div className="mt-8 flex justify-center">
            <ButtonLink href={homePath(locale)}>{t('notFound.home', locale)}</ButtonLink>
          </div>

          <nav className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
            {SUGGESTED.map((section) => (
              <a
                key={section}
                href={sectionPath(section, locale)}
                className="text-muted underline underline-offset-4 hover:text-signal-600"
              >
                {t(`nav.${section}`, locale)}
              </a>
            ))}
          </nav>
        </div>
      </Section>
    </Shell>
  )
}

export default NotFound
