'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ActionLink from '@/components/ActionLink'
import Reveal from '@/components/Reveal'
import SectionHeader from '@/components/SectionHeader'
import type { FAQItem } from '@/types'
import { SOCIAL_LINKS } from '@/lib/constants'
import { BUSINESS } from '@/lib/business'
import { useLanguage } from '@/lib/LanguageContext'

const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'Is electrolysis really permanent?',
    answer:
      'Yes. Electrolysis is FDA-approved as the only permanent method of hair removal. Once the hair follicle is treated and destroyed, it cannot produce hair again. Results are permanent.',
  },
  {
    id: '2',
    question: 'How long does electrolysis take?',
    answer:
      'Treatment time varies based on the area and hair density. Small areas like the upper lip may take 15-30 minutes, while larger areas can take 1-2 hours. Your electrologist will provide a timeline at your consultation.',
  },
  {
    id: '3',
    question: 'How many sessions will I need?',
    answer:
      'Most clients need 6-12 sessions spread over 6-12 months. This is because only hair in the active growth phase (Anagen) can be treated permanently. Spacing allows new hairs to enter the growth phase.',
  },
  {
    id: '4',
    question: 'Does electrolysis hurt?',
    answer:
      'Electrolysis causes minimal discomfort. Most clients describe it as slight tingling or warmth. Numbing cream is available if desired. The sensation varies by individual tolerance and area being treated.',
  },
  {
    id: '5',
    question: 'Will there be redness or marks after treatment?',
    answer:
      'Most clients experience minimal redness that fades within hours to a few days. Some may see slight marks that disappear quickly. We apply soothing products immediately after treatment to minimize any reaction.',
  },
  {
    id: '6',
    question: 'Can electrolysis work on all skin types and hair colors?',
    answer:
      'Yes. Unlike laser hair removal, electrolysis works on all skin types (fair to very dark) and all hair colors (including blonde, red, gray, and white). This makes it the most inclusive permanent hair removal method.',
  },
]

export default function FAQ() {
  const { t, list } = useLanguage()
  const [activeId, setActiveId] = useState<string | null>(null)
  const localizedFaqItems = list<FAQItem>('faq.items')
  const faqList = (localizedFaqItems.length ? localizedFaqItems : faqItems).map(
    (item, index) => ({
      ...item,
      id: item.id ?? faqItems[index]?.id ?? String(index + 1),
    })
  )

  const toggleAccordion = (id: string) => {
    setActiveId(activeId === id ? null : id)
  }

  return (
    <section id="faq" className="bg-soft-beige py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t('faq.eyebrow')}
          title={t('faq.title')}
          description={t('faq.description')}
          align="center"
        />

        <div className="border-y border-primary/10">
          {faqList.map((item, index) => (
            <motion.div
              key={`faq-item-${index}-${item.id}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: index * 0.045, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="overflow-hidden border-b border-primary/10 last:border-b-0"
            >
              <button
                onClick={() => toggleAccordion(item.id)}
                className="flex w-full items-center justify-between px-2 py-6 text-left transition-colors hover:bg-ivory/45 focus-visible:bg-ivory/45 md:px-4"
                aria-expanded={activeId === item.id}
                aria-controls={`faq-answer-${item.id}`}
              >
                <h3 className="pr-4 font-serif text-2xl text-primary">{item.question}</h3>
                <motion.div
                  animate={{ rotate: activeId === item.id ? 180 : 0 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-shrink-0"
                >
                  <svg
                    className="h-5 w-5 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </motion.div>
              </button>

              <motion.div
                id={`faq-answer-${item.id}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: activeId === item.id ? 'auto' : 0,
                  opacity: activeId === item.id ? 1 : 0,
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="border-t border-primary/10 px-2 py-5 md:px-4">
                  <p className="leading-8 text-primary/65">{item.answer}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Still have questions? */}
        <Reveal
          delay={0.2}
          whileHover={{ y: -5, borderColor: 'rgba(172, 145, 110, 0.28)' }}
          className="premium-sheen mt-16 border border-primary/10 bg-ivory p-8 text-center shadow-[0_24px_70px_rgba(45,42,40,0.06)]"
        >
          <h3 className="mb-2 font-serif text-3xl text-primary">{t('faq.cta.title')}</h3>
          <p className="mb-6 text-primary/65">
            {t('faq.cta.description')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ActionLink href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer">
              {t('common.whatsApp')}
            </ActionLink>
            <ActionLink href={SOCIAL_LINKS.telegram} target="_blank" rel="noopener noreferrer">
              {t('common.telegram')}
            </ActionLink>
            <ActionLink href={`mailto:${BUSINESS.email}`}>
              {t('common.email')}
            </ActionLink>
            <ActionLink href="#contact" className="border-primary bg-primary text-ivory hover:bg-clay hover:text-ivory">
              {t('header.bookNow')}
            </ActionLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
