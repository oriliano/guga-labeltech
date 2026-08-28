import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

export const Section = ({
  children,
  className = '',
  tone = 'default',
  id,
}: {
  children: ReactNode
  className?: string
  tone?: 'default' | 'dark' | 'tint'
  id?: string
}) => {
  const tones = {
    default: '',
    dark: 'bg-ink-950 text-ink-100',
    tint: 'bg-ink-900/60',
  }
  return (
    <section id={id} className={`py-16 md:py-24 ${tones[tone]} ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  )
}

export const SectionHeading = ({
  eyebrow,
  title,
  lead,
  align = 'left',
  as: Tag = 'h2',
}: {
  eyebrow?: string
  title: string
  lead?: string
  align?: 'left' | 'center'
  as?: 'h1' | 'h2'
}) => (
  <header className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
    {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
    <Tag className={`${eyebrow ? 'mt-3' : ''} ${Tag === 'h1' ? 'text-h1' : 'text-h2'} font-semibold`}>{title}</Tag>
    <span aria-hidden className={`rule-gold mt-5 ${align === 'center' ? 'mx-auto' : ''}`} />
    {lead ? <p className="mt-5 text-lead text-muted">{lead}</p> : null}
  </header>
)

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-button font-semibold transition duration-200 focus-visible:outline-2'

export const ButtonLink = ({
  href,
  children,
  variant = 'primary',
}: {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
}) => {
  const variants = {
    primary:
      'bg-signal-500 text-ink-950 shadow-[0_12px_28px_-16px_rgba(201,162,39,0.95)] hover:-translate-y-px hover:bg-signal-400',
    secondary:
      'border border-[var(--card-border)] hover:-translate-y-px hover:border-signal-500 hover:text-signal-400',
    ghost: 'text-signal-400 hover:underline underline-offset-4 px-0 py-0',
  }
  return (
    <Link href={href} className={`${buttonBase} ${variants[variant]}`}>
      {children}
    </Link>
  )
}

export const Card = ({
  href,
  eyebrow,
  title,
  body,
  footer,
  image,
  imageFit = 'cover',
  visual,
}: {
  href: string
  eyebrow?: string
  title: string
  body?: string
  footer?: ReactNode
  image?: string
  imageFit?: 'cover' | 'contain'
  visual?: ReactNode
}) => (
  <Link
    href={href}
    className="card-surface lift group relative flex h-full flex-col overflow-hidden hover:border-signal-500/40 hover:lift-hover focus-visible:lift-hover"
  >
    {!image && visual ? <div className="aspect-[16/9] overflow-hidden">{visual}</div> : null}
    {image ? (
      <div className="relative aspect-[16/9] overflow-hidden border-b border-signal-500/35 bg-[var(--page-bg)]">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
          className={`${imageFit === 'contain' ? 'object-contain p-3' : 'object-cover group-hover:scale-[1.04]'} transition-transform duration-500`}
        />
      </div>
    ) : null}
    <div className="flex flex-1 flex-col p-7">
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h3 className={`${eyebrow ? 'mt-2' : ''} text-h3 font-semibold transition-colors group-hover:text-signal-500`}>
        {title}
      </h3>
      {/* Kart görsellerinin altında tekrar eden uzun özetler yerine başlık
          odakta tutulur. Görselsiz kartlarda metin açıklaması korunur. */}
      {body && !image ? <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{body}</p> : null}
      {footer ? (
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-signal-400">
          {footer}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      ) : null}
    </div>
  </Link>
)

/** Numeric proof point. Used on solution pages and case studies. */
export const StatTile = ({ metric, label }: { metric: string; label: string }) => (
  <div className="card-surface p-6">
    <p className="text-h1 font-semibold tabular-nums text-signal-400">{metric}</p>
    <p className="mt-2 text-sm text-muted">{label}</p>
  </div>
)

export const SpecTable = ({ rows, caption }: { rows: { label: string; value: string }[]; caption: string }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse text-sm">
      <caption className="sr-only">{caption}</caption>
      <tbody>
        {rows.map((row, index) => (
          <tr key={`${row.label}-${index}`} className="border-b border-[var(--card-border)]">
            <th scope="row" className="w-2/5 py-3 pr-4 text-left align-top font-medium">
              {row.label}
            </th>
            <td className="py-3 align-top text-muted">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export const Breadcrumbs = ({ items }: { items: { label: string; href?: string }[] }) => (
  <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted">
    <ol className="flex flex-wrap items-center gap-2">
      {items.map((item, index) => (
        <li key={item.label} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="hover:text-signal-400">
              {item.label}
            </Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
          {index < items.length - 1 ? <span aria-hidden>/</span> : null}
        </li>
      ))}
    </ol>
  </nav>
)
