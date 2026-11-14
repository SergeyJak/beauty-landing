'use client'

import SectionHeader from '@/components/SectionHeader'
import { useLanguage } from '@/lib/LanguageContext'

type Benefit = { id: string; icon: string; title: string; description: string }

export default function Benefits() {
  const { t, list } = useLanguage()
  const benefits = list<Benefit>('benefits.items').slice(0, 4)

  return (
    <section id="benefits" className="relative bg-ivory py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={t('benefits.eyebrow')} title={t('benefits.title')} description={t('benefits.description')} />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <article key={benefit.id} className="rounded-xl border border-primary/10 bg-soft-beige/30 p-6">
              <span aria-hidden="true" className="text-2xl text-accent">{benefit.icon}</span>
              <h3 className="mt-4 font-serif text-2xl text-primary">{benefit.title}</h3>
              <p className="mt-3 text-sm leading-7 text-primary/80">{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
