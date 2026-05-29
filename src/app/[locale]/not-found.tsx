import Link from 'next/link'
import { DEFAULT_LOCALE } from '@/lib/i18n'

export default function LocaleNotFound() {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="font-serif text-4xl text-primary">404</h1>
      <p className="mt-4 max-w-md text-primary/65">
        Page not found.
      </p>
      <Link
        href={`/${DEFAULT_LOCALE}`}
        className="mt-8 bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-clay"
      >
        Home
      </Link>
    </section>
  )
}
