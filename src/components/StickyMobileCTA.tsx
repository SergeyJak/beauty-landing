'use client'

import { motion } from 'framer-motion'
import Button from '@/components/Button'
import { SOCIAL_LINKS } from '@/lib/constants'
import { useT } from '@/lib/LanguageContext'

export default function StickyMobileCTA() {
  const t = useT()

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-primary/10 bg-ivory/95 backdrop-blur-sm md:hidden"
    >
      <div className="px-4 py-3">
        <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="block w-full">
          <Button size="lg" className="w-full min-h-12">
            {t('stickyCta.button')}
          </Button>
        </a>
        <p className="mt-2 text-center text-xs text-primary/60">{t('stickyCta.note')}</p>
      </div>
    </motion.div>
  )
}
