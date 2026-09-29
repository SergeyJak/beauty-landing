import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/booking/route'

function request(body: unknown) {
  return new NextRequest('http://localhost/api/booking', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/booking', () => {
  beforeEach(() => {
    delete process.env.TELEGRAM_BOT_TOKEN
    delete process.env.TELEGRAM_CHAT_ID
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    vi.spyOn(console, 'info').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    delete process.env.TELEGRAM_BOT_TOKEN
    delete process.env.TELEGRAM_CHAT_ID
  })

  it('rejects missing required fields', async () => {
    const response = await POST(request({ locale: 'en', name: 'Anna' }))

    expect(response.status).toBe(400)
  })

  it('rejects an invalid email address', async () => {
    const response = await POST(
      request({
        locale: 'en',
        name: 'Anna',
        phone: '+371 20000000',
        service: 'Consultation',
        email: 'not-an-email',
      })
    )

    expect(response.status).toBe(400)
  })

  it('returns 503 instead of fake success when Telegram is not configured', async () => {
    const response = await POST(
      request({
        locale: 'en',
        name: 'Anna',
        phone: '+371 20000000',
        service: 'Consultation',
      })
    )

    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({
      error: 'Failed to process booking request',
    })
  })

  it('escapes user HTML before sending to Telegram', async () => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-token'
    process.env.TELEGRAM_CHAT_ID = 'test-chat'

    const fetchMock = vi.fn().mockResolvedValue(
      new Response('{}', { status: 200 })
    )
    vi.stubGlobal('fetch', fetchMock)

    const response = await POST(
      request({
        locale: 'en',
        name: '<b>Anna</b>',
        phone: '+371 20000000',
        service: '<script>alert(1)</script>',
        email: 'anna@example.com',
        comment: '<i>Hello</i>',
      })
    )

    expect(response.status).toBe(201)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const [, options] = fetchMock.mock.calls[0]
    const payload = JSON.parse(String(options?.body))

    expect(payload.text).toContain('&lt;b&gt;Anna&lt;/b&gt;')
    expect(payload.text).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(payload.text).toContain('&lt;i&gt;Hello&lt;/i&gt;')
    expect(payload.text).not.toContain('<script>')
  })

  it('returns 503 when Telegram rejects delivery', async () => {
    process.env.TELEGRAM_BOT_TOKEN = 'test-token'
    process.env.TELEGRAM_CHAT_ID = 'test-chat'

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('{}', { status: 500 }))
    )

    const response = await POST(
      request({
        locale: 'en',
        name: 'Anna',
        phone: '+371 20000000',
        service: 'Consultation',
      })
    )

    expect(response.status).toBe(503)
  })
})
