import { AnchorHTMLAttributes, ReactNode } from 'react'

interface ActionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  compact?: boolean
}

export default function ActionLink({
  children,
  className = '',
  compact = false,
  ...props
}: ActionLinkProps) {
  const sizeClasses = compact ? 'px-4 py-3' : 'px-6 py-3'

  return (
    <a
      className={`min-h-12 border border-primary/20 ${sizeClasses} text-center text-xs font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:bg-primary hover:text-ivory ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}
