import { expect, test } from '@playwright/test'

test('method details are available on the first screen in each language', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.addInitScript(() => localStorage.setItem('cookie-consent', 'essential'))
  for (const [locale, title, details] of [
    ['ru', 'Что такое электроэпиляция?', 'Подробнее о методе'],
    ['en', 'What is electrolysis?', 'More about electrolysis'],
    ['lv', 'Kas ir elektroepilācija?', 'Vairāk par metodi'],
  ]) {
    await page.goto(`/${locale}`)
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible()
    const toggle = page.locator('summary').filter({ hasText: details })
    await toggle.click()
    const section = page.locator('details').filter({ has: toggle })
    await expect(section).toHaveAttribute('open', '')
    await expect(section.locator('li')).toHaveCount(9)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await toggle.click()
    await expect(section).not.toHaveAttribute('open', '')
  }
})
