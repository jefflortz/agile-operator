import Link from 'next/link'

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Collective Edge', href: '/collective-edge' },
  { label: 'Playbooks', href: '/playbooks' },
  { label: 'Contact', href: '/contact' },
]

const socialLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/the-agile-operator/' },
  { label: 'YouTube', href: 'https://www.youtube.com/@Agile-Operator' },
  { label: 'Spotify', href: 'https://open.spotify.com/show/0JbihvBwMqoXr8EdEyWSOu' },
  { label: 'Bluesky', href: 'https://bsky.app/profile/theagileoperator.bsky.social' },
]

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="container-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">

          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="font-display text-xl text-white">
              Agile Operator
            </Link>
            <p className="mt-3 text-sm text-navy-200 leading-relaxed">
              Strategic growth advisory for ambitious operators.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-navy-200 hover:text-white transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social + podcast */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-sans font-semibold uppercase tracking-widest text-navy-400 mb-1">
              Follow
            </p>
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-navy-200 hover:text-white transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-navy-700 flex flex-col sm:flex-row justify-between gap-2 text-xs text-navy-400">
          <p>© {new Date().getFullYear()} Agile Operator. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
