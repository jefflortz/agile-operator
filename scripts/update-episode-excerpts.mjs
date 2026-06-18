/**
 * Update podcast episode excerpts to 450–560 characters
 *
 * Usage:
 *   node scripts/update-episode-excerpts.mjs            # dry run (preview only)
 *   node scripts/update-episode-excerpts.mjs --write    # actually update Sanity
 *   node scripts/update-episode-excerpts.mjs --overwrite --write  # redo even valid ones
 *   node scripts/update-episode-excerpts.mjs --slug home-care-software --write  # one episode
 *
 * Prerequisites:
 *   - SANITY_API_TOKEN in .env.local (Editor role)
 *   - ANTHROPIC_API_KEY in .env.local
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

// ── Args ──────────────────────────────────────────────────────────────────────

const WRITE     = process.argv.includes('--write')
const OVERWRITE = process.argv.includes('--overwrite')
const slugArg   = (() => {
  const i = process.argv.indexOf('--slug')
  return i !== -1 ? process.argv[i + 1] : null
})()

const MIN_CHARS = 450
const MAX_CHARS = 560
const DELAY_MS  = 1200   // stay well under Anthropic rate limits

// ── Clients ───────────────────────────────────────────────────────────────────

const TOKEN           = process.env.SANITY_API_TOKEN
const ANTHROPIC_KEY   = process.env.ANTHROPIC_API_KEY
const PROJECT_ID      = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'r51dmz2x'
const DATASET         = process.env.NEXT_PUBLIC_SANITY_DATASET    || 'production'

if (!TOKEN)         { console.error('❌  SANITY_API_TOKEN missing'); process.exit(1) }
if (!ANTHROPIC_KEY) { console.error('❌  ANTHROPIC_API_KEY missing'); process.exit(1) }

const sanity = createClient({
  projectId: PROJECT_ID,
  dataset:   DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: TOKEN,
})

// ── Helpers ───────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Extract plain text from a PortableText block array */
function blocksToText(blocks) {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .filter((b) => b._type === 'block')
    .map((b) =>
      (b.children || [])
        .map((c) => c.text ?? '')
        .join('')
    )
    .filter(Boolean)
    .join('\n\n')
    .trim()
}

/** Call Claude Haiku to write a tight excerpt */
async function generateExcerpt(episode) {
  const bodyText = blocksToText(episode.showNotes || episode.body || [])
  const guestLine = episode.guestName
    ? `Guest: ${episode.guestName}${episode.guestTitle ? `, ${episode.guestTitle}` : ''}`
    : ''

  const keywordsLine = episode.keywords?.length
    ? `SEO keywords (weave the primary one naturally into the excerpt): ${episode.keywords.join(', ')}`
    : ''

  const prompt = `Write a podcast episode excerpt for the Agile Operator website.

Episode title: ${episode.title}
${guestLine}
${keywordsLine}
${bodyText ? `\nContent summary:\n${bodyText.slice(0, 3000)}` : ''}

Requirements:
- Exactly between ${MIN_CHARS} and ${MAX_CHARS} characters (count carefully)
- Written in third person, present tense
- No bullet points, no headers — flowing prose only
- Opens with the guest's name or a strong hook about the episode topic
- Covers the core insight or theme of the episode
- Ends with a complete sentence (no ellipsis)
- Tone: direct, credible, operator-focused (not hype-y)
- Do NOT start with "In this episode" or "Jeff Lortz"

Return ONLY the excerpt text, nothing else.`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Anthropic API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const text = data.content?.[0]?.text?.trim() ?? ''
  return text
}

/** Trim or pad an excerpt to fit 450–560 characters at a sentence boundary */
function enforceLength(text) {
  if (text.length >= MIN_CHARS && text.length <= MAX_CHARS) return text

  // Too long — truncate at last sentence boundary within MAX_CHARS
  if (text.length > MAX_CHARS) {
    const trimmed = text.slice(0, MAX_CHARS)
    const lastPeriod = trimmed.lastIndexOf('.')
    if (lastPeriod > MIN_CHARS) return trimmed.slice(0, lastPeriod + 1)
    return trimmed.trimEnd()
  }

  // Too short — return as-is; we'll flag it for manual review
  return text
}

// ── Main ──────────────────────────────────────────────────────────────────────

const PUBLISHED = `!(_id in path("drafts.**"))`
const slugFilter = slugArg ? ` && slug.current == "${slugArg}"` : ''

const episodes = await sanity.fetch(
  `*[_type == "playbookContent" && ${PUBLISHED} && contentType == "episode"${slugFilter}]
   | order(publishedAt desc) {
     _id,
     title,
     "slug": slug.current,
     excerpt,
     guestName,
     guestTitle,
     showNotes,
     body,
     "keywords": seo.keywords,
   }`
)

console.log(`\n📋  Found ${episodes.length} episode(s)${slugArg ? ` matching slug "${slugArg}"` : ''}`)
console.log(WRITE ? '✏️   Mode: WRITE (will update Sanity)' : '👁️   Mode: DRY RUN (use --write to apply)')
console.log(OVERWRITE ? '🔄  --overwrite: will redo all excerpts' : '⏭️   Skipping episodes already in range\n')

let updated = 0, skipped = 0, failed = 0

for (const ep of episodes) {
  const currentLen = ep.excerpt?.length ?? 0
  const inRange = currentLen >= MIN_CHARS && currentLen <= MAX_CHARS

  if (inRange && !OVERWRITE) {
    console.log(`⏭️   SKIP  "${ep.title}" (${currentLen} chars — already in range)`)
    skipped++
    continue
  }

  process.stdout.write(`✨  GEN   "${ep.title}" ... `)

  try {
    let excerpt = await generateExcerpt(ep)
    excerpt = enforceLength(excerpt)
    const len = excerpt.length

    const status = len >= MIN_CHARS && len <= MAX_CHARS ? '✓' : `⚠ ${len} chars`
    process.stdout.write(`${len} chars ${status}\n`)

    if (WRITE) {
      await sanity.patch(ep._id).set({ excerpt }).commit()
      console.log(`        → Saved to Sanity`)
      updated++
    } else {
      console.log(`        → Preview: "${excerpt.slice(0, 80)}..."`)
      updated++
    }

    await sleep(DELAY_MS)
  } catch (err) {
    console.error(`\n❌  FAIL  "${ep.title}": ${err.message}`)
    failed++
    await sleep(DELAY_MS)
  }
}

console.log(`\n✅  Done — ${updated} ${WRITE ? 'updated' : 'previewed'}, ${skipped} skipped, ${failed} failed`)
if (!WRITE && updated > 0) {
  console.log(`\n   Run with --write to apply changes to Sanity.`)
}
