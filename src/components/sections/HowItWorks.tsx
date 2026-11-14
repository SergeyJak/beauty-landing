'use client'

import { useLanguage } from '@/lib/LanguageContext'

type Step = { number: string; title: string; description: string }

export default function HowItWorks() {
  const { t, list } = useLanguage()
  const steps = list<Step>('howItWorks.steps')

  return (
    <section id="how-it-works" className="bg-ivory py-12 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="eyebrow mb-3 text-accent">{t('howItWorks.eyebrow')}</p>
          <h2 className="section-heading text-primary">{t('howItWorks.title')}</h2>
          <p className="mt-3 text-base leading-7 text-primary/80 md:text-lg">{t('howItWorks.description')}</p>
        </div>
        <ol className="mt-6 overflow-hidden rounded-xl border border-primary/10 bg-soft-beige/30 md:mt-10 md:grid md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.number} className={`flex gap-4 px-4 py-4 sm:px-5 md:gap-3 md:p-6 ${index > 0 ? 'border-t border-primary/10 md:border-t-0 md:border-l' : ''}`}>
              <span className="shrink-0 font-serif text-xl leading-7 text-accent">{step.number}</span>
              <div>
                <h3 className="font-serif text-xl leading-7 text-primary">{step.title}</h3>
                <p className="mt-1 text-sm leading-6 text-primary/80">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
