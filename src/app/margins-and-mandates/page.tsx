import Image from 'next/image'
import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { FadeIn, FadeInStagger } from '@/components/ui/FadeIn'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { GridPattern } from '@/components/ui/GridPattern'
import ContentCard from '@/components/ui/ContentCard'
import Button from '@/components/ui/Button'
import { getMarginsAndMandates, getLatestEpisodes } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'
import type { PlaybookContentPreview } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Margins & Mandates | Agile Operator',
  description:
    'Conversations with CEOs and operators about the plays, pivots, and pressure-tested leadership that define their companies. Hosted by Jeff Lortz.',
}

// Fallback platform links when Sanity doc isn't populated yet
const SPOTIFY_EMBED = 'https://open.spotify.com/embed/show/0JbihvBwMqoXr8EdEyWSOu'
const SPOTIFY_URL = 'https://open.spotify.com/show/0JbihvBwMqoXr8EdEyWSOu'
const YOUTUBE_URL = 'https://www.youtube.com/@Agile-Operator'
const SUBSTACK_URL = 'https://agileoperator.substack.com'

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

function PlatformLink({
  href,
  label,
  icon,
}: {
  href: string
  label: string
  icon: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 font-sans text-sm font-medium text-white transition hover:bg-white/20"
    >
      {icon}
      {label}
    </a>
  )
}

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
)

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const SubstackIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
  </svg>
)

export default async function MarginsAndMandatesPage() {
  const [showData, allEpisodes] = await Promise.all([
    getMarginsAndMandates(),
    getLatestEpisodes(50),
  ])

  const tagline = showData?.tagline ?? 'The plays, pivots, and pressure-tested leadership of top operators.'
  const description = showData?.description ??
    'Margins & Mandates is a podcast for CEOs and operators navigating the decisions that define their companies. Hosted by Jeff Lortz, each episode is a direct conversation with a founder, executive, or operator about what it actually takes to build and scale a technology business.'
  const spotifyUrl = showData?.spotifyUrl ?? SPOTIFY_URL
  const youtubeUrl = showData?.youtubeChannelUrl ?? YOUTUBE_URL

  // Use featured episodes if set in Sanity, otherwise fall back to most recent
  const featured = (showData?.featuredEpisodes?.length ?? 0) > 0
    ? showData!.featuredEpisodes!
    : allEpisodes.slice(0, 3)

  // All-episodes list excludes the featured ones to avoid duplication
  const featuredSlugs = new Set(featured.map((e) =>
    typeof e.slug === 'string' ? e.slug : e.slug.current
  ))
  const remaining = allEpisodes.filter((e) => {
    const slug = typeof e.slug === 'string' ? e.slug : e.slug.current
    return !featuredSlugs.has(slug)
  })

  const coverImageUrl = showData?.coverImage
    ? urlFor(showData.coverImage).width(400).height(400).url()
    : null

  return (
    <>
      {/* Hero — dark, full-bleed, nav inverts to white */}
      <div className="-mt-[92px] relative isolate overflow-hidden bg-navy-950">
        <GridPattern
          className="absolute inset-x-0 top-0 -z-10 h-[900px] w-full mask-[linear-gradient(to_bottom_right,transparent_30%,rgba(0,0,0,0.7)_70%)] fill-navy-900 stroke-white/5"
          yOffset={-96}
          interactive
        />
        <Container className="pb-24 pt-36 sm:pb-32 sm:pt-44 md:pt-52">
          <FadeIn>
            <div className="flex flex-col lg:flex-row lg:items-end gap-10 lg:gap-16">

              {/* Show art */}
              <div className="flex-shrink-0">
                {coverImageUrl ? (
                  <Image
                    src={coverImageUrl}
                    alt="Margins & Mandates"
                    width={180}
                    height={180}
                    className="rounded-2xl shadow-2xl"
                    priority
                  />
                ) : (
                  <Image
                    src="/Margin and Mandates/Margins and Mandates Logo[58] (1).jpg"
                    alt="Margins & Mandates"
                    width={180}
                    height={180}
                    className="rounded-2xl shadow-2xl"
                    priority
                  />
                )}
              </div>

              {/* Show info */}
              <div className="flex-1">
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-400 mb-3">
                  Podcast · Hosted by Jeff Lortz
                </p>
                <h1 className="font-display text-5xl font-medium tracking-tight text-white sm:text-6xl text-balance">
                  Margins &amp; Mandates
                </h1>
                <p className="mt-4 text-xl text-navy-200 max-w-2xl leading-relaxed">
                  {tagline}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <PlatformLink href={spotifyUrl} label="Spotify" icon={<SpotifyIcon />} />
                  <PlatformLink href={youtubeUrl} label="YouTube" icon={<YouTubeIcon />} />
                  {showData?.applePodcastUrl && (
                    <PlatformLink
                      href={showData.applePodcastUrl}
                      label="Apple Podcasts"
                      icon={
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.266a7.734 7.734 0 0 1 0 15.468A7.734 7.734 0 0 1 12 4.266zm0 1.6a6.134 6.134 0 0 0 0 12.268A6.134 6.134 0 0 0 12 5.866zm-.32 2.24c.177 0 .32.143.32.32v5.427l2.293-2.293a.32.32 0 1 1 .453.453l-2.853 2.853a.32.32 0 0 1-.453 0L8.587 12.013a.32.32 0 1 1 .453-.453L11.36 13.85V8.426c0-.177.143-.32.32-.32z"/>
                        </svg>
                      }
                    />
                  )}
                  <PlatformLink href={SUBSTACK_URL} label="Newsletter" icon={<SubstackIcon />} />
                </div>
              </div>

            </div>
          </FadeIn>
        </Container>
      </div>

      {/* About the show + Spotify embed */}
      <div className="bg-white py-24 sm:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-start">
            <FadeIn>
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
                About the show
              </p>
              <h2 className="font-display text-3xl font-medium tracking-tight text-navy-900 sm:text-4xl text-balance">
                Leadership conversations that don&apos;t live in the strategy deck.
              </h2>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                {description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={spotifyUrl} external size="sm">
                  Listen on Spotify
                </Button>
                <Button href={youtubeUrl} external variant="outline" size="sm">
                  Watch on YouTube
                </Button>
              </div>
            </FadeIn>

            {/* Spotify embed */}
            <FadeIn>
              <iframe
                src={SPOTIFY_EMBED}
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-2xl"
                title="Margins & Mandates on Spotify"
              />
            </FadeIn>
          </div>
        </Container>
      </div>

      {/* Featured episodes */}
      {featured.length > 0 && (
        <div className="bg-navy-50 py-24 sm:py-32">
          <SectionIntro
            eyebrow="Featured Episodes"
            title="Start here."
          >
            <p>
              A few conversations that capture what the show is about.
            </p>
          </SectionIntro>
          <Container className="mt-16">
            <FadeInStagger>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((item) => (
                  <FadeIn key={item._id}>
                    <ContentCard {...toCardProps(item)} />
                  </FadeIn>
                ))}
              </div>
            </FadeInStagger>
          </Container>
        </div>
      )}

      {/* All episodes */}
      {remaining.length > 0 && (
        <div className="bg-white py-24 sm:py-32">
          <SectionIntro
            eyebrow="All Episodes"
            title="Every conversation."
          />
          <Container className="mt-16">
            <FadeInStagger>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {remaining.map((item) => (
                  <FadeIn key={item._id}>
                    <ContentCard {...toCardProps(item)} />
                  </FadeIn>
                ))}
              </div>
            </FadeInStagger>
          </Container>
        </div>
      )}

      {/* Empty state — no episodes in Sanity yet */}
      {allEpisodes.length === 0 && (
        <div className="bg-white py-24 sm:py-32">
          <Container>
            <FadeIn>
              <p className="text-gray-400 text-sm">
                Add episodes in Sanity Studio (type: playbookContent, contentType: episode) to populate this page.
              </p>
            </FadeIn>
          </Container>
        </div>
      )}

      {/* Subscribe CTA */}
      <div className="bg-navy-900 py-24 sm:py-32">
        <Container>
          <FadeIn>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
              <div className="max-w-xl">
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">
                  Stay in the loop
                </p>
                <h2 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl text-balance">
                  New episodes, frameworks, and field notes — in your inbox.
                </h2>
                <p className="mt-4 text-navy-200 text-lg">
                  Subscribe to the Agile Operator newsletter on Substack. No noise — just
                  the thinking behind the show and the work.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
                <Button
                  href={SUBSTACK_URL}
                  external
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 hover:text-white whitespace-nowrap"
                >
                  Subscribe on Substack
                </Button>
                <Button
                  href={spotifyUrl}
                  external
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white whitespace-nowrap"
                >
                  Follow on Spotify
                </Button>
              </div>
            </div>
          </FadeIn>
        </Container>
      </div>
    </>
  )
}
