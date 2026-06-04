import { Container } from './Container'
import { FadeIn } from './FadeIn'
import { GridPattern } from './GridPattern'

export function Testimonial({
  children,
  author,
}: {
  children: React.ReactNode
  author: { name: string; title: string }
}) {
  return (
    <div className="relative isolate bg-navy-50 py-16 sm:py-28 md:py-32">
      <GridPattern
        className="absolute inset-0 -z-10 h-full w-full mask-[linear-gradient(to_bottom_left,white_50%,transparent_60%)] fill-navy-100 stroke-navy-900/5"
        yOffset={-256}
      />
      <Container>
        <FadeIn>
          <figure className="mx-auto max-w-4xl">
            <blockquote className="relative font-display text-3xl font-medium tracking-tight text-navy-900 sm:text-4xl">
              <p className="before:content-['“'] after:content-['”'] sm:before:absolute sm:before:right-full">
                {children}
              </p>
            </blockquote>
            <figcaption className="mt-10">
              <p className="font-display font-semibold text-navy-900">{author.name}</p>
              <p className="mt-1 text-sm text-gray-500">{author.title}</p>
            </figcaption>
          </figure>
        </FadeIn>
      </Container>
    </div>
  )
}
