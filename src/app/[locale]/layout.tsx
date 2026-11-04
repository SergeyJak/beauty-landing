import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import {
  getTranslations,
  type Locale,
  LOCALES,
  resolveLocale,
  isValidLocale,
  getBaseUrl,
  getOpenGraphLocale,
  getHreflangAlternates,
} from '@/lib/i18n'
import { BUSINESS } from '@/lib/business'
import { getEditableContent } from '@/lib/content'
import { LanguageProvider } from '@/lib/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Toaster } from 'sonner'
import CookieConsent from '@/components/CookieConsent'
import ErrorBoundary from '@/components/ErrorBoundary'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: requestedLocale } = await params

  if (!isValidLocale(requestedLocale)) {
    return {}
  }

  const locale = resolveLocale(requestedLocale)
  const translations = getTranslations(locale)
  const saved = await getEditableContent(locale)
  const metadata = translations.metadata as {
    title?: string
    description?: string
    keywords?: string[]
  } | undefined
  const brand = translations.brand as { name?: string }

  const title = saved?.seoTitle || metadata?.title || 'Crystal E Studio'
  const description =
    saved?.seoDescription ||
    metadata?.description ||
    'Certified electrolysis specialist for permanent facial and bikini hair removal in Riga'

  const baseUrl = getBaseUrl()
  const canonicalUrl = `${baseUrl}/${locale}`
  const ogImage = `${baseUrl}/${locale}/opengraph-image`

  return {
    title: {
      default: title,
      template: `%s | ${brand?.name || 'Crystal E Studio'}`,
    },
    description,
    keywords: metadata?.keywords || [],
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: getOpenGraphLocale(locale),
      url: canonicalUrl,
      siteName: brand?.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || brand?.name || 'Crystal E Studio',
        },
      ],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) =>
        getOpenGraphLocale(l)
      ),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: getHreflangAlternates(),
    },
    other: {
      'geo.region': 'LV-RIX',
      'geo.placename': 'Riga',
      'geo.position': `${BUSINESS.geo.latitude};${BUSINESS.geo.longitude}`,
      ICBM: `${BUSINESS.geo.latitude}, ${BUSINESS.geo.longitude}`,
    },
  }
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: requestedLocale } = await params

  if (!isValidLocale(requestedLocale)) {
    notFound()
  }

  const locale = requestedLocale as Locale
  const translations = getTranslations(locale)

  return (
    <LanguageProvider initialLocale={locale} initialTranslations={translations}>
      <Header />
      <main id="main-content" className="relative min-h-screen pt-20 lg:pt-28">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      <Footer />
      <CookieConsent
        googleAnalyticsId={process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_GA_ID : undefined}
        facebookPixelId={process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_FB_PIXEL_ID : undefined}
      />
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'premium-toast',
          style: {
            background: 'rgb(var(--color-ivory))',
            color: 'rgb(var(--color-primary))',
            border: '1px solid rgba(var(--color-accent), 0.2)',
            borderRadius: '0px',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          },
        }}
      />
    </LanguageProvider>
  )
}
