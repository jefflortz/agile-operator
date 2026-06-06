import Image from 'next/image'
import clsx from 'clsx'

export function Logo({ className, invert = false }: { className?: string; invert?: boolean }) {
  return (
    <Image
      src="/SVG/Agile Operator-01.svg"
      alt="Agile Operator"
      width={480}
      height={120}
      className={clsx('w-auto', className, invert && 'brightness-0 invert')}
      priority
    />
  )
}
