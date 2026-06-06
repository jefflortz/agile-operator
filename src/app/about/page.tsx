import Image from 'next/image'
import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { FadeIn, FadeInStagger } from '@/components/ui/FadeIn'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Testimonial } from '@/components/ui/Testimonial'
import { GridPattern } from '@/components/ui/GridPattern'
import { Border } from '@/components/ui/Border'
import { StylizedImage } from '@/components/ui/StylizedImage'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'About | Agile Operator',
  description:
    'Jeff Lortz brings over two decades of executive leadership in Enterprise SaaS, Private Equity, and Digital Transformation. He built Agile Operator to be the advisory team he wished he had.',
}

const credentials = [
  {
    stat: '20+',
    label: 'Years of Executive Leadership',
    description:
      'Enterprise SaaS, Private Equity, and Digital Transformation across high-growth and investor-backed environments.',
  },
  {
    stat: 'CEO',
    label: 'Operator in the Seat',
    description:
      'Not a consultant who studied the problem — a former CEO and C-suite executive who carried the weight and has the scars.',
  },
  {
    stat: 'PE',
    label: 'Investor-Backed Growth',
    description:
      'Deep experience leading companies through the scrutiny and velocity of private equity ownership and board-level accountability.',
  },
]

const values = [
  {
    title: 'Operators, not advisors',
    body: 'We\'ve been in the seat. We know what it feels like when the board is watching, the team is struggling, and the strategy isn\'t landing. Our counsel comes from that place — not from a framework we found in a business school case study.',
  },
  {
    title: 'Clarity over complexity',
    body: 'Most leadership problems aren\'t actually mysterious. They\'re obscured by noise, politics, and the pressure of real-time decisions. We help you cut through and find the line.',
  },
  {
    title: 'The work is the relationship',
    body: 'We don\'t do retainers that quietly expire. If we\'re working together, you have access to the thinking when it matters most — in the moment, not in a scheduled debrief two weeks later.',
  },
]

export default function AboutPage() {
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
              About Jeff
            </p>
            <h1 className="font-display text-5xl font-medium tracking-tight text-balance text-navy-900 sm:text-6xl">
              Built for operators. By an operator.
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-xl">
              Jeff Lortz founded Agile Operator to be the advisory team he wished he had —
              one built from real executive experience, not consulting credentials.
            </p>
          </FadeIn>
        </Container>
      </div>

      {/* Bio */}
      <div className="bg-white py-24 sm:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-start">
            <FadeIn>
              <div className="relative max-w-sm mx-auto lg:mx-0 lg:max-w-none">
                <StylizedImage
                  src="/Headshots/0L9A6094 (1).png"
                  alt="Jeff Lortz"
                  width={480}
                  height={560}
                />
              </div>
            </FadeIn>
            <FadeIn>
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
                Background
              </p>
              <h2 className="font-display text-3xl font-medium tracking-tight text-navy-900 sm:text-4xl text-balance">
                Two decades in the room where the hard decisions get made.
              </h2>
              <div className="mt-6 space-y-5 text-lg text-gray-600 leading-relaxed">
                <p>
                  Jeff Lortz brings over two decades of executive leadership in Enterprise SaaS,
                  Private Equity, and Digital Transformation. As a former CEO and C-suite operator,
                  he&apos;s led companies through scaling, strategic transition, and investor-backed
                  growth — the kind of environments where the margin for error is thin and the
                  pressure is constant.
                </p>
                <p>
                  He founded Agile Operator after recognizing a gap: too many growth-stage leaders
                  were getting advice from people who had never actually carried what they were
                  carrying. The frameworks were sophisticated. The understanding was shallow.
                </p>
                <p>
                  Agile Operator was built to fix that — a firm where every engagement is led by
                  someone who has been in the seat, navigated the politics, and survived the
                  moments that don&apos;t make it into the case study.
                </p>
                <p className="font-display text-xl font-medium text-navy-800 italic border-l-2 border-gold-500 pl-5">
                  &ldquo;We&apos;re not consultants — we&apos;re operators with the scars, the playbooks,
                  and the clarity to help your teams level up fast.&rdquo;
                </p>
              </div>
            </FadeIn>
          </div>
        </Container>
      </div>

      {/* Credentials */}
      <div className="bg-navy-50 py-24 sm:py-32">
        <SectionIntro
          eyebrow="Experience"
          title="The background that makes the difference."
        >
          <p>
            Real advisory requires real experience. Here&apos;s what Jeff brings to every engagement.
          </p>
        </SectionIntro>
        <Container className="mt-16">
          <FadeInStagger>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {credentials.map((item) => (
                <FadeIn key={item.stat}>
                  <Border className="pt-8">
                    <p className="font-display text-5xl font-semibold text-navy-900">
                      {item.stat}
                    </p>
                    <p className="mt-2 font-sans text-sm font-semibold uppercase tracking-widest text-gold-500">
                      {item.label}
                    </p>
                    <p className="mt-4 text-base text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </Border>
                </FadeIn>
              ))}
            </div>
          </FadeInStagger>
        </Container>
      </div>

      {/* Philosophy */}
      <div className="bg-navy-900 py-24 sm:py-32">
        <Container>
          <FadeIn>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">
              How we work
            </p>
            <h2 className="font-display text-4xl font-medium tracking-tight text-white sm:text-5xl max-w-2xl text-balance">
              A few things we believe that shape every engagement.
            </h2>
          </FadeIn>
          <FadeInStagger className="mt-16">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((item) => (
                <FadeIn key={item.title}>
                  <Border invert className="pt-8">
                    <h3 className="font-display text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-base text-navy-200 leading-relaxed">
                      {item.body}
                    </p>
                  </Border>
                </FadeIn>
              ))}
            </div>
          </FadeInStagger>
        </Container>
      </div>

      {/* Testimonial */}
      <Testimonial
        author={{ name: 'Greg J.', title: 'CEO and Founder, Marketing Tech Agency' }}
      >
        He helped me cut through the noise, navigate the politics, and build a plan that not
        only kept my new bosses happy but made sure I didn&apos;t lose sight of my own growth
        and balance. He&apos;s not just a coach — he&apos;s the steady, clear-eyed partner every
        leader wishes they had during big transitions.
      </Testimonial>

      {/* Podcast strip */}
      <div className="bg-white py-24 sm:py-32">
        <Container>
          <div className="flex flex-col sm:flex-row items-center gap-8 rounded-2xl bg-navy-50 p-8 sm:p-10">
            <Image
              src="/Margin and Mandates/Margins and Mandates Logo[58] (1).jpg"
              alt="Margins and Mandates Podcast"
              width={100}
              height={100}
              className="rounded-xl flex-shrink-0"
            />
            <div className="flex-1">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-2">
                Podcast
              </p>
              <h3 className="font-display text-2xl text-navy-900">
                Margins &amp; Mandates
              </h3>
              <p className="mt-2 text-gray-600 text-base max-w-xl">
                Jeff hosts Margins &amp; Mandates — conversations with top operators about the
                plays, pivots, and pressure-tested leadership that define careers. Available on
                Spotify, YouTube, and Apple Podcasts.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button href="/margins-and-mandates" variant="outline" size="sm">
                  See All Episodes
                </Button>
                <Button
                  href="https://open.spotify.com/show/0JbihvBwMqoXr8EdEyWSOu"
                  variant="ghost"
                  size="sm"
                  external
                >
                  Listen on Spotify
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* CTA */}
      <div className="bg-navy-50 py-24 sm:py-32">
        <Container>
          <FadeIn className="text-center max-w-2xl mx-auto">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
              Work with Jeff
            </p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-navy-900 sm:text-4xl text-balance">
              Ready to have a different kind of conversation?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Book a no-obligation strategy session. No pitch deck, no proposal — just a
              direct conversation about what you&apos;re navigating and whether we&apos;re the
              right fit.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" size="lg">
                Book a Strategy Session
              </Button>
              <Button href="/services" variant="outline" size="lg">
                See Our Services
              </Button>
            </div>
          </FadeIn>
        </Container>
      </div>
    </>
  )
}
