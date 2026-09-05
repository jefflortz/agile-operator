import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { FadeIn, FadeInStagger } from '@/components/ui/FadeIn'
import ContentCard from '@/components/ui/ContentCard'
import { getAllContent, getActiveCategories } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'
import type { PlaybookContentPreview } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Playbooks',
  description:
    'Articles and podcast episodes covering SaaS growth, executive leadership, go-to-market strategy, and operational frameworks for technology CEOs and B2B operators.',
  keywords: 'SaaS growth playbooks, B2B operator frameworks, technology CEO articles, Margins and Mandates podcast',
  alternates: { canonical: 'https://www.agile-operator.com/playbooks' },
  openGraph: {
    title: 'Playbooks | Agile Operator',
    description: 'Articles and podcast episodes for technology CEOs and B2B SaaS operators.',
    url: 'https://www.agile-operator.com/playbooks',
    type: 'website',
  },
}

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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

function FeaturedPost({ item }: { item: PlaybookContentPreview }) {
  const slug = typeof item.slug === 'string' ? item.slug : item.slug.current
  const imageUrl = item.featuredImage
    ? urlFor(item.featuredImage).width(1600).height(900).url()
    : null
  const isEpisode = item.contentType === 'episode'
  const href = `/playbooks/${slug}`

  return (
    <FadeIn>
      <Link href={href} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-navy-950 min-h-[420px] sm:min-h-[500px] flex items-end">
          {/* Background image */}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={item.featuredImage?.alt ?? item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/60 to-navy-900/20" />

          {/* Content */}
          <div className="relative z-10 w-full p-8 sm:p-12">
            <div className="max-w-2xl">
              {/* Badge */}
              <span className="inline-block mb-4 text-xs font-sans font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-gold-400/20 text-gold-400">
                {isEpisode ? 'Latest Episode' : 'Latest Article'}
              </span>

              {/* Category */}
              {item.categories?.[0] && (
                <p className="text-sm text-navy-300 mb-2">{item.categories[0].title}</p>
              )}

              {/* Title */}
              <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-white text-balance leading-tight group-hover:text-gold-100 transition-colors">
                {item.title}
              </h2>

              {/* Excerpt */}
              {item.excerpt && (
                <p className="mt-4 text-base text-navy-300 leading-relaxed line-clamp-2 max-w-xl">
                  {item.excerpt}
                </p>
              )}

              {/* Meta */}
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-navy-400">
                {item.publishedAt && <span>{formatDate(item.publishedAt)}</span>}
                {isEpisode && item.guestName && (
                  <span>with {item.guestName}</span>
                )}
                <span className="flex items-center gap-1.5 text-gold-400 font-medium group-hover:gap-2.5 transition-all">
                  {isEpisode ? 'Listen now' : 'Read article'}
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </FadeIn>
  )
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

  const showCategoryFilter = filter !== 'episode' && categories.length > 0
  const isDefaultView = filter === 'all' && !activeCategory
  const featuredItem = isDefaultView && items.length > 0 ? items[0] : null
  const gridItems = featuredItem ? items.slice(1) : items

  return (
    <div className="pt-24 pb-24 sm:pt-32">
      {/* Page header — full width */}
      <Container>
        <FadeIn className="max-w-2xl">
          <span className="mb-4 block font-sans text-xs font-semibold uppercase tracking-widest text-gold-500">
            Playbooks
          </span>
          <h1 className="font-display text-4xl font-medium tracking-tight text-navy-900 sm:text-5xl text-balance">
            Frameworks and conversations for operators.
          </h1>
          <p className="mt-5 text-xl text-gray-600">
            Articles and podcast episodes from the field — the plays, pivots, and
            pressure-tested leadership of operators who have been in the seat.
          </p>
        </FadeIn>
      </Container>

      {/* Featured post — latest content, default view only */}
      {featuredItem && (
        <Container className="mt-12">
          <FeaturedPost item={featuredItem} />
        </Container>
      )}

      {/* Two-column layout */}
      <Container className="mt-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px]">

          {/* ── Main column ── */}
          <div className="min-w-0">
            <FadeIn>
              {/* Type tabs */}
              <div className="flex items-end gap-1 border-b border-navy-100">
                {tabs.map((tab) => (
                  <Link
                    key={tab.value}
                    href={buildHref(filter, activeCategory, tab.value, tab.value === 'episode' ? undefined : activeCategory)}
                    className={`px-4 py-2.5 text-sm font-sans font-medium transition-colors border-b-2 -mb-px ${
                      filter === tab.value
                        ? 'border-navy-900 text-navy-900'
                        : 'border-transparent text-gray-400 hover:text-navy-700'
                    }`}
                  >
                    {tab.label}
                  </Link>
                ))}
                <span className="ml-auto pb-2.5 text-xs text-gray-400 font-sans">
                  {total} {total === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Category filter — inline under tabs */}
              {showCategoryFilter && (
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
            {gridItems.length > 0 ? (
              <FadeInStagger className="mt-8">
                {/* Episodes: single column (horizontal card reads better full-width) */}
                {/* Articles / All: two-column grid */}
                <div className={filter === 'episode' ? 'flex flex-col gap-6' : 'grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch'}>
                  {gridItems.map((item) => (
                    <FadeIn key={item._id}>
                      <ContentCard {...toCardProps(item)} />
                    </FadeIn>
                  ))}
                </div>
              </FadeInStagger>
            ) : featuredItem ? null : (
              <FadeIn className="mt-16">
                <p className="text-gray-400 text-sm">No content found for this filter.</p>
              </FadeIn>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-10">

              {/* Margins & Mandates — Spotify embed */}
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
                  Margins &amp; Mandates
                </p>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                  The podcast for operators in the seat — conversations on growth, leadership, and the decisions that matter.
                </p>
                <iframe
                  src="https://open.spotify.com/embed/show/0JbihvBwMqoXr8EdEyWSOu?utm_source=generator&theme=0"
                  width="100%"
                  height="152"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-xl"
                  title="Margins and Mandates on Spotify"
                />
              </div>

              <div className="border-t border-navy-100" />

              {/* Browse by Topic */}
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
                  Browse by Topic
                </p>
                <nav className="space-y-1">
                  <Link
                    href="/playbooks"
                    className={`flex items-center justify-between py-1.5 text-sm transition-colors group ${
                      !activeCategory && filter === 'all'
                        ? 'text-navy-900 font-medium'
                        : 'text-gray-500 hover:text-navy-900'
                    }`}
                  >
                    <span>All content</span>
                    <span className="text-xs text-gray-400 group-hover:text-gray-600">{total}</span>
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/playbooks?category=${cat.slug}`}
                      className={`flex items-center justify-between py-1.5 text-sm transition-colors group ${
                        activeCategory === cat.slug
                          ? 'text-navy-900 font-medium'
                          : 'text-gray-500 hover:text-navy-900'
                      }`}
                    >
                      <span>{cat.title}</span>
                      <span className="text-xs text-gray-400 group-hover:text-gray-600">{cat.total}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="border-t border-navy-100" />

              {/* Newsletter CTA */}
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-3">
                  Stay Current
                </p>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  New articles and episodes delivered to your inbox.
                </p>
                <a
                  href="https://agileoperator.substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-navy-900 border border-navy-200 rounded px-4 py-2 hover:bg-navy-50 transition-colors"
                >
                  Subscribe on Substack
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>

            </div>
          </aside>

        </div>
      </Container>
    </div>
  )
}
