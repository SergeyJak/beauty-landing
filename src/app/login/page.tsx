'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type LoginLocale = 'lv' | 'ru' | 'en'

const COPY: Record<LoginLocale, {
  admin: string
  subtitle: string
  username: string
  password: string
  show: string
  hide: string
  submit: string
  submitting: string
  back: string
  invalid: string
  failed: string
}> = {
  lv: {
    admin: 'Admin',
    subtitle: 'Pieslēdzies, lai pārvaldītu mājaslapas saturu.',
    username: 'Lietotājvārds',
    password: 'Parole',
    show: 'Rādīt',
    hide: 'Slēpt',
    submit: 'Ieiet',
    submitting: 'Pieslēdzas…',
    back: 'Atpakaļ uz mājaslapu',
    invalid: 'Nepareizs lietotājvārds vai parole.',
    failed: 'Neizdevās pieslēgties. Mēģini vēlreiz.',
  },
  ru: {
    admin: 'Админ',
    subtitle: 'Войдите, чтобы управлять содержимым сайта.',
    username: 'Имя пользователя',
    password: 'Пароль',
    show: 'Показать',
    hide: 'Скрыть',
    submit: 'Войти',
    submitting: 'Входим…',
    back: 'Назад на сайт',
    invalid: 'Неверное имя пользователя или пароль.',
    failed: 'Не удалось войти. Попробуйте ещё раз.',
  },
  en: {
    admin: 'Admin',
    subtitle: 'Sign in to manage the website content.',
    username: 'Username',
    password: 'Password',
    show: 'Show',
    hide: 'Hide',
    submit: 'Login',
    submitting: 'Signing in…',
    back: 'Back to website',
    invalid: 'Incorrect username or password.',
    failed: 'Could not sign in. Please try again.',
  },
}

export default function LoginPage() {
  const [locale, setLocale] = useState<LoginLocale>('lv')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const lang = new URLSearchParams(window.location.search).get('lang')
    if (lang === 'ru' || lang === 'en' || lang === 'lv') {
      setLocale(lang)
    }
  }, [])

  const copy = COPY[locale]
  const backHref = useMemo(() => `/${locale}`, [locale])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (response.status === 401) {
        throw new Error(copy.invalid)
      }

      if (!response.ok) {
        throw new Error(copy.failed)
      }

      const params = new URLSearchParams(window.location.search)
      const requested = params.get('next')
      const next =
        requested && requested.startsWith('/') && !requested.startsWith('//')
          ? requested
          : '/admin'

      window.location.assign(next)
    } catch (error) {
      setError(error instanceof Error ? error.message : copy.failed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f3ee] px-5 py-10 text-primary sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(172,145,110,0.18),transparent_34%),radial-gradient(circle_at_85%_80%,rgba(45,42,40,0.08),transparent_32%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <section className="w-full border border-primary/10 bg-white/85 p-7 shadow-[0_30px_90px_rgba(45,42,40,0.12)] backdrop-blur-xl sm:p-9">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center border border-accent/40">
              <span className="font-serif text-2xl text-primary">E</span>
            </div>
            <p className="eyebrow mb-2 text-accent">Crystal E Studio</p>
            <h1 className="font-serif text-4xl font-medium">{copy.admin}</h1>
            <p className="mt-3 text-sm leading-relaxed text-primary/55">
              {copy.subtitle}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary/55">
                {copy.username}
              </span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                className="h-14 w-full border border-primary/15 bg-white px-4 text-base outline-none transition focus:border-accent"
                placeholder={copy.username}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary/55">
                {copy.password}
              </span>
              <div className="flex h-14 w-full items-stretch border border-primary/15 bg-white transition focus-within:border-accent">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  className="min-w-0 flex-1 border-0 bg-transparent px-4 text-base outline-none"
                  placeholder={copy.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="flex h-full min-w-[5.5rem] items-center justify-center border-l border-primary/10 px-3 text-[0.68rem] font-semibold uppercase tracking-wider text-primary/45 transition hover:bg-primary/[0.03] hover:text-accent"
                  aria-label={showPassword ? copy.hide : copy.show}
                >
                  {showPassword ? copy.hide : copy.show}
                </button>
              </div>
            </label>

            {error && (
              <div
                role="alert"
                className="border border-red-900/10 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="premium-sheen flex h-14 w-full items-center justify-center bg-primary px-6 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#6f5948] disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? copy.submitting : copy.submit}
            </button>
          </form>

          <div className="mt-7 border-t border-primary/10 pt-5 text-center">
            <Link
              href={backHref}
              className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/45 transition hover:text-accent"
            >
              ← {copy.back}
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
