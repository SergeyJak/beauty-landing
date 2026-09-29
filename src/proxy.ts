import { type NextRequest, NextResponse } from 'next/server'
import { DEFAULT_LOCALE, LOCALE_COOKIE, isValidLocale } from '@/lib/i18n'
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from '@/lib/admin-auth'

function localeFromPath(pathname: string): string | null {
  const segment = pathname.split('/')[1]
  return segment && isValidLocale(segment) ? segment : null
}

function withLocaleCookie(response: NextResponse, locale: string) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
  return response
}

async function hasAdminSession(request: NextRequest) {
  const username = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD

  if (!username || !password) return false

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  return verifyAdminSessionToken(token, username, password)
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (
    pathname === '/login' ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/_next') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.match(/\.(png|jpg|jpeg|gif|ico|svg|webp|json)$/)
  ) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    if (await hasAdminSession(request)) {
      return NextResponse.next()
    }

    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set(
      'next',
      `${pathname}${request.nextUrl.search}`
    )
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
    if (cookieLocale && isValidLocale(cookieLocale)) {
      loginUrl.searchParams.set('lang', cookieLocale)
    }
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith('/api/admin')) {
    if (await hasAdminSession(request)) {
      return NextResponse.next()
    }

    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const pathLocale = localeFromPath(pathname)

  if (pathLocale) {
    return withLocaleCookie(NextResponse.next(), pathLocale)
  }

  if (pathname === '/' || pathname === '') {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
    const locale =
      cookieLocale && isValidLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE
    return withLocaleCookie(
      NextResponse.redirect(new URL(`/${locale}`, request.url)),
      locale
    )
  }

  return NextResponse.redirect(
    new URL(`/${DEFAULT_LOCALE}${pathname}`, request.url)
  )
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
    '/api/admin/:path*',
    '/api/auth/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
