'use client'

import { motion } from 'framer-motion'
import { ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading, 
    leftIcon, 
    rightIcon, 
    className, 
    disabled, 
    ...props 
  }, ref) => {
    const variants = {
      primary: 'bg-primary text-ivory hover:bg-clay shadow-[0_18px_45px_rgba(23,19,15,0.18)]',
      secondary: 'bg-accent text-white hover:bg-clay',
      outline: 'border border-primary/40 text-primary hover:bg-primary hover:text-ivory',
      ghost: 'bg-transparent text-primary hover:bg-primary/5',
      glass: 'glass-panel text-primary hover:bg-primary/5',
    }

    const sizes = {
      sm: 'px-4 py-2 text-[0.65rem]',
      md: 'px-6 py-3 text-xs',
      lg: 'px-10 py-4 text-sm',
      icon: 'p-2',
    }

    const isDisabled = disabled || isLoading

    return (
      <motion.button
        ref={ref}
        whileHover={!isDisabled ? { y: -2 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'premium-sheen relative inline-flex items-center justify-center font-semibold uppercase tracking-[0.14em] transition-all duration-500 ease-smooth focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isDisabled}
        {...(props as any)}
      >
        {isLoading && (
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        <span className="relative z-10">{children}</span>
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
