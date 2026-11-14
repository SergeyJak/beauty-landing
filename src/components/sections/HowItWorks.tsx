'use client'

import SectionHeader from '@/components/SectionHeader'
import { useLanguage } from '@/lib/LanguageContext'

type Step = { number: string; title: string; description: string }

export default function HowItWorks() {
  const { t, list } = useLanguage()
  const steps = list<Step>('howItWorks.steps')

  return (
    <section id="how-it-works" className="bg-ivory py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={t('howItWorks.eyebrow')} title={t('howItWorks.title')} description={t('howItWorks.description')} />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.number} className="rounded-xl border border-primary/10 bg-soft-beige/30 p-6">
              <span className="font-serif text-2xl text-accent">{step.number}</span>
              <h3 className="mt-4 font-serif text-2xl text-primary">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-primary/80">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
