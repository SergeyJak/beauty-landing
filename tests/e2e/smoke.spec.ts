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

  test('mobile menu opens the standalone gallery', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chrome', 'mobile-only smoke')
    await page.goto('/ru')

    const menuButton = page.getByTestId('mobile-menu-toggle')
    await expect(menuButton).toBeVisible()
    await menuButton.click()
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    const panel = page.getByTestId('mobile-menu-panel')
    await expect(panel).toBeVisible()

    const galleryLink = page.getByTestId('mobile-gallery-link')
    await expect(galleryLink).toBeVisible()
    await galleryLink.click()

    await expect(page).toHaveURL(/\/ru\/gallery/)
    await expect(
      page.getByRole('heading', { name: 'Галерея', level: 1 })
    ).toBeVisible()
  })

  test('saved dark theme is applied before interaction and toggle is in sync', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'dark')
    })

    await page.goto('/ru')
    await expect(page.locator('html')).toHaveClass(/dark/)

    const menuButton = page.getByTestId('mobile-menu-toggle')
    if (await menuButton.isVisible()) {
      await menuButton.click()
      const themeButton = page.getByRole('button', { name: /свет|light|gaiš/i })
      await expect(themeButton).toBeVisible()
    }
  })

  test('Russian login is localized', async ({ page }) => {
    await page.goto('/login?lang=ru&next=/admin')

    await expect(page.getByText('Имя пользователя').first()).toBeVisible()
    await expect(page.getByText('Пароль').first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Войти' })).toBeVisible()
  })

  test('admin login stays readable even when public dark theme is active', async ({ page }) => {
    await page.goto('/login?lang=ru&next=/admin')
    await page.evaluate(() => document.documentElement.classList.add('dark'))

    const heading = page.getByRole('heading', { name: 'Админ' })
    await expect(heading).toBeVisible()

    const color = await heading.evaluate(
      (element) => getComputedStyle(element).color
    )
    expect(color).toBe('rgb(45, 42, 40)')
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
      const expectedHeading =
        locale === 'ru' ? 'Галерея' : locale === 'en' ? 'Gallery' : 'Galerija'
      await expect(
        page.getByRole('heading', { name: expectedHeading, level: 1 })
      ).toBeVisible()
    }
  })
})
