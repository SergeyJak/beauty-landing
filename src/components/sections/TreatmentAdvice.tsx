'use client'

import SectionHeader from '@/components/SectionHeader'
import { useLanguage } from '@/lib/LanguageContext'

type AdviceGroup = { title: string; items: string[] }

export default function TreatmentAdvice() {
  const { t, list } = useLanguage()
  const groups = list<AdviceGroup>('treatmentAdvice.groups')

  return (
    <section id="treatment-advice" className="bg-soft-beige py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={t('treatmentAdvice.eyebrow')} title={t('treatmentAdvice.title')} description={t('treatmentAdvice.description')} />
        <div className="mt-12 space-y-3">
          {groups.map((group) => (
            <details key={group.title} className="group rounded-xl border border-primary/10 bg-ivory px-6 open:shadow-sm">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 font-serif text-xl text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                {group.title}<span aria-hidden="true" className="text-2xl text-accent group-open:rotate-45">+</span>
              </summary>
              <ul className="space-y-3 border-t border-primary/10 py-5 text-sm leading-7 text-primary/80 sm:text-base">
                {group.items.map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true" className="text-accent">•</span><span>{item}</span></li>)}
              </ul>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
