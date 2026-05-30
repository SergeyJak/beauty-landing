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
import { LanguageProvider } from '@/lib/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import { Toaster } from 'sonner'
import CookieConsent from '@/components/CookieConsent'
import ErrorBoundary from '@/components/ErrorBoundary'

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
  const metadata = translations.metadata as {
    title?: string
    description?: string
    keywords?: string[]
  } | undefined
  const brand = translations.brand as { name?: string }

  const baseUrl = getBaseUrl()
  const canonicalUrl = `${baseUrl}/${locale}`
  const ogImage = `${baseUrl}/${locale}/opengraph-image`

  return {
    title: {
      default: metadata?.title || 'Electrolysis Riga',
      template: `%s | ${brand?.name || 'Electrolysis Riga'}`,
    },
    description:
      metadata?.description || 'Certified electrolysis specialist for permanent facial and bikini hair removal in Riga',
    keywords: metadata?.keywords || [],
    robots: { index: true, follow: true },
    openGraph: {
      title: metadata?.title,
      description: metadata?.description,
      type: 'website',
      locale: getOpenGraphLocale(locale),
      url: canonicalUrl,
      siteName: brand?.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: metadata?.title || brand?.name || 'Electrolysis Riga',
        },
      ],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) =>
        getOpenGraphLocale(l)
      ),
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata?.title,
      description: metadata?.description,
      images: [ogImage],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: getHreflangAlternates(),
    },
    other: {
      'geo.region': 'LV-RIX',
      'geo.placename': 'Riga',
      'geo.position': '56.9496;24.1134',
      ICBM: '56.9496, 24.1134',
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
      <StructuredData locale={locale} />
      
      {/* Analytics Placeholders */}
      {process.env.NODE_ENV === 'production' && (
        <>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(args)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID || 'PIXEL_ID'}');
                fbq('track', 'PageView');
              `,
            }}
          />
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'GA_ID'}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || 'GA_ID'}');
              `,
            }}
          />
        </>
      )}

      <Header />
      <main id="main-content" className="relative min-h-screen">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      <Footer />
      <CookieConsent />
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
