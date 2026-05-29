import { type NextRequest, NextResponse } from 'next/server'
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES, isValidLocale } from '@/lib/i18n'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for static files, API routes, and other non-page routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/messages') ||
    pathname.match(/\.(png|jpg|jpeg|gif|ico|svg|webp)$/)
  ) {
    return NextResponse.next()
  }

  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  if (pathname === '/' || pathname === '') {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value
    const locale = cookieLocale && isValidLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}${pathname}`, request.url))
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

