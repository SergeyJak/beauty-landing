'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
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

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || 'Nepareizs lietotājvārds vai parole.')
      }

      const params = new URLSearchParams(window.location.search)
      const requested = params.get('next')
      const next =
        requested && requested.startsWith('/') && !requested.startsWith('//')
          ? requested
          : '/admin'

      window.location.assign(next)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Neizdevās pieslēgties. Mēģini vēlreiz.'
      )
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
            <h1 className="font-serif text-4xl font-medium">Admin</h1>
            <p className="mt-3 text-sm leading-relaxed text-primary/55">
              Pieslēdzies, lai pārvaldītu mājaslapas saturu.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary/55">
                Lietotājvārds
              </span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                className="h-13 w-full border border-primary/15 bg-white px-4 text-base outline-none transition focus:border-accent"
                placeholder="Lietotājvārds"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary/55">
                Parole
              </span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  className="h-13 w-full border border-primary/15 bg-white px-4 pr-16 text-base outline-none transition focus:border-accent"
                  placeholder="Parole"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex min-w-14 items-center justify-center px-3 text-xs font-semibold uppercase tracking-wider text-primary/45 hover:text-accent"
                  aria-label={showPassword ? 'Paslēpt paroli' : 'Rādīt paroli'}
                >
                  {showPassword ? 'Hide' : 'Show'}
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
              className="premium-sheen flex h-13 w-full items-center justify-center bg-primary px-6 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#6f5948] disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? 'Pieslēdzas…' : 'Ieiet'}
            </button>
          </form>

          <div className="mt-7 border-t border-primary/10 pt-5 text-center">
            <Link
              href="/lv"
              className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/45 transition hover:text-accent"
            >
              ← Atpakaļ uz mājaslapu
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
