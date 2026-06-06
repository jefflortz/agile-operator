import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Collective Edge', href: '/collective-edge' },
  { label: 'Playbooks', href: '/playbooks' },
  { label: 'Contact', href: '/contact' },
  { label: 'Margins & Mandates', href: '/margins-and-mandates' },
]

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/the-agile-operator/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'X',
    href: 'https://x.com/theagileoperator',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'Spotify',
    href: 'https://open.spotify.com/show/0JbihvBwMqoXr8EdEyWSOu',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@Agile-Operator',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    label: 'Substack',
    href: 'https://agileoperator.substack.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white border-t border-navy-800">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-12 pt-16 pb-10">

        {/* Main row */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">

          {/* Col 1: Brand + CTA */}
          <div>
            <Link href="/" aria-label="Home">
              <Logo className="h-14" invert />
            </Link>
            <p className="mt-5 text-sm text-navy-300 leading-relaxed">
              Strategic growth advisory for CEOs and operators navigating complexity, scaling teams, and building businesses that last.
            </p>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-block font-sans text-sm font-medium px-5 py-2.5 rounded bg-gold-500 text-navy-950 hover:bg-gold-400 transition-colors duration-150"
              >
                Book a Strategy Session
              </Link>
            </div>
          </div>

          {/* Col 2: Nav + Collective Edge */}
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
              Navigation
            </p>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-navy-300 hover:text-white transition-colors duration-150 py-0.5"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

          </div>

          {/* Col 3: Address + Social */}
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
              Get in Touch
            </p>
            <address className="not-italic text-sm text-navy-300 leading-relaxed">
              Agile Operator LLC<br />
              75 State St<br />
              Boston, MA 02109
            </address>
            <a
              href="mailto:jeff@agile-operator.com"
              className="mt-2 block text-sm text-navy-300 hover:text-white transition-colors"
            >
              jeff@agile-operator.com
            </a>

            <div className="mt-8">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
                Follow
              </p>
              <div className="flex gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="text-navy-400 hover:text-white transition-colors duration-150"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-navy-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-navy-500">
          <p>© {new Date().getFullYear()} Agile Operator LLC. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-navy-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-navy-300 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
