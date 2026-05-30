import { ImageResponse } from 'next/og'
import { getTranslations, resolveLocale, isValidLocale } from '@/lib/i18n'

export const runtime = 'edge'
export const alt = 'Electrolysis Riga'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function OpenGraphImage({ params }: Props) {
  const { locale: requested } = await params
  const locale = isValidLocale(requested) ? requested : 'lv'
  const translations = getTranslations(resolveLocale(locale))
  const metadata = translations.metadata as { title?: string; description?: string }
  const brand = translations.brand as { name?: string }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(135deg, #f8f5f2 0%, #ebe4dc 45%, #2d2a28 100%)',
          color: '#2d2a28',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              border: '2px solid #ac916e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontFamily: 'serif',
            }}
          >
            E
          </div>
          <p style={{ fontSize: 28, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            {brand?.name || 'Electrolysis Riga'}
          </p>
        </div>
        <div style={{ maxWidth: 900 }}>
          <p
            style={{
              fontSize: 64,
              lineHeight: 1.05,
              fontFamily: 'serif',
              marginBottom: 24,
            }}
          >
            {metadata?.title?.split('|')[0]?.trim() || 'Permanent hair removal'}
          </p>
          <p style={{ fontSize: 28, lineHeight: 1.45, opacity: 0.82 }}>
            {metadata?.description?.slice(0, 140) || 'Certified electrolysis specialist for permanent hair removal in Riga'}
          </p>
        </div>
        <p style={{ fontSize: 22, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#ac916e' }}>
          Rīga • Bezmaksas konsultācija
        </p>
      </div>
    ),
    { ...size }
  )
}
