'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-primary/10 rounded-sm bg-soft-beige/30',
        className
      )}
    >
      {icon && <div className="mb-6 text-accent/40">{icon}</div>}
      <h3 className="mb-2 text-xl font-serif font-semibold text-primary">{title}</h3>
      <p className="mb-8 max-w-sm text-sm text-primary/60 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </motion.div>
  )
}
