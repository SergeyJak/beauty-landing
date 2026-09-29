'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'

export type LoginLocale = 'lv' | 'ru' | 'en'

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

export default function LoginForm({
  initialLocale,
}: {
  initialLocale: LoginLocale
}) {
  const locale = initialLocale
  const copy = COPY[locale]
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

      if (response.status === 401) throw new Error(copy.invalid)
      if (!response.ok) throw new Error(copy.failed)

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
    <main className="admin-theme admin-shell relative min-h-screen overflow-hidden px-5 py-10 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(172,145,110,0.18),transparent_34%),radial-gradient(circle_at_85%_80%,rgba(45,42,40,0.08),transparent_32%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <section className="admin-card w-full p-7 sm:p-9">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center border border-accent/40">
              <span className="font-serif text-2xl text-primary">E</span>
            </div>
            <p className="eyebrow admin-accent mb-2">Crystal E Studio</p>
            <h1 className="font-serif text-4xl font-medium">{copy.admin}</h1>
            <p className="admin-muted mt-3 text-sm leading-relaxed">
              {copy.subtitle}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <label className="block">
              <span className="admin-label mb-2">
                {copy.username}
              </span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                className="admin-input h-14 px-4 text-base"
                placeholder={copy.username}
              />
            </label>

            <label className="block">
              <span className="admin-label mb-2">
                {copy.password}
              </span>
              <div className="admin-input flex h-14 items-stretch">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  className="min-w-0 flex-1 border-0 bg-transparent px-4 text-base text-[#2d2a28] outline-none placeholder:text-[#99918a]"
                  placeholder={copy.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="flex h-full min-w-[5.5rem] items-center justify-center border-l border-[#ded8d1] px-3 text-[0.68rem] font-semibold uppercase tracking-wider text-[#716a64] transition hover:bg-[#faf8f5] hover:text-[#9a7a53]"
                  aria-label={showPassword ? copy.hide : copy.show}
                >
                  {showPassword ? copy.hide : copy.show}
                </button>
              </div>
            </label>

            {error && (
              <div role="alert" className="border border-red-900/10 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="admin-button-primary premium-sheen flex h-14 w-full items-center justify-center px-6 text-xs font-bold uppercase tracking-[0.2em] disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? copy.submitting : copy.submit}
            </button>
          </form>

          <div className="mt-7 border-t border-[#ded8d1] pt-5 text-center">
            <Link
              href={`/${locale}`}
              className="text-xs font-semibold uppercase tracking-[0.16em] text-[#716a64] transition hover:text-[#9a7a53]"
            >
              ← {copy.back}
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
