'use client'

import { motion } from 'framer-motion'
import { SOCIAL_LINKS } from '@/lib/constants'
import { useT } from '@/lib/LanguageContext'

const contactLinks = [
  {
    label: 'WhatsApp',
    href: SOCIAL_LINKS.whatsapp,
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371 0-.57 0-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-1.325 0-2.651-.402-3.76-1.161l-.27-.159-2.8.734.746-2.728-.175-.277c-.796-1.266-1.217-2.738-1.217-4.288 0-4.569 3.72-8.288 8.288-8.288 2.21 0 4.285.859 5.846 2.415 1.56 1.557 2.419 3.631 2.42 5.84 0 4.569-3.72 8.288-8.288 8.288m6.886-12.318C19.258 1.26 15.812.036 12.028 0 5.668-.036 0 5.659 0 12.028c0 2.067.543 4.1 1.575 5.895L.975 24l6.351-1.605c1.692.923 3.6 1.41 5.573 1.41 6.165 0 11.868-5.037 12.128-11.289.026-.526.026-1.051 0-1.575.257-6.252-5.946-11.348-12.128-11.348" />
      </svg>
    ),
  },
  {
    label: 'Call',
    href: 'tel:+12125550123',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 5.5C2 4.12 3.12 3 4.5 3H7l2 5-2 1.5a12 12 0 007.5 7.5l1.5-2 5 2v2.5A2.5 2.5 0 0118.5 22C9.39 22 2 14.61 2 5.5z" />
      </svg>
    ),
  },
]

export default function FloatingButtons() {
  const t = useT()

  return (
    <>
      <motion.div
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-primary/10 bg-ivory/95 px-3 pt-3 shadow-[0_-18px_45px_rgba(23,19,15,0.12)] backdrop-blur md:hidden"
      >
        <div className="grid grid-cols-[1fr_3.2rem_3.2rem] gap-2">
          <a
            href="#booking"
            className="premium-sheen flex min-h-12 items-center justify-center bg-primary px-4 text-center text-xs font-semibold uppercase tracking-[0.14em] text-ivory transition-colors active:bg-clay"
          >
            {t('floating.book')}
          </a>
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={link.label}
              className="flex min-h-12 items-center justify-center border border-primary/15 bg-ivory text-primary transition-colors active:bg-primary active:text-ivory"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="fixed bottom-8 right-8 z-40 hidden flex-col items-end space-y-3 md:flex"
      >
        {contactLinks.map((link) => (
          <motion.a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            aria-label={link.label}
            className="flex h-12 w-12 items-center justify-center border border-primary/10 bg-ivory text-primary shadow-[0_14px_35px_rgba(23,19,15,0.16)] transition-colors hover:bg-primary hover:text-ivory"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {link.icon}
          </motion.a>
        ))}
        <motion.a
          href="#booking"
          aria-label={t('floating.bookAppointment')}
          className="flex h-12 w-12 items-center justify-center bg-accent text-ivory shadow-[0_14px_35px_rgba(23,19,15,0.16)] transition-all hover:bg-primary"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
          </svg>
        </motion.a>
      </motion.div>
    </>
  )
}
