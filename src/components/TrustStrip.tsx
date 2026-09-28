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
      className="border-y border-primary/5 bg-soft-beige/30 py-5 backdrop-blur-md md:py-7"
    >
      <div className="section-container">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:justify-between lg:gap-x-16">
          <div className="hidden lg:block border-r border-primary/10 pr-12">
            <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-primary/50 whitespace-nowrap">
              Trusted Electrolysis Expertise
            </h4>
          </div>
          <div className="grid w-full grid-cols-2 gap-x-5 gap-y-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-10 sm:gap-y-4 md:gap-x-12">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex min-w-0 items-center gap-2.5 group"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-accent transition-transform group-hover:scale-150" />
                <span className="min-w-0 text-[0.62rem] font-bold uppercase leading-snug tracking-[0.14em] text-primary/80 sm:text-[0.68rem] sm:tracking-[0.18em]">
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
