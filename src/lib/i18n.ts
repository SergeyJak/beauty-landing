export type Locale = 'lv' | 'ru' | 'en'

export const LOCALES: Locale[] = ['lv', 'ru', 'en']
export const DEFAULT_LOCALE: Locale = 'lv'
export const LOCALE_COOKIE = 'preferred-language'

import lv from '../../messages/lv.json'
import ru from '../../messages/ru.json'
import en from '../../messages/en.json'

export function isValidLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale)
}

export function resolveLocale(requested?: string | null): Locale {
  if (requested && isValidLocale(requested)) {
    return requested
  }
  return DEFAULT_LOCALE
}

export function getLocaleFromPath(path: string): Locale {
  const segments = path.split('/')
  const firstSegment = segments[1]

  if (isValidLocale(firstSegment)) {
    return firstSegment
  }

  return DEFAULT_LOCALE
}

export function removeLocaleFromPath(path: string): string {
  const locale = getLocaleFromPath(path)
  return path.replace(`/${locale}`, '') || '/'
}

export function getLocalizedPath(path: string, locale: Locale): string {
  const cleanPath = removeLocaleFromPath(path)
  if (cleanPath === '/') {
    return `/${locale}`
  }
  return `/${locale}${cleanPath}`
}

interface Translations {
  [key: string]: unknown
}

const translationsByLocale: Record<Locale, Translations> = {
  lv,
  ru,
  en,
}

export function getTranslations(locale: Locale): Translations {
  return translationsByLocale[locale] || translationsByLocale[DEFAULT_LOCALE]
}

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://elektrolizeriga.lv'
}

const OPEN_GRAPH_LOCALE: Record<Locale, string> = {
  lv: 'lv_LV',
  ru: 'ru_RU',
  en: 'en_US',
}

export function getOpenGraphLocale(locale: Locale): string {
  return OPEN_GRAPH_LOCALE[locale]
}

/** hreflang map for Next.js metadata alternates.languages */
export function getHreflangAlternates(pathWithoutLocale = ''): Record<string, string> {
  const baseUrl = getBaseUrl()
  const suffix = pathWithoutLocale && pathWithoutLocale !== '/' ? pathWithoutLocale : ''

  const languages = LOCALES.reduce<Record<string, string>>((acc, locale) => {
    acc[locale] = `${baseUrl}/${locale}${suffix}`
    return acc
  }, {})

  languages['x-default'] = `${baseUrl}/${DEFAULT_LOCALE}${suffix}`
  return languages
}

export function getNestedValue(
  obj: Translations,
  path: string,
  defaultValue: string = path
): string {
  const keys = path.split('.')
  let current: unknown = obj

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return defaultValue
    }
  }

  return typeof current === 'string' ? current : defaultValue
}

export function t(
  translations: Translations,
  key: string,
  defaultValue?: string
): string {
  return getNestedValue(translations, key, defaultValue || key)
}

export function getArray<T = unknown>(translations: Translations, key: string): T[] {
  const keys = key.split('.')
  let current: unknown = translations

  for (const part of keys) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part]
    } else {
      return []
    }
  }

  return Array.isArray(current) ? (current as T[]) : []
}

interface InterpolationValues {
  [key: string]: string | number
}

export function interpolate(
  text: string,
  values: InterpolationValues
): string {
  return Object.entries(values).reduce(
    (result, [key, value]) =>
      result.replace(new RegExp(`{${key}}`, 'g'), String(value)),
    text
  )
}
