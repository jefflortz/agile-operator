/**
 * WordPress → Sanity Migration Script
 *
 * Usage:
 *   node scripts/migrate-from-wordpress.mjs              # migrate all, generate keywords
 *   node scripts/migrate-from-wordpress.mjs --no-keywords  # skip AI keyword gen (faster)
 *   node scripts/migrate-from-wordpress.mjs --overwrite  # re-migrate existing docs
 *   node scripts/migrate-from-wordpress.mjs --test       # 3 articles + 2 episodes only
 *   node scripts/migrate-from-wordpress.mjs --debug      # inspect raw WP API response
 *
 * Prerequisites:
 *   - SANITY_API_TOKEN in .env.local (Editor role)
 *   - ANTHROPIC_API_KEY in .env.local (for keyword generation; skip with --no-keywords)
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Load .env.local ────────────────────────────────────────────────────────────

const envPath = resolve(__dirname, '../.env.local')
try {
  const envFile = readFileSync(envPath, 'utf8')
  for (const rawLine of envFile.split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eqIdx = line.indexOf('=')
    if (eqIdx === -1) continue
    const key = line.slice(0, eqIdx).trim()
    const val = line.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '')
    if (key && val) process.env[key] = val
  }
  console.log(`📂  Loaded env from ${envPath}`)
} catch {
  console.warn(`⚠   Could not read ${envPath}`)
}

// ── Config ─────────────────────────────────────────────────────────────────────

const TEST_MODE     = process.argv.includes('--test')
const OVERWRITE_MODE = process.argv.includes('--overwrite')
const DEBUG_MODE    = process.argv.includes('--debug')
const NO_KEYWORDS   = process.argv.includes('--no-keywords')

const TEST_ARTICLE_LIMIT = 3
const TEST_EPISODE_LIMIT = 2
const ANTHROPIC_DELAY_MS = 1200

const WP_BASE = 'https://agile-operator.com/wp-json/wp/v2'
const PODCAST_CATEGORY_ID = 140
const SITE_NAME = 'Agile Operator'
const SITE_URL  = 'https://agile-operator.com'

// ── Sanity client ──────────────────────────────────────────────────────────────

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'r51dmz2x'
const DATASET    = process.env.NEXT_PUBLIC_SANITY_DATASET    || 'production'
const TOKEN      = process.env.SANITY_API_TOKEN
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

if (!TOKEN) {
  console.error('❌  SANITY_API_TOKEN is missing from .env.local')
  process.exit(1)
}

if (!NO_KEYWORDS && !ANTHROPIC_API_KEY) {
  console.warn('⚠   ANTHROPIC_API_KEY not set — running with --no-keywords mode')
  process.argv.push('--no-keywords')
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token: TOKEN,
  useCdn: false,
})

// ── Text helpers ───────────────────────────────────────────────────────────────

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g,   '&').replace(/&lt;/g,    '<').replace(/&gt;/g,   '>')
    .replace(/&quot;/g,  '"').replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“').replace(/&#8221;/g, '”')
    .replace(/&#8212;/g, '—').replace(/&#160;/g,  ' ')
    .replace(/&#38;/g,   '&').replace(/&#8230;/g, '…')
    .replace(/\s+/g, ' ')
    .trim()
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g,   '&').replace(/&lt;/g,    '<').replace(/&gt;/g,   '>')
    .replace(/&quot;/g,  '"').replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“').replace(/&#8221;/g, '”')
    .replace(/&#8212;/g, '—').replace(/&#160;/g,  ' ')
    .replace(/&#38;/g,   '&').replace(/&#8230;/g, '…')
}

/** Build a 320–560 char excerpt: prefer WP excerpt, fall back to body text */
function buildExcerpt(wpExcerpt, bodyHtml) {
  const MIN = 320
  const MAX = 560

  const fromExcerpt = stripHtml(wpExcerpt || '')
  if (fromExcerpt.length >= MIN && fromExcerpt.length <= MAX) return fromExcerpt

  // If excerpt exists but is too long, trim it
  if (fromExcerpt.length > MAX) return fromExcerpt.slice(0, MAX - 1) + '…'

  // Too short — extend using body text
  const bodyText = stripHtml(bodyHtml || '')
  const combined = fromExcerpt
    ? `${fromExcerpt} ${bodyText}`.replace(/\s+/g, ' ').trim()
    : bodyText

  if (combined.length <= MAX) {
    // Still pad if under MIN: add the full combined text regardless
    return combined.length >= MIN ? combined : combined
  }
  return combined.slice(0, MAX - 1) + '…'
}

// ── HTML → Portable Text ───────────────────────────────────────────────────────

function parseInlineMarks(html) {
  const spans = []
  const markDefs = []
  let remaining = html
  let linkKeyCounter = 0

  remaining = remaining.replace(/^<(?:p|li)[^>]*>([\s\S]*?)<\/(?:p|li)>$/i, '$1').trim()

  const pattern = /<(strong|b|em|i|a)([^>]*)>([\s\S]*?)<\/\1>|([^<]+)/gi
  let match

  while ((match = pattern.exec(remaining)) !== null) {
    const [, tag, attrs, inner, text] = match
    if (text !== undefined) {
      const decoded = decodeEntities(text)
      if (decoded.trim()) spans.push({ _type: 'span', text: decoded, marks: [] })
    } else if (tag) {
      const tagLower = tag.toLowerCase()
      const innerText = decodeEntities(stripHtml(inner))
      if (!innerText.trim()) continue

      if (tagLower === 'a') {
        const hrefMatch = attrs.match(/href=["']([^"']+)["']/)
        const href = hrefMatch?.[1]
        if (href) {
          const linkKey = `link${linkKeyCounter++}`
          markDefs.push({ _key: linkKey, _type: 'link', href })
          spans.push({ _type: 'span', text: innerText, marks: [linkKey] })
        } else {
          spans.push({ _type: 'span', text: innerText, marks: [] })
        }
      } else {
        const mark = tagLower === 'strong' || tagLower === 'b' ? 'strong'
          : tagLower === 'em'    || tagLower === 'i' ? 'em'
          : null
        spans.push({ _type: 'span', text: innerText, marks: mark ? [mark] : [] })
      }
    }
  }

  return {
    spans: spans.length
      ? spans
      : [{ _type: 'span', text: decodeEntities(stripHtml(html)), marks: [] }],
    markDefs,
  }
}

function htmlToPortableText(html) {
  if (!html) return []
  const blocks = []
  let key = 0

  const cleaned = html
    .replace(/<div[^>]*class="[^"]*wp-block[^"]*"[^>]*>/gi, '')
    .replace(/<\/div>/gi, '')
    .trim()

  const blockPattern = /<(h[1-6]|p|ul|ol|blockquote)[^>]*>([\s\S]*?)<\/\1>/gi
  let match

  while ((match = blockPattern.exec(cleaned)) !== null) {
    const [, tag, inner] = match
    const tagLower = tag.toLowerCase()

    if (tagLower === 'ul' || tagLower === 'ol') {
      const listStyle = tagLower === 'ol' ? 'number' : 'bullet'
      const liPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi
      let li
      while ((li = liPattern.exec(inner)) !== null) {
        const { spans, markDefs } = parseInlineMarks(li[1])
        if (spans.length) {
          blocks.push({
            _type: 'block', _key: `block${key++}`,
            style: 'normal', listItem: listStyle, level: 1,
            children: spans.map((s) => ({ ...s, _key: `span${key++}` })),
            markDefs,
          })
        }
      }
    } else if (/^h[1-6]$/.test(tagLower)) {
      const level = parseInt(tagLower[1])
      const style = level <= 2 ? 'h2' : level === 3 ? 'h3' : 'h4'
      const text = decodeEntities(stripHtml(inner))
      if (text.trim()) {
        blocks.push({
          _type: 'block', _key: `block${key++}`, style,
          children: [{ _type: 'span', _key: `span${key++}`, text: text.trim(), marks: [] }],
          markDefs: [],
        })
      }
    } else if (tagLower === 'blockquote') {
      const text = decodeEntities(stripHtml(inner)).trim()
      if (text) {
        blocks.push({
          _type: 'block', _key: `block${key++}`, style: 'blockquote',
          children: [{ _type: 'span', _key: `span${key++}`, text, marks: [] }],
          markDefs: [],
        })
      }
    } else if (tagLower === 'p') {
      const { spans, markDefs } = parseInlineMarks(inner)
      const text = spans.map(s => s.text).join('').trim()
      if (text) {
        blocks.push({
          _type: 'block', _key: `block${key++}`, style: 'normal',
          children: spans.map((s) => ({ ...s, _key: `span${key++}` })),
          markDefs,
        })
      }
    }
  }
  return blocks
}

// ── WordPress API helpers ──────────────────────────────────────────────────────

const FETCH_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; SanityMigration/1.0)',
  'Accept': 'application/json',
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: FETCH_HEADERS, signal: AbortSignal.timeout(30000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  return res.json()
}

async function debugFirstPost() {
  const posts = await fetchJson(`${WP_BASE}/posts?per_page=1&status=publish`)
  if (!posts.length) { console.log('No posts found'); return }
  const post = posts[0]
  console.log('\n=== RAW FIELDS ON FIRST POST ===')
  console.log('Top-level keys:', Object.keys(post).join(', '))
  console.log('\nyoast_head_json:', JSON.stringify(post.yoast_head_json ?? '(not present)', null, 2).slice(0, 1200))
  console.log('\nmeta field:', JSON.stringify(post.meta ?? '(not present)', null, 2).slice(0, 600))
  console.log('=================================\n')
}

async function fetchAllPosts() {
  let page = 1
  let all = []
  // Include yoast_head_json for existing SEO data
  const fields = 'id,slug,title,excerpt,date,categories,featured_media,content,jetpack_featured_media_url,meta,yoast_head_json'
  while (true) {
    const url = `${WP_BASE}/posts?per_page=100&page=${page}&status=publish&_fields=${fields}`
    const posts = await fetchJson(url)
    if (!posts.length) break
    all = all.concat(posts)
    console.log(`  Fetched page ${page} (${posts.length} posts, ${all.length} total)`)
    if (posts.length < 100) break
    page++
  }
  return all
}

async function fetchCategories() {
  return fetchJson(`${WP_BASE}/categories?per_page=100&_fields=id,name,slug`)
}

// ── Sanity helpers ─────────────────────────────────────────────────────────────

async function getOrCreateCategory(wpCat) {
  const existing = await client.fetch(
    `*[_type == "category" && slug.current == $slug][0]._id`,
    { slug: wpCat.slug }
  )
  if (existing) return existing
  const doc = await client.create({
    _type: 'category',
    title: wpCat.name,
    slug: { _type: 'slug', current: wpCat.slug },
  })
  console.log(`  ✓ Created category: ${wpCat.name}`)
  return doc._id
}

async function uploadImageFromUrl(imageUrl) {
  if (!imageUrl) return null
  try {
    const res = await fetch(imageUrl, { headers: FETCH_HEADERS, signal: AbortSignal.timeout(30000) })
    if (!res.ok) return null
    const buffer = await res.arrayBuffer()
    const ext  = imageUrl.split('.').pop().split('?')[0].toLowerCase()
    const mime = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' }[ext] || 'image/jpeg'
    const asset = await client.assets.upload('image', Buffer.from(buffer), { contentType: mime })
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
  } catch {
    return null
  }
}

async function getExistingDocId(slug) {
  return client.fetch(
    `*[_type == "playbookContent" && slug.current == $slug][0]._id`,
    { slug }
  )
}

// ── Anthropic keyword generation ───────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function truncate(str, max) {
  if (!str || str.length <= max) return str ?? ''
  return str.slice(0, str.lastIndexOf(' ', max)).replace(/[,;:]$/, '') + '…'
}

async function generateKeywords(doc) {
  if (NO_KEYWORDS || !ANTHROPIC_API_KEY) return null

  const contentType = doc.contentType === 'episode' ? 'podcast episode' : 'article'
  const bodyText = doc.body
    ? doc.body.filter(b => b._type === 'block')
        .flatMap(b => (b.children || []).map(c => c.text || ''))
        .join(' ').slice(0, 1500)
    : ''
  const guestLine = doc.guestName
    ? `Guest: ${doc.guestName}${doc.guestTitle ? `, ${doc.guestTitle}` : ''}`
    : ''

  const prompt = `You are an SEO strategist for "${SITE_NAME}", a strategic growth advisory firm for technology CEOs and B2B SaaS operators.

Analyze this ${contentType} and generate SEO metadata for technology CEOs, founders, and operators at growth-stage B2B SaaS companies ($5M–$50M ARR).

CONTENT:
Title: ${doc.title}
${guestLine}
Excerpt: ${doc.excerpt ?? ''}
Body preview: ${bodyText}

Generate ONLY this JSON object (no other text):
{
  "primaryKeyword": "one specific 2–5 word phrase a CEO would search",
  "keywords": ["primaryKeyword", "keyword2", "keyword3", "keyword4"],
  "seoTitle": "50–60 char title with primary keyword | ${SITE_NAME}",
  "seoDescription": "140–155 char meta description addressing a real pain point"
}

Rules:
- Keywords must be specific (e.g. "SaaS executive transition" not "leadership")
- seoTitle must be under 65 characters
- seoDescription must be under 160 characters`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Anthropic ${response.status}: ${err.slice(0, 200)}`)
  }

  const data = await response.json()
  const text = data.content?.[0]?.text ?? ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error(`No JSON in response`)

  const result = JSON.parse(jsonMatch[0])
  result.seoTitle       = truncate(result.seoTitle, 59)
  result.seoDescription = truncate(result.seoDescription, 158)
  if (!Array.isArray(result.keywords)) result.keywords = [result.primaryKeyword]

  return result
}

// ── Main migration ─────────────────────────────────────────────────────────────

async function migrate() {
  if (DEBUG_MODE) {
    console.log('🔍  DEBUG MODE — inspecting WP API response...\n')
    await debugFirstPost()
    process.exit(0)
  }

  console.log(`\n🚀  WordPress → Sanity migration`)
  console.log(`    Project: ${PROJECT_ID} / ${DATASET}`)
  console.log(`    Keywords: ${NO_KEYWORDS ? 'disabled (--no-keywords)' : 'enabled (Anthropic API)'}`)
  console.log()

  // 1. Fetch WP data
  console.log('📥  Fetching WordPress categories...')
  const wpCategories = await fetchCategories()
  console.log(`    Found ${wpCategories.length} categories\n`)

  console.log('📥  Fetching WordPress posts...')
  const wpPosts = await fetchAllPosts()
  console.log(`    Found ${wpPosts.length} posts total\n`)

  // 2. Sync categories
  console.log('📁  Syncing categories to Sanity...')
  const categoryMap = {}
  const keepSlugs = ['ceo', 'cmo', 'cco', 'cfo', 'cto', 'cro', 'leadership', 'go-to-market', 'demand-generation', 'playbook']
  for (const cat of wpCategories) {
    if (keepSlugs.includes(cat.slug)) {
      categoryMap[cat.id] = await getOrCreateCategory(cat)
    }
  }
  console.log()

  // 3. Migrate posts
  if (TEST_MODE)    console.log(`🧪  TEST MODE — ${TEST_ARTICLE_LIMIT} articles + ${TEST_EPISODE_LIMIT} episodes only\n`)
  if (OVERWRITE_MODE) console.log(`♻️   OVERWRITE MODE — existing docs will be updated\n`)

  console.log('📝  Migrating posts...\n')
  let created = 0, skipped = 0, errors = 0, articleCount = 0, episodeCount = 0

  for (const post of wpPosts) {
    if (TEST_MODE) {
      const isEp = post.categories.includes(PODCAST_CATEGORY_ID)
      if (isEp && episodeCount >= TEST_EPISODE_LIMIT) continue
      if (!isEp && articleCount >= TEST_ARTICLE_LIMIT) continue
    }

    try {
      const slug      = post.slug
      const existingId = await getExistingDocId(slug)
      if (existingId && !OVERWRITE_MODE) {
        console.log(`  ↷  Skipping (exists): ${post.title.rendered}`)
        skipped++
        continue
      }

      const isEpisode  = post.categories.includes(PODCAST_CATEGORY_ID)
      const contentType = isEpisode ? 'episode' : 'article'
      const postTitle  = decodeEntities(post.title.rendered)

      // Categories
      const skipCatIds = [1, PODCAST_CATEGORY_ID]
      const sanityCategories = post.categories
        .filter(id => !skipCatIds.includes(id) && categoryMap[id])
        .map(id => ({ _type: 'reference', _ref: categoryMap[id], _key: `cat-${id}` }))

      // Featured image
      const featuredImage = await uploadImageFromUrl(post.jetpack_featured_media_url)

      // Excerpt: 320–560 chars
      const excerpt = buildExcerpt(post.excerpt?.rendered, post.content?.rendered)

      // Body
      const body = htmlToPortableText(post.content?.rendered || '')

      // Podcast meta
      const meta           = post.meta || {}
      const podcastUrl     = meta.podcast_url || null
      const podcastDuration = meta.podcast_duration || null

      // ── SEO: pull from Yoast first, fall back to generated ─────────────────
      const yoast = post.yoast_head_json || {}

      // Yoast keyword fields
      const wpKeywords    = yoast.schema?.['@graph']
        ? null
        : yoast.twitter_misc?.['Written by'] // not useful — skip
      const yoastFocusKw  = yoast.schema?.articleBody  // Yoast doesn't expose focus kw via REST

      // Yoast SEO title/description (these ARE available)
      const yoastSeoTitle = yoast.og_title || yoast.title || null
      const yoastSeoDesc  = yoast.og_description || yoast.description || null
      const yoastOgImage  = yoast.og_image?.[0]?.url || null
      const yoastCanonical = yoast.canonical || `${SITE_URL}/playbooks/${slug}`

      // Build base SEO from Yoast data
      let seoTitle       = yoastSeoTitle ? truncate(yoastSeoTitle, 59) : truncate(`${postTitle} | ${SITE_NAME}`, 59)
      let seoDescription = yoastSeoDesc  ? truncate(yoastSeoDesc, 158) : truncate(excerpt, 158)
      let keywords       = null // will fill from AI or leave null

      // ── AI keyword generation ───────────────────────────────────────────────
      process.stdout.write(`  [${contentType}] "${postTitle}" … `)

      try {
        const aiSeo = await generateKeywords({
          title: postTitle,
          contentType,
          excerpt,
          body,
          guestName: meta.guest_name || null,
          guestTitle: meta.guest_title || null,
        })

        if (aiSeo) {
          keywords       = aiSeo.keywords
          // AI title/desc only wins if Yoast data was absent
          if (!yoastSeoTitle) seoTitle       = aiSeo.seoTitle
          if (!yoastSeoDesc)  seoDescription = aiSeo.seoDescription
          process.stdout.write(`✓ keywords\n`)
          await sleep(ANTHROPIC_DELAY_MS)
        } else {
          process.stdout.write(`(no-keywords)\n`)
        }
      } catch (kwErr) {
        process.stdout.write(`⚠ keyword gen failed: ${kwErr.message}\n`)
      }

      // Build Sanity document
      const doc = {
        _type: 'playbookContent',
        contentType,
        title: postTitle,
        slug:  { _type: 'slug', current: slug },
        publishedAt: post.date,
        excerpt,
        ...(sanityCategories.length && { categories: sanityCategories }),
        ...(featuredImage && { featuredImage }),
        ...(contentType === 'article' && body.length && { body }),
        ...(contentType === 'episode' && body.length && { showNotes: body }),
        ...(contentType === 'episode' && podcastUrl     && { podcastUrl }),
        ...(contentType === 'episode' && podcastDuration && { podcastDuration }),
        seo: {
          title: seoTitle,
          description: seoDescription,
          canonicalUrl: yoastCanonical,
          ...(keywords && { keywords }),
          // openGraph.image must be a Sanity image reference — skip for now,
          // generate-seo.mjs --write --all will set it from featuredImage
          openGraph: {
            title: seoTitle,
            description: seoDescription,
          },
        },
      }

      if (existingId && OVERWRITE_MODE) {
        await client.createOrReplace({ ...doc, _id: existingId })
      } else {
        await client.create(doc)
      }

      created++
      if (contentType === 'episode') episodeCount++
      else articleCount++

      // Polite rate limit for Sanity
      await sleep(150)

    } catch (e) {
      console.error(`  ✗  Error migrating "${post.title?.rendered}": ${e.message}`)
      errors++
    }
  }

  console.log('\n' + '─'.repeat(50))
  console.log(`✅  Migration complete`)
  console.log(`    Created:  ${created}`)
  console.log(`    Skipped:  ${skipped} (already existed)`)
  console.log(`    Errors:   ${errors}`)
  if (!NO_KEYWORDS) {
    console.log(`\n💡  AI keywords generated inline. Run generate-seo.mjs --write`)
    console.log(`    on any remaining docs that lack seoTitle/seoDescription.`)
  }
  console.log(`\n📋  Next: add 301 redirects in next.config.ts for old WP URLs.\n`)
}

migrate().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
