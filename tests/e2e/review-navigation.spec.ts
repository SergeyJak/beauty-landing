import { expect, test } from '@playwright/test'

test('review menu link opens the review section', async ({ page }, testInfo) => {
  for (const [locale, label] of [['ru', 'Отзывы'], ['en', 'Reviews'], ['lv', 'Atsauksmes']]) {
    await page.goto(`/${locale}`)
    if (testInfo.project.name === 'mobile-chrome') {
      await page.getByTestId('mobile-menu-toggle').click()
      await page.getByTestId('mobile-menu-panel').getByRole('link', { name: label, exact: true }).click()
    } else {
      await page.locator('header nav').first().getByRole('link', { name: label, exact: true }).click()
    }
    await expect(page).toHaveURL(new RegExp(`/${locale}#client-reviews$`))
    await expect(page.locator('#client-reviews')).toBeInViewport()
  }
})
