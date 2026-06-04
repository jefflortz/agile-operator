import { Container } from '@/components/ui/Container'
import { FadeIn, FadeInStagger } from '@/components/ui/FadeIn'
import { Border } from '@/components/ui/Border'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Testimonial } from '@/components/ui/Testimonial'
import { GridPattern } from '@/components/ui/GridPattern'
import Button from '@/components/ui/Button'

const services = [
  {
    title: 'Growth Advisory',
    description:
      'Strategy, planning, and operational execution for growth-stage companies navigating complexity under investor pressure.',
  },
  {
    title: 'Executive Coaching',
    description:
      '1:1 coaching for individual leaders navigating performance challenges, executive transitions, and scaling demands.',
  },
  {
    title: 'Interim / Fractional Executive',
    description:
      'Experienced CEO, CMO, or operator leadership on a defined-term basis when you need steady hands fast.',
  },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <div className="relative isolate overflow-hidden pt-14">
        <GridPattern
          className="absolute inset-x-0 -top-14 -z-10 h-[1000px] w-full mask-[linear-gradient(to_bottom_left,white_40%,transparent_50%)] fill-navy-50 stroke-navy-900/5"
          yOffset={-96}
          interactive
        />
        <Container className="pb-24 pt-20 sm:pb-32 sm:pt-32 md:pt-40">
          <FadeIn className="max-w-3xl">
            <p className="font-sans text-sm font-semibold uppercase tracking-widest text-gold-500 mb-6">
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
              {services.map((service) => (
                <FadeIn key={service.title}>
                  <Border className="pt-8">
                    <h3 className="font-display text-2xl font-semibold text-navy-900">
                      {service.title}
                    </h3>
                    <p className="mt-4 text-base text-gray-600 leading-relaxed">
                      {service.description}
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
      <div className="mt-24 sm:mt-32 lg:mt-40 bg-navy-900 py-24 sm:py-32">
        <Container>
          <FadeIn>
            <p className="font-sans text-sm font-semibold uppercase tracking-widest text-gold-400 mb-6">
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

      {/* Testimonial */}
      <Testimonial
        author={{ name: 'Greg J.', title: 'CEO and Founder, Marketing Tech Agency' }}
      >
        He helped me cut through the noise, navigate the politics, and build a plan that not only kept my new bosses happy but made sure I didn&apos;t lose sight of my own growth and balance. He&apos;s not just a coach — he&apos;s the steady, clear-eyed partner every leader wishes they had during big transitions.
      </Testimonial>

      {/* CTA */}
      <div className="bg-navy-900 py-24 sm:py-32">
        <Container>
          <FadeIn className="text-center">
            <h2 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
              Ready to transform your business?
            </h2>
            <p className="mt-4 text-navy-200 max-w-md mx-auto">
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
