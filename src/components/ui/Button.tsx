import Link from 'next/link'

type ButtonProps = {
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
  external?: boolean
}

const variants = {
  primary: 'bg-navy-900 text-white hover:bg-navy-700 focus:ring-navy-900',
  outline: 'border border-navy-900 text-navy-900 hover:bg-navy-50 focus:ring-navy-900',
  ghost:   'text-navy-900 hover:bg-navy-50 focus:ring-navy-900',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export default function Button({
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  external = false,
}: ButtonProps) {
  const base = `inline-flex items-center justify-center font-sans font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
          {children}
        </a>
      )
    }
    return <Link href={href} className={base}>{children}</Link>
  }

  return (
    <button onClick={onClick} className={base}>
      {children}
    </button>
  )
}
