import { describe, expect, it } from 'vitest'
import {
  DEFAULT_LOCALE,
  getLocaleFromPath,
  getLocalizedPath,
  isValidLocale,
  removeLocaleFromPath,
  resolveLocale,
} from '@/lib/i18n'

describe('i18n routing', () => {
  it('accepts only supported locales', () => {
    expect(isValidLocale('lv')).toBe(true)
    expect(isValidLocale('ru')).toBe(true)
    expect(isValidLocale('en')).toBe(true)
    expect(isValidLocale('de')).toBe(false)
  })

  it('falls back to Latvian for unsupported locale', () => {
    expect(resolveLocale('de')).toBe(DEFAULT_LOCALE)
    expect(resolveLocale(null)).toBe(DEFAULT_LOCALE)
  })

  it('detects locale from a localized path', () => {
    expect(getLocaleFromPath('/ru/gallery')).toBe('ru')
    expect(getLocaleFromPath('/en')).toBe('en')
    expect(getLocaleFromPath('/unknown')).toBe(DEFAULT_LOCALE)
  })

  it('switches locale without losing the route', () => {
    expect(getLocalizedPath('/ru/gallery', 'en')).toBe('/en/gallery')
    expect(getLocalizedPath('/lv', 'ru')).toBe('/ru')
  })

  it('removes only the leading locale segment', () => {
    expect(removeLocaleFromPath('/ru/gallery')).toBe('/gallery')
    expect(removeLocaleFromPath('/en')).toBe('/')
  })
})
