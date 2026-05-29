'use client'

import { motion } from 'framer-motion'
import ActionLink from '@/components/ActionLink'
import Reveal from '@/components/Reveal'
import SectionHeader from '@/components/SectionHeader'
import { useLanguage } from '@/lib/LanguageContext'

export default function Contact() {
  const { t, list } = useLanguage()
  const contactMethods = list<any>('contact.methods')

  return (
    <section id="contact" className="bg-ivory py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t('contact.eyebrow')}
          title={t('contact.title')}
          description={t('contact.description')}
          className="lg:grid-cols-[0.85fr_1.15fr]"
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="border-y border-primary/10">
            {contactMethods.map((method) => (
              <div key={method.title} className="grid grid-cols-[3rem_1fr] gap-5 border-b border-primary/10 py-6 last:border-b-0">
                <div className="flex h-11 w-11 items-center justify-center border border-accent/45 font-serif text-accent">
                  {method.label}
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-primary">{method.title}</h3>
                  {method.action ? (
                    <a href={method.action} className="mt-2 block leading-7 text-primary/65 transition-colors hover:text-accent">
                      {method.content}
                    </a>
                  ) : (
                    <p className="mt-2 leading-7 text-primary/65">{method.content}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="py-8">
              <h3 className="eyebrow mb-4 text-primary/45">{t('contact.follow')}</h3>
              <div className="flex gap-3">
                {[
                  ['Instagram', 'https://instagram.com/electrolysisnyc'],
                  ['TikTok', 'https://tiktok.com/@electrolysisnyc'],
                  ['WhatsApp', 'https://wa.me/12125550123?text=Hello%20Electrolysis%20NYC%2C%20I%20have%20a%20question%20about%20permanent%20hair%20removal'],
                ].map(([social, href]) => (
                  <ActionLink
                    key={social}
                    href={href}
                    compact
                  >
                    {social}
                  </ActionLink>
                ))}
              </div>
            </div>
          </Reveal>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="min-h-[28rem] border border-primary/10 bg-soft-beige p-3 shadow-[0_28px_90px_rgba(23,19,15,0.08)]"
          >
            <iframe
              width="100%"
              height="100%"
              className="min-h-[26.5rem]"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src="https://www.google.com/maps?q=157%20E%2086th%20St%2C%20New%20York%2C%20NY%2010028&output=embed"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
