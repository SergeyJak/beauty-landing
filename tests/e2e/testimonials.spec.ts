import { expect, test } from '@playwright/test'

test('reviews stay compact, readable and localized', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cookie-consent', 'essential'))
  for (const [locale, title, more] of [
    ['ru', 'Отзывы клиентов', 'Больше отзывов'],
    ['en', 'Words from our clients', 'More reviews'],
    ['lv', 'Klientu atsauksmes', 'Vairāk atsauksmju'],
  ]) {
    await page.goto(`/${locale}`)
    const section = page.locator('#client-reviews')
    await expect(section.getByRole('heading', { name: title })).toBeVisible()
    await expect(section.locator('figure')).toHaveCount(6)
    await expect(section.locator('figure:visible')).toHaveCount(page.viewportSize()!.width < 768 ? 3 : 6)
    expect(await section.locator('img').count()).toBe(0)
    expect(await section.evaluate((element) => element.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
    await section.getByRole('button', { name: more, exact: true }).click()
    await expect(section.locator('figure')).toHaveCount(23)
    await expect(section.getByRole('button', { expanded: true })).toHaveAttribute('aria-controls', 'additional-client-reviews')
    await section.getByRole('button', { expanded: true }).click()
    await expect(section.locator('figure')).toHaveCount(6)
    await expect(section.locator('figure:visible')).toHaveCount(page.viewportSize()!.width < 768 ? 3 : 6)
    await section.locator(`a[href="/${locale}#contact"]`).click()
    await expect(page).toHaveURL(new RegExp(`/${locale}#contact$`))
  }
})


test('original viewer supports keyboard dismissal and restores focus', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cookie-consent', 'essential'))
  await page.goto('/ru')
  const trigger = page.locator('#client-reviews button[aria-haspopup="dialog"]').first()
  test.skip(await trigger.count() === 0, 'Original screenshot binaries have not been supplied yet')
  await trigger.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  const close = dialog.getByRole('button', { name: 'Закрыть оригинал отзыва' })
  await expect(close).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(close).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(close).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
  await trigger.click()
  await close.click()
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})
