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

    const header = page.locator('header').first()
    const headerBackground = await header.evaluate(
      (element) => getComputedStyle(element).backgroundColor
    )
    expect(headerBackground).not.toBe('rgba(0, 0, 0, 0)')

    await expect(page.getByText('Crystal E Studio').first()).toBeVisible()

    const menuButton = page.getByTestId('mobile-menu-toggle')
    if (await menuButton.isVisible()) {
      await menuButton.click()
      const themeButton = page.getByRole('button', { name: /свет|light|gaiš/i })
      await expect(themeButton).toBeVisible()
    }
  })

  test('dark mode cards use dark surfaces instead of white panels', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'dark')
    })

    await page.goto('/lv')

    const selectors = [
      page.getByTestId('hero-stat-card').first(),
      page.getByTestId('expertise-standards-card'),
      page.getByTestId('electrolysis-standard-card'),
    ]

    for (const card of selectors) {
      await card.scrollIntoViewIfNeeded()
      await expect(card).toBeVisible()
      const background = await card.evaluate(
        (element) => getComputedStyle(element).backgroundColor
      )
      expect(background).not.toBe('rgb(255, 255, 255)')
      expect(background).not.toBe('rgba(255, 255, 255, 0.8)')
    }
  })

  test('dark mobile menu CTA keeps readable contrast', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chrome', 'mobile-only smoke')

    await page.addInitScript(() => {
      localStorage.setItem('theme', 'dark')
    })

    await page.goto('/ru')
    const menuButton = page.getByTestId('mobile-menu-toggle')
    await menuButton.click()

    const cta = page.getByRole('link', { name: 'Связь' })
    await expect(cta).toBeVisible()

    const styles = await cta.evaluate((element) => {
      const computed = getComputedStyle(element)
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
      }
    })

    expect(styles.color).not.toBe(styles.backgroundColor)
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


  test('admin API rejects unauthenticated requests with 401 JSON', async ({ request }) => {
    const response = await request.get('/api/admin/gallery')

    expect(response.status()).toBe(401)
    await expect(response.json()).resolves.toEqual({
      error: 'Authentication required',
    })
  })
})

test.describe('admin preference smoke', () => {
  test('CMS keeps selected section and locale after reload', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chrome', 'desktop-only admin smoke')

    const login = await page.context().request.post('/api/auth/login', {
      data: {
        username: 'e2e-admin',
        password: 'e2e-password',
      },
    })
    expect(login.ok()).toBeTruthy()

    await page.goto('/admin')
    await expect(page.getByTestId('admin-current-section')).toHaveText('Content')

    await page.getByRole('button', { name: 'Open CMS menu' }).click()
    await page.getByTestId('admin-section-gallery').click()
    await page.getByTestId('admin-locale-ru').click()

    await expect(page.getByTestId('admin-current-section')).toHaveText('Gallery')
    await page.reload()

    await expect(page.getByTestId('admin-current-section')).toHaveText('Gallery')
    await expect(page.getByTestId('admin-locale-ru')).toHaveClass(/bg-accent/)
  })
})

test.describe('seo and conversion smoke', () => {
  test('robots and sitemap expose only public localized routes', async ({ request }) => {
    const robots = await request.get('/robots.txt')
    expect(robots.ok()).toBeTruthy()
    const robotsText = await robots.text()
    expect(robotsText).toContain('Disallow: /admin')
    expect(robotsText).toContain('Disallow: /api')
    expect(robotsText).toContain('Disallow: /login')
    expect(robotsText).toContain('/sitemap.xml')

    const sitemap = await request.get('/sitemap.xml')
    expect(sitemap.ok()).toBeTruthy()
    const sitemapText = await sitemap.text()

    for (const path of [
      '/lv',
      '/ru',
      '/en',
      '/lv/gallery',
      '/ru/gallery',
      '/en/gallery',
    ]) {
      expect(sitemapText).toContain(path)
    }

    expect(sitemapText).not.toContain('/admin')
    expect(sitemapText).not.toContain('/login')
  })

  test('localized pages expose canonical and hreflang metadata', async ({ page }) => {
    for (const locale of ['lv', 'ru', 'en']) {
      await page.goto('/' + locale)

      const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute('href')
      expect(canonicalHref).toBeTruthy()
      expect(canonicalHref?.endsWith('/' + locale)).toBeTruthy()

      for (const hreflang of ['lv', 'ru', 'en', 'x-default']) {
        await expect(
          page.locator('link[rel="alternate"][hreflang="' + hreflang + '"]')
        ).toHaveCount(1)
      }

      await page.goto('/' + locale + '/gallery')
      const galleryCanonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute('href')
      expect(galleryCanonical).toBeTruthy()
      expect(galleryCanonical?.endsWith('/' + locale + '/gallery')).toBeTruthy()
    }
  })

  test('contact CTAs point to real external destinations', async ({ page }) => {
    await page.goto('/en')

    const whatsappHref = await page.locator('a[href*="wa.me"]').first().getAttribute('href')
    const instagramHref = await page
      .locator('a[href*="instagram.com"]')
      .first()
      .getAttribute('href')

    expect(whatsappHref?.startsWith('https://')).toBeTruthy()
    expect(instagramHref?.startsWith('https://')).toBeTruthy()
  })

  test('missing analytics IDs do not emit placeholder tracking scripts', async ({ page }) => {
    await page.goto('/en')

    await expect(page.locator('script[src*="GA_ID"]')).toHaveCount(0)
    const html = await page.content()
    expect(html).not.toContain('PIXEL_ID')
    expect(html).not.toContain("gtag('config', 'GA_ID')")
  })

  test('gallery keeps a dark surface in dark mode', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'dark')
    })

    await page.goto('/en/gallery')
    await expect(page.locator('html')).toHaveClass(/dark/)

    const allFilter = page.getByRole('button', { name: 'All' })
    await expect(allFilter).toBeVisible()

    const background = await allFilter.evaluate(
      (element) => getComputedStyle(element).backgroundColor
    )
    expect(background).not.toBe('rgb(255, 255, 255)')
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
