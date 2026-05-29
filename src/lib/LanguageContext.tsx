'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Locale } from '@/lib/i18n'
import { DEFAULT_LOCALE, LOCALE_COOKIE, getArray, isValidLocale, t } from '@/lib/i18n'

interface LanguageContextType {
  locale: Locale
  translations: Record<string, any>
  setLocale: (locale: Locale) => void
  t: (key: string, defaultValue?: string) => string
  list: <T = unknown>(key: string) => T[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
)

export function LanguageProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
  initialTranslations = {},
}: {
  children: React.ReactNode
  initialLocale?: Locale
  initialTranslations?: Record<string, any>
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const translations = initialTranslations

  // Persist locale to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_COOKIE, locale)
      document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`
    } catch (error) {
      console.error('Failed to save language preference:', error)
    }
  }, [locale])

  const translate = useMemo(
    () => (key: string, defaultValue?: string) => t(translations, key, defaultValue),
    [translations]
  )

  const list = useMemo(
    () => <T,>(key: string) => getArray<T>(translations, key),
    [translations]
  )

  const setLocale = (newLocale: Locale) => {
    if (isValidLocale(newLocale) && newLocale !== locale) {
      setLocaleState(newLocale)
    }
  }

  return (
    <LanguageContext.Provider
      value={{
        locale,
        translations,
        setLocale,
        t: translate,
        list,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export function useTranslations() {
  const { translations } = useLanguage()
  return translations
}

export function useT() {
  const { t } = useLanguage()
  return t
}

export function useTranslationList<T = unknown>(key: string) {
  const { list } = useLanguage()
  return list<T>(key)
}

export function useLocale() {
  const { locale } = useLanguage()
  return locale
}

export function useSetLocale() {
  const { setLocale } = useLanguage()
  return setLocale
}
