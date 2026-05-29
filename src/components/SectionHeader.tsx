import { motion } from 'framer-motion'
import { sectionReveal, revealItem } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center' | 'split'
  light?: boolean
  className?: string
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'split',
  light = false,
  className = '',
}: SectionHeaderProps) {
  const eyebrowClass = light ? 'text-champagne' : 'text-accent'
  const titleClass = light ? 'text-parchment' : 'text-primary'
  const descriptionClass = light ? 'text-parchment/65' : 'text-primary/70'

  const content = (
    <motion.div
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={cn("mb-16 md:mb-24", className)}
    >
      {align === 'center' ? (
        <div className="text-center">
          <motion.p variants={revealItem} className={cn("eyebrow mb-5", eyebrowClass)}>{eyebrow}</motion.p>
          <motion.h2 variants={revealItem} className={cn("section-heading mb-8", titleClass)}>{title}</motion.h2>
          {description && (
            <motion.p variants={revealItem} className={cn("mx-auto max-w-2xl subheading", descriptionClass)}>
              {description}
            </motion.p>
          )}
        </div>
      ) : align === 'left' ? (
        <div>
          <motion.p variants={revealItem} className={cn("eyebrow mb-5", eyebrowClass)}>{eyebrow}</motion.p>
          <motion.h2 variants={revealItem} className={cn("section-heading mb-8", titleClass)}>{title}</motion.h2>
          {description && <motion.p variants={revealItem} className={cn("max-w-2xl subheading", descriptionClass)}>{description}</motion.p>}
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <motion.p variants={revealItem} className={cn("eyebrow mb-5", eyebrowClass)}>{eyebrow}</motion.p>
            <motion.h2 variants={revealItem} className={cn("section-heading", titleClass)}>{title}</motion.h2>
          </div>
          {description && (
            <motion.p variants={revealItem} className={cn("max-w-2xl lg:pt-14 subheading", descriptionClass)}>
              {description}
            </motion.p>
          )}
        </div>
      )}
    </motion.div>
  )

  return content
}
