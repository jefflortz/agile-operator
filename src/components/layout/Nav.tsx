'use client'

import { createContext, useContext, useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, MotionConfig, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'
import { Container } from '@/components/ui/Container'

const NavContext = createContext<{
  logoHovered: boolean
  setLogoHovered: React.Dispatch<React.SetStateAction<boolean>>
} | null>(null)

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Collective Edge', href: '/collective-edge' },
  { label: 'Playbooks', href: '/playbooks' },
  { label: 'Contact', href: '/contact' },
]

function MenuIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M2 6h20v2H2zM2 16h20v2H2z" />
    </svg>
  )
}

function XIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="m5.636 4.223 14.142 14.142-1.414 1.414L4.222 5.637z" />
      <path d="M4.222 18.363 18.364 4.22l1.414 1.414L5.636 19.777z" />
    </svg>
  )
}

function Header({
  panelId,
  icon: Icon,
  expanded,
  onToggle,
  toggleRef,
  invert = false,
}: {
  panelId: string
  icon: React.ComponentType<{ className?: string }>
  expanded: boolean
  onToggle: () => void
  toggleRef: React.RefObject<HTMLButtonElement | null>
  invert?: boolean
}) {
  return (
    <Container>
      <div className="flex items-center justify-between">
        <Link href="/" aria-label="Home">
          <span className={clsx(
            'font-display text-xl tracking-tight font-medium',
            invert ? 'text-white' : 'text-navy-900'
          )}>
            Agile Operator
          </span>
        </Link>
        <div className="flex items-center gap-x-8">
          <Link
            href="/contact"
            className={clsx(
              'hidden md:inline-flex font-sans text-sm font-medium px-4 py-2 rounded transition-colors duration-200',
              invert
                ? 'bg-white text-navy-900 hover:bg-navy-50'
                : 'bg-navy-900 text-white hover:bg-navy-700'
            )}
          >
            Book a Strategy Session
          </Link>
          <button
            ref={toggleRef}
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={panelId}
            className={clsx(
              'group -m-2.5 rounded-full p-2.5 transition',
              invert ? 'hover:bg-white/10' : 'hover:bg-navy-900/10',
            )}
            aria-label="Toggle navigation"
          >
            <Icon className={clsx(
              'h-6 w-6',
              invert
                ? 'fill-white group-hover:fill-navy-200'
                : 'fill-navy-900 group-hover:fill-navy-700',
            )} />
          </button>
        </div>
      </div>
    </Container>
  )
}

function Navigation() {
  return (
    <nav className="mt-px font-display text-5xl font-medium tracking-tight text-white">
      <div className="bg-navy-950">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'group relative isolate -mx-6 bg-navy-950 px-6 py-10 sm:mx-0 sm:px-0 sm:py-16',
                  i % 2 === 0 ? 'sm:pr-16' : 'sm:border-l sm:border-navy-800 sm:pl-16',
                )}
              >
                {link.label}
                <span className="absolute inset-y-0 -z-10 w-screen bg-navy-900 opacity-0 transition group-odd:right-0 group-even:left-0 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </nav>
  )
}

function NavInner({ children }: { children: React.ReactNode }) {
  let panelId = useId()
  let [expanded, setExpanded] = useState(false)
  let [isTransitioning, setIsTransitioning] = useState(false)
  let openRef = useRef<HTMLButtonElement>(null)
  let closeRef = useRef<HTMLButtonElement>(null)
  let shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (
        event.target instanceof HTMLElement &&
        event.target.closest('a')?.href === window.location.href
      ) {
        setIsTransitioning(false)
        setExpanded(false)
      }
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  return (
    <MotionConfig transition={shouldReduceMotion || !isTransitioning ? { duration: 0 } : undefined}>
      <header>
        {/* Static header bar */}
        <div
          className="absolute top-2 right-0 left-0 z-40 pt-14"
          aria-hidden={expanded ? 'true' : undefined}
          inert={expanded ? true : undefined}
        >
          <Header
            panelId={panelId}
            icon={MenuIcon}
            toggleRef={openRef}
            expanded={expanded}
            onToggle={() => {
              setIsTransitioning(true)
              setExpanded((e) => !e)
              window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }))
            }}
          />
        </div>

        {/* Expandable nav panel */}
        <motion.div
          layout
          id={panelId}
          style={{ height: expanded ? 'auto' : '0.5rem' }}
          className="relative z-50 overflow-hidden bg-navy-950 pt-2"
          aria-hidden={expanded ? undefined : 'true'}
          inert={expanded ? undefined : true}
        >
          <motion.div layout className="bg-navy-800">
            <div className="bg-navy-950 pt-14 pb-16">
              <Header
                invert
                panelId={panelId}
                icon={XIcon}
                toggleRef={closeRef}
                expanded={expanded}
                onToggle={() => {
                  setIsTransitioning(true)
                  setExpanded((e) => !e)
                  window.setTimeout(() => openRef.current?.focus({ preventScroll: true }))
                }}
              />
            </div>
            <Navigation />
          </motion.div>
        </motion.div>
      </header>

      {/* Page content with rounded top corners */}
      <motion.div
        layout
        style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
        className="relative flex flex-auto overflow-hidden bg-white pt-14"
      >
        <motion.div layout className="relative isolate flex w-full flex-col pt-9">
          {children}
        </motion.div>
      </motion.div>
    </MotionConfig>
  )
}

export default function Nav({ children }: { children: React.ReactNode }) {
  let pathname = usePathname()
  let [logoHovered, setLogoHovered] = useState(false)

  return (
    <NavContext.Provider value={{ logoHovered, setLogoHovered }}>
      <NavInner key={pathname}>{children}</NavInner>
    </NavContext.Provider>
  )
}
