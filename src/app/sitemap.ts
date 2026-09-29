import type { MetadataRoute } from 'next'
import { LOCALES, getBaseUrl } from '@/lib/i18n'

const ROUTES = [
  { path: '', priority: 1 },
  { path: '/gallery', priority: 0.8 },
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()

  return ROUTES.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: `${baseUrl}/${locale}${route.path}`,
      changeFrequency: 'weekly' as const,
      priority: route.priority,
      alternates: {
        languages: {
          ...Object.fromEntries(
            LOCALES.map((language) => [
              language,
              `${baseUrl}/${language}${route.path}`,
            ])
          ),
          'x-default': `${baseUrl}/lv${route.path}`,
        },
      },
    }))
  )
}
