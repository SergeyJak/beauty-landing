import { expect, test } from '@playwright/test'

test('localized treatment information and navigation are available without unrelated services', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cookie-consent', 'essential'))
  for (const [locale, title, first, more] of [
    ['ru', 'Подготовка и уход', 'Как подготовиться', 'Больше отзывов'],
    ['en', 'Preparation and aftercare', 'Preparing for your appointment', 'More reviews'],
    ['lv', 'Sagatavošanās un kopšana', 'Kā sagatavoties', 'Vairāk atsauksmju'],
  ]) {
    await page.goto(`/${locale}`)
    const advice = page.locator('#treatment-advice')
    await expect(advice.getByRole('heading', { name: title })).toBeVisible()
    const section = advice.locator('details').first()
    await section.locator('summary').click()
    await expect(section).toHaveAttribute('open', '')
    await expect(section.locator('li').first()).toBeVisible()
    await expect(section.locator('summary')).toHaveText(first + '+')
    await page.locator('#client-reviews').getByRole('button', { name: more, exact: true }).click()
    await expect(page.locator('main')).not.toContainText(/laser|лазер|lāzer|anagen|анаген|anagēn/i)
    await expect(page.locator('a[href$="#comparison"]')).toHaveCount(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})
