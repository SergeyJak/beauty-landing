import { type NextRequest, NextResponse } from 'next/server'
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES, isValidLocale } from '@/lib/i18n'

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

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
