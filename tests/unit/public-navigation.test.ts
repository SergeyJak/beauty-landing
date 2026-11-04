import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { LanguageProvider } from '@/lib/LanguageContext'
import { getTranslations, type Locale } from '@/lib/i18n'

function renderNavigation(locale: Locale) {
  return renderToStaticMarkup(React.createElement(LanguageProvider, {
    initialLocale: locale, initialTranslations: getTranslations(locale),
    children: React.createElement(React.Fragment, null,
      React.createElement(Header), React.createElement(Footer)),
  }))
}

describe('public navigation', () => {
  it.each(['lv', 'ru', 'en'] as const)('uses existing localized destinations in %s', (locale) => {
    const html = renderNavigation(locale)
    expect(html).toContain(`href="/${locale}#comparison"`)
    expect(html).toContain(`href="/${locale}/gallery"`)
    expect(html).toContain(`href="/${locale}#benefits"`)
    expect(html).toContain(`href="/${locale}#faq"`)
    expect(html).toContain(`href="/${locale}#contact"`)
    expect(html).not.toContain('#why-electrolysis')
    expect(html).not.toContain('href="#gallery"')
    expect(html).not.toContain('href="#reviews"')
    expect(html).not.toContain('reviews.eyebrow')
  })
})
