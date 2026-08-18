import type { ReactNode } from 'react'

type LexicalNode = {
  type?: string
  tag?: string
  text?: string
  format?: number | string
  listType?: string
  fields?: { url?: string; newTab?: boolean }
  children?: LexicalNode[]
}

const inline = (node: LexicalNode, key: number): ReactNode => {
  if (node.type === 'linebreak') return <br key={key} />
  if (typeof node.text === 'string') {
    const format = typeof node.format === 'number' ? node.format : 0
    let content: ReactNode = node.text
    if (format & 1) content = <strong key={key}>{content}</strong>
    if (format & 2) content = <em key={key}>{content}</em>
    if (format & 8) content = <u key={key}>{content}</u>
    if (format & 16) content = <code key={key}>{content}</code>
    return <span key={key}>{content}</span>
  }
  if (node.type === 'link' || node.type === 'autolink') {
    return (
      <a
        key={key}
        href={node.fields?.url ?? '#'}
        {...(node.fields?.newTab ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      >
        {node.children?.map(inline)}
      </a>
    )
  }
  return <span key={key}>{node.children?.map(inline)}</span>
}

const block = (node: LexicalNode, key: number): ReactNode => {
  switch (node.type) {
    case 'heading': {
      const Tag = (node.tag ?? 'h2') as 'h2' | 'h3' | 'h4'
      return <Tag key={key}>{node.children?.map(inline)}</Tag>
    }
    case 'list': {
      const Tag = node.listType === 'number' ? 'ol' : 'ul'
      return (
        <Tag key={key}>
          {node.children?.map((item, index) => <li key={index}>{item.children?.map(inline)}</li>)}
        </Tag>
      )
    }
    case 'quote':
      return (
        <blockquote key={key} className="border-l-4 border-signal-500 pl-4 italic">
          {node.children?.map(inline)}
        </blockquote>
      )
    case 'horizontalrule':
      return <hr key={key} className="border-ink-100 dark:border-ink-800" />
    case 'paragraph':
    default:
      if (!node.children?.length) return null
      return <p key={key}>{node.children.map(inline)}</p>
  }
}

/**
 * Minimal Lexical renderer. Payload ships a React renderer too, but the content
 * here is plain prose and this keeps the client bundle free of the editor.
 */
export const RichText = ({ data, className = '' }: { data?: { root?: LexicalNode } | null; className?: string }) => {
  const children = data?.root?.children
  if (!children?.length) return null
  return <div className={`prose-guga ${className}`}>{children.map(block)}</div>
}
