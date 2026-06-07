import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { FadeIn } from '@/components/ui/FadeIn'

export const metadata: Metadata = {
  title: 'Privacy Policy | Agile Operator',
  description: 'How Agile Operator collects, uses, and protects your information.',
  alternates: { canonical: 'https://agile-operator.com/privacy-policy' },
  robots: { index: false },
}

const LAST_UPDATED = 'June 2026'

export default function PrivacyPolicy() {
  return (
    <div className="pt-24 pb-24 sm:pt-32">
      <Container>
        <FadeIn className="max-w-3xl mx-auto">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
            Legal
          </p>
          <h1 className="font-display text-4xl font-medium tracking-tight text-navy-900 sm:text-5xl mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-400 mb-12">Last updated: {LAST_UPDATED}</p>

          <div className="prose prose-gray max-w-none space-y-10 text-gray-600">

            <section>
              <h2 className="font-display text-xl font-semibold text-navy-900 mb-3">Overview</h2>
              <p className="leading-relaxed">
                Agile Operator LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates agile-operator.com. This policy explains what information we collect when you visit our site, how we use it, and your choices regarding that information.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy-900 mb-3">Information We Collect</h2>
              <p className="leading-relaxed mb-3">We collect information in two ways:</p>
              <p className="leading-relaxed mb-2"><strong className="text-navy-800">Information you provide.</strong> When you submit a contact form or sign up for our newsletter, we collect your name, email address, and any message content you include.</p>
              <p className="leading-relaxed"><strong className="text-navy-800">Information collected automatically.</strong> We use Google Analytics 4 to collect anonymized usage data — pages visited, session duration, device type, and general geographic region. This data does not identify you personally. We also use cookies and similar technologies to remember your preferences and measure site performance.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy-900 mb-3">How We Use Your Information</h2>
              <p className="leading-relaxed">We use collected information to respond to inquiries, send requested newsletters or updates, understand how visitors use our site so we can improve it, and comply with legal obligations. We do not sell your personal information to third parties.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy-900 mb-3">Third-Party Services</h2>
              <p className="leading-relaxed">We use the following third-party services that may collect or process data on our behalf:</p>
              <ul className="mt-3 space-y-2 list-disc list-inside text-gray-600">
                <li><strong className="text-navy-800">HubSpot</strong> — contact form processing and email communications</li>
                <li><strong className="text-navy-800">Google Analytics 4</strong> — anonymized site analytics</li>
                <li><strong className="text-navy-800">Vercel</strong> — site hosting and performance monitoring</li>
                <li><strong className="text-navy-800">Substack</strong> — newsletter delivery (if you subscribe)</li>
              </ul>
              <p className="mt-3 leading-relaxed">Each of these services has its own privacy policy governing how they handle data.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy-900 mb-3">Cookies</h2>
              <p className="leading-relaxed">Our site uses cookies for analytics (Google Analytics) and form functionality (HubSpot). You can disable cookies in your browser settings, though some site features may not function as expected. Google Analytics data collection can be opted out via the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-navy-700 underline underline-offset-2 hover:text-gold-600">Google Analytics opt-out browser add-on</a>.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy-900 mb-3">Data Retention</h2>
              <p className="leading-relaxed">Contact form submissions are retained in HubSpot for as long as necessary to fulfill the purpose for which they were collected, or as required by law. Analytics data is retained in accordance with Google Analytics&apos; standard retention policies.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy-900 mb-3">Your Rights</h2>
              <p className="leading-relaxed">You may request access to, correction of, or deletion of personal information we hold about you by contacting us at <a href="mailto:jeff@agile-operator.com" className="text-navy-700 underline underline-offset-2 hover:text-gold-600">jeff@agile-operator.com</a>. If you are located in California, you may have additional rights under the California Consumer Privacy Act (CCPA).</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy-900 mb-3">Children&apos;s Privacy</h2>
              <p className="leading-relaxed">Our site is not directed to individuals under the age of 13, and we do not knowingly collect personal information from children.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy-900 mb-3">Changes to This Policy</h2>
              <p className="leading-relaxed">We may update this policy periodically. When we do, we will revise the &ldquo;last updated&rdquo; date above. Continued use of the site after any changes constitutes your acceptance of the updated policy.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy-900 mb-3">Contact</h2>
              <p className="leading-relaxed">
                Questions about this policy? Contact us at:<br />
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
