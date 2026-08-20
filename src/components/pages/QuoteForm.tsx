'use client'

import Link from 'next/link'

import { useState } from 'react'

import { t, type Locale } from '@/lib/i18n'
import { legalPath } from '@/lib/routes'

const field =
  'w-full rounded-lg border border-[var(--card-border)] bg-ink-950/50 px-4 py-3 text-sm outline-none focus:border-signal-500'

export const QuoteForm = ({ locale, sourcePath }: { locale: Locale; sourcePath: string }) => {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setState('sending')
    const form = new FormData(event.currentTarget)
    form.set('locale', locale)
    form.set('sourcePath', sourcePath)
    try {
      const response = await fetch('/api/quote', { method: 'POST', body: form })
      if (!response.ok) throw new Error('request failed')
      setState('sent')
      event.currentTarget.reset()
    } catch {
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <p role="status" className="card-surface p-6 text-sm">
        {t('form.success', locale)}
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Honeypot: bots fill hidden fields, humans never see this one. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">{t('form.name', locale)} *</span>
          <input required name="name" autoComplete="name" className={field} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">{t('form.company', locale)}</span>
          <input name="company" autoComplete="organization" className={field} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">{t('form.email', locale)} *</span>
          <input required type="email" name="email" autoComplete="email" className={field} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">{t('form.phone', locale)}</span>
          <input name="phone" type="tel" autoComplete="tel" className={field} />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1.5 block font-medium">{t('form.country', locale)}</span>
          <input name="country" autoComplete="country-name" className={field} />
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">{t('form.message', locale)}</span>
        <textarea name="message" rows={5} className={field} />
      </label>

      {state === 'error' ? (
        <p role="alert" className="text-sm text-red-600">
          {t('form.error', locale)}
        </p>
      ) : null}

      {/* Kanun gereği form gönderilmeden önce aydınlatma metnine erişim verilmeli. */}
      <p className="text-xs leading-relaxed text-muted">
        {locale === 'tr' ? 'Formu göndererek ' : 'By sending this form you accept the '}
        <Link href={legalPath('kvkk', locale)} className="text-signal-400 underline underline-offset-2">
          {locale === 'tr' ? 'Aydınlatma Metni' : 'Data Protection Notice'}
        </Link>
        {locale === 'tr' ? ' ve ' : ' and the '}
        <Link href={legalPath('privacy', locale)} className="text-signal-400 underline underline-offset-2">
          {locale === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}
        </Link>
        {locale === 'tr'
          ? '’nı okuduğunuzu kabul etmiş olursunuz. Bilgileriniz yalnızca talebinizi yanıtlamak için kullanılır.'
          : '. Your details are used only to answer your request.'}
      </p>

      <button
        type="submit"
        disabled={state === 'sending'}
        className="inline-flex items-center rounded-lg bg-signal-500 px-6 py-3 text-sm font-semibold text-ink-950 hover:bg-signal-400 disabled:opacity-60"
      >
        {state === 'sending' ? t('form.sending', locale) : t('form.submit', locale)}
      </button>
    </form>
  )
}
