/**
 * Scrapes the legacy GoDaddy site (gugalabeltech.com) into a structured JSON file
 * used to seed the Payload database.
 *
 * Boilerplate (nav, footer, cookie notice) is detected statistically: any text
 * block that appears on more than half of the pages is treated as chrome and
 * dropped, so we don't have to hardcode the legacy navigation.
 *
 * Usage: node src/seed/scrape.mjs
 */
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const ORIGIN = 'https://gugalabeltech.com'
const OUT = path.resolve(process.cwd(), 'src/seed/scraped.json')

const decodeEntities = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))

const stripTags = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, '\n')

const textBlocks = (html) =>
  decodeEntities(stripTags(html))
    .split('\n')
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter((s) => s.length > 1)

/** Legacy images are served by GoDaddy's isteam CDN with a `/:/rs=...` resize suffix. */
const imageUrls = (html) => {
  const raw = [...html.matchAll(/https:\/\/img1\.wsimg\.com\/isteam\/[^"'\\ )]+/g)].map((m) => m[0])
  const originals = raw
    .map((u) => u.split('/:/')[0])
    .filter((u) => !u.includes('/favicon/'))
    .map((u) => decodeEntities(u))
  return [...new Set(originals)]
}

const fetchText = async (url) => {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; guga-migration)' } })
      if (res.ok) return await res.text()
      if (res.status === 404) return null
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 500 * (attempt + 1)))
  }
  return null
}

const sitemapUrls = async (name) => {
  const xml = await fetchText(`${ORIGIN}/sitemap.${name}.xml`)
  if (!xml) return []
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => u.startsWith(ORIGIN))
}

const meta = (html, prop) => {
  const re = new RegExp(`<meta[^>]+(?:name|property)="${prop}"[^>]+content="([^"]*)"`, 'i')
  return decodeEntities(html.match(re)?.[1] ?? '')
}

const main = async () => {
  const pageUrls = await sitemapUrls('website')
  const blogUrls = await sitemapUrls('blog')
  const all = [...new Set([...pageUrls, ...blogUrls])]
  console.log(`Fetching ${all.length} pages...`)

  const pages = []
  for (const url of all) {
    const html = await fetchText(url)
    if (!html) {
      console.warn(`  MISS ${url}`)
      continue
    }
    pages.push({
      url,
      slug: decodeURIComponent(new URL(url).pathname).replace(/^\/|\/$/g, '') || 'home',
      kind: blogUrls.includes(url) ? 'post' : 'page',
      title: decodeEntities(html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? '').trim(),
      description: meta(html, 'description'),
      blocks: textBlocks(html),
      images: imageUrls(html),
    })
    process.stdout.write('.')
  }
  console.log(`\nFetched ${pages.length} pages.`)

  // Boilerplate = any block present on more than half of the pages.
  const frequency = new Map()
  for (const page of pages) {
    for (const block of new Set(page.blocks)) {
      frequency.set(block, (frequency.get(block) ?? 0) + 1)
    }
  }
  const threshold = pages.length / 2
  const chrome = new Set([...frequency].filter(([, n]) => n > threshold).map(([block]) => block))

  for (const page of pages) {
    const seen = new Set()
    page.content = page.blocks.filter((block) => {
      if (chrome.has(block) || seen.has(block)) return false
      seen.add(block)
      return true
    })
    delete page.blocks
  }

  const sharedImages = new Set()
  const imageFrequency = new Map()
  for (const page of pages) {
    for (const img of new Set(page.images)) imageFrequency.set(img, (imageFrequency.get(img) ?? 0) + 1)
  }
  for (const [img, n] of imageFrequency) if (n > threshold) sharedImages.add(img)
  for (const page of pages) page.images = page.images.filter((img) => !sharedImages.has(img))

  await mkdir(path.dirname(OUT), { recursive: true })
  await writeFile(
    OUT,
    JSON.stringify(
      { scrapedAt: new Date().toISOString(), origin: ORIGIN, chrome: [...chrome], sharedImages: [...sharedImages], pages },
      null,
      2,
    ),
  )
  console.log(`Wrote ${OUT}`)
  console.log(`  chrome blocks dropped: ${chrome.size}`)
  console.log(`  pages with content: ${pages.filter((p) => p.content.length).length}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
