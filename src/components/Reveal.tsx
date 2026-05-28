'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'

type RevealProps = HTMLMotionProps<'div'> & {
  children: ReactNode
  delay?: number
}

export const premiumEase = [0.22, 1, 0.36, 1] as const

export default function Reveal({
  children,
  delay = 0,
  className = '',
  transition,
  ...props
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay, ease: premiumEase, ...transition }}
      viewport={{ once: true }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
