import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Maison Elise Skin Studio | Facials, Bodywork & Event Beauty',
  description: 'A private New York beauty studio specializing in tailored facials, restorative bodywork, gloss treatments, and polished event preparation.',
  keywords: ['facials', 'skin studio', 'bodywork', 'beauty treatments', 'event beauty', 'nyc beauty', 'luxury facials', 'skin treatments'],
  authors: [{ name: 'Maison Elise Skin Studio' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Maison Elise Skin Studio | Facials, Bodywork & Event Beauty',
    description: 'Tailored beauty appointments in a quiet private studio on the Flatiron.',
    type: 'website',
    locale: 'en_US',
    url: 'https://maisonelise.studio',
    images: [{
      url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&h=630&fit=crop',
      width: 1200,
      height: 630,
      alt: 'Maison Elise Skin Studio',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maison Elise Skin Studio',
    description: 'Tailored facials, bodywork, gloss treatments, and event beauty.',
    creator: '@maisoneliseskin',
  },
  alternates: {
    canonical: 'https://maisonelise.studio',
  },
}

import './globals.css'
import type { ReactNode } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Maison Elise Skin Studio',
              description: 'A private New York beauty studio specializing in tailored facials, restorative bodywork, gloss treatments, and polished event preparation.',
              url: 'https://maisonelise.studio',
              telephone: '+1 (212) 731-8426',
              email: 'hello@maisonelise.studio',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '118 W 18th St, Suite 602',
                addressLocality: 'New York',
                addressRegion: 'NY',
                postalCode: '10011',
                addressCountry: 'US',
              },
              image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop',
              geo: {
                '@type': 'GeoCoordinates',
                latitude: '40.7408',
                longitude: '-74.0019',
              },
              priceRange: '$$',
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  opens: '10:00',
                  closes: '19:00',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: 'Saturday',
                  opens: '09:00',
                  closes: '17:00',
                },
              ],
              sameAs: ['https://instagram.com/maisoneliseskin'],
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = stored === 'dark' || (!stored && prefersDark) ? 'dark' : 'light';
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                  document.documentElement.style.colorScheme = theme;
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="overflow-x-hidden">
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
