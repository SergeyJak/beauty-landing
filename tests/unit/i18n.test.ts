import { describe, expect, it } from 'vitest'
import lv from '../../messages/lv.json'
import ru from '../../messages/ru.json'
import en from '../../messages/en.json'
import {
  DEFAULT_LOCALE,
  getLocaleFromPath,
  getLocalizedPath,
  isValidLocale,
  removeLocaleFromPath,
  resolveLocale,
} from '@/lib/i18n'

function translationShape(value: unknown): unknown {
  if (Array.isArray(value)) {
    return {
      type: 'array',
      length: value.length,
      items: value.map(translationShape),
    }
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, translationShape(child)])
    )
  }

  return typeof value
}

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

describe('translation dictionaries', () => {
  it('keeps Latvian structurally aligned with English', () => {
    expect(translationShape(lv)).toEqual(translationShape(en))
  })

  it('keeps Russian structurally aligned with English', () => {
    expect(translationShape(ru)).toEqual(translationShape(en))
  })


  it('does not ship demo testimonials as verified client content', () => {
    for (const dictionary of [lv, ru, en]) {
      expect(dictionary).not.toHaveProperty('reviews')
      expect(dictionary.common).not.toHaveProperty('verifiedClient')
    }
  })
})
