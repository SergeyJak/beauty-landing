import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
} from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  const configuredUsername = process.env.ADMIN_USERNAME
  const configuredPassword = process.env.ADMIN_PASSWORD

  if (!configuredUsername || !configuredPassword) {
    return NextResponse.json(
      { error: 'Admin access is not configured.' },
      { status: 503 }
    )
  }

  const body = await request.json().catch(() => null)
  const username = typeof body?.username === 'string' ? body.username : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  if (
    username !== configuredUsername ||
    password !== configuredPassword
  ) {
    return NextResponse.json(
      { error: 'Nepareizs lietotājvārds vai parole.' },
      { status: 401 }
    )
  }

  const token = await createAdminSessionToken(
    configuredUsername,
    configuredPassword
  )

  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE,
  })

  return response
}
