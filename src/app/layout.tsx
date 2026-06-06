import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Agile Operator',
    default: 'Agile Operator | Strategic Growth Advisory',
  },
  description:
    'Strategic growth advisory for ambitious operators. Agile Operator provides proven playbooks and frameworks to balance margins and mandates.',
  metadataBase: new URL('https://agile-operator.com'),
  openGraph: {
    siteName: 'Agile Operator',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-navy-950">
        <Nav>
          <main className="w-full flex-auto">{children}</main>
          <Footer />
        </Nav>
      </body>
    </html>
  )
}
