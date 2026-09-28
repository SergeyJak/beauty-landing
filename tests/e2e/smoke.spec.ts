import { expect, test } from '@playwright/test'

test.describe('public mobile smoke', () => {
  test('Russian homepage has no horizontal page overflow', async ({ page }) => {
    await page.goto('/ru')
    await expect(page.getByText('Crystal E Studio').first()).toBeVisible()

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))

    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1)
  })

  test('mobile menu opens the standalone gallery', async ({ page }) => {
    await page.goto('/ru')

    const menuButton = page.locator('header button[aria-expanded]').first()
    await expect(menuButton).toBeVisible()
    await menuButton.click()

    const galleryLink = page.locator('a[href="/ru/gallery"]').first()
    await expect(galleryLink).toBeVisible()
    await galleryLink.click()

    await expect(page).toHaveURL(/\/ru\/gallery/)
    await expect(
      page.getByRole('heading', { name: 'Галерея', level: 1 })
    ).toBeVisible()
  })

  test('Russian login is localized', async ({ page }) => {
    await page.goto('/login?lang=ru&next=/admin')

    await expect(page.getByText('Имя пользователя').first()).toBeVisible()
    await expect(page.getByText('Пароль').first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Войти' })).toBeVisible()
  })

  test('admin route redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/admin')

    await expect(page).toHaveURL(/\/login\?/)
    expect(page.url()).toContain('next=%2Fadmin')
  })
})

test.describe('desktop smoke', () => {
  test('all locale homepages render and gallery route is reachable', async ({ page }) => {
    for (const locale of ['lv', 'ru', 'en']) {
      await page.goto(`/${locale}`)
      await expect(page.getByText('Crystal E Studio').first()).toBeVisible()

      await page.goto(`/${locale}/gallery`)
      await expect(page.locator('main')).toBeVisible()
    }
  })
})
