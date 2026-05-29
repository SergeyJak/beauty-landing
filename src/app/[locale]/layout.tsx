import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getTranslations, type Locale, DEFAULT_LOCALE, LOCALES } from '@/lib/i18n'
import { LanguageProvider } from '@/lib/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: requestedLocale } = await params
  const locale = (LOCALES.includes(requestedLocale as Locale) ? requestedLocale : DEFAULT_LOCALE) as Locale
  const translations = await getTranslations(locale)

  const localeMap: Record<Locale, string> = {
    lv: 'lv_LV',
    ru: 'ru_RU',
    en: 'en_US',
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://electrolysisnyc.com'
  const canonicalUrl = `${baseUrl}/${locale}`

  const localeAlternates = LOCALES.reduce((acc, l) => {
    acc[l] = `${baseUrl}/${l}`
    return acc
  }, {} as Record<string, string>)
  localeAlternates['x-default'] = `${baseUrl}/${DEFAULT_LOCALE}`

  return {
    title: translations?.metadata?.title || 'Electrolysis NYC',
    description: translations?.metadata?.description || 'Medical-grade permanent hair removal',
    keywords: translations?.metadata?.keywords || [],
    robots: 'index, follow',
    openGraph: {
      title: translations?.metadata?.title,
      description: translations?.metadata?.description,
      type: 'website',
      locale: localeMap[locale],
      url: canonicalUrl,
      images: [{
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: translations?.metadata?.title || 'Electrolysis NYC',
      }],
      alternateLocale: LOCALES.filter(l => l !== locale).map(l => localeMap[l]),
    },
    twitter: {
      card: 'summary_large_image',
      title: translations?.metadata?.title,
      description: translations?.metadata?.description,
      creator: '@electrolysisnyc',
    },
    alternates: {
      canonical: canonicalUrl,
      languages: localeAlternates,
    },
  }
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({
    locale,
  }))
}

function getInitialTranslations(locale: string) {
  const validLocale = (LOCALES.includes(locale as Locale) ? locale : DEFAULT_LOCALE) as Locale
  return getTranslations(validLocale)
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: requestedLocale } = await params
  const locale = (LOCALES.includes(requestedLocale as Locale) ? requestedLocale : DEFAULT_LOCALE) as Locale
  const translations = getInitialTranslations(locale)

  return (
    <LanguageProvider initialLocale={locale} initialTranslations={translations}>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </LanguageProvider>
  )
}
