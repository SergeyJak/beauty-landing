import { expect, test } from '@playwright/test'

test.describe('analytics consent', () => {
  test.skip(!process.env.NEXT_PUBLIC_GA_ID || !process.env.NEXT_PUBLIC_FB_PIXEL_ID,
    'Build with test analytics IDs to exercise consent-gated trackers')

  test.beforeEach(async ({ page }) => {
    // Never contact tracking services during the test run.
    await page.route(/https:\/\/(www\.googletagmanager\.com|connect\.facebook\.net)\//,
      (route) => route.fulfill({ contentType: 'application/javascript', body: '' }))
  })

  test('declining prevents trackers before and after reload', async ({ page }) => {
    const requests: string[] = []
    page.on('request', (request) => {
      if (/googletagmanager\.com|connect\.facebook\.net/.test(request.url())) requests.push(request.url())
    })
    await page.goto('/en')
    const decline = page.getByRole('button', { name: 'Decline', exact: true })
    await expect(decline).toBeVisible()
    await expect(page.locator('#crystal-google-analytics, #crystal-facebook-pixel')).toHaveCount(0)
    await decline.click()
    expect(await page.evaluate(() => localStorage.getItem('cookie-consent'))).toBe('essential')
    await page.reload()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.locator('#crystal-google-analytics, #crystal-facebook-pixel')).toHaveCount(0)
    await expect(decline).toBeHidden()
    expect(requests).toEqual([])
  })

  test('accepting starts trackers immediately and respects saved consent', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto('/en')
    await page.getByRole('button', { name: 'Accept All', exact: true }).click()
    await expect(page.locator('#crystal-google-analytics, #crystal-facebook-pixel')).toHaveCount(2)
    const pixelQueue = () => page.evaluate(() =>
      (window as unknown as { fbq: { queue: unknown[][] } }).fbq.queue)
    expect(await pixelQueue()).toEqual([
      ['init', process.env.NEXT_PUBLIC_FB_PIXEL_ID], ['track', 'PageView'],
    ])
    await page.reload()
    await expect(page.locator('#crystal-google-analytics, #crystal-facebook-pixel')).toHaveCount(2)
    expect(await pixelQueue()).toHaveLength(2)
    expect(errors).toEqual([])
  })
})

test('homepage anchors exist and footer gallery opens the standalone page', async ({ page }) => {
  for (const locale of ['lv', 'ru', 'en']) {
    await page.goto(`/${locale}`)
    const broken = await page.evaluate(() => Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href*="#"]'))
      .filter((link) => link.origin === location.origin && link.pathname === location.pathname && link.hash.length > 1)
      .filter((link) => !document.getElementById(decodeURIComponent(link.hash.slice(1))))
      .map((link) => link.getAttribute('href')))
    expect(broken).toEqual([])
    await expect(page.locator('footer')).not.toContainText('reviews.eyebrow')
    await page.locator(`footer a[href="/${locale}/gallery"]`).click()
    await expect(page).toHaveURL(new RegExp(`/${locale}/gallery$`))
    await page.locator(`footer a[href="/${locale}#benefits"]`).click()
    await expect(page).toHaveURL(new RegExp(`/${locale}#benefits$`))
    await expect(page.locator('#benefits')).toBeVisible()
  }
})
