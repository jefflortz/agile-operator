import clsx from 'clsx'
import { Container } from './Container'
import { FadeIn } from './FadeIn'

export function SectionIntro({
  title,
  eyebrow,
  children,
  smaller = false,
  invert = false,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof Container>, 'title' | 'children'> & {
  title: string
  eyebrow?: string
  children?: React.ReactNode
  smaller?: boolean
  invert?: boolean
}) {
  return (
    <Container {...props}>
      <FadeIn className="max-w-2xl">
        <h2>
          {eyebrow && (
            <>
              <span
                className={clsx(
                  'mb-6 block font-display text-base font-semibold',
                  invert ? 'text-white' : 'text-navy-900',
                )}
              >
                {eyebrow}
              </span>
              <span className="sr-only"> - </span>
            </>
          )}
          <span
            className={clsx(
              'block font-display tracking-tight text-balance',
              smaller
                ? 'text-2xl font-semibold'
                : 'text-4xl font-medium sm:text-5xl',
              invert ? 'text-white' : 'text-navy-900',
            )}
          >
            {title}
          </span>
        </h2>
        {children && (
          <div
            className={clsx(
              'mt-6 text-xl',
              invert ? 'text-navy-200' : 'text-gray-600',
            )}
          >
            {children}
          </div>
        )}
      </FadeIn>
    </Container>
  )
}
