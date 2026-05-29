'use client'

import { motion } from 'framer-motion'
import { Check, X, ShieldCheck, AlertCircle } from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'
import { useLanguage } from '@/lib/LanguageContext'
import { cn } from '@/lib/utils'

export default function ClinicalComparison() {
  const { t } = useLanguage()

  const electrolysis = {
    title: t('comparison.electrolysis.title'),
    subtitle: t('comparison.electrolysis.subtitle'),
    description: t('comparison.electrolysis.description'),
    points: [
      { text: t('comparison.electrolysis.points.0'), status: 'check' },
      { text: t('comparison.electrolysis.points.1'), status: 'check' },
      { text: t('comparison.electrolysis.points.2'), status: 'check' },
      { text: t('comparison.electrolysis.points.3'), status: 'check' },
      { text: t('comparison.electrolysis.points.4'), status: 'check' },
    ],
    highlight: true,
  }

  const laser = {
    title: t('comparison.laser.title'),
    subtitle: t('comparison.laser.subtitle'),
    description: t('comparison.laser.description'),
    points: [
      { text: t('comparison.laser.points.0'), status: 'info' },
      { text: t('comparison.laser.points.1'), status: 'cross' },
      { text: t('comparison.laser.points.2'), status: 'cross' },
      { text: t('comparison.laser.points.3'), status: 'cross' },
      { text: t('comparison.laser.points.4'), status: 'cross' },
    ],
    highlight: false,
  }

  return (
    <section id="comparison" className="bg-soft-beige py-20 md:py-32">
      <div className="section-container">
        <SectionHeader
          eyebrow={t('comparison.eyebrow')}
          title={t('comparison.title')}
          description={t('comparison.description')}
          align="center"
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Electrolysis Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-accent/5 blur-2xl group-hover:bg-accent/10 transition-colors" />
            <div className="relative border-2 border-accent bg-white p-8 md:p-12 shadow-2xl h-full">
              <div className="absolute top-0 right-0 bg-accent px-4 py-1 text-[0.6rem] font-bold uppercase tracking-widest text-white">
                Medical Gold Standard
              </div>
              
              <h3 className="font-serif text-3xl mb-2 text-primary">{electrolysis.title}</h3>
              <p className="eyebrow text-accent mb-6">{electrolysis.subtitle}</p>
              <p className="body-small text-primary/70 mb-10 leading-relaxed">
                {electrolysis.description}
              </p>

              <ul className="space-y-5">
                {electrolysis.points.map((point, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-primary/80">{point.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Laser Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative border border-primary/10 bg-ivory/50 p-8 md:p-12 h-full">
              <h3 className="font-serif text-3xl mb-2 text-primary/60">{laser.title}</h3>
              <p className="eyebrow text-primary/30 mb-6">{laser.subtitle}</p>
              <p className="body-small text-primary/60 mb-10 leading-relaxed">
                {laser.description}
              </p>

              <ul className="space-y-5">
                {laser.points.map((point, i) => (
                  <li key={i} className="flex items-center gap-4 opacity-70">
                    <div className={cn(
                      "flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center",
                      point.status === 'cross' ? "bg-red-100 text-red-500" : "bg-primary/10 text-primary/40"
                    )}>
                      {point.status === 'cross' ? <X className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    </div>
                    <span className="text-sm font-medium text-primary/60">{point.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 max-w-3xl mx-auto text-center"
        >
          <div className="luxury-rule mb-8" />
          <p className="body-base italic text-primary/60 leading-relaxed">
            {t('comparison.quote')}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
