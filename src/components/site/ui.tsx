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
    dark: 'bg-ink-900 text-ink-100',
    tint: 'bg-signal-100/50 dark:bg-ink-800/40',
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
    {eyebrow ? (
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-signal-600 dark:text-signal-400">
        {eyebrow}
      </p>
    ) : null}
    <Tag className="text-h1 font-semibold">{title}</Tag>
    {lead ? <p className="mt-4 text-lead text-muted">{lead}</p> : null}
  </header>
)

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-2'

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
    primary: 'bg-signal-500 text-ink-950 hover:bg-signal-400',
    secondary: 'border border-ink-200 dark:border-ink-700 hover:border-signal-500 hover:text-signal-600',
    ghost: 'text-signal-600 hover:underline underline-offset-4 px-0 py-0',
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
}: {
  href: string
  eyebrow?: string
  title: string
  body?: string
  footer?: ReactNode
  image?: string
}) => (
  <Link
    href={href}
    className="card-surface group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg focus-visible:shadow-lg"
  >
    {image ? (
      <div className="relative aspect-[16/9] overflow-hidden bg-ink-100 dark:bg-ink-800">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
    ) : null}
    <div className="flex flex-1 flex-col p-6">
      {eyebrow ? (
        <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-signal-600 dark:text-signal-400">
          {eyebrow}
        </span>
      ) : null}
      <h3 className="text-h3 font-semibold group-hover:text-signal-600">{title}</h3>
      {body ? <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{body}</p> : null}
      {footer ? <div className="mt-4 text-sm font-medium text-signal-600">{footer}</div> : null}
    </div>
  </Link>
)

/** Numeric proof point. Used on solution pages and case studies. */
export const StatTile = ({ metric, label }: { metric: string; label: string }) => (
  <div className="card-surface p-6">
    <p className="text-h1 font-semibold tabular-nums text-signal-600 dark:text-signal-400">{metric}</p>
    <p className="mt-2 text-sm text-muted">{label}</p>
  </div>
)

export const SpecTable = ({ rows, caption }: { rows: { label: string; value: string }[]; caption: string }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse text-sm">
      <caption className="sr-only">{caption}</caption>
      <tbody>
        {rows.map((row, index) => (
          <tr key={`${row.label}-${index}`} className="border-b border-ink-100 dark:border-ink-800">
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
            <Link href={item.href} className="hover:text-signal-600">
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
