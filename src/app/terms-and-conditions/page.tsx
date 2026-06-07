import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { FadeIn } from '@/components/ui/FadeIn'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Agile Operator',
  description: 'Terms and conditions for use of agile-operator.com.',
  alternates: { canonical: 'https://agile-operator.com/terms-and-conditions' },
  robots: { index: false },
}

const LAST_UPDATED = 'June 2026'

export default function Terms() {
  return (
    <div className="pt-24 pb-24 sm:pt-32">
      <Container>
        <FadeIn className="max-w-3xl mx-auto">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
            Legal
          </p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-navy-900 sm:text-5xl mb-4">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm text-gray-400 mb-12">Last updated: {LAST_UPDATED}</p>

          <div className="prose prose-gray max-w-none space-y-10 text-gray-600">

            <section>
              <h2 className="font-display text-xl font-semibold text-navy-900 mb-3">Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing or using agile-operator.com (&ldquo;the Site&rdquo;), you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use the Site. These terms apply to all visitors, users, and others who access the Site.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy-900 mb-3">Use of the Site</h2>
              <p className="leading-relaxed">The Site and its content are provided for informational purposes only. You agree to use the Site only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use and enjoyment of the Site. Unauthorized use of the Site may give rise to a claim for damages and/or be a criminal offense.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy-900 mb-3">Intellectual Property</h2>
              <p className="leading-relaxed">All content on this Site — including text, graphics, logos, images, audio clips, and software — is the property of Agile Operator LLC or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from any content on this Site without our express written permission.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy-900 mb-3">Content and Advice Disclaimer</h2>
              <p className="leading-relaxed">The articles, podcast episodes, frameworks, and other content published on this Site represent the opinions and experience of Jeff Lortz and Agile Operator LLC. They are provided for general informational purposes only and do not constitute professional business, legal, financial, or investment advice. You should seek independent professional advice before making decisions based on any content on this Site.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy-900 mb-3">Third-Party Links</h2>
              <p className="leading-relaxed">The Site may contain links to third-party websites. These links are provided for your convenience only. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy-900 mb-3">Limitation of Liability</h2>
              <p className="leading-relaxed">To the fullest extent permitted by law, Agile Operator LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the Site or its content. Our total liability to you for any claim arising from your use of the Site shall not exceed one hundred dollars ($100).</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy-900 mb-3">Governing Law</h2>
              <p className="leading-relaxed">These Terms &amp; Conditions are governed by and construed in accordance with the laws of the Commonwealth of Massachusetts, without regard to its conflict of law provisions. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in Suffolk County, Massachusetts.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy-900 mb-3">Changes to These Terms</h2>
              <p className="leading-relaxed">We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the Site. Your continued use of the Site after any changes constitutes your acceptance of the revised terms.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy-900 mb-3">Contact</h2>
              <p className="leading-relaxed">
                Questions about these terms? Contact us at:<br />
                <strong className="text-navy-800">Agile Operator LLC</strong><br />
                75 State St, Boston, MA 02109<br />
                <a href="mailto:jeff@agile-operator.com" className="text-navy-700 underline underline-offset-2 hover:text-gold-600">jeff@agile-operator.com</a>
              </p>
            </section>

          </div>
        </FadeIn>
      </Container>
    </div>
  )
}
