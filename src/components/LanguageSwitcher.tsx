'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Globe, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import type { Locale } from '@/lib/i18n'
import { LOCALES } from '@/lib/i18n'
import { useLocaleNavigation } from '@/hooks/useLocaleNavigation'
import { cn } from '@/lib/utils'

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
        className="flex flex-col gap-2 w-full"
        role="listbox"
        aria-label={t('languageSwitcher.selectLanguage')}
      >
        {LOCALES.map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => handleSelectLanguage(lang)}
            className={cn(
              "flex items-center justify-between px-6 py-4 border transition-all",
              locale === lang 
                ? "border-accent bg-accent/5 text-primary" 
                : "border-primary/10 text-primary/60 hover:border-primary/20"
            )}
            role="option"
            aria-selected={locale === lang}
          >
            <div className="flex flex-col items-start">
              <span className="text-[0.6rem] font-bold uppercase tracking-widest opacity-50">{localeLabel(lang, 'name')}</span>
              <span className="font-serif text-xl">{localeLabel(lang, 'native')}</span>
            </div>
            {locale === lang && <div className="h-2 w-2 rounded-full bg-accent" />}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-3 px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-primary/70 transition-all hover:text-accent focus-visible:outline-none"
        aria-label={t('languageSwitcher.selectLanguage')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-2 border-r border-primary/10 pr-3">
          <Globe className="h-3.5 w-3.5" />
          <span>{locale.toUpperCase()}</span>
        </div>
        <span className="hidden sm:inline opacity-50 group-hover:opacity-100 transition-opacity">{localeLabel(locale, 'native')}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform duration-300", isOpen && "rotate-180")} />
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
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 z-40 mt-3 w-56 origin-top-right overflow-hidden bg-white shadow-[0_30px_90px_rgba(23,19,15,0.15)] border border-primary/5"
              role="listbox"
              aria-label={t('languageSwitcher.selectLanguage')}
            >
              <div className="py-2">
                {LOCALES.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleSelectLanguage(lang)}
                    className={cn(
                      "w-full px-5 py-4 text-left transition-all relative group/item",
                      locale === lang ? "bg-accent/5" : "hover:bg-soft-beige"
                    )}
                    role="option"
                    aria-selected={locale === lang}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={cn(
                          "text-[0.65rem] font-bold uppercase tracking-widest transition-colors",
                          locale === lang ? "text-accent" : "text-primary/40 group-hover/item:text-primary/70"
                        )}>
                          {localeLabel(lang, 'name')}
                        </div>
                        <div className={cn(
                          "font-serif text-lg transition-colors",
                          locale === lang ? "text-primary" : "text-primary/60 group-hover/item:text-primary"
                        )}>
                          {localeLabel(lang, 'native')}
                        </div>
                      </div>
                      {locale === lang && (
                        <div className="h-2 w-2 rounded-full bg-accent" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
