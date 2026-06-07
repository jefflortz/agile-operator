import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { FadeIn } from '@/components/ui/FadeIn'
import { GridPattern } from '@/components/ui/GridPattern'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="relative isolate overflow-hidden pt-14 min-h-[calc(100vh-4rem)] flex items-center">
      <GridPattern
        className="absolute inset-x-0 -top-14 -z-10 h-full w-full mask-[linear-gradient(to_bottom_left,white_40%,transparent_50%)] fill-navy-50 stroke-navy-900/5"
        yOffset={-96}
      />
      <Container className="py-24 sm:py-32">
        <FadeIn className="max-w-xl">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
            404
          </p>
          <h1 className="font-display text-5xl font-medium tracking-tight text-navy-900 sm:text-6xl">
            Page not found.
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            The page you&apos;re looking for doesn&apos;t exist or may have moved. If you followed a bookmark from the old site, try the Playbooks index.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button href="/">Back to Home</Button>
            <Button href="/playbooks" variant="outline">Browse Playbooks</Button>
          </div>
        </FadeIn>
      </Container>
    </div>
  )
}
