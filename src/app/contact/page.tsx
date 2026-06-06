import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { FadeIn } from '@/components/ui/FadeIn'
import { GridPattern } from '@/components/ui/GridPattern'
import { Border } from '@/components/ui/Border'
import HubSpotForm from '@/components/ui/HubSpotForm'

export const metadata: Metadata = {
  title: 'Contact | Agile Operator',
  description:
    'Book a no-obligation strategy session with Jeff Lortz. We respond within one business day.',
}

const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID ?? ''
const formId = process.env.NEXT_PUBLIC_HUBSPOT_FORM_ID ?? ''

const contactDetails = [
  {
    label: 'Email',
    value: 'jeff@agile-operator.com',
    href: 'mailto:jeff@agile-operator.com',
  },
  {
    label: 'Phone',
    value: '+1 617 687 9810',
    href: 'tel:+16176879810',
  },
  {
    label: 'Office',
    value: '75 State St, Boston, MA 02109',
    href: 'https://maps.google.com/?q=75+State+St+Boston+MA+02109',
  },
]

const whatToExpect = [
  {
    step: '01',
    title: 'A real conversation, not a pitch',
    body: 'We\'ll spend 30 minutes understanding what you\'re navigating — the challenge, the stakes, and what\'s already been tried.',
  },
  {
    step: '02',
    title: 'Honest assessment of fit',
    body: 'We\'ll tell you directly whether we\'re the right partner for your situation. If we\'re not, we\'ll say so and point you somewhere useful.',
  },
  {
    step: '03',
    title: 'A clear path forward',
    body: 'If there\'s a fit, we\'ll outline what working together looks like — timeline, format, and what you can expect to walk away with.',
  },
]

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <div className="relative isolate overflow-hidden pt-14">
        <GridPattern
          className="absolute inset-x-0 -top-14 -z-10 h-[700px] w-full mask-[linear-gradient(to_bottom_left,white_40%,transparent_50%)] fill-navy-50 stroke-navy-900/5"
          yOffset={-96}
          interactive
        />
        <Container className="pb-16 pt-20 sm:pb-20 sm:pt-32 md:pt-40">
          <FadeIn className="max-w-2xl">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
              Get in Touch
            </p>
            <h1 className="font-display text-5xl font-medium tracking-tight text-balance text-navy-900 sm:text-6xl">
              Let&apos;s talk about what you&apos;re facing.
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-xl">
              No pitch deck. No proposal. Just a direct conversation about your situation
              and whether we&apos;re the right fit. We respond within one business day.
            </p>
          </FadeIn>
        </Container>
      </div>

      {/* Main content */}
      <div className="bg-white pb-24 sm:pb-32">
        <Container>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-start">

            {/* Left: what to expect + contact details */}
            <FadeIn>
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-8">
                What to expect
              </p>
              <div className="space-y-8">
                {whatToExpect.map((item) => (
                  <div key={item.step} className="flex gap-5">
                    <span className="font-display text-3xl font-semibold text-navy-100 leading-none flex-shrink-0 w-10">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-navy-900">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-base text-gray-600 leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact details */}
              <div className="mt-14">
                <Border className="pt-8">
                  <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-6">
                    Contact
                  </p>
                  <div className="space-y-4">
                    {contactDetails.map((item) => (
                      <div key={item.label} className="flex gap-4 items-start">
                        <span className="w-12 font-sans text-xs font-semibold uppercase tracking-widest text-navy-400 pt-0.5 flex-shrink-0">
                          {item.label}
                        </span>
                        <a
                          href={item.href}
                          target={item.label === 'Office' ? '_blank' : undefined}
                          rel={item.label === 'Office' ? 'noopener noreferrer' : undefined}
                          className="text-sm text-navy-700 hover:text-navy-900 transition-colors leading-relaxed"
                        >
                          {item.value}
                        </a>
                      </div>
                    ))}
                  </div>
                </Border>
              </div>
            </FadeIn>

            {/* Right: HubSpot form */}
            <FadeIn>
              <div className="rounded-2xl bg-navy-50 p-8 sm:p-10">
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-2">
                  Book a Strategy Session
                </p>
                <h2 className="font-display text-2xl font-medium text-navy-900 mb-8">
                  Tell us about your situation.
                </h2>

                {portalId && formId ? (
                  <HubSpotForm portalId={portalId} formId={formId} />
                ) : (
                  // Placeholder shown until HubSpot IDs are configured
                  <div className="space-y-4">
                    {[
                      { id: 'firstname', label: 'First name', type: 'text' },
                      { id: 'lastname', label: 'Last name', type: 'text' },
                      { id: 'email', label: 'Email address', type: 'email' },
                      { id: 'company', label: 'Company', type: 'text' },
                      { id: 'jobtitle', label: 'Title', type: 'text' },
                    ].map((field) => (
                      <div key={field.id}>
                        <label
                          htmlFor={field.id}
                          className="block font-sans text-sm font-medium text-navy-700 mb-1"
                        >
                          {field.label}
                        </label>
                        <input
                          id={field.id}
                          type={field.type}
                          disabled
                          placeholder="—"
                          className="w-full rounded border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-400 outline-none cursor-not-allowed"
                        />
                      </div>
                    ))}
                    <div>
                      <label
                        htmlFor="message"
                        className="block font-sans text-sm font-medium text-navy-700 mb-1"
                      >
                        What are you navigating?
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        disabled
                        placeholder="—"
                        className="w-full rounded border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy-400 outline-none resize-none cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-navy-400 pt-2">
                      Form will be active once HubSpot is configured —{' '}
                      set <code className="font-mono">NEXT_PUBLIC_HUBSPOT_PORTAL_ID</code> and{' '}
                      <code className="font-mono">NEXT_PUBLIC_HUBSPOT_FORM_ID</code> in{' '}
                      <code className="font-mono">.env.local</code>.
                    </p>
                  </div>
                )}
              </div>
            </FadeIn>

          </div>
        </Container>
      </div>

      {/* Collective Edge nudge */}
      <div className="bg-navy-900 py-16 sm:py-20">
        <Container>
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-400 mb-2">
                  Collective Edge — CEO Council
                </p>
                <h2 className="font-display text-2xl font-medium text-white text-balance">
                  Interested in peer advisory for Boston tech CEOs?
                </h2>
                <p className="mt-2 text-navy-300 text-base max-w-lg">
                  Eight seats. Founding cohort forming for Summer 2026.
                </p>
              </div>
              <a
                href="/collective-edge"
                className="flex-shrink-0 inline-flex items-center justify-center font-sans text-sm font-medium px-6 py-3 rounded border border-white/30 text-white hover:bg-white/10 transition-colors duration-200"
              >
                Learn More
              </a>
            </div>
          </FadeIn>
        </Container>
      </div>
    </>
  )
}
