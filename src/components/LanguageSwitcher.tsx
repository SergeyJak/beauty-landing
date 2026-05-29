'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from '@/lib/LanguageContext'
import type { Locale } from '@/lib/i18n'
import { LOCALES } from '@/lib/i18n'
import { useLocaleNavigation } from '@/hooks/useLocaleNavigation'

type LanguageSwitcherProps = {
  variant?: 'dropdown' | 'inline'
}

export default function LanguageSwitcher({ variant = 'dropdown' }: LanguageSwitcherProps) {
  const { t } = useLanguage()
  const { locale, navigateToLocale } = useLocaleNavigation()
  const [isOpen, setIsOpen] = useState(false)

  const localeLabel = (lang: Locale, field: 'native' | 'name') =>
    t(`languageSwitcher.locales.${lang}.${field}`)

  const handleSelectLanguage = (newLocale: Locale) => {
    setIsOpen(false)
    navigateToLocale(newLocale)
  }

  if (variant === 'inline') {
    return (
      <div
        className="grid grid-cols-3 gap-2"
        role="listbox"
        aria-label={t('languageSwitcher.selectLanguage')}
      >
        {LOCALES.map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => handleSelectLanguage(lang)}
            className={`min-h-12 border px-2 py-3 text-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              locale === lang
                ? 'border-accent bg-primary/10 text-primary'
                : 'border-primary/10 text-primary/70 hover:border-accent hover:text-primary'
            }`}
            role="option"
            aria-selected={locale === lang}
          >
            {localeLabel(lang, 'native')}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={t('languageSwitcher.selectLanguage')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-sm" aria-hidden="true">
          ⌘
        </span>
        <span className="hidden sm:inline">{localeLabel(locale, 'native')}</span>
        <span className="sm:hidden">{locale.toUpperCase()}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-30"
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 z-40 mt-2 w-48 origin-top-right overflow-hidden border border-primary/10 bg-ivory shadow-lg"
              role="listbox"
              aria-label={t('languageSwitcher.selectLanguage')}
            >
              {LOCALES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleSelectLanguage(lang)}
                  className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors ${
                    locale === lang
                      ? 'bg-primary/10 text-primary'
                      : 'text-primary/70 hover:bg-soft-beige hover:text-primary'
                  } focus-visible:outline-none focus-visible:bg-primary/10`}
                  role="option"
                  aria-selected={locale === lang}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{localeLabel(lang, 'native')}</div>
                      <div className="text-xs text-primary/50">{localeLabel(lang, 'name')}</div>
                    </div>
                    {locale === lang && (
                      <span className="text-accent" aria-hidden="true">
                        ✓
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
