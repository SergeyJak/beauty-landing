'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hoverable?: boolean
  onClick?: () => void
}

export default function Card({ children, className = '', hoverable = false, onClick }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      whileHover={{ y: hoverable ? -8 : -4, borderColor: 'rgba(185, 144, 88, 0.28)' }}
      onClick={onClick}
      className={`overflow-hidden border border-primary/10 bg-ivory transition-shadow duration-500 ${
        hoverable ? 'cursor-pointer shadow-[0_24px_70px_rgba(23,19,15,0.07)] hover:shadow-[0_30px_90px_rgba(23,19,15,0.13)]' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  )
}
