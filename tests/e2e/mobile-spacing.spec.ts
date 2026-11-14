import { expect, test } from '@playwright/test'

test('mobile sections keep headings and cards compact without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.addInitScript(() => localStorage.setItem('cookie-consent', 'essential'))
  for (const locale of ['ru', 'en', 'lv']) {
    await page.goto(`/${locale}`)
    const benefits = page.locator('#benefits')
    const cards = benefits.locator('article')
    await expect(cards).toHaveCount(4)
    const boxes = await cards.evaluateAll((items) => items.map((item) => item.getBoundingClientRect().height))
    expect(Math.max(...boxes)).toBeLessThan(180)
    const first = await cards.first().boundingBox()
    const description = await benefits.locator('.subheading').boundingBox()
    expect(first!.y - (description!.y + description!.height)).toBeLessThan(55)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})
