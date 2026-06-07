/**
 * generate-excerpts.mjs
 *
 * Uses the Anthropic API to rewrite every playbookContent excerpt to
 * 150–200 characters — the ideal length for consistent card UIs.
 *
 * Usage:
 *   node scripts/generate-excerpts.mjs              # dry run — review in console
 *   node scripts/generate-excerpts.mjs --write      # apply to Sanity
 *   node scripts/generate-excerpts.mjs --all        # regenerate even if excerpt looks good
 *   node scripts/generate-excerpts.mjs --write --all
 */

import { createClient } from '@sanity/client'
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Config ─────────────────────────────────────────────────────────────────

const DRY_RUN  = !process.argv.includes('--write')
const ALL_MODE = process.argv.includes('--all')
const MIN_CHARS = 150
const MAX_CHARS = 200
const DELAY_MS  = 800

// ── Load .env.local ─────────────────────────────────────────────────────────

const envPath = resolve(__dirname, '..', '.env.local')
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
  console.warn(`⚠   Could not read ${envPath} — relying on existing environment variables`)
}

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
if (!ANTHROPIC_API_KEY) {
  console.error('\n❌  ANTHROPIC_API_KEY is not set in .env.local\n')
  process.exit(1)
}

// ── Sanity client ──────────────────────────────────────────────────────────

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'r51dmz2x',
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// ── Helpers ────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function bodyToText(blocks) {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .filter((b) => b._type === 'block')
    .flatMap((b) => (b.children ?? []).map((c) => c.text ?? ''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1200)
}

function needsRewrite(doc) {
  if (ALL_MODE) return true
  const len = (doc.excerpt ?? '').length
  return len < MIN_CHARS || len > MAX_CHARS
}

// ── Claude API ─────────────────────────────────────────────────────────────

async function generateExcerpt(doc) {
  const contentType = doc.contentType === 'episode' ? 'podcast episode' : 'article'
  const bodyText    = bodyToText(doc.body ?? doc.showNotes)
  const guestLine   = doc.guestName
    ? `Guest: ${doc.guestName}${doc.guestTitle ? `, ${doc.guestTitle}` : ''}`
    : ''
  const currentExcerpt = doc.excerpt ? `Current excerpt: ${doc.excerpt}` : ''

  const prompt = `You are writing card preview text for a B2B content site. Write a single excerpt for this ${contentType} that is EXACTLY 150–200 characters long (count carefully — no more, no less).

CONTENT:
Title: ${doc.title}
${guestLine}
${currentExcerpt}
Body preview: ${bodyText}

RULES:
- Must be 150–200 characters total (including spaces and punctuation)
- Write in active voice, present tense where possible
- Hook the reader with the core insight or tension from the content
- No quotes, no markdown, no "In this episode/article" opener
- End with a complete sentence (no mid-sentence cutoffs)
- Do not start with the title

Respond with ONLY the excerpt text — no labels, no explanation.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 120,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Anthropic API ${response.status}: ${err}`)
  }

  const data = await response.json()
  const text = (data.content?.[0]?.text ?? '').trim()

  if (!text) throw new Error('Empty response from API')

  // Hard-enforce the length window — truncate at word boundary if AI went long
  if (text.length > MAX_CHARS) {
    const truncated = text.slice(0, text.lastIndexOf(' ', MAX_CHARS)).replace(/[,;:]$/, '')
    return truncated.length >= MIN_CHARS ? truncated : text.slice(0, MAX_CHARS)
  }

  return text
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔍  Fetching documents from Sanity…\n')

  const docs = await sanity.fetch(`
    *[_type == "playbookContent"] | order(publishedAt desc) {
      _id, contentType, title,
      "slug": slug.current,
      excerpt, body, showNotes,
      guestName, guestTitle
    }
  `)

  console.log(`Found ${docs.length} documents.`)

  const toProcess = docs.filter(needsRewrite)
  const inRange   = docs.length - toProcess.length

  console.log(`${inRange} already 150–200 chars — skipping.`)
  console.log(`${toProcess.length} need new excerpts${ALL_MODE ? ' (--all mode)' : ''}.\n`)

  if (toProcess.length === 0) {
    console.log('✅  All excerpts are already the right length. Use --all to regenerate.')
    return
  }

  if (DRY_RUN) {
    console.log('DRY RUN — no changes will be written. Add --write to apply.\n')
  }

  const results = []
  let succeeded = 0
  let failed    = 0

  for (let i = 0; i < toProcess.length; i++) {
    const doc = toProcess[i]
    const currentLen = (doc.excerpt ?? '').length
    process.stdout.write(`[${i + 1}/${toProcess.length}] "${doc.title}" (current: ${currentLen} chars) … `)

    try {
      const excerpt = await generateExcerpt(doc)
      results.push({ id: doc._id, slug: doc.slug, title: doc.title, oldLen: currentLen, newLen: excerpt.length, excerpt })

      console.log(`✓ (${excerpt.length} chars)`)
      console.log(`  ${excerpt}`)
      console.log()

      if (!DRY_RUN) {
        await sanity.patch(doc._id).set({ excerpt }).commit()
      }

      succeeded++
    } catch (err) {
      console.log(`❌  ${err.message}`)
      failed++
    }

    if (i < toProcess.length - 1) await sleep(DELAY_MS)
  }

  // Save review file
  const reviewPath = resolve(__dirname, 'excerpt-review.json')
  writeFileSync(reviewPath, JSON.stringify(results, null, 2))

  console.log('─'.repeat(60))
  console.log(`\n✅  ${succeeded} processed, ${failed} failed.`)
  console.log(`📄  Full results saved to scripts/excerpt-review.json`)

  if (DRY_RUN) {
    console.log(`\nTo apply, run:\n  node scripts/generate-excerpts.mjs --write\n`)
  }
}

main().catch((err) => {
  console.error('\nFatal:', err.message)
  process.exit(1)
})
