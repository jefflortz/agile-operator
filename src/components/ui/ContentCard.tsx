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

// ── Article card — text-first, no image ──────────────────────────────────────
function ArticleCard({ href, title, excerpt, publishedAt, category }: {
  href: string
  title: string
  excerpt?: string
  publishedAt?: string
  category?: string
}) {
  return (
    <Link href={href} className="group flex h-full">
      <article className="w-full flex flex-col border-t-2 border-navy-900 pt-6 pb-2">
        {/* Top meta */}
        <div className="flex items-center gap-3 mb-4">
          {category && (
            <span className="text-xs font-sans font-semibold uppercase tracking-widest text-gold-500">
              {category}
            </span>
          )}
          {category && publishedAt && (
            <span className="text-gray-200 text-xs">|</span>
          )}
          {publishedAt && (
            <span className="text-xs text-gray-400 font-sans">{formatDate(publishedAt)}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display text-xl font-medium text-navy-900 leading-snug group-hover:text-navy-600 transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Excerpt — fixed height keeps all cards the same size */}
        <p className="mt-3 text-sm text-gray-500 leading-relaxed h-56 overflow-hidden">
          {truncateExcerpt(excerpt)}
        </p>

        {/* Read link */}
        <p className="mt-5 text-sm font-medium text-navy-400 group-hover:text-navy-700 transition-colors">
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
        <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-navy-900">
          {featuredImage ? (
            <Image
              src={featuredImage.url}
              alt={featuredImage.alt ?? title}
              width={80}
              height={80}
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
    />
  )
}
