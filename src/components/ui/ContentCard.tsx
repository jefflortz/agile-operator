import Link from 'next/link'
import Image from 'next/image'

type ContentCardProps = {
  title: string
  slug: string
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

export default function ContentCard({
  title,
  slug,
  contentType,
  excerpt,
  featuredImage,
  publishedAt,
  category,
  guestName,
}: ContentCardProps) {
  const href = `/playbooks/${slug}`

  return (
    <Link href={href} className="group block">
      <article className="h-full flex flex-col bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-navy-200 hover:shadow-md transition-all duration-200">

        {/* Image */}
        {featuredImage && (
          <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
            <Image
              src={featuredImage.url}
              alt={featuredImage.alt ?? title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">

          {/* Meta row */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-sans font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full ${
              contentType === 'episode'
                ? 'bg-gold-400/20 text-gold-600'
                : 'bg-navy-50 text-navy-600'
            }`}>
              {contentType === 'episode' ? 'Episode' : category ?? 'Article'}
            </span>
            {publishedAt && (
              <span className="text-xs text-gray-400">{formatDate(publishedAt)}</span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-display text-lg text-navy-900 leading-snug group-hover:text-navy-700 transition-colors">
            {title}
          </h3>

          {/* Guest name for episodes */}
          {contentType === 'episode' && guestName && (
            <p className="mt-1 text-sm text-gray-500">with {guestName}</p>
          )}

          {/* Excerpt for articles */}
          {contentType === 'article' && excerpt && (
            <p className="mt-2 text-sm text-gray-500 line-clamp-2 flex-1">{excerpt}</p>
          )}

          {/* Read/Listen link */}
          <p className="mt-4 text-sm font-medium text-navy-700 group-hover:text-navy-900">
            {contentType === 'episode' ? 'Listen →' : 'Read →'}
          </p>
        </div>
      </article>
    </Link>
  )
}
