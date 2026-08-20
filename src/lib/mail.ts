import { Resend } from 'resend'

/**
 * Teklif taleplerinin e-posta bildirimi.
 *
 * Anahtar tanımlı değilse hiçbir şey gönderilmiyor ve talep yine de veritabanına
 * yazılıyor: bildirim, kaydın kendisinden daha az kritik. Gönderim hatası da
 * formu bozmuyor, yalnızca loga düşüyor.
 *
 * Gerekli değişkenler:
 *   RESEND_API_KEY   Resend hesabından alınan anahtar
 *   MAIL_FROM        Gönderen adresi, doğrulanmış alan adından (ör. site@gugalabeltech.com)
 *   MAIL_TO          Bildirimin gideceği adres(ler), virgülle ayrılır
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
}

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const row = (label: string, value?: string) =>
  value ? `<tr><td style="padding:4px 12px 4px 0;color:#6b7280">${label}</td><td>${escape(value)}</td></tr>` : ''

export const sendLeadMail = async (lead: LeadMail) => {
  const key = process.env.RESEND_API_KEY
  const from = process.env.MAIL_FROM
  const to = (process.env.MAIL_TO || '')
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean)

  if (!key || !from || !to.length) return { sent: false, reason: 'yapılandırılmadı' as const }

  const resend = new Resend(key)

  const bildirim = `
    <h2 style="font:600 18px system-ui">Yeni teklif talebi</h2>
    <table style="font:14px system-ui;border-collapse:collapse">
      ${row('Ad Soyad', lead.name)}
      ${row('E-posta', lead.email)}
      ${row('Firma', lead.company)}
      ${row('Telefon', lead.phone)}
      ${row('Ülke', lead.country)}
      ${row('Form dili', lead.locale === 'tr' ? 'Türkçe' : 'İngilizce')}
      ${row('Geldiği sayfa', lead.sourcePath)}
    </table>
    ${lead.message ? `<p style="font:14px system-ui;white-space:pre-wrap">${escape(lead.message)}</p>` : ''}
    ${lead.adminUrl ? `<p style="font:14px system-ui"><a href="${lead.adminUrl}">Panelde aç</a></p>` : ''}
  `

  const tesekkur =
    lead.locale === 'tr'
      ? `<p style="font:14px system-ui">Merhaba ${escape(lead.name)},</p>
         <p style="font:14px system-ui">Talebiniz bize ulaştı. Bir iş günü içinde dönüş yapacağız.</p>
         <p style="font:14px system-ui">GUGA LABELTECH</p>`
      : `<p style="font:14px system-ui">Hello ${escape(lead.name)},</p>
         <p style="font:14px system-ui">We received your request and will reply within one business day.</p>
         <p style="font:14px system-ui">GUGA LABELTECH</p>`

  try {
    await resend.emails.send({
      from,
      to,
      replyTo: lead.email,
      subject: `Teklif talebi — ${lead.name}${lead.company ? ` (${lead.company})` : ''}`,
      html: bildirim,
    })

    // Talep sahibine otomatik teşekkür; başarısız olursa bildirim yine de gitti.
    await resend.emails.send({
      from,
      to: [lead.email],
      subject: lead.locale === 'tr' ? 'Talebiniz bize ulaştı' : 'We received your request',
      html: tesekkur,
    })

    return { sent: true as const }
  } catch (error) {
    return { sent: false, reason: (error as Error).message }
  }
}
