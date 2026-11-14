'use client'

import SectionHeader from '@/components/SectionHeader'
import { useLanguage } from '@/lib/LanguageContext'

type Benefit = { id: string; icon: string; title: string; description: string }

export default function Benefits() {
  const { t, list } = useLanguage()
  const benefits = list<Benefit>('benefits.items').slice(0, 4)

  return (
    <section id="benefits" className="relative bg-ivory py-12 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={t('benefits.eyebrow')} title={t('benefits.title')} description={t('benefits.description')} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
          {benefits.map((benefit) => (
            <article key={benefit.id} className="flex gap-4 rounded-xl border border-primary/10 bg-soft-beige/30 p-4 md:block md:p-6">
              <span aria-hidden="true" className="shrink-0 text-xl leading-7 text-accent md:text-2xl">{benefit.icon}</span>
              <div><h3 className="font-serif text-xl leading-7 text-primary md:mt-4 md:text-2xl">{benefit.title}</h3>
              <p className="mt-1 text-sm leading-6 text-primary/80 md:mt-3 md:leading-7">{benefit.description}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
