'use client'

import { FormEvent, useEffect, useState } from 'react'

type Locale = 'lv' | 'ru' | 'en'

type FormState = {
  heroTitle: string
  heroDescription: string
  seoTitle: string
  seoDescription: string
}

const emptyForm: FormState = {
  heroTitle: '',
  heroDescription: '',
  seoTitle: '',
  seoDescription: '',
}

const localeLabels: Record<Locale, string> = {
  lv: 'Latviešu',
  ru: 'Русский',
  en: 'English',
}

export default function AdminPage() {
  const [locale, setLocale] = useState<Locale>('lv')
  const [form, setForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setMessage('')

    fetch(`/api/admin/content?locale=${locale}`, { cache: 'no-store' })
      .then(async (response) => {
        if (response.status === 401) {
          window.location.assign(`/login?next=/admin&lang=${locale}`)
          throw new Error('Authentication required')
        }
        if (!response.ok) throw new Error('Failed to load content')
        return response.json()
      })
      .then(({ content }) => {
        if (cancelled) return
        setForm({
          heroTitle: content?.heroTitle || '',
          heroDescription: content?.heroDescription || '',
          seoTitle: content?.seoTitle || '',
          seoDescription: content?.seoDescription || '',
        })
      })
      .catch((error) => {
        if (cancelled) return
        if (error instanceof Error && error.message === 'Authentication required') {
          return
        }
        setForm(emptyForm)
        setMessage('Neizdevās ielādēt saturu.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [locale])

  const update = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch(`/api/admin/content?locale=${locale}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (response.status === 401) {
        window.location.assign(`/login?next=/admin&lang=${locale}`)
        return
      }

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to save content')
      }

      setMessage(`Saglabāts: ${localeLabels[locale]}.`)
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Neizdevās saglabāt saturu.'
      )
    } finally {
      setSaving(false)
    }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.assign(`/login?lang=${locale}`)
  }

  return (
    <div className="min-h-screen bg-ivory px-4 py-8 text-primary sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-start justify-between gap-6 border-b border-primary/10 pb-6">
          <div>
            <p className="eyebrow mb-2 text-accent">Crystal E Studio</p>
            <h1 className="font-serif text-4xl">Satura administrēšana</h1>
            <p className="mt-3 text-sm text-primary/60">
              Hero un SEO saturs visām trim mājaslapas valodām.
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex h-11 shrink-0 items-center justify-center border border-primary/15 px-4 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-primary/60 transition hover:border-accent hover:text-accent"
          >
            Logout
          </button>
        </div>

        <div className="mb-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary/45">
            Rediģējamā valoda
          </p>
          <div className="grid grid-cols-3 border border-primary/10 bg-white/50">
            {(Object.keys(localeLabels) as Locale[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLocale(item)}
                className={`h-12 border-r border-primary/10 px-3 text-xs font-bold uppercase tracking-[0.12em] transition last:border-r-0 ${
                  locale === item
                    ? 'bg-primary text-white'
                    : 'text-primary/55 hover:bg-primary/[0.04] hover:text-primary'
                }`}
              >
                {item.toUpperCase()}
                <span className="ml-2 hidden normal-case tracking-normal sm:inline">
                  {localeLabels[item]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-primary/60">
            Ielādē {localeLabels[locale]} saturu…
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-8">
            <section className="space-y-5 border border-primary/10 bg-white/60 p-6">
              <div>
                <h2 className="font-serif text-2xl">Hero · {locale.toUpperCase()}</h2>
                <p className="mt-1 text-xs uppercase tracking-widest text-primary/40">
                  Redzams /{locale} lapas augšdaļā
                </p>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest">
                  Virsraksts
                </span>
                <input
                  value={form.heroTitle}
                  onChange={(e) => update('heroTitle', e.target.value)}
                  required
                  maxLength={180}
                  className="w-full border border-primary/20 bg-white px-4 py-3 outline-none focus:border-accent"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest">
                  Apraksts
                </span>
                <textarea
                  value={form.heroDescription}
                  onChange={(e) => update('heroDescription', e.target.value)}
                  required
                  maxLength={500}
                  rows={5}
                  className="w-full border border-primary/20 bg-white px-4 py-3 outline-none focus:border-accent"
                />
              </label>
            </section>

            <section className="space-y-5 border border-primary/10 bg-white/60 p-6">
              <div>
                <h2 className="font-serif text-2xl">SEO · {locale.toUpperCase()}</h2>
                <p className="mt-1 text-xs uppercase tracking-widest text-primary/40">
                  Google title un description
                </p>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest">
                  SEO title
                </span>
                <input
                  value={form.seoTitle}
                  onChange={(e) => update('seoTitle', e.target.value)}
                  required
                  maxLength={120}
                  className="w-full border border-primary/20 bg-white px-4 py-3 outline-none focus:border-accent"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest">
                  Meta description
                </span>
                <textarea
                  value={form.seoDescription}
                  onChange={(e) => update('seoDescription', e.target.value)}
                  required
                  maxLength={320}
                  rows={4}
                  className="w-full border border-primary/20 bg-white px-4 py-3 outline-none focus:border-accent"
                />
              </label>
            </section>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={saving}
                className="border border-accent bg-accent px-8 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white disabled:opacity-50"
              >
                {saving ? 'Saglabā…' : `Saglabāt ${locale.toUpperCase()}`}
              </button>
              {message && (
                <p className="text-sm text-primary/65" role="status">
                  {message}
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
