import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { FadeIn, FadeInStagger } from '@/components/ui/FadeIn'
import { GridPattern } from '@/components/ui/GridPattern'
import { Border } from '@/components/ui/Border'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'GTM Diagnostic & Go-to-Market Advisory',
  description:
    'Operator-led go-to-market advisory for B2B SaaS executives. Run the free GTM diagnostic for a health score, gap analysis, and a prioritized roadmap in ten minutes.',
  alternates: { canonical: 'https://www.agile-operator.com/gtm' },
  openGraph: {
    title: 'GTM Diagnostic & Go-to-Market Advisory | Agile Operator',
    description:
      'Turn GTM friction into predictable growth. Free ten-minute diagnostic from operators who have run these companies.',
    url: 'https://www.agile-operator.com/gtm',
    type: 'website',
  },
}

const DIAGNOSTIC_APP = 'https://gtm-report-generator.lovable.app/'

const pressureStats = [
  { value: '70%', label: 'of SaaS growth plans fail because teams aren’t truly aligned' },
  { value: '20%', label: 'of sales orgs forecast within 5% accuracy' },
  { value: '<2 yrs', label: 'average CMO or CRO tenure' },
]

const system = [
  {
    step: '01',
    title: 'Diagnostic Tune-Up',
    stage: 'Foundation',
    body: 'Identify growth constraints and GTM gaps.',
  },
  {
    step: '02',
    title: 'Strategy & Alignment',
    stage: 'Foundation',
    body: 'Align leadership on vision, metrics, and cadence.',
  },
  {
    step: '03',
    title: 'Leadership Health',
    stage: 'Stability',
    body: 'Strengthen team cohesion and executive effectiveness.',
  },
  {
    step: '04',
    title: 'Execution Acceleration',
    stage: 'Performance',
    body: 'Drive measurable performance with operator guidance.',
  },
  {
    step: '05',
    title: 'Sustained Performance',
    stage: 'Scale',
    body: 'Embed playbooks for scalable, repeatable growth.',
  },
]

const differentiators = [
  {
    title: 'Strategic Alignment',
    body: 'Unbiased insight, practical playbooks, and the honesty you won’t get from the echo chamber.',
  },
  {
    title: 'Performance-Driven',
    body: 'Tactics, accountability, and results you can measure. Steady hands when the boardroom heat is on.',
  },
  {
    title: 'Agile Playbooks',
    body: 'Battle-tested strategies and frameworks designed for rapid deployment and measurable impact.',
  },
]

const deliverables = [
  'Comprehensive GTM health score',
  'Sales process efficiency analysis',
  'Marketing and demand gen assessment',
  'Revenue operations evaluation',
  'Leadership alignment insights',
  'Prioritized improvement roadmap',
]

const advisors = [
  {
    name: 'Jeff Lortz',
    role: 'CEO Coach & Advisor',
    points: [
      'Former CEO/COO of PE-backed SaaS firms',
      'Scaled growth and exit readiness across multiple carve-outs',
      'Founder of Agile Operator',
    ],
    proof: 'Led transformations from carve-out through exit',
  },
  {
    name: 'Norman Guadagno',
    role: 'CMO Coach & Advisor',
    points: [
      'Former CMO: Mimecast, Acoustic, Carbonite',
      'Led enterprise brand and demand transformations',
      'Deep M&A integration and repositioning experience',
    ],
    proof: 'Transformed multiple B2B SaaS marketing orgs at scale',
  },
  {
    name: 'Steve Keilen',
    role: 'CRO Coach & Advisor',
    points: [
      'Dynatrace $25M → $250M+ under Thoma Bravo (IPO prep)',
      'Rebuilt Acoustic’s global sales org post-IBM carve-out ($22M → $70M ARR)',
      'Scaled InsightSquared and Addigy with 30%+ YoY growth',
    ],
    proof: '$2B+ in cumulative revenue scaled',
  },
]

const benchStats = [
  { value: '50+', label: 'Years Combined Experience' },
  { value: '$2B+', label: 'In Revenue Scaled' },
  { value: '100+', label: 'Leadership Teams Coached' },
]

export default function GtmPage() {
  return (
    <>
      {/* ── Hero ── */}
      <div className="-mt-[92px] relative isolate overflow-hidden bg-navy-950">
        <GridPattern
          className="absolute inset-x-0 top-0 -z-10 h-[900px] w-full mask-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.6)_60%)] fill-navy-900 stroke-white/5"
          yOffset={-96}
          interactive
        />
        <Container className="pb-24 pt-36 sm:pb-32 sm:pt-44 md:pt-52">
          <FadeIn className="max-w-3xl">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
              Go-to-Market Advisory
            </p>
            <h1 className="font-display text-5xl font-medium tracking-tight text-balance text-white sm:text-7xl">
              Refine. Align. Accelerate.
            </h1>
            <p className="mt-6 text-xl text-navy-200 max-w-2xl">
              Operator-led advisory that helps SaaS executives turn GTM friction into
              predictable growth.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button href="#diagnostic" size="lg">
                Begin Your Analysis
              </Button>
              <Button
                href="/contact"
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                Talk to an Advisor
              </Button>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {benchStats.map((item) => (
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

      {/* ── The pressure ── */}
      <div className="bg-white py-24 sm:py-32">
        <Container>
          <FadeIn className="max-w-2xl">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
              The Problem
            </p>
            <h2 className="font-display text-4xl font-medium tracking-tight text-balance text-navy-900 sm:text-5xl">
              When your GTM engine misfires, growth slows &mdash; and confidence slips.
            </h2>
            <p className="mt-6 text-lg text-gray-500">
              Misalignment, churn, and forecast misses create a cycle that erodes momentum
              and trust.
            </p>
          </FadeIn>

          <FadeInStagger className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {pressureStats.map((item) => (
              <FadeIn key={item.value}>
                <Border className="pt-8">
                  <p className="font-display text-5xl font-semibold text-navy-900">
                    {item.value}
                  </p>
                  <p className="mt-3 text-base text-gray-500">{item.label}</p>
                </Border>
              </FadeIn>
            ))}
          </FadeInStagger>

          <FadeIn>
            <blockquote className="mt-16 border-l-2 border-gold-500 pl-5 max-w-2xl">
              <p className="text-lg text-gray-500 italic leading-relaxed">
                &ldquo;Boards are looking ahead&hellip; it&rsquo;s only getting harder to be a
                CEO navigating uncharted territory.&rdquo;
              </p>
              <footer className="mt-3 font-sans text-sm text-navy-700">
                &mdash; Margot McShane, Russell Reynolds
              </footer>
            </blockquote>
          </FadeIn>
        </Container>
      </div>

      {/* ── The system ── */}
      <div className="relative bg-navy-900 py-24 sm:py-32 overflow-hidden">
        <GridPattern
          className="absolute inset-0 h-full w-full fill-white/[0.025] stroke-white/[0.05] mask-[linear-gradient(to_bottom_left,white_30%,transparent_70%)]"
          yOffset={0}
        />
        <Container className="relative">
          <FadeIn className="max-w-2xl">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
              How It Works
            </p>
            <h2 className="font-display text-4xl font-medium tracking-tight text-white sm:text-5xl text-balance">
              A peer-to-peer framework that connects strategy and execution.
            </h2>
            <p className="mt-6 text-lg text-navy-200">
              The Agile Operator System&trade; pairs proven operators with active executives
              through structured collaboration. Each phase builds alignment, accountability,
              and measurable progress.
            </p>
          </FadeIn>

          <FadeInStagger className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {system.map((item) => (
              <FadeIn key={item.step}>
                <div className="h-full bg-navy-900 p-6">
                  <p
                    className="font-display text-5xl font-medium text-white opacity-[0.14] leading-none mb-4 select-none"
                    aria-hidden="true"
                  >
                    {item.step}
                  </p>
                  <h3 className="font-display text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 font-sans text-xs font-semibold uppercase tracking-widest text-gold-400">
                    {item.stage}
                  </p>
                  <p className="mt-3 text-sm text-navy-200">{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </FadeInStagger>

          <FadeIn>
            <p className="mt-12 text-lg text-navy-200 max-w-2xl">
              This isn&rsquo;t consulting. It&rsquo;s peer-to-peer collaboration with operators
              who have built and scaled under the same pressure you face.
            </p>
          </FadeIn>
        </Container>
      </div>

      {/* ── Differentiators ── */}
      <div className="bg-white py-24 sm:py-32">
        <Container>
          <FadeIn className="max-w-2xl">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
              What&rsquo;s Holding You Back?
            </p>
            <h2 className="font-display text-4xl font-medium tracking-tight text-balance text-navy-900 sm:text-5xl">
              Elite advisors. Steady under fire. Obsessed with results.
            </h2>
            <p className="mt-6 text-lg text-gray-500">
              We help growth-minded leaders align teams, accelerate execution, and scale
              smarter with agile playbooks built for high-stakes environments.
            </p>
          </FadeIn>

          <FadeInStagger className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-3">
            {differentiators.map((item, i) => (
              <FadeIn key={item.title}>
                <Border className="pt-8">
                  <p
                    className="font-display text-6xl font-medium text-navy-900 opacity-[0.06] leading-none mb-3 select-none"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-display text-xl font-semibold text-navy-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base text-gray-500">{item.body}</p>
                </Border>
              </FadeIn>
            ))}
          </FadeInStagger>
        </Container>
      </div>

      {/* ── Diagnostic ── */}
      <div id="diagnostic" className="scroll-mt-24 bg-navy-50 py-24 sm:py-32">
        <Container>
          <FadeIn className="max-w-2xl">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
              Free Diagnostic
            </p>
            <h2 className="font-display text-4xl font-medium tracking-tight text-balance text-navy-900 sm:text-5xl">
              See where your GTM is stuck &mdash; and how to fix it.
            </h2>
            <p className="mt-6 text-lg text-gray-500">
              Our diagnostic evaluates your sales, marketing, and revenue operations to
              pinpoint growth blockers. In ten minutes, get an actionable snapshot of your
              GTM health and a prioritized improvement roadmap.
            </p>
          </FadeIn>

          <FadeIn>
            <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <h3 className="font-display text-lg font-semibold text-navy-900">
                  What you&rsquo;ll receive
                </h3>
                <ul className="mt-4 space-y-3">
                  {deliverables.map((d) => (
                    <li key={d} className="flex gap-3 text-base text-gray-500">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500"
                        aria-hidden="true"
                      />
                      {d}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 font-sans text-sm text-navy-700">Takes about 10 minutes.</p>
              </div>

              <div className="lg:col-span-2">
                <div className="overflow-hidden rounded-lg border border-navy-200 bg-white shadow-sm">
                  <iframe
                    src={DIAGNOSTIC_APP}
                    title="Agile Operator GTM Diagnostic"
                    loading="lazy"
                    className="h-[820px] w-full border-0"
                  />
                </div>
                <p className="mt-3 font-sans text-xs text-gray-400">
                  Trouble loading?{' '}
                  <a
                    href={DIAGNOSTIC_APP}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-navy-700"
                  >
                    Open the diagnostic in a new tab
                  </a>
                  .
                </p>
              </div>
            </div>
          </FadeIn>
        </Container>
      </div>

      {/* ── The bench ── */}
      <div className="bg-white py-24 sm:py-32">
        <Container>
          <FadeIn className="max-w-2xl">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
              Who You Work With
            </p>
            <h2 className="font-display text-4xl font-medium tracking-tight text-balance text-navy-900 sm:text-5xl">
              Seasoned operators who have sat in your seat.
            </h2>
            <p className="mt-6 text-lg text-gray-500">
              You work directly with growth leaders who have driven results under PE
              pressure &mdash; not advisors reading from a playbook.
            </p>
          </FadeIn>

          <FadeInStagger className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-3">
            {advisors.map((a) => (
              <FadeIn key={a.name}>
                <Border className="pt-8">
                  <p className="font-display text-xl font-semibold text-navy-900">{a.name}</p>
                  <p className="mt-1 font-sans text-xs font-semibold uppercase tracking-widest text-gold-500">
                    {a.role}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {a.points.map((p) => (
                      <li key={p} className="flex gap-3 text-sm text-gray-500">
                        <span
                          className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-navy-300"
                          aria-hidden="true"
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm italic text-navy-700">{a.proof}</p>
                </Border>
              </FadeIn>
            ))}
          </FadeInStagger>
        </Container>
      </div>

      {/* ── CTA ── */}
      <div className="relative bg-navy-950 py-24 sm:py-32 overflow-hidden">
        <GridPattern
          className="absolute inset-0 h-full w-full fill-white/[0.025] stroke-white/[0.05] mask-[linear-gradient(to_bottom_left,white_30%,transparent_70%)]"
          yOffset={0}
        />
        <Container className="relative">
          <FadeIn className="max-w-2xl">
            <h2 className="font-display text-4xl font-medium tracking-tight text-white sm:text-5xl text-balance">
              Prefer to talk first?
            </h2>
            <p className="mt-6 text-lg text-navy-200">
              Book a short strategy call. We&rsquo;ll tell you directly whether we&rsquo;re
              the right partner for your situation &mdash; and if we&rsquo;re not, we&rsquo;ll
              point you somewhere useful.
            </p>
            <div className="mt-10">
              <Button href="/contact" size="lg">
                Book a Strategy Call
              </Button>
            </div>
          </FadeIn>
        </Container>
      </div>
    </>
  )
}
