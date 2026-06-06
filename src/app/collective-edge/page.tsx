import Image from 'next/image'
import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { FadeIn, FadeInStagger } from '@/components/ui/FadeIn'
import { GridPattern } from '@/components/ui/GridPattern'
import { Border } from '@/components/ui/Border'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Collective Edge — CEO Council | Agile Operator',
  description:
    'A peer-advisory council for Boston technology CEOs. Eight seats. Founding cohort forming for Summer 2026.',
}

const memberBenefits = [
  {
    title: 'A small room of peers who have carried the same load',
    body: 'Eight technology CEOs leading B2B software companies at comparable stage. Pattern recognition is dense. The advice you get is grounded in what your peers have actually done — not what the framework says.',
  },
  {
    title: 'Time and structure for the decisions that matter',
    body: 'Each session is built around a real decision a member is carrying. The format is disciplined. The conversation is focused. No panels, no curriculum, no general-purpose advice.',
  },
  {
    title: 'A confidential complement to your board',
    body: 'Your board is governance. The council is counsel. The same operator can hold both — and most CEOs benefit from doing so.',
  },
]

const decisions = [
  {
    title: 'The executive you hired who isn\'t going to make it',
    body: 'You see it. Your team sees it. Replacing them is expensive, slow, and politically loaded. The decision is yours and it is not going to get easier next quarter.',
  },
  {
    title: 'The co-founder who has stalled out',
    body: 'Same person who started this with you. Same loyalty. Different stage. The conversation you need to have is not one the board can have for you.',
  },
  {
    title: 'The customer concentration risk you are minimizing',
    body: 'The customer is paying, the relationship is good, the renewal looks fine. You also know what happens if they consolidate vendors. The math is in your head; you have not put it on a slide.',
  },
  {
    title: 'The term sheet, the offer, the exit conversation',
    body: 'The decisions whose consequences land on you alone. The ones you cannot rehearse with your team and cannot fully share with your spouse.',
  },
]

const structure = [
  '8 technology CEOs per cohort (founding cohort: forming for Summer 2026)',
  'Confidential by structure — Chatham House rule, no recordings',
  'Monthly in-person roundtable in Boston',
  'Quarterly individual business review meetings with the moderator',
  'Optional individual coaching at a member rate',
]

const criteria = [
  'CEO or founder-CEO of a technology company in Boston metro',
  'B2B SaaS or vertical software, typically between $5M and $50M in annual revenue',
  'Navigating a period of growth, transition, or strategic complexity',
  'Values candid exchange and peer accountability',
  'Willing to commit to monthly in-person participation and confidentiality',
]

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 items-start">
      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
      <span className="text-base leading-relaxed">{children}</span>
    </li>
  )
}

export default function CollectiveEdgePage() {
  return (
    <>
      {/* Hero — -mt-[92px] cancels nav wrapper's pt-14+pt-9 so bg-navy-950 starts at top of viewport */}
      <div className="-mt-[92px] relative isolate overflow-hidden bg-navy-950">
        <GridPattern
          className="absolute inset-x-0 top-0 -z-10 h-[900px] w-full mask-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.6)_60%)] fill-navy-900 stroke-white/5"
          yOffset={-96}
          interactive
        />
        <Container className="pb-24 pt-36 sm:pb-32 sm:pt-44 md:pt-52">
          <FadeIn className="max-w-3xl">
            {/* Founding cohort badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
              <span className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-400">
                Founding Cohort — Summer 2026
              </span>
            </div>
            <h1 className="font-display text-5xl font-medium tracking-tight text-balance text-white sm:text-7xl">
              A Peer-Advisory Council for Boston Technology CEOs
            </h1>
            <p className="mt-6 text-xl text-navy-200 max-w-2xl">
              Eight seats. Collective Edge convenes a small, confidential council of
              technology CEOs in Boston to work through the decisions that don&apos;t
              belong in a board meeting — and don&apos;t have an obvious other room.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button href="/contact" size="lg">
                Apply for a Seat
              </Button>
              <Button
                href="#how-it-works"
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                How It Works
              </Button>
            </div>
            {/* Cohort specs */}
            <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                { label: 'Seats', value: '8' },
                { label: 'Location', value: 'Boston Metro' },
                { label: 'Model', value: 'B2B SaaS' },
                { label: 'Revenue', value: '$5–50M' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="font-display text-3xl font-semibold text-white">{item.value}</p>
                  <p className="mt-1 font-sans text-xs font-semibold uppercase tracking-widest text-navy-400">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </Container>
      </div>

      {/* What is Collective Edge */}
      <div className="bg-white py-24 sm:py-32">
        <Container>
          <FadeIn className="max-w-2xl">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
              The Council
            </p>
            <h2 className="font-display text-4xl font-medium tracking-tight text-balance text-navy-900 sm:text-5xl">
              Collective Edge — CEO Council
            </h2>
            <div className="mt-6 space-y-4 text-xl text-gray-600 leading-relaxed">
              <p>
                Collective Edge convenes a small group of technology CEOs in Boston who lead
                growth-stage B2B SaaS and vertical-software companies. Members meet on a
                regular cadence to work through the strategic decisions that define their
                companies — organizational design, capital allocation, market positioning,
                executive transitions, and the moments in between.
              </p>
              <p>
                The setting is confidential by structure. The composition is intentional.
                The objective is straightforward: better decisions, stronger leadership, and
                companies built to last.
              </p>
            </div>
          </FadeIn>

          {/* Benefits */}
          <FadeInStagger className="mt-20">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-10">
              What members get from Collective Edge
            </p>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {memberBenefits.map((item) => (
                <FadeIn key={item.title}>
                  <Border className="pt-8">
                    <h3 className="font-display text-xl font-semibold text-navy-900">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-base text-gray-600 leading-relaxed">{item.body}</p>
                  </Border>
                </FadeIn>
              ))}
            </div>
          </FadeInStagger>
        </Container>
      </div>

      {/* The decisions you're carrying */}
      <div className="bg-navy-900 py-24 sm:py-32">
        <Container>
          <FadeIn>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">
              The Context
            </p>
            <h2 className="font-display text-4xl font-medium tracking-tight text-white sm:text-5xl max-w-2xl text-balance">
              The decisions you are actually carrying.
            </h2>
            <p className="mt-6 text-lg text-navy-200 max-w-xl">
              Not the ones in the strategy deck. The ones in your head on the drive home.
            </p>
          </FadeIn>
          <FadeInStagger className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {decisions.map((item) => (
                <FadeIn key={item.title}>
                  <Border invert className="pt-8">
                    <h3 className="font-display text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-base text-navy-200 leading-relaxed">{item.body}</p>
                  </Border>
                </FadeIn>
              ))}
            </div>
          </FadeInStagger>
        </Container>
      </div>

      {/* How it works */}
      <div id="how-it-works" className="bg-navy-50 py-24 sm:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-start">
            <FadeIn>
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
                Structure
              </p>
              <h2 className="font-display text-4xl font-medium tracking-tight text-balance text-navy-900 sm:text-5xl">
                How the council works.
              </h2>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                A disciplined format designed for substantive peer exchange. Each cohort brings
                together a small number of technology CEOs who meet on a regular cadence to work
                through the real challenges of leading their companies.
              </p>
              <ul className="mt-8 space-y-4 text-navy-700">
                {structure.map((item) => (
                  <ListItem key={item}>{item}</ListItem>
                ))}
              </ul>
              <p className="mt-8 text-base text-gray-500 leading-relaxed">
                Sessions are structured around member-presented issues. Each CEO receives focused
                time for peer analysis and constructive challenge.
              </p>
            </FadeIn>

            {/* Jeff — Moderator */}
            <FadeIn>
              <Border className="pt-8">
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-6">
                  Moderation
                </p>
                <div className="flex items-start gap-6">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src="/Headshots/0L9A6094 (1).png"
                      alt="Jeff Lortz"
                      fill
                      className="object-cover grayscale"
                    />
                  </div>
                  <div>
                    <p className="font-display text-xl font-semibold text-navy-900">Jeff Lortz</p>
                    <p className="mt-0.5 font-sans text-sm text-gray-500">Council Moderator</p>
                  </div>
                </div>
                <p className="mt-6 text-base text-gray-600 leading-relaxed">
                  Collective Edge is moderated by Jeff Lortz, a former technology CEO, military
                  veteran, and 25-year operator across SaaS, marketing technology, and
                  growth-stage software. Jeff has led companies through scaling, executive
                  transitions, and investor-backed growth — and has advised founders, CEOs, and
                  boards through the decisions that follow.
                </p>
                <p className="mt-4 text-base text-gray-600 leading-relaxed">
                  He writes on operator leadership at The Agile Operator and hosts the Margins
                  &amp; Mandates podcast, where he interviews CEOs and operators about the
                  decisions that define their companies.
                </p>
                <p className="mt-4 text-base text-navy-700 italic">
                  &ldquo;The role of the moderator is not to advise. It is to ensure the collective
                  intelligence of the room is brought fully to bear on each member&apos;s situation.&rdquo;
                </p>
                <div className="mt-6">
                  <Button href="/about" variant="outline" size="sm">
                    About Jeff
                  </Button>
                </div>
              </Border>
            </FadeIn>
          </div>
        </Container>
      </div>

      {/* Who should join */}
      <div id="membership" className="bg-white py-24 sm:py-32">
        <Container>
          <FadeIn className="max-w-2xl">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
              Membership
            </p>
            <h2 className="font-display text-4xl font-medium tracking-tight text-balance text-navy-900 sm:text-5xl">
              Who should join.
            </h2>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              The council is designed for technology CEOs who recognize that sustained
              effectiveness requires honest counsel from peers who understand the role.
            </p>
            <ul className="mt-8 space-y-4 text-navy-700">
              {criteria.map((item) => (
                <ListItem key={item}>{item}</ListItem>
              ))}
            </ul>
            <p className="mt-8 text-base text-gray-500 leading-relaxed">
              Cohort size is intentionally limited to preserve the quality of discussion and
              depth of relationship among members.
            </p>
          </FadeIn>
        </Container>
      </div>

      {/* Application CTA */}
      <div id="join" className="bg-navy-950 py-24 sm:py-32">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-400 mb-4">
                Apply
              </p>
              <h2 className="font-display text-4xl font-medium tracking-tight text-white sm:text-5xl text-balance">
                Apply for a Founding Seat
              </h2>
              <p className="mt-6 text-lg text-navy-200">
                The founding cohort is limited to eight Boston-area technology CEOs. Selection
                is based on fit with the room — stage, posture, and willingness to contribute.
                Apply for an introductory conversation. We respond personally within two
                business days.
              </p>
              <div className="mt-10">
                <Button href="/contact" size="lg">
                  Apply for a Seat
                </Button>
              </div>

              {/* Contact details */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-navy-400">
                <a
                  href="mailto:info@agile-operator.com"
                  className="hover:text-white transition-colors"
                >
                  info@agile-operator.com
                </a>
                <span className="hidden sm:block text-navy-700">·</span>
                <a
                  href="tel:+16176879810"
                  className="hover:text-white transition-colors"
                >
                  +1 617 687 9810
                </a>
                <span className="hidden sm:block text-navy-700">·</span>
                <a
                  href="https://www.linkedin.com/company/the-agile-operator/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </FadeIn>
        </Container>
      </div>
    </>
  )
}
