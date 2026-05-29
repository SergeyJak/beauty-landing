'use client'

import { motion } from 'framer-motion'
import SectionHeader from '@/components/SectionHeader'
import Card from '@/components/Card'
import { useLanguage } from '@/lib/LanguageContext'

export default function Benefits() {
  const { t, list } = useLanguage()
  const benefits = list<any>('benefits.items')
  const science = list<string>('benefits.science.items')
  const timeline = list<any>('benefits.timeline.items')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section id="benefits" className="relative bg-ivory py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={t('benefits.eyebrow')} title={t('benefits.title')} description={t('benefits.description')} />

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <motion.div key={benefit.id} variants={itemVariants}>
              <Card className="h-full border border-primary/10 hover:border-accent/30">
                <div className="p-6 md:p-7">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-champagne/10">
                    <span className="text-2xl font-bold text-accent">{benefit.icon}</span>
                  </div>
                  <h3 className="mb-3 font-serif text-2xl text-primary">{benefit.title}</h3>
                  <p className="text-base leading-relaxed text-primary/72">{benefit.description}</p>
                  <div className="mt-6 border-t border-primary/10 pt-6">
                    <motion.div className="inline-flex items-center gap-2 text-sm font-semibold text-accent" whileHover={{ x: 4 }} transition={{ duration: 0.3 }}>
                      {t('common.learnMore')}
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <h3 className="mb-6 font-serif text-3xl text-primary">{t('benefits.science.title')}</h3>
            <ul className="space-y-4">
              {science.map((item) => (
                <li key={item} className="flex gap-3">
                  <svg className="mt-1 h-5 w-5 flex-shrink-0 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-primary/72">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-soft-beige/50 p-8">
            <h4 className="mb-4 font-serif text-xl text-primary">{t('benefits.timeline.title')}</h4>
            <div className="space-y-4">
              {timeline.map((item) => (
                <div key={item.phase} className="flex items-start gap-4">
                  <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
                  <div>
                    <p className="font-semibold text-primary">{item.phase}</p>
                    <p className="text-sm text-primary/60">{item.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
