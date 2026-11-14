'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/Button'
import { initializeAnalytics, type AnalyticsConfig } from '@/lib/analytics'
import { useLanguage } from '@/lib/LanguageContext'

export default function CookieConsent({
  googleAnalyticsId,
  facebookPixelId,
}: AnalyticsConfig) {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [consent, setConsent] = useState<string | null>(null)

  useEffect(() => {
    let stored: string | null = null
    try {
      stored = localStorage.getItem('cookie-consent')
    } catch {
      // If storage is blocked, ask for consent for this session.
    }
    if (stored === 'all' || stored === 'essential') {
      setConsent(stored)
      return
    }
    const timer = setTimeout(() => setIsVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    initializeAnalytics(consent, { googleAnalyticsId, facebookPixelId })
  }, [consent, googleAnalyticsId, facebookPixelId])

  const saveConsent = (value: 'all' | 'essential') => {
    try {
      localStorage.setItem('cookie-consent', value)
    } catch {
      // The user's choice still applies to this session.
    }
    setConsent(value)
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 inset-x-0 z-[100] p-4 md:p-6"
        >
          <div className="mx-auto max-w-4xl glass-panel p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-accent/20">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-primary mb-2">
                {t('common.cookiesTitle') || 'We value your privacy'}
              </h3>
              <p className="text-sm text-primary/70 leading-relaxed">
                {t('common.cookiesDescription') || 
                  'We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.'}
                {' '}
                <a href="#" className="text-accent hover:underline underline-offset-4">
                  {t('common.privacyPolicy')}
                </a>
              </p>
            </div>
            <div className="flex flex-shrink-0 gap-3 w-full md:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => saveConsent('essential')}
                className="flex-1 md:flex-none border-primary/10"
              >
                {t('common.decline') || 'Decline'}
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => saveConsent('all')}
                className="flex-1 md:flex-none"
              >
                {t('common.acceptAll') || 'Accept All'}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
