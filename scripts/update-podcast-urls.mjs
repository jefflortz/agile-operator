/**
 * update-podcast-urls.mjs
 *
 * Fetches all podcast episodes from WordPress, extracts Spotify and YouTube
 * URLs from the post content/HTML, then patches the matching Sanity documents.
 *
 * Usage:
 *   node scripts/update-podcast-urls.mjs              # dry run — shows what would change
 *   node scripts/update-podcast-urls.mjs --write      # apply updates to Sanity
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
} catch {
  console.warn('⚠   Could not read .env.local')
}

// ── Config ─────────────────────────────────────────────────────────────────────
const WRITE_MODE   = process.argv.includes('--write')

const WP_BASE             = 'https://agile-operator.com/wp-json/wp/v2'
const PODCAST_CATEGORY_ID = 140

// Regex patterns to extract URLs from post HTML content
const SPOTIFY_RE = /https:\/\/open\.spotify\.com\/episode\/[A-Za-z0-9]+[^\s"'<]*/g
const YOUTUBE_RE = /https:\/\/(?:www\.youtube\.com\/watch\?v=|youtu\.be\/)[A-Za-z0-9_-]+[^\s"'<]*/g

// ── Sanity client ──────────────────────────────────────────────────────────────
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'r51dmz2x',
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET    || 'production',
  apiVersion: '2024-01-01',
  token:      process.env.SANITY_API_TOKEN,
  useCdn:     false,
})

// ── WordPress helpers ──────────────────────────────────────────────────────────
async function fetchJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) })
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`)
  return res.json()
}

async function fetchAllEpisodes() {
  const fields = 'id,slug,title,content'
  const perPage = 100
  let page = 1
  const posts = []

  while (true) {
    const batch = await fetchJson(
      `${WP_BASE}/posts?per_page=${perPage}&page=${page}&status=publish&categories=${PODCAST_CATEGORY_ID}&_fields=${fields}`
    )
    if (!batch.length) break
    posts.push(...batch)
    if (batch.length < perPage) break
    page++
  }

  return posts
}

function extractFirst(html, regex) {
  const matches = html?.match(regex)
  return matches?.[0] ?? null
}

// ── Main ───────────────────────────────────────────────────────────────────────
console.log('\n📻  Podcast URL updater')
console.log(`    Mode: ${WRITE_MODE ? 'WRITE' : 'DRY RUN'}\n`)

const episodes = await fetchAllEpisodes()
console.log(`📥  Found ${episodes.length} episode posts in WordPress\n`)

// Fetch matching Sanity docs
const sanityEpisodes = await client.fetch(
  `*[_type == "playbookContent" && contentType == "episode"]{ _id, slug, spotifyUrl, youtubeUrl }`
)
const sanityBySlug = Object.fromEntries(
  sanityEpisodes.map(d => [
    typeof d.slug === 'string' ? d.slug : d.slug?.current,
    d,
  ])
)

let updated = 0, skipped = 0, missing = 0

for (const ep of episodes) {
  const slug = ep.slug
  const sanityDoc = sanityBySlug[slug]

  if (!sanityDoc) {
    console.log(`⚠   No Sanity doc for slug: ${slug}`)
    missing++
    continue
  }

  const html = ep.content?.rendered ?? ''
  const spotifyUrl = extractFirst(html, SPOTIFY_RE)
  const youtubeUrl = extractFirst(html, YOUTUBE_RE)

  const patch = {}
  if (spotifyUrl && spotifyUrl !== sanityDoc.spotifyUrl) patch.spotifyUrl = spotifyUrl
  if (youtubeUrl && youtubeUrl !== sanityDoc.youtubeUrl) patch.youtubeUrl = youtubeUrl

  if (!Object.keys(patch).length) {
    console.log(`  ✓  ${slug} — no changes`)
    skipped++
    continue
  }

  console.log(`  ${WRITE_MODE ? '✏️ ' : '→ '} ${slug}`)
  if (patch.spotifyUrl) console.log(`       spotify: ${patch.spotifyUrl}`)
  if (patch.youtubeUrl) console.log(`       youtube: ${patch.youtubeUrl}`)

  if (WRITE_MODE) {
    await client.patch(sanityDoc._id).set(patch).commit()
  }

  updated++
}

console.log(`\n${WRITE_MODE ? '✅' : '🔍'} Done`)
console.log(`    Updated : ${updated}`)
console.log(`    Skipped : ${skipped}`)
console.log(`    Missing : ${missing}`)

if (!WRITE_MODE && updated > 0) {
  console.log('\n💡  Run with --write to apply these changes.\n')
}
if (updated === 0) {
  console.log('\n💡  No Spotify or YouTube URLs found in post content.')
  console.log('    They may need to be entered manually in Sanity Studio.\n')
}
