'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ActionLink from '@/components/ActionLink'
import Reveal from '@/components/Reveal'
import SectionHeader from '@/components/SectionHeader'
import type { FAQItem } from '@/types'

const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'How do I request an appointment?',
    answer:
      'Send a request through the form, WhatsApp, or phone. We reply during studio hours with available times, treatment fit, and any prep notes for your skin or event timeline.',
  },
  {
    id: '2',
    question: 'What is your cancellation policy?',
    answer:
      'Appointments can be moved or cancelled up to 24 hours in advance. Late cancellations and no-shows may be charged 50% of the reserved service.',
  },
  {
    id: '3',
    question: 'Do you offer gift cards?',
    answer:
      'Yes. Digital gift cards can be issued for a specific treatment or a custom amount and include a brief note from the sender.',
  },
  {
    id: '4',
    question: 'Can you work with sensitive or reactive skin?',
    answer:
      'Yes. Please mention sensitivities, prescriptions, pregnancy, recent peels, retinoid use, or injectables when booking so we can adjust actives and technique.',
  },
  {
    id: '5',
    question: 'Do you create event timelines?',
    answer:
      'For weddings, shoots, galas, and speaking engagements, we can plan facials, bodywork, brows, nails, hair gloss, and day-of timing around the event date.',
  },
  {
    id: '6',
    question: 'What should I expect on my first visit?',
    answer:
      'Your first appointment includes a short intake, skin or service consultation, the treatment, and concise aftercare. Arrive with clean skin when possible and bring product names if you use prescriptions.',
  },
]

export default function FAQ() {
  const [activeId, setActiveId] = useState<string | null>(null)

  const toggleAccordion = (id: string) => {
    setActiveId(activeId === id ? null : id)
  }

  return (
    <section id="faq" className="bg-soft-beige py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Details"
          title="Before your appointment."
          description="The practical details clients ask for before their first studio visit."
          align="center"
        />

        <div className="border-y border-primary/10">
          {faqItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: index * 0.045, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="overflow-hidden border-b border-primary/10 last:border-b-0"
            >
              <button
                onClick={() => toggleAccordion(item.id)}
                className="flex w-full items-center justify-between px-2 py-6 text-left transition-colors hover:bg-ivory/45 md:px-4"
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
          whileHover={{ y: -5, borderColor: 'rgba(185, 144, 88, 0.28)' }}
          className="premium-sheen mt-16 border border-primary/10 bg-ivory p-8 text-center shadow-[0_24px_70px_rgba(23,19,15,0.06)]"
        >
          <h3 className="mb-2 font-serif text-3xl text-primary">Still have questions?</h3>
          <p className="mb-6 text-primary/65">
            Contact the studio directly for timing, sensitivities, or event preparation questions.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <ActionLink href="https://wa.me/12127318426?text=Hello%20Maison%20Elise%2C%20I%20have%20a%20question%20about%20booking">
              WhatsApp
            </ActionLink>
            <ActionLink href="https://t.me/maisoneliseskin">
              Telegram
            </ActionLink>
            <ActionLink href="mailto:hello@maisonelise.studio">
              Email
            </ActionLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
