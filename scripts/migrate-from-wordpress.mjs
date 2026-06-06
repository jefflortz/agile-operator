/**
 * WordPress → Sanity Migration Script
 *
 * Usage:
 *   node scripts/migrate-from-wordpress.mjs
 *
 * Prerequisites:
 *   - SANITY_API_TOKEN in .env.local must have Editor or Contributor permissions
 *     (go to sanity.io/manage → API → Tokens → create token with Editor role)
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env.local
 *
 * What this does:
 *   1. Fetches all published posts from agile-operator.com WP REST API
 *   2. Creates Sanity Category documents for each WP category
 *   3. Downloads featured images and uploads them to Sanity
 *   4. Converts HTML body content to Sanity Portable Text
 *   5. Creates PlaybookContent documents (contentType: article or episode)
 *
 * WP category 140 (Podcast) → contentType: "episode"
 * All other categories → contentType: "article"
 *
 * Safe to re-run — uses WP slug as idempotency key, skips existing documents.
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load env vars from .env.local
function loadEnv() {
  const envPath = resolve(__dirname, '../.env.local')
  const lines = readFileSync(envPath, 'utf8').split('\n')
  const env = {}
  for (const line of lines) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) env[key.trim()] = rest.join('=').trim()
  }
  return env
}

const env = loadEnv()

const PROJECT_ID = env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'r51dmz2x'
const DATASET = env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = env.SANITY_API_TOKEN

if (!TOKEN) {
  console.error('❌ SANITY_API_TOKEN is missing from .env.local')
  console.error('   Create an Editor token at sanity.io/manage → API → Tokens')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  token: TOKEN,
  useCdn: false,
})

const WP_BASE = 'https://agile-operator.com/wp-json/wp/v2'
const PODCAST_CATEGORY_ID = 140

// Run with --test for a limited 3 articles + 2 episodes trial
// Run with --overwrite to re-migrate existing documents (updates in place)
const TEST_MODE = process.argv.includes('--test')
const OVERWRITE_MODE = process.argv.includes('--overwrite')
const DEBUG_MODE = process.argv.includes('--debug')
const TEST_ARTICLE_LIMIT = 3
const TEST_EPISODE_LIMIT = 2

// ─── HTML → Portable Text converter ──────────────────────────────────────────

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#8217;/g, '\u2019').replace(/&#8220;/g, '\u201c').replace(/&#8221;/g, '\u201d').replace(/&#8212;/g, '\u2014').replace(/&#160;/g, ' ').trim()
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#8217;/g, '\u2019')
    .replace(/&#8220;/g, '\u201c').replace(/&#8221;/g, '\u201d')
    .replace(/&#8212;/g, '\u2014').replace(/&#160;/g, ' ')
    .replace(/&#38;/g, '&').replace(/&#8230;/g, '\u2026')
}

function parseInlineMarks(html) {
  // Returns { spans, markDefs } — markDefs holds link definitions
  const spans = []
  const markDefs = []
  let remaining = html
  let linkKeyCounter = 0

  // Strip outer element wrapper
  remaining = remaining.replace(/^<(?:p|li)[^>]*>([\s\S]*?)<\/(?:p|li)>$/i, '$1').trim()

  // Inline parser — handles bold, italic, links
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
        // Extract href
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
          : tagLower === 'em' || tagLower === 'i' ? 'em'
          : null
        spans.push({ _type: 'span', text: innerText, marks: mark ? [mark] : [] })
      }
    }
  }

  return {
    spans: spans.length ? spans : [{ _type: 'span', text: decodeEntities(stripHtml(html)), marks: [] }],
    markDefs,
  }
}

function htmlToPortableText(html) {
  if (!html) return []

  const blocks = []
  let key = 0

  // Remove WordPress-specific wrapper divs and classes
  const cleaned = html
    .replace(/<div[^>]*class="[^"]*wp-block[^"]*"[^>]*>/gi, '')
    .replace(/<\/div>/gi, '')
    .trim()

  // Split into block-level elements
  const blockPattern = /<(h[1-6]|p|ul|ol|blockquote|figure)[^>]*>([\s\S]*?)<\/\1>/gi
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
            _type: 'block',
            _key: `block${key++}`,
            style: 'normal',
            listItem: listStyle,
            level: 1,
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
          _type: 'block',
          _key: `block${key++}`,
          style,
          children: [{ _type: 'span', _key: `span${key++}`, text: text.trim(), marks: [] }],
          markDefs: [],
        })
      }
    } else if (tagLower === 'blockquote') {
      const text = decodeEntities(stripHtml(inner)).trim()
      if (text) {
        blocks.push({
          _type: 'block',
          _key: `block${key++}`,
          style: 'blockquote',
          children: [{ _type: 'span', _key: `span${key++}`, text, marks: [] }],
          markDefs: [],
        })
      }
    } else if (tagLower === 'p') {
      const { spans, markDefs } = parseInlineMarks(inner)
      const text = spans.map(s => s.text).join('').trim()
      if (text) {
        blocks.push({
          _type: 'block',
          _key: `block${key++}`,
          style: 'normal',
          children: spans.map((s) => ({ ...s, _key: `span${key++}` })),
          markDefs,
        })
      }
    }
  }

  return blocks
}

// ─── WordPress API helpers ────────────────────────────────────────────────────

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
  // Fetch one post WITHOUT _fields filter to see everything WP exposes
  const url = `${WP_BASE}/posts?per_page=1&status=publish`
  const posts = await fetchJson(url)
  if (!posts.length) { console.log('No posts found'); return }
  const post = posts[0]
  console.log('\n=== RAW FIELDS ON FIRST POST ===')
  console.log('Top-level keys:', Object.keys(post).join(', '))
  console.log('\nmeta field:', JSON.stringify(post.meta ?? '(not present)', null, 2).slice(0, 1200))
  const seoKeys = Object.keys(post).filter(k => k.includes('yoast') || k.includes('seo') || k.includes('rank') || k.includes('podcast'))
  console.log('\nOther interesting keys:', seoKeys.join(', ') || 'none')
  console.log('\npodcasting_podcasts:', JSON.stringify(post.podcasting_podcasts ?? '(not present)', null, 2).slice(0, 400))
  console.log('=================================\n')
}

async function fetchAllPosts() {
  let page = 1
  let all = []
  while (true) {
    const url = `${WP_BASE}/posts?per_page=100&page=${page}&status=publish&_fields=id,slug,title,excerpt,date,categories,featured_media,content,jetpack_featured_media_url,meta`
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

// ─── Sanity helpers ───────────────────────────────────────────────────────────

async function getOrCreateCategory(wpCat) {
  // Check if exists
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
    const ext = imageUrl.split('.').pop().split('?')[0].toLowerCase()
    const mimeMap = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' }
    const mime = mimeMap[ext] || 'image/jpeg'
    const asset = await client.assets.upload('image', Buffer.from(buffer), { contentType: mime })
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
  } catch (e) {
    console.warn(`  ⚠ Could not upload image: ${imageUrl}`)
    return null
  }
}

async function getExistingDocId(slug) {
  return client.fetch(
    `*[_type == "playbookContent" && slug.current == $slug][0]._id`,
    { slug }
  )
}

// ─── Main migration ───────────────────────────────────────────────────────────

async function migrate() {
  if (DEBUG_MODE) {
    console.log('🔍 DEBUG MODE — inspecting WP API response...\n')
    await debugFirstPost()
    process.exit(0)
  }

  console.log('🚀 Starting WordPress → Sanity migration\n')
  console.log(`   Project: ${PROJECT_ID} / ${DATASET}\n`)

  // 1. Fetch WP data
  console.log('📥 Fetching WordPress categories...')
  const wpCategories = await fetchCategories()
  console.log(`   Found ${wpCategories.length} categories\n`)

  console.log('📥 Fetching WordPress posts...')
  const wpPosts = await fetchAllPosts()
  console.log(`   Found ${wpPosts.length} posts total\n`)

  // 2. Create categories in Sanity
  console.log('📁 Creating categories in Sanity...')
  const categoryMap = {} // wpId → sanityId
  // Only migrate the categories we care about
  const keepCategories = ['ceo', 'cmo', 'cco', 'cfo', 'cto', 'cro', 'leadership', 'go-to-market', 'demand-generation', 'playbook']
  for (const cat of wpCategories) {
    if (keepCategories.includes(cat.slug)) {
      categoryMap[cat.id] = await getOrCreateCategory(cat)
    }
  }
  console.log()

  // 3. Migrate posts
  if (TEST_MODE) {
    console.log(`🧪 TEST MODE — migrating ${TEST_ARTICLE_LIMIT} articles + ${TEST_EPISODE_LIMIT} episodes only\n`)
  }
  if (OVERWRITE_MODE) {
    console.log(`♻️  OVERWRITE MODE — existing documents will be updated in place\n`)
  }
  console.log('📝 Migrating posts...\n')
  let created = 0
  let skipped = 0
  let errors = 0
  let articleCount = 0
  let episodeCount = 0

  for (const post of wpPosts) {
    // In test mode, stop once we have enough of each type
    if (TEST_MODE) {
      const isEpisodePost = post.categories.includes(PODCAST_CATEGORY_ID)
      if (isEpisodePost && episodeCount >= TEST_EPISODE_LIMIT) continue
      if (!isEpisodePost && articleCount >= TEST_ARTICLE_LIMIT) continue
    }
    try {
      const slug = post.slug

      // Check if already migrated
      const existingId = await getExistingDocId(slug)
      if (existingId && !OVERWRITE_MODE) {
        console.log(`  ↷ Skipping (exists): ${post.title.rendered}`)
        skipped++
        continue
      }

      // Determine content type
      const isEpisode = post.categories.includes(PODCAST_CATEGORY_ID)
      const contentType = isEpisode ? 'episode' : 'article'

      // Map categories (skip "All" and "Podcast" — those are meta-categories)
      const skipCatIds = [1, PODCAST_CATEGORY_ID]
      const sanityCategories = post.categories
        .filter(id => !skipCatIds.includes(id) && categoryMap[id])
        .map(id => ({ _type: 'reference', _ref: categoryMap[id], _key: `cat-${id}` }))

      // Upload featured image
      const featuredImage = await uploadImageFromUrl(post.jetpack_featured_media_url)

      // Strip HTML from excerpt
      const excerpt = decodeEntities(stripHtml(post.excerpt?.rendered || '')).slice(0, 150)

      // Convert body HTML to Portable Text
      const body = htmlToPortableText(post.content?.rendered || '')

      // SEO — default from post fields (no SEO plugin data in WP REST API)
      const postTitle = decodeEntities(post.title.rendered)
      const seo = {
        _type: 'seoFields',
        title: `${postTitle} | Agile Operator`,
        ...(excerpt && { description: excerpt }),
      }

      // Podcast meta fields (for episodes)
      const meta = post.meta || {}
      const podcastUrl = meta.podcast_url || null
      const podcastDuration = meta.podcast_duration || null

      // Build document
      const doc = {
        _type: 'playbookContent',
        contentType,
        title: postTitle,
        slug: { _type: 'slug', current: slug },
        publishedAt: post.date,
        excerpt,
        ...(sanityCategories.length && { categories: sanityCategories }),
        ...(featuredImage && { featuredImage }),
        ...(contentType === 'article' && body.length && { body }),
        ...(contentType === 'episode' && body.length && { showNotes: body }),
        // Podcast audio (episodes only)
        ...(contentType === 'episode' && podcastUrl && { podcastUrl }),
        ...(contentType === 'episode' && podcastDuration && { podcastDuration }),
        // SEO defaults (refine in Sanity Studio)
        seo,
      }

      if (existingId && OVERWRITE_MODE) {
        await client.createOrReplace({ ...doc, _id: existingId })
        console.log(`  ↺ [${contentType}] Updated: ${doc.title}`)
      } else {
        await client.create(doc)
        console.log(`  ✓ [${contentType}] Created: ${doc.title}`)
      }
      created++
      if (contentType === 'episode') episodeCount++
      else articleCount++

      // Polite rate limiting
      await new Promise(r => setTimeout(r, 100))

    } catch (e) {
      console.error(`  ✗ Error migrating "${post.title?.rendered}": ${e.message}`)
      errors++
    }
  }

  console.log('\n─────────────────────────────────')
  console.log(`✅ Migration complete`)
  console.log(`   Created:  ${created}`)
  console.log(`   Skipped:  ${skipped} (already existed)`)
  console.log(`   Errors:   ${errors}`)
  console.log('\n⚠️  Note: Podcast episodes were migrated with show notes but without')
  console.log('   YouTube/Spotify URLs. Update those manually in Sanity Studio.')
  console.log('\n📋 Next: Add 301 redirects in next.config.ts for old WordPress URLs.')
}

migrate().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
