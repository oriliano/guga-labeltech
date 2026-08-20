import nodemailer, { type Transporter } from 'nodemailer'

/**
 * Teklif taleplerinin e-posta bildirimi, şirketin kendi posta kutusu üzerinden.
 *
 * Üçüncü taraf bir gönderim servisi yok: doğrudan SMTP'ye bağlanılıyor, yani
 * kurulum için alan adının DNS kayıtlarına dokunmak gerekmiyor, var olan
 * info@ hesabının kullanıcı adı ve parolası yetiyor.
 *
 * SMTP tanımlı değilse hiçbir şey gönderilmiyor ve talep yine de veritabanına
 * yazılıyor: bildirim, kaydın kendisinden daha az kritik. Gönderim hatası da
 * formu bozmuyor, yalnızca loga düşüyor.
 *
 * Gerekli değişkenler:
 *   SMTP_HOST   Posta sunucusu (ör. mail.gugalabeltech.com, smtp.yandex.com.tr)
 *   SMTP_PORT   465 (SSL) ya da 587 (STARTTLS)
 *   SMTP_USER   Kutunun tam adresi (ör. info@gugalabeltech.com)
 *   SMTP_PASS   O kutunun parolası ya da uygulama parolası
 *   MAIL_FROM   Gönderen adresi; boşsa SMTP_USER kullanılır
 *   MAIL_TO     Bildirimin gideceği adres(ler), virgülle ayrılır; boşsa SMTP_USER
 */
export type LeadMail = {
  name: string
  email: string
  company?: string
  phone?: string
  country?: string
  message?: string
  locale: 'tr' | 'en'
  sourcePath?: string
  adminUrl?: string
  /** Formla gelen dosyalar; yalnızca firmaya giden bildirime iliştiriliyor. */
  attachments?: { name: string; mimetype: string; data: Buffer }[]
}

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const row = (label: string, value?: string) =>
  value ? `<tr><td style="padding:4px 12px 4px 0;color:#6b7280">${label}</td><td>${escape(value)}</td></tr>` : ''

/**
 * Bağlantı havuzu modül düzeyinde tutuluyor; her talepte yeni TLS el sıkışması
 * kurmak gönderimi saniyelerce geciktiriyordu.
 */
let cached: Transporter | null = null

const transport = () => {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) return null

  // 465 örtük TLS ister, 587 bağlantıyı STARTTLS ile yükseltir. Port yazılmamışsa
  // sunucuların büyük kısmında çalışan 587 varsayılıyor.
  const port = Number(process.env.SMTP_PORT || 587)

  cached ??= nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    pool: true,
    maxConnections: 2,
  })
  return cached
}

type ResendMessage = {
  to: string | string[]
  subject: string
  html: string
  text: string
  replyTo?: string
  attachments?: { name: string; data: Buffer }[]
}

const sendWithResend = async (message: ResendMessage) => {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return false

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || 'GUGA LABELTECH <bildirim@form.gugalabeltech.com>',
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      reply_to: message.replyTo,
      attachments: message.attachments?.map((file) => ({
        filename: file.name,
        content: file.data.toString('base64'),
      })),
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Resend ${response.status}: ${detail.slice(0, 300)}`)
  }

  return true
}

export const sendLeadMail = async (lead: LeadMail) => {
  const user = process.env.SMTP_USER || 'info@gugalabeltech.com'
  // Gönderen adresi kimlik doğrulanan kutuyla aynı olmalı, yoksa sunucular
  // "sender not allowed" diyip reddediyor; bu yüzden varsayılan SMTP_USER.
  const from = `GUGA LABELTECH <${process.env.MAIL_FROM || user}>`
  const to = (process.env.MAIL_TO || user)
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean)

  const bildirim = `
    <!doctype html>
    <html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
    <body><h2 style="font:600 18px system-ui">Yeni teklif talebi</h2>
    <table style="font:14px system-ui;border-collapse:collapse">
      ${row('Ad Soyad', lead.name)}
      ${row('E-posta', lead.email)}
      ${row('Firma', lead.company)}
      ${row('Telefon', lead.phone)}
      ${row('Ülke', lead.country)}
      ${row('Form dili', lead.locale === 'tr' ? 'Türkçe' : 'İngilizce')}
      ${row('Geldiği sayfa', lead.sourcePath)}
      ${row('Ek', lead.attachments?.length ? lead.attachments.map((file) => file.name).join(', ') : undefined)}
    </table>
    ${lead.message ? `<p style="font:14px system-ui;white-space:pre-wrap">${escape(lead.message)}</p>` : ''}
    ${lead.adminUrl ? `<p style="font:14px system-ui"><a href="${lead.adminUrl}">Panelde aç</a></p>` : ''}
    </body></html>
  `

  const bildirimMetni = [
    'Yeni teklif talebi',
    `Ad Soyad: ${lead.name}`,
    `E-posta: ${lead.email}`,
    lead.company ? `Firma: ${lead.company}` : '',
    lead.phone ? `Telefon: ${lead.phone}` : '',
    lead.country ? `Ülke: ${lead.country}` : '',
    `Form dili: ${lead.locale === 'tr' ? 'Türkçe' : 'İngilizce'}`,
    lead.sourcePath ? `Geldiği sayfa: ${lead.sourcePath}` : '',
    lead.message ? `Mesaj:\n${lead.message}` : '',
    lead.adminUrl ? `Panel: ${lead.adminUrl}` : '',
  ]
    .filter(Boolean)
    .join('\n\n')

  const tesekkur =
    lead.locale === 'tr'
      ? `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body>
         <p style="font:14px system-ui">Merhaba ${escape(lead.name)},</p>
         <p style="font:14px system-ui">Talebiniz bize ulaştı. Bir iş günü içinde dönüş yapacağız.</p>
         <p style="font:14px system-ui">GUGA LABELTECH</p></body></html>`
      : `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body>
         <p style="font:14px system-ui">Hello ${escape(lead.name)},</p>
         <p style="font:14px system-ui">We received your request and will reply within one business day.</p>
         <p style="font:14px system-ui">GUGA LABELTECH</p></body></html>`

  const tesekkurMetni =
    lead.locale === 'tr'
      ? `Merhaba ${lead.name},\n\nTalebiniz bize ulaştı. Bir iş günü içinde dönüş yapacağız.\n\nGUGA LABELTECH`
      : `Hello ${lead.name},\n\nWe received your request and will reply within one business day.\n\nGUGA LABELTECH`

  if (process.env.RESEND_API_KEY) {
    try {
      await sendWithResend({
        to,
        replyTo: lead.email,
        subject: `Teklif talebi — ${lead.name}${lead.company ? ` (${lead.company})` : ''}`,
        text: bildirimMetni,
        html: bildirim,
        attachments: lead.attachments?.map((file) => ({ name: file.name, data: file.data })),
      })
    } catch (error) {
      return { sent: false, reason: (error as Error).message }
    }

    try {
      await sendWithResend({
        to: lead.email,
        subject: lead.locale === 'tr' ? 'Talebiniz bize ulaştı' : 'We received your request',
        text: tesekkurMetni,
        html: tesekkur,
      })
    } catch {
      return { sent: true as const, reason: 'tesekkur maili gonderilemedi' }
    }

    return { sent: true as const }
  }

  const mailer = transport()
  if (!mailer) return { sent: false, reason: 'E-posta servisi yapılandırılmadı' as const }

  try {
    await mailer.sendMail({
      from,
      to,
      replyTo: lead.email,
      subject: `Teklif talebi — ${lead.name}${lead.company ? ` (${lead.company})` : ''}`,
      text: bildirimMetni,
      html: bildirim,
      // Ekler yalnızca firmaya gidiyor; teşekkür maili müşterinin kendi
      // gönderdiği dosyayı geri yollamak zorunda değil.
      attachments: lead.attachments?.map((file) => ({
        filename: file.name,
        content: file.data,
        contentType: file.mimetype,
      })),
    })
  } catch (error) {
    return { sent: false, reason: (error as Error).message }
  }

  // Talep sahibine otomatik teşekkür. Bu gönderim başarısız olsa da bildirim
  // gitmiş sayılıyor: firma talebi görüyor, iş akışı durmuyor.
  try {
    await mailer.sendMail({
      from,
      to: lead.email,
      subject: lead.locale === 'tr' ? 'Talebiniz bize ulaştı' : 'We received your request',
      text: tesekkurMetni,
      html: tesekkur,
    })
  } catch {
    return { sent: true as const, reason: 'tesekkur maili gonderilemedi' }
  }

  return { sent: true as const }
}
