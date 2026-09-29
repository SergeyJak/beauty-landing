import { afterEach, describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/auth/login/route'
import { ADMIN_SESSION_COOKIE } from '@/lib/admin-auth'

const originalUsername = process.env.ADMIN_USERNAME
const originalPassword = process.env.ADMIN_PASSWORD

function request(body: unknown) {
  return new NextRequest('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

afterEach(() => {
  if (originalUsername === undefined) delete process.env.ADMIN_USERNAME
  else process.env.ADMIN_USERNAME = originalUsername

  if (originalPassword === undefined) delete process.env.ADMIN_PASSWORD
  else process.env.ADMIN_PASSWORD = originalPassword
})

describe('POST /api/auth/login', () => {
  it('returns 503 when admin credentials are not configured', async () => {
    delete process.env.ADMIN_USERNAME
    delete process.env.ADMIN_PASSWORD

    const response = await POST(request({ username: 'x', password: 'y' }))
    expect(response.status).toBe(503)
  })

  it('rejects invalid credentials without setting a session', async () => {
    process.env.ADMIN_USERNAME = 'admin'
    process.env.ADMIN_PASSWORD = 'correct-password'

    const response = await POST(
      request({ username: 'admin', password: 'wrong-password' })
    )

    expect(response.status).toBe(401)
    expect(response.headers.get('set-cookie')).toBeNull()
  })

  it('sets an httpOnly session cookie for valid credentials', async () => {
    process.env.ADMIN_USERNAME = 'admin'
    process.env.ADMIN_PASSWORD = 'correct-password'

    const response = await POST(
      request({ username: 'admin', password: 'correct-password' })
    )

    expect(response.status).toBe(200)
    const cookie = response.headers.get('set-cookie') || ''
    expect(cookie).toContain(`${ADMIN_SESSION_COOKIE}=`)
    expect(cookie.toLowerCase()).toContain('httponly')
    expect(cookie.toLowerCase()).toContain('samesite=lax')
  })
})
