'use client'

import Link from 'next/link'

import { useRef, useState } from 'react'

import { t, type Locale } from '@/lib/i18n'
import { legalPath } from '@/lib/routes'

const field =
  'w-full rounded-lg border border-[var(--card-border)] bg-ink-950/50 px-4 py-3 text-sm outline-none focus:border-signal-500'

/** Sunucu tarafındaki sınırların aynısı; kullanıcı yüklemeyi beklemeden uyarılıyor. */
const MAX_FILES = 3
const MAX_BYTES = 8 * 1024 * 1024
const ACCEPT = '.pdf,.jpg,.jpeg,.png,.webp,.heic,.doc,.docx,.xls,.xlsx,.csv,.txt'

const readableSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`

export const QuoteForm = ({ locale, sourcePath }: { locale: Locale; sourcePath: string }) => {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState<string | null>(null)
  // Seçilen dosyalar React tarafında tutuluyor; tek tek çıkarabilmek için input'un
  // kendi listesi yeniden yazılamadığından gönderimde biz dolduruyoruz.
  const fileInput = useRef<HTMLInputElement>(null)

  const onPick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files ?? [])
    if (fileInput.current) fileInput.current.value = ''
    if (!picked.length) return

    const tooBig = picked.find((file) => file.size > MAX_BYTES)
    if (tooBig) {
      setFileError(`${t('form.attachmentTooBig', locale)} ${tooBig.name}`)
      return
    }
    const next = [...files, ...picked].slice(0, MAX_FILES)
    setFileError(files.length + picked.length > MAX_FILES ? t('form.attachmentTooMany', locale) : null)
    setFiles(next)
  }

  const removeFile = (index: number) => {
    setFiles((current) => current.filter((_, position) => position !== index))
    setFileError(null)
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setState('sending')
    const element = event.currentTarget
    const form = new FormData(element)
    form.delete('files')
    files.forEach((file) => form.append('files', file))
    form.set('locale', locale)
    form.set('sourcePath', sourcePath)
    try {
      const response = await fetch('/api/quote', { method: 'POST', body: form })
      if (!response.ok) throw new Error('request failed')
      setState('sent')
      element.reset()
      setFiles([])
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

      <div className="text-sm">
        <span className="mb-1.5 block font-medium">{t('form.attachments', locale)}</span>
        {/* Tarayicinin kendi "Dosya secilmedi" yazisi gizleniyor: secilen dosyalar
            asagida kendi listemizde duruyor, ikisi bir arada celisiyordu. */}
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[var(--card-border)] bg-ink-950/30 px-4 py-3 text-sm text-muted hover:border-signal-500">
          <input
            ref={fileInput}
            type="file"
            name="files"
            multiple
            accept={ACCEPT}
            onChange={onPick}
            className="sr-only"
          />
          <span className="rounded-md bg-signal-500 px-4 py-2 text-sm font-semibold text-ink-950">
            {locale === 'tr' ? 'Dosya seç' : 'Choose files'}
          </span>
          <span>
            {files.length
              ? `${files.length} ${locale === 'tr' ? 'dosya seçildi' : files.length === 1 ? 'file selected' : 'files selected'}`
              : locale === 'tr'
                ? 'Henüz dosya seçilmedi'
                : 'No file selected yet'}
          </span>
        </label>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">{t('form.attachmentsHint', locale)}</p>
        {files.length ? (
          <ul className="mt-3 space-y-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-[var(--card-border)] px-3 py-2 text-xs"
              >
                <span className="truncate">
                  {file.name} <span className="text-muted">· {readableSize(file.size)}</span>
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="shrink-0 text-muted underline underline-offset-2 hover:text-signal-400"
                >
                  {locale === 'tr' ? 'Kaldır' : 'Remove'}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {fileError ? (
          <p role="alert" className="mt-2 text-xs text-red-600">
            {fileError}
          </p>
        ) : null}
      </div>

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
