import { BUSINESS } from '@/lib/business'
import type { FAQItem } from '@/types'
import type { Locale } from '@/lib/i18n'

type BusinessCopy = {
  name: string
  description: string
  openingHours: string[]
}

export function buildLocalBusinessSchema(
  locale: Locale,
  copy: BusinessCopy
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    '@id': `${BUSINESS.siteUrl}/${locale}#business`,
    name: copy.name,
    description: copy.description,
    url: `${BUSINESS.siteUrl}/${locale}`,
    telephone: BUSINESS.phoneE164,
    email: BUSINESS.email,
    priceRange: BUSINESS.priceRange,
    image: `${BUSINESS.siteUrl}/${locale}/opengraph-image`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.addressLocality,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    openingHoursSpecification: copy.openingHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      description: hours,
    })),
    areaServed: {
      '@type': 'City',
      name: 'Rīga',
    },
    sameAs: [BUSINESS.instagram, BUSINESS.tiktok, BUSINESS.facebook],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Electrolysis treatments',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Free consultation',
            description: 'Private electrolysis consultation in Riga',
          },
        },
      ],
    },
  }
}

export function buildFaqPageSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function buildWebSiteSchema(locale: Locale, siteName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BUSINESS.siteUrl}/#website`,
    url: BUSINESS.siteUrl,
    name: siteName,
    inLanguage: locale,
    potentialAction: {
      '@type': 'ReserveAction',
      target: `${BUSINESS.siteUrl}/${locale}#booking`,
      name: 'Book consultation',
    },
  }
}
