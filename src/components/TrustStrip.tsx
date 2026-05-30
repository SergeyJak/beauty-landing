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
      className="border-y border-primary/5 bg-soft-beige/30 py-8 backdrop-blur-md"
    >
      <div className="section-container">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:justify-between lg:gap-x-20">
          <div className="hidden lg:block border-r border-primary/10 pr-12">
            <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-primary/30 whitespace-nowrap">
              Trusted Electrolysis Expertise
            </h4>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-16">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex items-center gap-3 group"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-accent transition-transform group-hover:scale-150" />
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-primary/80">
                  {badge.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
