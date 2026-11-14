import { expect, test } from '@playwright/test'

test('review links stay aligned to the right at mobile widths', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cookie-consent', 'essential'))
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 800 })
    for (const [locale, more] of [['ru', 'Больше отзывов'], ['en', 'More reviews'], ['lv', 'Vairāk atsauksmju']]) {
      await page.goto(`/${locale}`)
      const section = page.locator('#client-reviews')
      await section.getByRole('button', { name: more, exact: true }).click()
      const misaligned = await section.locator('figcaption').evaluateAll((captions) => captions.flatMap((caption) => {
        const button = caption.querySelector('button')
        if (!button) return []
        const difference = caption.getBoundingClientRect().right - button.getBoundingClientRect().right
        return Math.abs(difference) > 1 ? [`${button.getAttribute('aria-label')}: ${difference}px`] : []
      }))
      expect(misaligned, `${locale} at ${width}px`).toEqual([])
    }
  }
})
