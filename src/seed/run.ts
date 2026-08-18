/**
 * Seeds the database from the legacy site scrape (src/seed/scraped.json).
 *
 * The legacy pages are flat runs of text, so the parsing here is heuristic: a
 * short line followed by longer lines becomes a heading plus its body. Everything
 * lands as Turkish content; English falls back to Turkish until it is translated
 * in the panel.
 *
 * Safe to re-run: documents are matched by slug and updated in place.
 */
import 'dotenv/config'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'

import config from '../payload.config'
import { slugify } from '../fields/slug'

type ScrapedPage = { slug: string; kind: string; title: string; content: string[]; images: string[] }
type Scrape = { pages: ScrapedPage[] }

const scrape: Scrape = JSON.parse(readFileSync(path.resolve(process.cwd(), 'src/seed/scraped.json'), 'utf8'))

const richText = (paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
    })),
  },
})

/** Legacy solution pages: title, lead paragraphs, then "heading + description" pairs. */
const parseSolution = (page: ScrapedPage) => {
  const [title, ...rest] = page.content
  const lead = rest.filter((line) => line.length > 80).slice(0, 2)
  const capabilities: { title: string; description: string }[] = []

  for (let index = 0; index < rest.length - 1; index++) {
    const heading = rest[index]
    const body = rest[index + 1]
    if (heading.length < 60 && !heading.endsWith('.') && body.length > 90) {
      capabilities.push({ title: heading, description: body })
      index++
    }
  }

  return {
    title: title ?? page.title,
    excerpt: lead[0] ?? page.title,
    problem: richText(lead.slice(0, 3)),
    capabilities: capabilities.slice(0, 8),
  }
}

/** Product pages list several models; a model code marks the start of each one. */
const MODEL = /^(Guga[\w\d]*|GUGA\d+)\s*[-–—]?\s*(.*)$/

const parseProducts = (page: ScrapedPage) => {
  const items: { title: string; model?: string; paragraphs: string[] }[] = []
  for (const line of page.content) {
    const match = line.match(MODEL)
    if (match && line.length < 80) {
      items.push({ title: match[2]?.trim() || match[1], model: match[1], paragraphs: [] })
      continue
    }
    if (items.length && line.length > 60) items.at(-1)!.paragraphs.push(line)
  }
  return items
}

const CATEGORY_BY_SLUG: Record<string, string> = {
  'rfid-donanım': 'hardware',
  'rfid-etiket-1': 'label',
  'rfid-endüstriyel-tag': 'industrial-tag',
  'endüstriyel-etiketler': 'industrial-label',
  'kart-ürünlerimiz': 'card',
  ribon: 'ribbon',
  'yaka-i̇pleri': 'lanyard',
  'kütüphane-ürünlerimiz': 'library',
  'perakende-ürünlerimiz': 'retail',
}

const SOLUTION_SLUGS = [
  'rfid-depo-yönetimi',
  'rfid-lojistik-yönetimi',
  'rfid-perakende-yönetimi',
  'rfid-tekstil-yönetimi',
  'rfid-medikal-yönetimi',
  'rfid-kuyum-yönetimi',
  'rfid-demirbaş-yönetimi',
  'rfid-personel-yönetimi',
  'rfid-otopark-yönetimi',
  'soğuk-zincir-yönetimi',
  'medikal-kabin-yönetimi',
  'el-aletleri-yönetimi',
  'hastane-takip-yönetim',
  'perakende-takip-yönetimi',
  'havacılık-takip-yönetimi-1',
  'mobil-cihaz-yönetimimdm',
]

const main = async () => {
  const payload = await getPayload({ config })

  const email = process.env.SEED_ADMIN_EMAIL || 'info@gugalabeltech.com'
  const password = process.env.SEED_ADMIN_PASSWORD

  const existingUsers = await payload.count({ collection: 'users' })
  if (existingUsers.totalDocs === 0) {
    if (password) {
      await payload.create({
        collection: 'users',
        data: { email, password, name: 'GUGA Yönetici', role: 'admin' },
      })
      console.log(`admin user created: ${email}`)
    } else {
      // Preferred path: let Payload's first-user screen at /admin take the password,
      // so it never passes through a shell history or a CI log.
      console.log('no SEED_ADMIN_PASSWORD set — create the first admin at /admin')
    }
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'tr',
    data: {
      legalName: 'GUGA Bilişim Teknoloji Limited Şirketi',
      brandName: 'GUGA LABELTECH',
      tagline:
        'RFID etiket ve donanım üretimi, IoT ve RTLS yazılımlarıyla depodan perakendeye uçtan uca izlenebilirlik.',
      email: 'info@gugalabeltech.com',
      offices: [
        {
          label: 'Merkez',
          street: 'Mehmet Akif Ersoy Mah. 292. Sk. No: 4/30',
          postalCode: '06170',
          district: 'Yenimahalle',
          city: 'Ankara',
          country: 'Türkiye',
        },
      ],
      phones: [{ label: 'Satış', number: '+90 541 741 90 90', whatsapp: true }],
    },
  })
  console.log('site settings written')

  const upsert = async (collection: 'products' | 'solutions', slug: string, data: Record<string, unknown>) => {
    const existing = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, locale: 'tr' })
    if (existing.docs[0]) {
      await payload.update({ collection, id: existing.docs[0].id, locale: 'tr', data: data as never })
      return 'updated'
    }
    await payload.create({ collection, locale: 'tr', data: { ...data, slug } as never })
    return 'created'
  }

  let solutionCount = 0
  for (const legacySlug of SOLUTION_SLUGS) {
    const page = scrape.pages.find((item) => item.slug === legacySlug)
    if (!page) continue
    const parsed = parseSolution(page)
    // Pages the legacy site never filled in carry only a title; keep them as drafts.
    const isStub = page.content.length < 5
    await upsert('solutions', slugify(page.title || legacySlug), {
      title: parsed.title,
      excerpt: parsed.excerpt,
      problem: parsed.problem,
      capabilities: parsed.capabilities,
      sector: parsed.title.split(' ')[0],
      _status: isStub ? 'draft' : 'published',
    })
    solutionCount++
  }
  console.log(`solutions seeded: ${solutionCount}`)

  let productCount = 0
  for (const [legacySlug, category] of Object.entries(CATEGORY_BY_SLUG)) {
    const page = scrape.pages.find((item) => item.slug === legacySlug)
    if (!page) continue
    const parsed = parseProducts(page)

    if (parsed.length === 0) {
      await upsert('products', slugify(page.title), {
        title: page.title,
        category,
        excerpt: page.content[1]?.slice(0, 200) ?? page.title,
        body: richText(page.content.filter((line) => line.length > 60).slice(0, 6)),
        _status: 'draft',
      })
      productCount++
      continue
    }

    for (const item of parsed) {
      await upsert('products', slugify(`${item.model ?? ''} ${item.title}`), {
        title: item.title,
        model: item.model,
        category,
        excerpt: item.paragraphs[0]?.slice(0, 200) ?? item.title,
        body: richText(item.paragraphs.slice(0, 6)),
        _status: item.paragraphs.length ? 'published' : 'draft',
      })
      productCount++
    }
  }
  console.log(`products seeded: ${productCount}`)

  console.log('done')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
