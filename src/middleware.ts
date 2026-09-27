import { type NextRequest, NextResponse } from 'next/server'
import { DEFAULT_LOCALE, LOCALE_COOKIE, isValidLocale } from '@/lib/i18n'

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

function protectAdmin(request: NextRequest) {
  const username = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD

  if (!username || !password) {
    return new NextResponse('Admin access is not configured', { status: 503 })
  }

  const authorization = request.headers.get('authorization')
  if (authorization?.startsWith('Basic ')) {
    try {
      const decoded = atob(authorization.slice(6))
      const separator = decoded.indexOf(':')
      const providedUser = decoded.slice(0, separator)
      const providedPassword = decoded.slice(separator + 1)

      if (providedUser === username && providedPassword === password) {
        return NextResponse.next()
      }
    } catch {
      // Fall through to the authentication challenge.
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Crystal E Studio Admin"',
    },
  })
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    return protectAdmin(request)
  }

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.(png|jpg|jpeg|gif|ico|svg|webp|json)$/)
  ) {
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
    '/api/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
