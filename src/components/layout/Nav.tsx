'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Collective Edge', href: '/collective-edge' },
  { label: 'Playbooks', href: '/playbooks' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="container-content flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 mx-auto">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="font-display text-xl text-navy-900 tracking-tight">
            Agile Operator
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-sans text-sm font-medium transition-colors duration-150 ${
                pathname === link.href
                  ? 'text-navy-900'
                  : 'text-gray-500 hover:text-navy-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="hidden md:inline-flex btn-primary text-sm px-4 py-2"
          >
            Book a Strategy Session
          </Link>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 text-navy-900"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-sans text-sm font-medium text-gray-700 hover:text-navy-900"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="btn-primary text-sm text-center"
          >
            Book a Strategy Session
          </Link>
        </div>
      )}
    </header>
  )
}
