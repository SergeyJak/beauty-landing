import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { initializeAnalytics } from '@/lib/analytics'

const scripts: Array<{ id: string; src: string; async: boolean }> = []
const config = { googleAnalyticsId: 'G-TEST', facebookPixelId: '12345' }
let browser: {
  dataLayer?: IArguments[]
  fbq?: { (...args: unknown[]): void; queue: unknown[][]; callMethod?: (...args: unknown[]) => void }
}
beforeEach(() => {
  scripts.length = 0
  browser = {}
  vi.stubGlobal('window', browser)
  vi.stubGlobal('document', {
    getElementById: (id: string) => scripts.find((script) => script.id === id) || null,
    createElement: () => ({}),
    head: { appendChild: (script: typeof scripts[number]) => scripts.push(script) },
  })
})
afterEach(() => vi.unstubAllGlobals())

describe('consent-controlled analytics', () => {
  it.each([null, 'essential', 'invalid'])('loads no trackers for consent %s', (consent) => {
    initializeAnalytics(consent, config)
    expect(scripts).toEqual([])
    expect(browser.dataLayer).toBeUndefined()
    expect(browser.fbq).toBeUndefined()
  })
  it('starts both trackers when consent is accepted without reloading', () => {
    initializeAnalytics('essential', config)
    initializeAnalytics('all', config)
    expect(scripts.map((script) => script.src)).toEqual([
      'https://www.googletagmanager.com/gtag/js?id=G-TEST',
      'https://connect.facebook.net/en_US/fbevents.js',
    ])
    expect(Array.from(browser.dataLayer![1])).toEqual(['config', 'G-TEST'])
    expect(browser.fbq?.queue).toEqual([['init', '12345'], ['track', 'PageView']])
  })
  it('does not initialize missing IDs or duplicate trackers on repeated mounts', () => {
    initializeAnalytics('all', {})
    expect(scripts).toEqual([])
    initializeAnalytics('all', config)
    initializeAnalytics('all', config)
    expect(scripts).toHaveLength(2)
    expect(browser.dataLayer).toHaveLength(2)
    expect(browser.fbq?.queue).toHaveLength(2)
  })
  it('forwards pixel events once the external library is ready', () => {
    initializeAnalytics('all', { facebookPixelId: '12345' })
    const received: unknown[][] = []
    browser.fbq!.callMethod = (...args: unknown[]) => received.push(args)
    browser.fbq!('track', 'Contact')
    expect(received).toEqual([['track', 'Contact']])
    expect(browser.fbq?.queue).toEqual([['init', '12345'], ['track', 'PageView']])
  })
})
