'use client'

import { motion } from 'framer-motion'
import SectionHeader from '@/components/SectionHeader'
import { useLanguage } from '@/lib/LanguageContext'

export default function HairGrowthPhases() {
  const { t, list } = useLanguage()
  const phases = list<any>('hairGrowthPhases.phases')
  const steps = list<any>('hairGrowthPhases.steps')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  }

  return (
    <section id="hair-growth" className="relative bg-gradient-to-b from-soft-beige to-ivory py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={t('hairGrowthPhases.eyebrow')} title={t('hairGrowthPhases.title')} description={t('hairGrowthPhases.description')} />

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mt-16 space-y-8">
          {phases.map((phase) => (
            <motion.div key={phase.id} variants={itemVariants} className={`grid grid-cols-1 gap-8 rounded-xl bg-gradient-to-br ${phase.color} p-8 md:grid-cols-2 md:p-12`}>
              <div className="flex flex-col justify-center">
                <h3 className="mb-2 font-serif text-4xl text-primary">{phase.name}</h3>
                <p className="mb-4 text-lg font-semibold text-accent">{phase.subtitle}</p>
                <p className="mb-6 text-base leading-relaxed text-primary/72">{phase.description}</p>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
                  <div>
                    <p className="text-sm uppercase text-primary/60">{t('hairGrowthPhases.percentageLabel')}</p>
                    <p className="font-serif text-3xl text-primary">{phase.percentage}</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase text-primary/60">{t('hairGrowthPhases.durationLabel')}</p>
                    <p className="font-serif text-2xl text-primary">{phase.duration}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-6 font-semibold text-primary">{t('hairGrowthPhases.characteristics')}</h4>
                <ul className="space-y-3">
                  {phase.details?.map((detail: string) => (
                    <li key={detail} className="flex gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                      <span className="text-primary/72">{detail}</span>
                    </li>
                  ))}
                </ul>

                {phase.id === 'anagen' && (
                  <div className="mt-6 rounded-lg bg-accent/15 px-4 py-3">
                    <p className="text-sm font-semibold text-accent">{t('hairGrowthPhases.treatableBadge')}</p>
                    <p className="mt-1 text-sm text-primary/70">{t('hairGrowthPhases.treatableNote')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-16 rounded-lg bg-gradient-to-r from-accent/5 to-champagne/5 p-8 md:p-12">
          <h3 className="mb-4 font-serif text-3xl text-primary">{t('hairGrowthPhases.multiple.title')}</h3>
          <p className="mb-6 max-w-3xl text-lg leading-relaxed text-primary/72">{t('hairGrowthPhases.multiple.paragraph1')}</p>
          <p className="max-w-3xl text-base text-primary/70">{t('hairGrowthPhases.multiple.paragraph2')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6, delay: 0.7 }} className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <motion.div key={step.number} className="text-center" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent/30 to-champagne/20">
                <span className="font-serif text-3xl font-bold text-accent">{step.number}</span>
              </div>
              <h4 className="mb-2 font-serif text-xl text-primary">{step.label}</h4>
              <p className="text-sm text-primary/70">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
