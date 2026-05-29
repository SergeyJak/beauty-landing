'use client'

import { motion } from 'framer-motion'
import SectionHeader from '@/components/SectionHeader'
import Card from '@/components/Card'
import { useLanguage } from '@/lib/LanguageContext'

export default function WhyElectrolysis() {
  const { t, list } = useLanguage()
  const methods = list<any>('whyElectrolysis.methods')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section id="why-electrolysis" className="relative bg-soft-beige py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t('whyElectrolysis.eyebrow')}
          title={t('whyElectrolysis.title')}
          description={t('whyElectrolysis.description')}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {methods.map((method) => (
            <motion.div key={method.id} variants={itemVariants}>
              <Card className={`h-full ${method.permanent ? 'border-2 border-accent bg-gradient-to-br from-accent/5 to-champagne/10' : 'border border-primary/10'}`}>
                <div className="flex h-full flex-col p-6 md:p-5">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-2xl text-primary">{method.name}</h3>
                      <p className="mt-1 text-sm text-primary/60">{method.type}</p>
                    </div>
                    {method.permanent && (
                      <div className="rounded-full bg-accent px-3 py-1">
                        <span className="text-xs font-semibold text-ivory">{method.badge}</span>
                      </div>
                    )}
                  </div>

                  <p className="mb-5 text-sm leading-relaxed text-primary/72">{method.description}</p>

                  {method.benefits?.length > 0 && (
                    <div className="mb-5">
                      <p className="mb-3 text-xs font-semibold uppercase text-primary/60">{t('common.benefits')}</p>
                      <ul className="space-y-2">
                        {method.benefits.map((benefit: string) => (
                          <li key={benefit} className="flex gap-2 text-sm text-primary/70">
                            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {method.limitations?.length > 0 && (
                    <div className="mt-auto">
                      <p className="mb-3 text-xs font-semibold uppercase text-primary/60">{t('common.limitations')}</p>
                      <ul className="space-y-2">
                        {method.limitations.map((limitation: string) => (
                          <li key={limitation} className="flex gap-2 text-sm text-primary/70">
                            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/30" />
                            <span>{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 rounded-lg bg-gradient-to-r from-accent/10 to-champagne/10 p-8 md:p-12"
        >
          <h3 className="mb-4 font-serif text-3xl text-primary">{t('whyElectrolysis.explainer.title')}</h3>
          <p className="mb-6 max-w-3xl text-lg leading-relaxed text-primary/72">{t('whyElectrolysis.explainer.paragraph1')}</p>
          <p className="max-w-3xl text-base text-primary/70">{t('whyElectrolysis.explainer.paragraph2')}</p>
        </motion.div>
      </div>
    </section>
  )
}
