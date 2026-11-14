export type AnalyticsConfig = {
  googleAnalyticsId?: string
  facebookPixelId?: string
}

type FacebookPixel = {
  (...args: unknown[]): void
  callMethod?: (...args: unknown[]) => void
  queue: unknown[][]
  push: FacebookPixel
  loaded: boolean
  version: string
}

type AnalyticsWindow = Window & {
  dataLayer?: IArguments[]
  gtag?: (...args: unknown[]) => void
  fbq?: FacebookPixel
  _fbq?: FacebookPixel
}

function appendScript(id: string, src: string) {
  const script = document.createElement('script')
  script.id = id
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

export function initializeAnalytics(
  consent: string | null,
  { googleAnalyticsId, facebookPixelId }: AnalyticsConfig
) {
  if (consent !== 'all') return

  const browser = window as AnalyticsWindow

  if (googleAnalyticsId && !document.getElementById('crystal-google-analytics')) {
    browser.dataLayer = browser.dataLayer || []
    browser.gtag = browser.gtag || function () {
      browser.dataLayer!.push(arguments)
    }
    browser.gtag('js', new Date())
    browser.gtag('config', googleAnalyticsId)
    appendScript(
      'crystal-google-analytics',
      `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAnalyticsId)}`
    )
  }

  if (facebookPixelId && !document.getElementById('crystal-facebook-pixel')) {
    if (!browser.fbq) {
      const pixel = function (...args: unknown[]) {
        if (pixel.callMethod) pixel.callMethod(...args)
        else pixel.queue.push(args)
      } as FacebookPixel
      pixel.queue = []
      pixel.push = pixel
      pixel.loaded = true
      pixel.version = '2.0'
      browser.fbq = pixel
      browser._fbq = pixel
    }
    browser.fbq('init', facebookPixelId)
    browser.fbq('track', 'PageView')
    appendScript('crystal-facebook-pixel', 'https://connect.facebook.net/en_US/fbevents.js')
  }
}
