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
import { resolve } from 'path'

// Load .env.local manually (dotenv not installed as a dep)
try {
  const envFile = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
  for (const line of envFile.split('\n')) {
    const match = line.match(/^([^#=\s]+)\s*=\s*(.*)$/)
    if (match) process.env[match[1]] ??= match[2].replace(/^['"]|['"]$/g, '')
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

/** Build SEO title — 50–60 chars is the sweet spot */
function buildSeoTitle(doc) {
  const brand = 'Agile Operator'
  const base = doc.contentType === 'episode'
    ? doc.guestName
      ? `${doc.title} with ${doc.guestName}`
      : doc.title
    : doc.title

  const candidate = `${base} | ${brand}`
  // If too long, drop the guest title suffix and just use the episode title
  if (candidate.length > 65 && doc.contentType === 'episode' && doc.guestName) {
    return truncate(`${doc.title} | Margins & Mandates`, 65)
  }
  return truncate(candidate, 65)
}

/** Build meta description — 140–160 chars */
function buildSeoDescription(doc) {
  // Prefer excerpt (already editorial-quality), then fall back to body text
  const source = doc.excerpt
    ?? bodyToText(doc.body)
    ?? bodyToText(doc.showNotes)
    ?? ''

  if (!source) {
    return doc.contentType === 'episode'
      ? `Listen to this episode of Margins & Mandates hosted by Jeff Lortz.`
      : `Read this article from Agile Operator — strategic growth advisory for technology CEOs.`
  }

  return truncate(source, 155)
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
  return !seo.seoTitle || !seo.seoDescription
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
      'seo.seoTitle': seoTitle,
      'seo.seoDescription': seoDescription,
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
    if (!doc.seo?.openGraph?.image && doc.featuredImage?.asset?._ref) {
      const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'r51dmz2x'
      const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET   ?? 'production'
      // Convert asset ref (image-{id}-{w}x{h}-{ext}) to CDN URL at 1200×630
      const ref = doc.featuredImage.asset._ref
      const [, id, dims, fmt] = ref.split('-')
      const ogImageUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dims}.${fmt}?w=1200&h=630&fit=crop&auto=format`
      patch['seo.openGraph.image'] = ogImageUrl
    }

    console.log(`${DRY_RUN ? '[DRY RUN] Would update' : 'Updating'}: "${doc.title}"`)
    console.log(`  seoTitle:       ${seoTitle}`)
    console.log(`  seoDescription: ${seoDescription}`)
    if (canonicalUrl) console.log(`  canonicalUrl:   ${canonicalUrl}`)
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
