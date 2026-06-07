import type { Metadata } from 'next'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { FadeIn, FadeInStagger } from '@/components/ui/FadeIn'
import { Border } from '@/components/ui/Border'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Testimonial } from '@/components/ui/Testimonial'
import { GridPattern } from '@/components/ui/GridPattern'
import { StylizedImage } from '@/components/ui/StylizedImage'
import ContentCard from '@/components/ui/ContentCard'
import Button from '@/components/ui/Button'
import { getLatestArticles, getLatestEpisodes, getServices } from '@/lib/queries'
import type { PlaybookContentPreview, Service } from '@/lib/types'
import { urlFor } from '@/lib/sanity'

export const metadata: Metadata = {
  title: 'Agile Operator | Strategic Growth Advisory for Technology CEOs',
  description:
    'Proven playbooks and frameworks for B2B SaaS operators navigating growth. Jeff Lortz helps technology CEOs balance margins and mandates at $5M–$50M ARR.',
  keywords: 'B2B SaaS growth advisory, technology CEO coaching, SaaS operator playbooks, Boston growth advisory, executive leadership',
  alternates: { canonical: 'https://agile-operator.com' },
  openGraph: {
    title: 'Agile Operator | Strategic Growth Advisory for Technology CEOs',
    description:
      'Proven playbooks and frameworks for B2B SaaS operators navigating growth. Balance margins and mandates.',
    url: 'https://agile-operator.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agile Operator | Strategic Growth Advisory for Technology CEOs',
    description: 'Proven playbooks for B2B SaaS operators navigating growth.',
  },
}

const fallbackServices: Service[] = [
  {
    _id: 'fallback-1',
    title: 'Growth Advisory',
    headline:
      'Strategy, planning, and operational execution for growth-stage companies navigating complexity under investor pressure.',
    order: 1,
  },
  {
    _id: 'fallback-2',
    title: 'Executive Coaching',
    headline:
      '1:1 coaching for individual leaders navigating performance challenges, executive transitions, and scaling demands.',
    order: 2,
  },
  {
    _id: 'fallback-3',
    title: 'Interim / Fractional Executive',
    headline:
      'Experienced CEO, CMO, or operator leadership on a defined-term basis when you need steady hands fast.',
    order: 3,
  },
]

function toCardProps(item: PlaybookContentPreview) {
  return {
    title: item.title,
    slug: item.slug.current ?? item.slug,
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://agile-operator.com/#organization',
      name: 'Agile Operator LLC',
      url: 'https://agile-operator.com',
      logo: 'https://agile-operator.com/SVG/Agile%20Operator-01.svg',
      sameAs: [
        'https://www.linkedin.com/company/the-agile-operator/',
        'https://x.com/theagileoperator',
        'https://open.spotify.com/show/0JbihvBwMqoXr8EdEyWSOu',
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: '75 State St',
        addressLocality: 'Boston',
        addressRegion: 'MA',
        postalCode: '02109',
        addressCountry: 'US',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'jeff@agile-operator.com',
        contactType: 'customer service',
      },
    },
    {
      '@type': 'Person',
      '@id': 'https://agile-operator.com/#jeff-lortz',
      name: 'Jeff Lortz',
      jobTitle: 'Founder & Principal Advisor',
      worksFor: { '@id': 'https://agile-operator.com/#organization' },
      url: 'https://agile-operator.com/about',
      sameAs: [
        'https://www.linkedin.com/company/the-agile-operator/',
      ],
      description:
        'Jeff Lortz brings over two decades of executive leadership in Enterprise SaaS, Private Equity, and Digital Transformation. Founder of Agile Operator LLC.',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://agile-operator.com/#website',
      url: 'https://agile-operator.com',
      name: 'Agile Operator',
      publisher: { '@id': 'https://agile-operator.com/#organization' },
    },
  ],
}

export default async function Home() {
  const [articles, episodes, sanityServices] = await Promise.all([
    getLatestArticles(3),
    getLatestEpisodes(2),
    getServices(),
  ])
  const services = sanityServices.length > 0 ? sanityServices : fallbackServices

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="relative isolate overflow-hidden pt-14">
        <GridPattern
          className="absolute inset-x-0 -top-14 -z-10 h-[1000px] w-full mask-[linear-gradient(to_bottom_left,white_40%,transparent_50%)] fill-navy-50 stroke-navy-900/5"
          yOffset={-96}
          interactive
        />
<Container className="pb-24 pt-20 sm:pb-32 sm:pt-32 md:pt-40">
          <FadeIn className="max-w-3xl">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
              Strategic Growth Advisory
            </p>
            <h1 className="font-display text-5xl font-medium tracking-tight text-balance text-navy-900 sm:text-7xl">
              Scale smarter. Lead with clarity.
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-xl">
              We help growth-minded leaders align teams, accelerate execution, and build businesses that last — with agile playbooks built for high-stakes environments.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button href="/contact" size="lg">Book a Strategy Session</Button>
              <Button href="/playbooks" variant="outline" size="lg">Explore Playbooks</Button>
            </div>
          </FadeIn>
        </Container>
      </div>

      {/* Services */}
      <div className="mt-24 sm:mt-32 lg:mt-40">
        <SectionIntro
          eyebrow="What we do"
          title="Advisory built for operators who run under pressure."
        >
          <p>
            We work with growth-stage leaders who need more than a framework — they need a partner who has carried what they&apos;re carrying.
          </p>
        </SectionIntro>
        <Container className="mt-16">
          <FadeInStagger>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {services.map((service, index) => (
                <FadeIn key={service._id}>
                  <Border className="pt-8">
                    <p className="font-display text-6xl font-medium text-navy-900 opacity-[0.06] leading-none mb-3 select-none" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-navy-900">
                      {service.title}
                    </h3>
                    <p className="mt-4 text-base text-gray-600 leading-relaxed">
                      {service.headline}
                    </p>
                  </Border>
                </FadeIn>
              ))}
            </div>
          </FadeInStagger>
          <FadeIn className="mt-12">
            <Button href="/services" variant="outline">Learn More</Button>
          </FadeIn>
        </Container>
      </div>

      {/* Collective Edge callout */}
      <div className="relative mt-24 sm:mt-32 lg:mt-40 bg-navy-900 py-24 sm:py-32 overflow-hidden">
        <GridPattern
          className="absolute inset-0 h-full w-full fill-white/[0.025] stroke-white/[0.05] mask-[linear-gradient(to_bottom_left,white_30%,transparent_70%)]"
          yOffset={0}
        />
        <Container className="relative">
          <FadeIn>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">
              Collective Edge — CEO Council
            </p>
            <h2 className="font-display text-4xl font-medium tracking-tight text-white sm:text-5xl max-w-2xl text-balance">
              A peer-advisory council for Boston technology CEOs.
            </h2>
            <p className="mt-6 text-lg text-navy-200 max-w-xl">
              Eight seats. Founding cohort forming Summer 2026. A confidential room for the decisions that don&apos;t belong in a board meeting — and don&apos;t have an obvious other room.
            </p>
            <div className="mt-8">
              <Button
                href="/collective-edge"
                variant="outline"
                className="border-white text-white hover:bg-white/10 hover:text-white"
              >
                Learn More
              </Button>
            </div>
          </FadeIn>
        </Container>
      </div>

      {/* Featured Playbooks */}
      <div className="mt-24 sm:mt-32 lg:mt-40">
        <SectionIntro
          eyebrow="Playbooks"
          title="Frameworks and conversations for operators."
        >
          <p>
            Articles and podcast episodes from the field — the plays, pivots, and pressure-tested leadership of operators who have been in the seat.
          </p>
        </SectionIntro>

        {/* Margins & Mandates strip */}
        <Container className="mt-16">
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-center gap-8 rounded-2xl bg-navy-50 p-8 sm:p-10">
              <Image
                src="/Margin and Mandates/Margins and Mandates Logo[58] (1).jpg"
                alt="Margins and Mandates Podcast"
                width={120}
                height={120}
                className="rounded-xl flex-shrink-0"
              />
              <div className="flex-1">
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-2">Podcast</p>
                <h3 className="font-display text-2xl text-navy-900">Margins &amp; Mandates</h3>
                <p className="mt-2 text-gray-600 text-sm">
                  Hosted by Jeff Lortz — the plays, pivots, and pressure-tested leadership of top operators. Available on Spotify, YouTube, and Apple Podcasts.
                </p>
                <div className="mt-4 flex gap-3">
                  <Button href="/margins-and-mandates" size="sm" variant="outline">See All Episodes</Button>
                </div>
              </div>
            </div>
          </FadeIn>
        </Container>

        {/* Latest articles */}
        {articles.length > 0 && (
          <Container className="mt-12">
            <FadeIn>
              <h3 className="font-display text-lg font-semibold text-navy-900 mb-6">Latest Articles</h3>
            </FadeIn>
            <FadeInStagger>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((item) => (
                  <FadeIn key={item._id}>
                    <ContentCard {...toCardProps(item)} />
                  </FadeIn>
                ))}
              </div>
            </FadeInStagger>
          </Container>
        )}

        {/* Latest episodes */}
        {episodes.length > 0 && (
          <Container className="mt-10">
            <FadeIn>
              <h3 className="font-display text-lg font-semibold text-navy-900 mb-6">Latest Episodes</h3>
            </FadeIn>
            <FadeInStagger>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {episodes.map((item) => (
                  <FadeIn key={item._id}>
                    <ContentCard {...toCardProps(item)} />
                  </FadeIn>
                ))}
              </div>
            </FadeInStagger>
          </Container>
        )}

        {(articles.length > 0 || episodes.length > 0) && (
          <Container className="mt-10">
            <FadeIn>
              <Button href="/playbooks" variant="outline">View All Playbooks</Button>
            </FadeIn>
          </Container>
        )}

        {/* Placeholder when no content yet */}
        {articles.length === 0 && episodes.length === 0 && (
          <Container className="mt-12">
            <FadeIn>
              <p className="text-gray-400 text-sm">
                Add articles and episodes in Sanity Studio to populate this section.
              </p>
            </FadeIn>
          </Container>
        )}
      </div>

      {/* Testimonial */}
      <div className="mt-24 sm:mt-32 lg:mt-40">
        <Testimonial
          author={{ name: 'Greg J.', title: 'CEO and Founder, Marketing Tech Agency' }}
        >
          He helped me cut through the noise, navigate the politics, and build a plan that not only kept my new bosses happy but made sure I didn&apos;t lose sight of my own growth and balance. He&apos;s not just a coach — he&apos;s the steady, clear-eyed partner every leader wishes they had during big transitions.
        </Testimonial>
      </div>

      {/* Meet Jeff */}
      <div className="mt-24 sm:mt-32 lg:mt-40">
        <Container>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
            <FadeIn>
              <div className="relative max-w-sm mx-auto lg:mx-0 p-4">
                <StylizedImage
                  src="/Headshots/0L9A6094 (1).png"
                  alt="Jeff Lortz"
                  width={480}
                  height={560}
                />
              </div>
            </FadeIn>
            <FadeIn>
              <p className="font-sans text-sm font-semibold uppercase tracking-widest text-gold-500 mb-4">
                About Jeff
              </p>
              <h2 className="font-display text-4xl font-medium tracking-tight text-navy-900 sm:text-5xl">
                Built this to be the advisory team I wished I had.
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                Jeff Lortz brings over two decades of executive leadership in Enterprise SaaS, Private Equity, and Digital Transformation. As a former CEO and C-suite operator, he&apos;s led companies through scaling, strategic transition, and investor-backed growth.
              </p>
              <blockquote className="mt-6 border-l-2 border-gold-500 pl-5">
                <p className="text-lg text-gray-500 italic leading-relaxed">
                  &ldquo;We&apos;re not consultants — we&apos;re operators with the scars, the playbooks, and the clarity to help your teams level up fast.&rdquo;
                </p>
              </blockquote>
              <div className="mt-8">
                <Button href="/about" variant="outline">Meet Jeff</Button>
              </div>
            </FadeIn>
          </div>
        </Container>
      </div>

      {/* CTA */}
      <div className="mt-24 sm:mt-32 lg:mt-40 bg-navy-50 py-24 sm:py-32">
        <Container>
          <FadeIn className="text-center">
            <Image
              src="/SVG/Agile Operator-03.svg"
              alt=""
              width={56}
              height={56}
              className="mx-auto mb-6 opacity-20 pointer-events-none select-none"
              aria-hidden="true"
            />
            <h2 className="font-display text-3xl font-medium tracking-tight text-navy-900 sm:text-4xl">
              Ready to transform your business?
            </h2>
            <p className="mt-4 text-gray-600 max-w-md mx-auto">
              Schedule a no-obligation strategy session to discuss your challenges.
            </p>
            <div className="mt-8">
              <Button href="/contact" size="lg">Book a Strategy Session</Button>
            </div>
          </FadeIn>
        </Container>
      </div>
    </>
  )
}
