import { describe, expect, it } from 'vitest'
import { DEFAULT_SITE_URL } from '@/lib/business'
import { getHreflangAlternates } from '@/lib/i18n'
import sitemap from '@/app/sitemap'
import robots from '@/app/robots'

describe('SEO configuration', () => {
  it('uses the Crystal E Studio public domain as the canonical fallback', () => {
    expect(DEFAULT_SITE_URL).toBe('https://crystal-e-studio.heysmart.lv')
  })

  it('builds hreflang alternates for gallery in every locale plus x-default', () => {
    const alternates = getHreflangAlternates('/gallery')

    expect(Object.keys(alternates).sort()).toEqual(['en', 'lv', 'ru', 'x-default'])
    expect(alternates.lv).toMatch(/\/lv\/gallery$/)
    expect(alternates.ru).toMatch(/\/ru\/gallery$/)
    expect(alternates.en).toMatch(/\/en\/gallery$/)
    expect(alternates['x-default']).toMatch(/\/lv\/gallery$/)
  })

  it('publishes homepage and gallery for all three locales in sitemap', () => {
    const entries = sitemap()
    const paths = entries.map((entry) => new URL(entry.url).pathname).sort()

    expect(entries).toHaveLength(6)
    expect(paths).toEqual([
      '/en',
      '/en/gallery',
      '/lv',
      '/lv/gallery',
      '/ru',
      '/ru/gallery',
    ])

    for (const entry of entries) {
      expect(entry.alternates?.languages?.['x-default']).toBeTruthy()
    }
  })

  it('keeps admin, API and login routes out of search', () => {
    const config = robots()
    const rules = Array.isArray(config.rules) ? config.rules[0] : config.rules

    expect(rules?.disallow).toEqual(
      expect.arrayContaining(['/admin', '/api', '/login'])
    )
    expect(config.sitemap).toMatch(/\/sitemap\.xml$/)
  })
})
