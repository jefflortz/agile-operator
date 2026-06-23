import type { Metadata } from 'next'
import { PortableText } from '@portabletext/react'
import { Container } from '@/components/ui/Container'
import { FadeIn } from '@/components/ui/FadeIn'
import { GridPattern } from '@/components/ui/GridPattern'
import { StylizedImage } from '@/components/ui/StylizedImage'
import Button from '@/components/ui/Button'
import { getServices } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'
import type { Service } from '@/lib/types'
import imageWhiteboard from '@/images/whiteboard.jpg'
import imageMeeting from '@/images/meeting.jpg'
import imageLaptop from '@/images/laptop.jpg'
import type { StaticImageData } from 'next/image'

export const metadata: Metadata = {
  title: 'Services | Agile Operator',
  description:
    'Three ways Agile Operator works with growth-stage companies — growth advisory, executive coaching, and interim or fractional executive leadership.',
}

// ── Default images + shapes per slot ─────────────────────────────────────────
const DEFAULT_VISUALS: { image: StaticImageData; shape: 0 | 1 | 2 }[] = [
  { image: imageWhiteboard, shape: 0 },
  { image: imageMeeting,    shape: 1 },
  { image: imageLaptop,     shape: 2 },
]

// ── Slug map (fallback when Sanity pillarPage ref isn't set yet) ──────────────
const PILLAR_SLUGS: Record<string, string> = {
  'Growth Advisory':                   'growth-advisory',
  'Executive Coaching':                'executive-coaching',
  'Interim / Fractional Executive':    'interim-fractional-executive',
  'Interim & Fractional Executive':    'interim-fractional-executive',
}

// ── Fallback service data ─────────────────────────────────────────────────────
const fallbackServices: Service[] = [
  {
    _id: 'fallback-1',
    title: 'Growth Advisory',
    headline: "Most growth-stage companies don't have a vision problem. They have an execution problem.",
    outcomes: [
      'Operating cadence installed. Meeting rhythms, decision rights, and reporting structures that keep your team aligned.',
      'Investor-ready strategy. Clear assumptions, honest risks, and credible milestones that hold up in the boardroom.',
      'Execution accountability. We stay in the room long enough to make sure the strategy doesn\'t dissolve under daily pressure.',
    ],
    order: 1,
    pillarPageSlug: 'growth-advisory',
  },
  {
    _id: 'fallback-2',
    title: 'Executive Coaching',
    headline: 'The best leaders invest in getting better. And they do it before a crisis forces their hand.',
    outcomes: [
      'Defined leadership identity. Clarity on your defaults under pressure and where your blind spots live.',
      'Personal operating system. Practical tools for managing time, energy, and decisions at the pace your role demands.',
      'Difficult conversation skills. The confidence to have the hard conversations your role requires without damaging what matters.',
    ],
    order: 2,
    pillarPageSlug: 'executive-coaching',
  },
  {
    _id: 'fallback-3',
    title: 'Interim & Fractional Executive',
    headline: 'Leadership gaps are expensive. Filling them with the wrong person is worse.',
    outcomes: [
      'Day-one credibility. A leader your board, investors, and team trust from the first meeting.',
      'Defined scope and timeline. No open-ended commitments — we agree upfront on what success looks like and when we\'re done.',
      'Clean knowledge transfer. We don\'t build dependency. What we create, your permanent team inherits and can run.',
    ],
    order: 3,
    pillarPageSlug: 'interim-fractional-executive',
  },
]

// ── Portable text ─────────────────────────────────────────────────────────────
const ptComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-base text-gray-600 leading-relaxed mt-4 first:mt-0">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-navy-900">{children}</strong>
    ),
  },
}

// ── Service section ───────────────────────────────────────────────────────────
function ServiceSection({
  service,
  index,
}: {
  service: Service
  index: number
}) {
  const isReversed = index % 2 !== 0
  const slug = service.pillarPageSlug ?? PILLAR_SLUGS[service.title]
  const href = slug ? `/services/${slug}` : '/contact'
  const { image: defaultImage, shape } = DEFAULT_VISUALS[index % 3]

  // Use the Sanity image if one has been uploaded, otherwise fall back to the
  // template stock photo for this slot.
  const imageSrc = service.image
    ? urlFor(service.image).width(1400).height(1330).url()
    : defaultImage

  return (
    <Container className="py-20 sm:py-28">
      <div
        className={`flex flex-col lg:flex-row lg:items-center lg:gap-x-8 xl:gap-x-20 ${
          isReversed ? 'lg:flex-row-reverse' : ''
        }`}
      >
        {/* ── Image ─────────────────────────────────────────────────────── */}
        <div className="flex justify-center lg:justify-end lg:flex-none">
          <FadeIn className="w-full max-w-[31rem] lg:max-w-[41rem]">
            <StylizedImage
              src={imageSrc}
              shape={shape}
              sizes="(min-width: 1024px) 41rem, 31rem"
              className={isReversed ? 'lg:justify-start' : 'lg:justify-end'}
            />
          </FadeIn>
        </div>

        {/* ── Content ───────────────────────────────────────────────────── */}
        <div className="mt-12 lg:mt-0 lg:w-[37rem] lg:flex-none">
          <FadeIn>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
              {service.title}
            </p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-navy-900 sm:text-4xl text-balance">
              {service.headline ?? service.title}
            </h2>

            {service.description && service.description.length > 0 && (
              <div className="mt-6 space-y-4">
                <PortableText
                  value={service.description as Parameters<typeof PortableText>[0]['value']}
                  components={ptComponents}
                />
              </div>
            )}

            {service.outcomes && service.outcomes.length > 0 && (
              <ul className="mt-8 space-y-4">
                {service.outcomes.map((outcome, i) => (
                  <li key={i} className="flex gap-3 items-start text-base text-gray-600 leading-relaxed">
                    <span
                      className="mt-[0.45rem] h-1.5 w-1.5 rounded-full bg-gold-500 flex-shrink-0"
                      aria-hidden="true"
                    />
                    {outcome}
                  </li>
                ))}
              </ul>
            )}

            <a
              href={href}
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-gold-500 transition-colors"
            >
              Learn more
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M6 12l4-4-4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </FadeIn>
        </div>
      </div>
    </Container>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ServicesPage() {
  const sanityServices = await getServices()
  const services = sanityServices.length > 0 ? sanityServices : fallbackServices

  return (
    <>
      {/* Hero */}
      <div className="relative isolate overflow-hidden pt-14">
        <GridPattern
          className="absolute inset-x-0 -top-14 -z-10 h-[800px] w-full mask-[linear-gradient(to_bottom_left,white_40%,transparent_50%)] fill-navy-50 stroke-navy-900/5"
          yOffset={-96}
          interactive
        />
        <Container className="pb-20 pt-20 sm:pb-28 sm:pt-32 md:pt-40">
          <FadeIn className="max-w-2xl">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
              Our Services
            </p>
            <h1 className="font-display text-5xl font-medium tracking-tight text-balance text-navy-900 sm:text-6xl">
              Three ways we work with your business.
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-xl leading-relaxed">
              Every engagement starts with a direct conversation. No packaged programs,
              no fixed retainers before you&apos;re ready. We design the scope around
              what you actually need.
            </p>
            <div className="mt-8">
              <Button href="/contact" size="lg">Book a Strategy Session</Button>
            </div>
          </FadeIn>
        </Container>
      </div>

      {/* Service sections */}
      <div className="mt-8 space-y-4 sm:space-y-8">
        {services.map((service, index) => (
          <ServiceSection key={service._id} service={service} index={index} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 bg-navy-900 py-24 sm:py-32">
        <Container>
          <FadeIn>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">
              Let&apos;s talk
            </p>
            <h2 className="font-display text-4xl font-medium tracking-tight text-white sm:text-5xl max-w-2xl text-balance">
              Not sure which engagement is right for you?
            </h2>
            <p className="mt-6 text-lg text-navy-200 max-w-xl">
              Most of our best client relationships started with a single honest
              conversation. Book a no-obligation strategy session and we&apos;ll
              figure it out together.
            </p>
            <div className="mt-8">
              <Button
                href="/contact"
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 hover:text-white"
              >
                Book a Strategy Session
              </Button>
            </div>
          </FadeIn>
        </Container>
      </div>
    </>
  )
}
