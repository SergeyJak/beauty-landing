'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/LanguageContext'

type TrustBadge = {
  id: string
  label: string
}

export default function TrustStrip() {
  const { t, list } = useLanguage()
  const badges = list<TrustBadge>('trust.badges')

  if (!badges.length) {
    return null
  }

  return (
    <section
      aria-label={t('trust.ariaLabel')}
      className="border-y border-primary/10 bg-ivory/90 py-4 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 sm:px-6 lg:px-8">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-sm text-primary/72"
          >
            <span className="flex h-7 w-7 items-center justify-center border border-accent/40 font-serif text-accent">
              ✓
            </span>
            <span className="font-medium">{badge.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
