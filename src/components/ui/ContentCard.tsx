import Link from 'next/link'
import Image from 'next/image'
import { truncateExcerpt } from '@/lib/excerpt'

type ContentCardProps = {
  title: string
  slug: string | { current: string }
  contentType: 'article' | 'episode'
  excerpt?: string
  featuredImage?: { url: string; alt?: string }
  publishedAt?: string
  category?: string
  guestName?: string
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Deterministic motif (0–2) derived from slug characters
function getMotif(slug: string): number {
  let hash = 0
  for (let i = 0; i < slug.length; i++) hash = (hash + slug.charCodeAt(i)) % 3
  return hash
}

// SVG geometric decoration — right-hand side of the graphic area
function ArticleMotif({ motif }: { motif: number }) {
  if (motif === 0) return (
    <svg className="absolute right-0 top-0 h-full w-36" viewBox="0 0 144 130" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">
      <circle cx="100" cy="65" r="52" fill="none" stroke="#1a2744" strokeWidth="1" opacity="0.07"/>
      <circle cx="100" cy="65" r="34" fill="none" stroke="#B87D2A" strokeWidth="0.75" opacity="0.11"/>
      <circle cx="100" cy="65" r="16" fill="#1a2744" opacity="0.03"/>
      <circle cx="100" cy="65" r="4" fill="#B87D2A" opacity="0.2"/>
    </svg>
  )
  if (motif === 1) return (
    <svg className="absolute right-0 top-0 h-full w-36" viewBox="0 0 144 130" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">
      <polygon points="104,8 138,118 70,118" fill="none" stroke="#1a2744" strokeWidth="1" opacity="0.07"/>
      <polygon points="104,26 128,112 80,112" fill="none" stroke="#B87D2A" strokeWidth="0.75" opacity="0.11"/>
      <polygon points="104,48 118,106 90,106" fill="#B87D2A" opacity="0.04"/>
    </svg>
  )
  return (
    <svg className="absolute right-0 top-0 h-full w-36" viewBox="0 0 144 130" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">
      <line x1="48" y1="0" x2="48" y2="130" stroke="#1a2744" strokeWidth="0.5" opacity="0.08"/>
      <line x1="80" y1="0" x2="80" y2="130" stroke="#1a2744" strokeWidth="0.5" opacity="0.08"/>
      <line x1="112" y1="0" x2="112" y2="130" stroke="#1a2744" strokeWidth="0.5" opacity="0.08"/>
      <line x1="48" y1="32" x2="144" y2="32" stroke="#1a2744" strokeWidth="0.5" opacity="0.08"/>
      <line x1="48" y1="65" x2="144" y2="65" stroke="#B87D2A" strokeWidth="0.75" opacity="0.18"/>
      <line x1="48" y1="98" x2="144" y2="98" stroke="#1a2744" strokeWidth="0.5" opacity="0.08"/>
      <rect x="64" y="42" width="64" height="46" fill="#B87D2A" opacity="0.04"/>
    </svg>
  )
}

// ── Article card — branded graphic header ─────────────────────────────────────
function ArticleCard({ href, title, excerpt, publishedAt, category, slug }: {
  href: string
  title: string
  excerpt?: string
  publishedAt?: string
  category?: string
  slug: string
}) {
  const motif = getMotif(slug)

  return (
    <Link href={href} className="group flex h-full">
      <article className="w-full flex flex-col rounded-lg border border-navy-100 overflow-hidden group-hover:border-navy-200 transition-colors">

        {/* ── Graphic header ── */}
        <div className="flex-shrink-0">
          {/* Navy category band */}
          <div className="bg-navy-900 px-4 h-9 flex items-center justify-between">
            <span className="text-xs font-sans font-semibold uppercase tracking-widest text-gold-500">
              {category ?? 'Article'}
            </span>
            <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-gold-500 opacity-50" />
            </div>
          </div>
          {/* Gold rule */}
          <div className="h-[1.5px] bg-gold-500" />
          {/* White graphic field */}
          <div className="relative bg-white px-4 pt-4 pb-4 min-h-[110px] overflow-hidden">
            <ArticleMotif motif={motif} />
            {/* Gold accent line */}
            <div className="w-10 h-px bg-gold-500 mb-3 opacity-70" />
            {/* Title */}
            <h3 className="relative font-display text-base font-medium text-navy-900 leading-snug group-hover:text-navy-600 transition-colors max-w-[58%]">
              {title}
            </h3>
            {/* Date meta */}
            {publishedAt && (
              <p className="relative mt-3 text-[11px] text-navy-400 font-sans">
                {formatDate(publishedAt)}
              </p>
            )}
          </div>
        </div>

        {/* ── Excerpt with gold left border ── */}
        <div className="flex-1 px-4 pt-2.5 pb-2">
          <div className="border-l-2 border-gold-500 pl-3">
            <p className="text-xs text-gray-500 leading-relaxed">
              {truncateExcerpt(excerpt)}
            </p>
          </div>
        </div>

        {/* ── CTA ── */}
        <p className="px-4 pb-3 pt-1 text-xs font-medium text-navy-400 group-hover:text-navy-700 transition-colors">
          Read →
        </p>

      </article>
    </Link>
  )
}

// ── Episode card — horizontal with artwork ────────────────────────────────────
function EpisodeCard({ href, title, featuredImage, publishedAt, guestName }: {
  href: string
  title: string
  featuredImage?: { url: string; alt?: string }
  publishedAt?: string
  guestName?: string
}) {
  return (
    <Link href={href} className="group block h-full">
      <article className="h-full flex gap-4 border-t-2 border-gold-500 pt-6 pb-2">
        {/* Artwork */}
        <div className="flex-shrink-0 w-[120px] h-[68px] rounded-lg overflow-hidden bg-navy-900">
          {featuredImage ? (
            <Image
              src={featuredImage.url}
              alt={featuredImage.alt ?? title}
              width={120}
              height={68}
              className="w-full h-full object-cover"
            />
          ) : (
            // Branded placeholder
            <div className="w-full h-full flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="w-8 h-8 text-gold-500" fill="currentColor">
                <path d="M16 4a12 12 0 100 24A12 12 0 0016 4zm-2 8l6 4-6 4V12z"/>
              </svg>
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-sans font-semibold uppercase tracking-widest text-gold-500">
              Episode
            </span>
            {publishedAt && (
              <span className="text-xs text-gray-400 font-sans">{formatDate(publishedAt)}</span>
            )}
          </div>

          <h3 className="font-display text-base font-medium text-navy-900 leading-snug group-hover:text-navy-600 transition-colors line-clamp-2">
            {title}
          </h3>

          {guestName && (
            <p className="mt-1 text-xs text-gray-500">with {guestName}</p>
          )}

          <p className="mt-auto pt-3 text-sm font-medium text-navy-400 group-hover:text-navy-700 transition-colors">
            Listen →
          </p>
        </div>
      </article>
    </Link>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function ContentCard(props: ContentCardProps) {
  const slugStr = typeof props.slug === 'string' ? props.slug : props.slug.current
  const href = `/playbooks/${slugStr}`

  if (props.contentType === 'episode') {
    return (
      <EpisodeCard
        href={href}
        title={props.title}
        featuredImage={props.featuredImage}
        publishedAt={props.publishedAt}
        guestName={props.guestName}
      />
    )
  }

  return (
    <ArticleCard
      href={href}
      title={props.title}
      excerpt={props.excerpt}
      publishedAt={props.publishedAt}
      category={props.category}
      slug={slugStr}
    />
  )
}
