import { expect, test } from '@playwright/test'

test('process steps stay compact and readable on narrow screens', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.addInitScript(() => localStorage.setItem('cookie-consent', 'essential'))
  for (const locale of ['ru', 'en', 'lv']) {
    await page.goto(`/${locale}`)
    const section = page.locator('#how-it-works')
    const steps = section.locator('ol > li')
    await expect(steps).toHaveCount(4)
    for (const step of await steps.all()) {
      await expect(step.locator('h3')).toBeVisible()
      await expect(step.locator('p')).toBeVisible()
    }
    const size = await section.locator('ol').boundingBox()
    expect(size!.height).toBeLessThan(600)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})
