'use client'

import { useLanguage } from '@/lib/LanguageContext'
import type { Locale } from '@/lib/i18n'
import { getLocalizedPath } from '@/lib/i18n'

export function useLocaleNavigation() {
  const { locale, setLocale } = useLanguage()

  const navigateToLocale = (newLocale: Locale) => {
    if (newLocale === locale) {
      return
    }
    setLocale(newLocale)
    window.location.href = getLocalizedPath(window.location.pathname, newLocale)
  }

  return { locale, navigateToLocale }
}
