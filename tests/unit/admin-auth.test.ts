import { describe, expect, it } from 'vitest'
import {
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
  verifyAdminSessionToken,
} from '@/lib/admin-auth'

describe('admin session tokens', () => {
  it('accepts a valid signed token for the expected user', async () => {
    const token = await createAdminSessionToken('admin', 'strong-secret')

    await expect(
      verifyAdminSessionToken(token, 'admin', 'strong-secret')
    ).resolves.toBe(true)
  })

  it('rejects a token signed with another secret', async () => {
    const token = await createAdminSessionToken('admin', 'secret-a')

    await expect(
      verifyAdminSessionToken(token, 'admin', 'secret-b')
    ).resolves.toBe(false)
  })

  it('rejects a token for another username', async () => {
    const token = await createAdminSessionToken('admin', 'strong-secret')

    await expect(
      verifyAdminSessionToken(token, 'another-admin', 'strong-secret')
    ).resolves.toBe(false)
  })

  it('rejects malformed tokens', async () => {
    await expect(
      verifyAdminSessionToken('not-a-valid-token', 'admin', 'secret')
    ).resolves.toBe(false)
  })

  it('uses a seven-day session lifetime', () => {
    expect(ADMIN_SESSION_MAX_AGE).toBe(60 * 60 * 24 * 7)
  })
})
