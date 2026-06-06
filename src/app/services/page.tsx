import { PortableText } from '@portabletext/react'
import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { FadeIn } from '@/components/ui/FadeIn'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { GridPattern } from '@/components/ui/GridPattern'
import { Border } from '@/components/ui/Border'
import Button from '@/components/ui/Button'
import { getServices } from '@/lib/queries'
import type { Service } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Services | Agile Operator',
  description:
    'Growth advisory, executive coaching, and fractional executive leadership for growth-stage companies navigating complexity under investor pressure.',
}

// Fallback until Sanity services are populated
const fallbackServices: Service[] = [
  {
    _id: 'fallback-1',
    title: 'Growth Advisory',
    headline:
      'Strategy and execution for companies navigating complexity under investor pressure.',
    outcomes: [
      'Aligned leadership team with a clear operating cadence',
      'Prioritized growth strategy built for your stage and sector',
      'Execution frameworks that hold up under board-level scrutiny',
    ],
    order: 1,
  },
  {
    _id: 'fallback-2',
    title: 'Executive Coaching',
    headline:
      '1:1 coaching for leaders navigating performance challenges, transitions, and scaling demands.',
    outcomes: [
      'Clarity on leadership identity and decision-making style',
      'A personal operating system for high-stakes environments',
      'Accelerated development through honest, experienced counsel',
    ],
    order: 2,
  },
  {
    _id: 'fallback-3',
    title: 'Interim / Fractional Executive',
    headline:
      'Experienced CEO, CMO, or operator leadership on a defined-term basis when you need steady hands fast.',
    outcomes: [
      'Day-one credibility with your board and leadership team',
      'Rapid stabilization or transition without a long-term commitment',
      'Full-time presence and accountability without full-time cost',
    ],
    order: 3,
  },
]

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mt-4 text-lg text-gray-600 leading-relaxed">{children}</p>
    ),
  },
}

function CheckIcon() {
  return (
    <svg
      className="h-5 w-5 flex-shrink-0 text-gold-500 mt-0.5"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ServiceSection({
  service,
  index,
}: {
  service: Service
  index: number
}) {
  const isEven = index % 2 === 0

  return (
    <div className={isEven ? 'bg-white py-24 sm:py-32' : 'bg-navy-50 py-24 sm:py-32'}>
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-start">
          {/* Left: service identity + description */}
          <FadeIn>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
              {service.title}
            </p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-balance text-navy-900 sm:text-4xl">
              {service.headline ?? service.title}
            </h2>
            {service.description && (
              <div className="mt-6">
                <PortableText
                  value={service.description as Parameters<typeof PortableText>[0]['value']}
                  components={portableTextComponents}
                />
              </div>
            )}
          </FadeIn>

          {/* Right: outcomes + CTA */}
          <FadeIn>
            {service.outcomes && service.outcomes.length > 0 ? (
              <Border className="pt-8">
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-navy-400 mb-6">
                  What you walk away with
                </p>
                <ul className="space-y-4">
                  {service.outcomes.map((outcome, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <CheckIcon />
                      <span className="text-base text-navy-700 leading-relaxed">
                        {outcome}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <Button href="/contact">Start a Conversation</Button>
                </div>
              </Border>
            ) : (
              <div className="pt-8">
                <Button href="/contact">Start a Conversation</Button>
              </div>
            )}
          </FadeIn>
        </div>
      </Container>
    </div>
  )
}

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
              The right partnership for what you&apos;re facing.
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-xl">
              We don&apos;t run plays from a playbook we found somewhere. We bring
              operator-earned experience to every engagement — and we meet you where
              the work is hardest.
            </p>
          </FadeIn>
        </Container>
      </div>

      {/* Service sections — alternating white / navy-50 */}
      {services.map((service, index) => (
        <ServiceSection key={service._id} service={service} index={index} />
      ))}

      {/* Final CTA */}
      <div className="bg-navy-900 py-24 sm:py-32">
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
