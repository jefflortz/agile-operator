/**
 * generate-keywords.mjs
 *
 * Uses the Anthropic API to generate focus keywords, an optimized SEO title,
 * and meta description for every playbookContent document in Sanity.
 *
 * Prerequisites:
 *   Add ANTHROPIC_API_KEY to .env.local
 *
 * Usage:
 *   node scripts/generate-keywords.mjs              # dry run — review in console
 *   node scripts/generate-keywords.mjs --write      # apply to Sanity
 *   node scripts/generate-keywords.mjs --all        # regenerate even if keywords exist
 *   node scripts/generate-keywords.mjs --write --all
 */

import { createClient } from '@sanity/client'
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Config ─────────────────────────────────────────────────────────────────

const DRY_RUN   = !process.argv.includes('--write')
const ALL_MODE  = process.argv.includes('--all')
const SITE_NAME = 'Agile Operator'
const DELAY_MS  = 1200 // stay well under Anthropic rate limits

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
  console.error('Add it like this:\n  ANTHROPIC_API_KEY=sk-ant-...\n')
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

function truncate(str, max) {
  if (!str || str.length <= max) return str ?? ''
  return str.slice(0, str.lastIndexOf(' ', max)).replace(/[,;:]$/, '') + '…'
}

function bodyToText(blocks) {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .filter((b) => b._type === 'block')
    .flatMap((b) => (b.children ?? []).map((c) => c.text ?? ''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1500) // cap context sent to API
}

// ── Claude API call ────────────────────────────────────────────────────────

async function generateSeoForDoc(doc) {
  const contentType = doc.contentType === 'episode' ? 'podcast episode' : 'article'
  const bodyText    = bodyToText(doc.body ?? doc.showNotes)
  const guestLine   = doc.guestName ? `Guest: ${doc.guestName}${doc.guestTitle ? `, ${doc.guestTitle}` : ''}` : ''

  const prompt = `You are an SEO strategist for "${SITE_NAME}", a strategic growth advisory firm for technology CEOs and B2B SaaS operators in Boston.

Analyze this ${contentType} and generate SEO metadata optimized for the target audience: technology CEOs, founders, and operators at growth-stage B2B SaaS companies ($5M–$50M ARR).

CONTENT:
Title: ${doc.title}
${guestLine}
Excerpt: ${doc.excerpt ?? ''}
Body preview: ${bodyText}

Generate the following JSON (no other text, just the JSON object):
{
  "primaryKeyword": "one specific 2–5 word phrase that a CEO would actually search (not too broad)",
  "keywords": ["primaryKeyword", "secondaryKeyword2", "secondaryKeyword3", "secondaryKeyword4"],
  "seoTitle": "optimized title, 50–60 chars, includes primary keyword naturally, ends with | ${SITE_NAME} or | Margins & Mandates for episodes",
  "seoDescription": "compelling meta description, 140–155 chars, includes primary keyword, addresses the reader's pain point directly"
}

Rules:
- Keywords should be specific, not generic (e.g. "SaaS executive transition" not "leadership")
- Include at least one location-relevant keyword where natural (Boston, B2B SaaS, tech CEO)
- seoTitle must be under 65 characters total
- seoDescription must be under 160 characters total
- Write for someone actively searching for help with this exact problem`

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
    throw new Error(`Anthropic API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  const text = data.content?.[0]?.text ?? ''

  // Extract JSON from the response
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error(`No JSON in response: ${text}`)

  const result = JSON.parse(jsonMatch[0])

  // Enforce length limits as a safety net
  result.seoTitle       = truncate(result.seoTitle, 65)
  result.seoDescription = truncate(result.seoDescription, 158)
  if (!Array.isArray(result.keywords)) result.keywords = [result.primaryKeyword]

  return result
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔍  Fetching documents from Sanity…\n')

  const docs = await sanity.fetch(`
    *[_type == "playbookContent"] | order(publishedAt desc) {
      _id, contentType, title,
      "slug": slug.current,
      excerpt, body, showNotes,
      guestName, guestTitle, seo
    }
  `)

  console.log(`Found ${docs.length} documents.`)

  const toProcess = ALL_MODE
    ? docs
    : docs.filter((d) => !d.seo?.keywords?.length)

  console.log(`${toProcess.length} need keyword generation${ALL_MODE ? ' (--all mode)' : ' (missing keywords)'}.\n`)

  if (toProcess.length === 0) {
    console.log('✅  All documents already have keywords. Use --all to regenerate.')
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
    process.stdout.write(`[${i + 1}/${toProcess.length}] "${doc.title}" … `)

    try {
      const seo = await generateSeoForDoc(doc)
      results.push({ doc, seo })

      console.log('✓')
      console.log(`  Primary keyword:  ${seo.primaryKeyword}`)
      console.log(`  All keywords:     ${seo.keywords.join(', ')}`)
      console.log(`  SEO title:        ${seo.seoTitle}`)
      console.log(`  Meta description: ${seo.seoDescription}`)
      console.log()

      if (!DRY_RUN) {
        await sanity.patch(doc._id).set({
          'seo.keywords':       seo.keywords,
          'seo.seoTitle':       seo.seoTitle,
          'seo.seoDescription': seo.seoDescription,
        }).commit()
      }

      succeeded++
    } catch (err) {
      console.log(`❌  ${err.message}`)
      failed++
    }

    // Rate limit buffer between calls
    if (i < toProcess.length - 1) await sleep(DELAY_MS)
  }

  // Save review file regardless of dry run
  const reviewPath = resolve(process.cwd(), 'scripts/seo-review.json')
  writeFileSync(reviewPath, JSON.stringify(results.map(({ doc, seo }) => ({
    id: doc._id,
    slug: doc.slug,
    title: doc.title,
    contentType: doc.contentType,
    ...seo,
  })), null, 2))

  console.log('─'.repeat(60))
  console.log(`\n✅  ${succeeded} processed, ${failed} failed.`)
  console.log(`📄  Full results saved to scripts/seo-review.json`)

  if (DRY_RUN) {
    console.log(`\nTo apply, run:\n  node scripts/generate-keywords.mjs --write\n`)
  } else {
    console.log()
  }
}

main().catch((err) => {
  console.error('\nFatal:', err.message)
  process.exit(1)
})
