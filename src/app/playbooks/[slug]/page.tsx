import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { Container } from '@/components/ui/Container'
import { FadeIn } from '@/components/ui/FadeIn'
import Button from '@/components/ui/Button'
import { getContentBySlug } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'

// Portable Text component overrides
const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mt-6 text-lg text-gray-600 leading-relaxed">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mt-12 font-display text-3xl font-medium text-navy-900">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mt-10 font-display text-2xl font-medium text-navy-900">{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="mt-8 font-display text-xl font-medium text-navy-900">{children}</h4>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="mt-8 border-l-4 border-gold-500 pl-6 italic text-gray-600 text-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mt-6 space-y-2 list-disc list-outside pl-6 text-gray-600 text-lg">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mt-6 space-y-2 list-decimal list-outside pl-6 text-gray-600 text-lg">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }: { children?: React.ReactNode }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-navy-900">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => <em>{children}</em>,
    link: ({ value, children }: { value?: { href: string }; children?: React.ReactNode }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-navy-700 underline underline-offset-2 hover:text-gold-600"
      >
        {children}
      </a>
    ),
  },
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function getYouTubeEmbedId(url: string) {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match?.[1] ?? null
}

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
    ? urlFor(content.featuredImage).width(1200).height(630).url()
    : null

  const youtubeEmbedId = content.youtubeUrl ? getYouTubeEmbedId(content.youtubeUrl) : null

  return (
    <>
      {/* Header */}
      <div className="pt-24 pb-12 sm:pt-32">
        <Container>
          <FadeIn>
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400">
              <Link href="/playbooks" className="hover:text-navy-700 transition-colors">
                Playbooks
              </Link>
              <span>›</span>
              <span className={isEpisode ? 'text-gold-600' : 'text-navy-600'}>
                {isEpisode ? 'Episode' : content.categories?.[0]?.title ?? 'Article'}
              </span>
            </nav>

            {/* Type badge */}
            <span className={`inline-block text-xs font-sans font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full mb-6 ${
              isEpisode ? 'bg-gold-400/20 text-gold-600' : 'bg-navy-50 text-navy-600'
            }`}>
              {isEpisode ? 'Episode' : 'Article'}
            </span>

            {/* Title */}
            <h1 className="font-display text-4xl font-medium tracking-tight text-navy-900 sm:text-5xl max-w-3xl text-balance">
              {content.title}
            </h1>

            {/* Episode guest */}
            {isEpisode && content.guestName && (
              <p className="mt-4 text-xl text-gray-500">
                with <span className="text-navy-700 font-medium">{content.guestName}</span>
                {content.guestTitle && <span className="text-gray-400">, {content.guestTitle}</span>}
              </p>
            )}

            {/* Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-400">
              {content.publishedAt && <span>{formatDate(content.publishedAt)}</span>}
              {!isEpisode && content.categories?.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/playbooks?type=article`}
                  className="hover:text-navy-700 transition-colors"
                >
                  {cat.title}
                </Link>
              ))}
            </div>
          </FadeIn>
        </Container>
      </div>

      {/* Featured image (articles) */}
      {!isEpisode && featuredImageUrl && (
        <Container className="mb-12">
          <FadeIn>
            <div className="relative aspect-[2/1] overflow-hidden rounded-2xl">
              <Image
                src={featuredImageUrl}
                alt={content.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </FadeIn>
        </Container>
      )}

      {/* Episode: YouTube embed + podcast links */}
      {isEpisode && (
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
                <Image
                  src={featuredImageUrl}
                  alt={content.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : null}

            {/* Podcast listen links */}
            {(content.spotifyUrl || content.applePodcastUrl || content.youtubeUrl) && (
              <div className="mt-6 flex flex-wrap gap-3">
                {content.spotifyUrl && (
                  <a
                    href={content.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#1DB954] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                    Listen on Spotify
                  </a>
                )}
                {content.applePodcastUrl && (
                  <a
                    href={content.applePodcastUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#872EC4] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  >
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
      )}

      {/* Body content */}
      <Container className="pb-24">
        <FadeIn>
          <div className="max-w-prose mx-auto">
            {/* Excerpt / intro */}
            {content.excerpt && (
              <p className="text-xl text-gray-500 leading-relaxed border-l-4 border-navy-100 pl-6 mb-8">
                {content.excerpt}
              </p>
            )}

            {/* Article body */}
            {!isEpisode && content.body && (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <PortableText value={content.body as any} components={portableTextComponents} />
            )}

            {/* Episode show notes */}
            {isEpisode && content.showNotes && (
              <>
                <h2 className="font-display text-2xl font-medium text-navy-900 mt-4 mb-2">Show Notes</h2>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <PortableText value={content.showNotes as any} components={portableTextComponents} />
              </>
            )}

            {/* Back link */}
            <div className="mt-16 pt-8 border-t border-navy-100">
              <Button href="/playbooks" variant="outline">← Back to Playbooks</Button>
            </div>
          </div>
        </FadeIn>
      </Container>
    </>
  )
}
