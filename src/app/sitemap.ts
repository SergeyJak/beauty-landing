import type { MetadataRoute } from 'next'
import { BUSINESS } from '@/lib/business'
import { LOCALES } from '@/lib/i18n'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BUSINESS.siteUrl
  const lastModified = new Date()

  return LOCALES.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: locale === 'lv' ? 1 : 0.9,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${baseUrl}/${l}`])
      ),
    },
  }))
}
