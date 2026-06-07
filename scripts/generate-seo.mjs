/**
 * generate-seo.mjs
 *
 * Auto-generates SEO fields for all playbookContent documents that are
 * missing seoTitle or seoDescription.
 *
 * Usage:
 *   node scripts/generate-seo.mjs            # dry run — shows what would change
 *   node scripts/generate-seo.mjs --write    # writes to Sanity
 *   node scripts/generate-seo.mjs --all      # overwrites even existing SEO fields
 *   node scripts/generate-seo.mjs --write --all
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local from project root
try {
  const envFile = readFileSync(resolve(__dirname, '../.env.local'), 'utf8')
  for (const rawLine of envFile.split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eqIdx = line.indexOf('=')
    if (eqIdx === -1) continue
    const key = line.slice(0, eqIdx).trim()
    const val = line.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '')
    if (key && val) process.env[key] = val
  }
} catch { /* .env.local not found — rely on existing env */ }

const DRY_RUN = !process.argv.includes('--write')
const OVERWRITE_ALL = process.argv.includes('--all')
const SITE_URL = 'https://agile-operator.com'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'r51dmz2x',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// ── Helpers ────────────────────────────────────────────────────────────────

/** Truncate to maxLen, breaking at a word boundary */
function truncate(str, maxLen) {
  if (!str) return ''
  if (str.length <= maxLen) return str
  return str.slice(0, str.lastIndexOf(' ', maxLen)).replace(/[,;:]$/, '') + '…'
}

/** Extract plain text from a PortableText body array */
function bodyToText(body) {
  if (!Array.isArray(body)) return ''
  return body
    .filter((b) => b._type === 'block')
    .map((b) =>
      (b.children ?? []).map((c) => c.text ?? '').join('')
    )
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Build SEO title — target 50–59 chars (plugin flags ≥60) */
function buildSeoTitle(doc) {
  const brand = 'Agile Operator'
  const base = doc.contentType === 'episode'
    ? doc.guestName
      ? `${doc.title} with ${doc.guestName}`
      : doc.title
    : doc.title

  const candidate = `${base} | ${brand}`
  // If too long, drop the guest suffix and use short brand
  if (candidate.length > 59 && doc.contentType === 'episode' && doc.guestName) {
    return truncate(`${doc.title} | Margins & Mandates`, 59)
  }
  return truncate(candidate, 59)
}

/** Build meta description — must be 120–158 chars */
function buildSeoDescription(doc) {
  const MIN = 120
  const MAX = 158

  // Build from best available source: excerpt → body → show notes
  const excerpt   = doc.excerpt ? doc.excerpt.trim() : ''
  const bodyText  = bodyToText(doc.body)
  const notesText = bodyToText(doc.showNotes)

  // Combine sources until we have enough
  let combined = excerpt
  if (combined.length < MIN && bodyText)  combined = `${combined} ${bodyText}`.trim()
  if (combined.length < MIN && notesText) combined = `${combined} ${notesText}`.trim()
  combined = combined.replace(/\s+/g, ' ').trim()

  if (!combined || combined.length < 20) {
    // Absolute fallback
    return doc.contentType === 'episode'
      ? `Listen to this episode of Margins & Mandates with Jeff Lortz — strategic growth advisory for technology CEOs and B2B SaaS operators.`
      : `Read this article from Agile Operator — strategic growth advisory for technology CEOs and B2B SaaS operators navigating growth.`
  }

  if (combined.length <= MAX) return combined
  return truncate(combined, MAX)
}

/** Build canonical URL */
function buildCanonicalUrl(doc) {
  const slug = typeof doc.slug === 'string' ? doc.slug : doc.slug?.current
  if (!slug) return null
  return `${SITE_URL}/playbooks/${slug}`
}

/** Build Open Graph patch */
function buildOpenGraph(doc, seoTitle, seoDescription) {
  return {
    title: seoTitle,
    description: seoDescription,
    // ogImage will be set to featuredImage if present — left unset here
    // so existing images aren't overwritten
  }
}

/** Determine if a doc needs SEO work */
function needsSeo(doc) {
  if (OVERWRITE_ALL) return true
  const seo = doc.seo ?? {}
  return !seo.title || !seo.description
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🔍 Fetching playbookContent documents…\n`)

  const docs = await client.fetch(`
    *[_type == "playbookContent"] | order(publishedAt desc) {
      _id,
      _rev,
      contentType,
      title,
      "slug": slug.current,
      excerpt,
      body,
      showNotes,
      guestName,
      guestTitle,
      featuredImage,
      seo
    }
  `)

  console.log(`Found ${docs.length} documents total.`)

  const toUpdate = docs.filter(needsSeo)
  console.log(`${toUpdate.length} need SEO updates${OVERWRITE_ALL ? ' (--all mode)' : ' (missing seoTitle or seoDescription)'}.\n`)

  if (toUpdate.length === 0) {
    console.log('✅ All documents already have SEO fields. Use --all to regenerate.')
    return
  }

  let updated = 0
  let skipped = 0

  for (const doc of toUpdate) {
    const seoTitle = buildSeoTitle(doc)
    const seoDescription = buildSeoDescription(doc)
    const canonicalUrl = buildCanonicalUrl(doc)

    if (!seoTitle || !seoDescription) {
      console.log(`⚠  Skipping "${doc.title}" — not enough content to generate SEO`)
      skipped++
      continue
    }

    const patch = {
      'seo.title': seoTitle,
      'seo.description': seoDescription,
    }
    if (canonicalUrl) patch['seo.canonicalUrl'] = canonicalUrl

    // Only set OG title/desc if not already set
    if (!doc.seo?.openGraph?.title) {
      patch['seo.openGraph.title'] = seoTitle
    }
    if (!doc.seo?.openGraph?.description) {
      patch['seo.openGraph.description'] = seoDescription
    }

    // Link OG image to featuredImage if not already set
    // Must be a Sanity image reference object, not a URL string
    if (!doc.seo?.openGraph?.image && doc.featuredImage?.asset?._ref) {
      patch['seo.openGraph.image'] = {
        _type: 'image',
        asset: { _type: 'reference', _ref: doc.featuredImage.asset._ref },
      }
    }

    console.log(`${DRY_RUN ? '[DRY RUN] Would update' : 'Updating'}: "${doc.title}"`)
    console.log(`  title:       ${seoTitle}`)
    console.log(`  description: ${seoDescription}`)
    if (canonicalUrl) console.log(`  canonicalUrl: ${canonicalUrl}`)
    console.log()

    if (!DRY_RUN) {
      try {
        await client.patch(doc._id).set(patch).commit()
        updated++
      } catch (err) {
        console.error(`  ❌ Failed to update ${doc._id}: ${err.message}`)
        skipped++
      }
    } else {
      updated++
    }
  }

  console.log('─'.repeat(60))
  if (DRY_RUN) {
    console.log(`\n✅ Dry run complete. ${updated} documents would be updated, ${skipped} skipped.`)
    console.log(`\nTo apply changes, run:\n  node scripts/generate-seo.mjs --write\n`)
  } else {
    console.log(`\n✅ Done. ${updated} documents updated, ${skipped} skipped.\n`)
  }
}

main().catch((err) => {
  console.error('Fatal error:', err.message)
  process.exit(1)
})
