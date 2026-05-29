'use client'

import { motion } from 'framer-motion'
import SectionHeader from '@/components/SectionHeader'
import { useLanguage } from '@/lib/LanguageContext'

export default function HowItWorks() {
  const { t, list } = useLanguage()
  const steps = list<any>('howItWorks.steps')
  const methodItems = list<string>('howItWorks.science.methodItems')
  const permanentItems = list<string>('howItWorks.science.permanentItems')
  const timeline = list<any>('howItWorks.timeline.items')
  const aftercare = list<any>('howItWorks.aftercare.items')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section id="how-it-works" className="relative bg-ivory py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={t('howItWorks.eyebrow')} title={t('howItWorks.title')} description={t('howItWorks.description')} />

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="mt-16 space-y-8">
          {steps.map((step, idx) => (
            <motion.div key={step.number} variants={itemVariants}>
              <div className="grid grid-cols-1 gap-8 rounded-xl border border-primary/10 bg-soft-beige/30 p-8 transition-colors duration-300 hover:border-accent/30 md:grid-cols-[100px_1fr_1fr] md:p-10">
                <div className="flex items-start md:flex-col md:items-center md:justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-champagne/10">
                    <span className="font-serif text-3xl font-bold text-accent">{step.number}</span>
                  </div>
                  {idx < steps.length - 1 && <div className="ml-10 hidden h-px w-8 bg-primary/20 md:ml-0 md:mt-4 md:h-8 md:w-px" />}
                </div>

                <div>
                  <h3 className="mb-3 font-serif text-2xl text-primary">{step.title}</h3>
                  <p className="text-base leading-relaxed text-primary/72">{step.description}</p>
                </div>

                <div>
                  <p className="mb-4 text-sm font-semibold uppercase text-primary/60">{t('howItWorks.whatHappens')}</p>
                  <ul className="space-y-2">
                    {step.details?.map((detail: string) => (
                      <li key={detail} className="flex gap-2 text-sm text-primary/70">
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-16 rounded-lg bg-gradient-to-r from-accent/10 to-champagne/10 p-8 md:p-12">
          <h3 className="mb-4 font-serif text-3xl text-primary">{t('howItWorks.science.title')}</h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <ScienceColumn title={t('howItWorks.science.methodTitle')} description={t('howItWorks.science.methodDescription')} items={methodItems} />
            <ScienceColumn title={t('howItWorks.science.permanentTitle')} description={t('howItWorks.science.permanentDescription')} items={permanentItems} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6, delay: 0.7 }} className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          <InfoList title={t('howItWorks.timeline.title')} items={timeline} primaryKey="time" secondaryKey="action" />
          <InfoList title={t('howItWorks.aftercare.title')} items={aftercare} primaryKey="tip" secondaryKey="desc" />
        </motion.div>
      </div>
    </section>
  )
}

function ScienceColumn({ title, description, items }: { title: string; description: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-4 font-semibold text-primary">{title}</h4>
      <p className="mb-4 text-base text-primary/72">{description}</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-primary/70">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function InfoList({ title, items, primaryKey, secondaryKey }: { title: string; items: any[]; primaryKey: string; secondaryKey: string }) {
  return (
    <div className="rounded-lg bg-soft-beige/50 p-8">
      <h4 className="mb-6 font-serif text-2xl text-primary">{title}</h4>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item[primaryKey]} className="flex items-start gap-4">
            <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
            <div>
              <p className="font-semibold text-primary">{item[primaryKey]}</p>
              <p className="text-sm text-primary/60">{item[secondaryKey]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
