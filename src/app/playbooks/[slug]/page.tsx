import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { Container } from '@/components/ui/Container'
import { FadeIn } from '@/components/ui/FadeIn'
import Button from '@/components/ui/Button'
import ContentCard from '@/components/ui/ContentCard'
import GiscusComments from '@/components/ui/GiscusComments'
import ScrollProgress from '@/components/ui/ScrollProgress'
import ShareBar from '@/components/ui/ShareBar'
import { getContentBySlug, getContentMetadata, getRelatedContent } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const doc = await getContentMetadata(slug)
  if (!doc) return {}

  const seoTitle = doc.seo?.seoTitle || `${doc.title} | Agile Operator`
  const seoDescription = doc.seo?.seoDescription || doc.excerpt || ''
  const canonical = doc.seo?.canonicalUrl || `https://agile-operator.com/playbooks/${slug}`
  const keywords = doc.seo?.keywords?.join(', ') || undefined

  // OG image: prefer explicit seo.openGraph.image, fall back to featuredImage
  const ogImageUrl = doc.seo?.openGraph?.image
    || (doc.featuredImage ? urlFor(doc.featuredImage).width(1200).height(630).url() : null)
    || undefined

  return {
    // `absolute` bypasses the root layout template so we don't get "Title | Agile Operator | Agile Operator"
    title: { absolute: seoTitle },
    description: seoDescription,
    ...(keywords && { keywords }),
    alternates: { canonical },
    openGraph: {
      title: doc.seo?.openGraph?.title || seoTitle,
      description: doc.seo?.openGraph?.description || seoDescription,
      url: canonical,
      type: 'article',
      ...(doc.publishedAt && { publishedTime: doc.publishedAt }),
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: doc.title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  }
}

// ── Portable Text components ─────────────────────────────────────────────────

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mt-6 text-lg text-gray-600 leading-relaxed">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mt-14 mb-2 font-display text-3xl font-medium text-navy-900 border-b border-navy-100 pb-3">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mt-10 font-display text-2xl font-medium text-navy-900">{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="mt-8 font-display text-xl font-medium text-navy-900">{children}</h4>
    ),
    // Pull quote — breaks out of prose for visual impact
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-12 border-y-2 border-gold-500/40 py-10 text-2xl sm:text-3xl font-display font-medium italic text-navy-800 text-center leading-snug">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mt-6 space-y-2 list-none pl-0 text-gray-600 text-lg">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mt-6 space-y-2 list-none pl-0 text-gray-600 text-lg counter-reset-item">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="leading-relaxed flex gap-3 items-start">
        <span className="mt-2.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gold-500" />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="leading-relaxed pl-6 relative before:absolute before:left-0 before:text-gold-500 before:font-semibold">
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-navy-900">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    link: ({ value, children }: { value?: { href: string }; children?: React.ReactNode }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-navy-700 underline underline-offset-2 decoration-navy-300 hover:text-gold-600 hover:decoration-gold-500 transition-colors"
      >
        {children}
      </a>
    ),
  },
}

// Simpler components for author bio (no drop cap, smaller text)
const bioComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{children}</p>
    ),
  },
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

function getYouTubeEmbedId(url: string) {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match?.[1] ?? null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function estimateReadTime(body: any[]): number {
  if (!body?.length) return 0
  const text = body
    .filter((b) => b._type === 'block')
    .map((b) => b.children?.map((c: { text?: string }) => c.text ?? '').join('') ?? '')
    .join(' ')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function PlaybookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const content = await getContentBySlug(slug)
  if (!content) notFound()

  const isEpisode = content.contentType === 'episode'
  const featuredImageUrl = content.featuredImage
    ? urlFor(content.featuredImage).width(1600).height(900).url()
    : null
  const youtubeEmbedId = content.youtubeUrl ? getYouTubeEmbedId(content.youtubeUrl) : null
  const readTime = !isEpisode ? estimateReadTime(content.body ?? []) : 0
  const categoryIds = content.categories?.map((c: { _id: string }) => c._id) ?? []
  const related = await getRelatedContent(categoryIds, slug, 3).catch(() => [])

  // ── EPISODE LAYOUT ─────────────────────────────────────────────────────────
  if (isEpisode) {
    return (
      <>
        <ScrollProgress />

        <div className="pt-24 pb-12 sm:pt-32">
          <Container>
            <FadeIn>
              <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400">
                <Link href="/playbooks" className="hover:text-navy-700 transition-colors">Playbooks</Link>
                <span>›</span>
                <span className="text-gold-600">Episode</span>
              </nav>

              <span className="inline-block text-xs font-sans font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full mb-6 bg-gold-400/20 text-gold-600">
                Episode
              </span>

              <h1 className="font-display text-4xl font-medium tracking-tight text-navy-900 sm:text-5xl max-w-3xl text-balance">
                {content.title}
              </h1>

              {content.guestName && (
                <p className="mt-4 text-xl text-gray-500">
                  with <span className="text-navy-700 font-medium">{content.guestName}</span>
                  {content.guestTitle && <span className="text-gray-400">, {content.guestTitle}</span>}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-400">
                {content.publishedAt && <span>{formatDate(content.publishedAt)}</span>}
                {content.podcastDuration && <span>{content.podcastDuration}</span>}
              </div>
            </FadeIn>
          </Container>
        </div>

        <Container className="mb-12">
          <FadeIn>
            {youtubeEmbedId ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-navy-900">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeEmbedId}`}
                  title={content.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            ) : featuredImageUrl ? (
              <div className="relative aspect-[2/1] overflow-hidden rounded-2xl">
                <Image src={featuredImageUrl} alt={content.title} fill className="object-cover" priority />
              </div>
            ) : null}

            {(content.spotifyUrl || content.applePodcastUrl) && (
              <div className="mt-6 flex flex-wrap gap-3">
                {content.spotifyUrl && (
                  <a href={content.spotifyUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#1DB954] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                    Listen on Spotify
                  </a>
                )}
                {content.applePodcastUrl && (
                  <a href={content.applePodcastUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#872EC4] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.8a7.2 7.2 0 110 14.4A7.2 7.2 0 0112 4.8zm0 2.4a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6zm0 1.8a3 3 0 110 6 3 3 0 010-6zm0 1.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/>
                    </svg>
                    Apple Podcasts
                  </a>
                )}
              </div>
            )}
          </FadeIn>
        </Container>

        <Container className="pb-24">
          <FadeIn>
            <div className="max-w-prose mx-auto">
              {content.excerpt && (
                <p className="text-xl text-gray-500 leading-relaxed mb-10">{content.excerpt}</p>
              )}
              {content.showNotes && (
                <>
                  <h2 className="font-display text-2xl font-medium text-navy-900 mb-4">Show Notes</h2>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <PortableText value={content.showNotes as any} components={portableTextComponents} />
                </>
              )}
              <div className="mt-16 pt-8 border-t border-navy-100">
                <Button href="/playbooks" variant="outline">← Back to Playbooks</Button>
              </div>
            </div>
          </FadeIn>
        </Container>

        {related.length > 0 && <RelatedSection related={related} />}
      </>
    )
  }

  // ── ARTICLE LAYOUT ─────────────────────────────────────────────────────────
  const authorImageUrl = content.author?.photo
    ? urlFor(content.author.photo).width(160).height(160).url()
    : null

  return (
    <>
      <ScrollProgress />

      {/* ── Hero ── */}
      {/* -mt-[92px] cancels the nav wrapper's pt-14 + pt-9 so the image starts at the very top */}
      <div className="-mt-[92px] relative min-h-[65vh] flex items-end overflow-hidden">
        {/* Background: image or solid navy */}
        {featuredImageUrl ? (
          <Image
            src={featuredImageUrl}
            alt={content.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-navy-950" />
        )}

        {/* Gradient overlay — always present */}
        {featuredImageUrl ? (
          <>
            {/* Bottom-up: darkens behind the title text */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/70 to-transparent" />
            {/* Top-down: darkens behind the nav so image doesn't bleed through */}
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-transparent to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-navy-950" />
        )}

        {/* Hero content */}
        <div className="relative z-10 w-full pb-14 pt-48">
          <Container>
            <FadeIn>
              {/* Breadcrumb */}
              <nav className="mb-6 flex items-center gap-2 text-sm text-navy-300">
                <Link href="/playbooks" className="hover:text-white transition-colors">Playbooks</Link>
                <span className="text-navy-500">›</span>
                <span className="text-gold-400">
                  {content.categories?.[0]?.title ?? 'Article'}
                </span>
              </nav>

              {/* Title */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white max-w-4xl text-balance leading-tight">
                {content.title}
              </h1>

              {/* Meta row */}
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-navy-300">
                {content.author?.name && (
                  <span className="font-medium text-white">{content.author.name}</span>
                )}
                {content.publishedAt && <span>{formatDate(content.publishedAt)}</span>}
                {readTime > 0 && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="8" cy="8" r="6.5"/>
                      <path d="M8 4.5V8l2.5 2" strokeLinecap="round"/>
                    </svg>
                    {readTime} min read
                  </span>
                )}
                {content.categories?.map((cat: { _id: string; title: string; slug: string }) => (
                  <Link key={cat._id} href={`/playbooks?category=${cat.slug}`}
                    className="text-gold-400 hover:text-gold-300 transition-colors">
                    {cat.title}
                  </Link>
                ))}
              </div>
            </FadeIn>
          </Container>
        </div>
      </div>

      {/* ── Article body ── */}
      <Container className="py-16 sm:py-20">
        <FadeIn>
          <div className="max-w-prose mx-auto">

            {/* Lede / excerpt */}
            {content.excerpt && (
              <p className="text-xl sm:text-2xl text-gray-500 leading-relaxed font-display font-medium mb-10 pb-10 border-b border-navy-100">
                {content.excerpt}
              </p>
            )}

            {/* Share bar — top */}
            <ShareBar title={content.title} className="mb-10" />

            {/* Article body — drop cap on first paragraph */}
            {content.body && (
              <div className="[&>p:first-child::first-letter]:float-left [&>p:first-child::first-letter]:text-[4.5rem] [&>p:first-child::first-letter]:font-display [&>p:first-child::first-letter]:font-bold [&>p:first-child::first-letter]:text-navy-900 [&>p:first-child::first-letter]:leading-[0.8] [&>p:first-child::first-letter]:mr-2 [&>p:first-child::first-letter]:mt-2">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <PortableText value={content.body as any} components={portableTextComponents} />
              </div>
            )}

            {/* Share bar — bottom */}
            <div className="mt-16 pt-10 border-t border-navy-100 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <ShareBar title={content.title} />
              <Button href="/playbooks" variant="outline">← Back to Playbooks</Button>
            </div>

            {/* ── Author bio ── */}
            {content.author && (
              <div className="mt-12 pt-10 border-t border-navy-100 flex gap-5 items-start">
                {authorImageUrl && (
                  <Image
                    src={authorImageUrl}
                    alt={content.author.name}
                    width={72}
                    height={72}
                    className="rounded-full flex-shrink-0 grayscale"
                  />
                )}
                <div>
                  <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-1">
                    Written by
                  </p>
                  <p className="font-display text-lg font-medium text-navy-900">
                    {content.author.name}
                  </p>
                  {content.author.title && (
                    <p className="text-sm text-gray-500">{content.author.title}</p>
                  )}
                  {content.author.bio && (
                    <div className="mt-2">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <PortableText value={content.author.bio as any} components={bioComponents} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Giscus comments */}
            <GiscusComments />
          </div>
        </FadeIn>
      </Container>

      {/* ── Related reading ── */}
      {related.length > 0 && <RelatedSection related={related} />}
    </>
  )
}

// ── Shared related section ────────────────────────────────────────────────────

function RelatedSection({ related }: { related: Awaited<ReturnType<typeof getRelatedContent>> }) {
  return (
    <div className="bg-navy-50 py-16 sm:py-20">
      <Container>
        <FadeIn>
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-8">
            Related Reading
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ContentCard
                key={item._id}
                title={item.title}
                slug={typeof item.slug === 'string' ? item.slug : item.slug.current}
                contentType={item.contentType}
                excerpt={item.excerpt}
                publishedAt={item.publishedAt}
                guestName={item.guestName}
                category={item.categories?.[0]?.title}
                featuredImage={
                  item.featuredImage
                    ? { url: urlFor(item.featuredImage).width(800).height(450).url(), alt: item.featuredImage.alt ?? item.title }
                    : undefined
                }
              />
            ))}
          </div>
        </FadeIn>
      </Container>
    </div>
  )
}
