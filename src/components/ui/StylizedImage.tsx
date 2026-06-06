import Image from 'next/image'
import clsx from 'clsx'
import type { ComponentPropsWithoutRef } from 'react'

type StylizedImageProps = ComponentPropsWithoutRef<typeof Image> & {
  className?: string
}

export function StylizedImage({ className, ...props }: StylizedImageProps) {
  return (
    <div className={clsx('relative', className)}>
      {/* Decorative border accent — Studio signature */}
      <div className="absolute -inset-x-4 -inset-y-4 rounded-3xl bg-navy-50/50" />
      <div className="relative overflow-hidden rounded-2xl">
        <Image
          {...props}
          className={clsx(
            'h-full w-full object-cover grayscale transition duration-500 motion-safe:hover:grayscale-0',
            typeof props.className === 'string' ? props.className : '',
          )}
        />
        {/* Overlay that fades out on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-navy-900/10" />
      </div>
    </div>
  )
}
