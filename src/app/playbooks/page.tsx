import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { FadeIn, FadeInStagger } from '@/components/ui/FadeIn'
import { SectionIntro } from '@/components/ui/SectionIntro'
import ContentCard from '@/components/ui/ContentCard'
import { getAllContent, getActiveCategories } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'
import type { PlaybookContentPreview } from '@/lib/types'

type FilterType = 'all' | 'article' | 'episode'

function toCardProps(item: PlaybookContentPreview) {
  return {
    title: item.title,
    slug: typeof item.slug === 'string' ? item.slug : item.slug.current,
    contentType: item.contentType,
    excerpt: item.excerpt,
    publishedAt: item.publishedAt,
    guestName: item.guestName,
    category: item.categories?.[0]?.title,
    featuredImage: item.featuredImage
      ? {
          url: urlFor(item.featuredImage).width(800).height(450).url(),
          alt: item.featuredImage.alt ?? item.title,
        }
      : undefined,
  }
}

function buildHref(type: FilterType, category: string | undefined, newType?: FilterType, newCategory?: string) {
  const t = newType ?? type
  const c = newCategory
  const params = new URLSearchParams()
  if (t !== 'all') params.set('type', t)
  if (c) params.set('category', c)
  const qs = params.toString()
  return `/playbooks${qs ? `?${qs}` : ''}`
}

export default async function PlaybooksPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; category?: string }>
}) {
  const params = await searchParams
  const filter = (params.type ?? 'all') as FilterType
  const activeCategory = params.category

  const contentType = filter === 'all' ? undefined : filter

  const [{ items, total }, categories] = await Promise.all([
    getAllContent(contentType, activeCategory, 1, 24),
    getActiveCategories(),
  ])

  const tabs: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Articles', value: 'article' },
    { label: 'Episodes', value: 'episode' },
  ]

  // Only show category pills for All or Articles (episodes don't use categories)
  const showCategoryPills = filter !== 'episode' && categories.length > 0

  return (
    <>
      <div className="pt-24 pb-16 sm:pt-32">
        <SectionIntro
          eyebrow="Playbooks"
          title="Frameworks and conversations for operators."
        >
          <p>
            Articles and podcast episodes from the field — the plays, pivots, and
            pressure-tested leadership of operators who have been in the seat.
          </p>
        </SectionIntro>

        <Container className="mt-12">
          <FadeIn>
            {/* Row 1: Type tabs */}
            <div className="flex gap-2 border-b border-navy-100">
              {tabs.map((tab) => (
                <Link
                  key={tab.value}
                  href={buildHref(filter, activeCategory, tab.value, tab.value === 'episode' ? undefined : activeCategory)}
                  className={`px-4 py-2 text-sm font-sans font-medium transition-colors border-b-2 -mb-px ${
                    filter === tab.value
                      ? 'border-navy-900 text-navy-900'
                      : 'border-transparent text-gray-500 hover:text-navy-700'
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
              <span className="ml-auto self-center text-xs text-gray-400">
                {total} {total === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Row 2: Category pills */}
            {showCategoryPills && (
              <div className="flex flex-wrap gap-2 mt-4">
                <Link
                  href={buildHref(filter, activeCategory, filter, undefined)}
                  className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-colors ${
                    !activeCategory
                      ? 'bg-navy-900 text-white'
                      : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
                  }`}
                >
                  All topics
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={buildHref(filter, activeCategory, filter, cat.slug)}
                    className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-colors ${
                      activeCategory === cat.slug
                        ? 'bg-navy-900 text-white'
                        : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
                    }`}
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            )}
          </FadeIn>

          {/* Content grid */}
          {items.length > 0 ? (
            <FadeInStagger className="mt-10">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <FadeIn key={item._id}>
                    <ContentCard {...toCardProps(item)} />
                  </FadeIn>
                ))}
              </div>
            </FadeInStagger>
          ) : (
            <FadeIn className="mt-16">
              <p className="text-gray-400 text-sm">No content found for this filter.</p>
            </FadeIn>
          )}
        </Container>
      </div>
    </>
  )
}
