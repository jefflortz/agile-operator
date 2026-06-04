import Button from '@/components/ui/Button'

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="section-lg bg-navy-900 text-white">
        <div className="container-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-sans text-sm font-semibold uppercase tracking-widest mb-4">
              Strategic Growth Advisory
            </p>
            <h1 className="text-display-xl font-display leading-tight">
              Scale smarter.<br />Lead with clarity.
            </h1>
            <p className="mt-6 text-lg text-navy-200 max-w-xl leading-relaxed">
              We help growth-minded leaders align teams, accelerate execution, and build businesses that last — with agile playbooks built for high-stakes environments.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button href="/contact" size="lg">
                Book a Strategy Session
              </Button>
              <Button href="/playbooks" variant="outline" size="lg" className="border-white text-white hover:bg-white/10 hover:text-white">
                Explore Playbooks
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility bar */}
      <section className="bg-navy-950 text-navy-300">
        <div className="container-content mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs font-sans text-center tracking-wide">
            20+ years SaaS &amp; PE leadership &nbsp;·&nbsp; Veteran-owned &nbsp;·&nbsp; Boston, MA
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-white">
        <div className="container-content mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-display-md font-display text-navy-900 mb-12">What we do</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Growth Advisory',
                desc: 'Strategy, planning, and operational execution for growth-stage companies navigating complexity.',
              },
              {
                title: 'Executive Coaching',
                desc: '1:1 coaching for individual leaders navigating performance, transitions, and scale.',
              },
              {
                title: 'Interim / Fractional Executive',
                desc: 'Stepping into CEO, CMO, or operator roles on a defined-term basis when you need experienced leadership fast.',
              },
            ].map((s) => (
              <div key={s.title} className="border-t-2 border-navy-900 pt-6">
                <h3 className="font-display text-xl text-navy-900 mb-3">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Button href="/services" variant="outline">Learn More</Button>
          </div>
        </div>
      </section>

      {/* Collective Edge callout */}
      <section className="section bg-navy-900 text-white">
        <div className="container-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-gold-400 font-sans text-xs font-semibold uppercase tracking-widest mb-3">
              Collective Edge — CEO Council
            </p>
            <h2 className="text-display-md font-display leading-tight">
              A peer-advisory council for Boston technology CEOs.
            </h2>
            <p className="mt-4 text-navy-200 leading-relaxed">
              Eight seats. Founding cohort forming Summer 2026. A confidential room for the decisions that don&apos;t belong in a board meeting.
            </p>
            <div className="mt-6">
              <Button href="/collective-edge" variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="cta-banner">
        <div className="container-content mx-auto px-4">
          <h2 className="text-display-sm font-display mb-4">Ready to transform your business?</h2>
          <p className="text-navy-200 mb-8 max-w-md mx-auto">
            Schedule a no-obligation strategy session to discuss your challenges.
          </p>
          <Button href="/contact" size="lg">
            Book a Strategy Session
          </Button>
        </div>
      </section>
    </>
  )
}
