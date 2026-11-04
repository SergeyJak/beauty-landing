import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const fetchMock = vi.fn()
const body = { name: 'Client', phone: '+37128821341', service: 'Consultation', locale: 'en' }
async function submit(overrides = {}) {
  const { POST } = await import('@/app/api/booking/route')
  return POST(new NextRequest('http://localhost/api/booking', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...body, ...overrides }),
  }))
}
beforeEach(() => {
  vi.resetModules()
  vi.stubEnv('TELEGRAM_BOT_TOKEN', 'test-token')
  vi.stubEnv('TELEGRAM_CHAT_ID', 'test-chat')
  vi.stubGlobal('fetch', fetchMock)
  fetchMock.mockReset()
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'log').mockImplementation(() => {})
})
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs() })

describe('booking delivery', () => {
  it('does not confirm a booking without Telegram credentials', async () => {
    vi.stubEnv('TELEGRAM_BOT_TOKEN', '')
    const response = await submit()
    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({ error: expect.any(String) })
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it.each(['http', 'network', 'api'] as const)('does not confirm a booking after a %s failure', async (failure) => {
    if (failure === 'network') fetchMock.mockRejectedValue(new Error('offline'))
    else fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: false }), { status: failure === 'http' ? 429 : 200 }))
    const response = await submit()
    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({ error: expect.any(String) })
  })
  it('confirms only after Telegram accepts the message', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))
    const response = await submit()
    expect(response.status).toBe(201)
    expect(await response.json()).toMatchObject({ success: true, bookingId: expect.stringMatching(/^BOOK_/) })
  })
  it('escapes user text so ordinary HTML characters cannot break Telegram delivery', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))
    await submit({ name: 'A & B', comment: '<hello>' })
    const payload = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(payload.text).toContain('A &amp; B')
    expect(payload.text).toContain('&lt;hello&gt;')
  })
  it('does not send incomplete requests or honeypot submissions', async () => {
    expect((await submit({ phone: '' })).status).toBe(400)
    expect((await submit({ honeypot: 'spam' })).status).toBe(200)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
