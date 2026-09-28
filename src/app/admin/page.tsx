'use client'

import { FormEvent, useEffect, useState } from 'react'
import GalleryAdmin from '@/components/admin/GalleryAdmin'

type Locale = 'lv' | 'ru' | 'en'
type AdminSection = 'content' | 'gallery'

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

const sections: Array<{
  id: AdminSection
  label: string
  description: string
}> = [
  {
    id: 'content',
    label: 'Content',
    description: 'Hero & SEO',
  },
  {
    id: 'gallery',
    label: 'Gallery',
    description: 'Before / After',
  },
]

export default function AdminPage() {
  const [section, setSection] = useState<AdminSection>('content')
  const [locale, setLocale] = useState<Locale>('lv')
  const [form, setForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (section !== 'content') return

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
        if (
          error instanceof Error &&
          error.message === 'Authentication required'
        ) {
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
  }, [locale, section])

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
    <div className="min-h-screen bg-ivory text-primary">
      <header className="border-b border-primary/10 bg-white/80 px-4 py-5 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="eyebrow mb-1 text-accent">Crystal E Studio</p>
            <h1 className="font-serif text-2xl sm:text-3xl">CMS</h1>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/${locale}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-11 items-center justify-center border border-primary/15 px-4 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-primary/55 transition hover:border-accent hover:text-accent sm:flex"
            >
              View site
            </a>
            <button
              type="button"
              onClick={logout}
              className="flex h-11 shrink-0 items-center justify-center border border-primary/15 px-4 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-primary/60 transition hover:border-accent hover:text-accent"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 grid grid-cols-2 border border-primary/10 bg-white lg:hidden">
          {sections.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`min-h-14 px-4 py-3 text-left transition first:border-r first:border-primary/10 ${
                section === item.id
                  ? 'bg-primary text-white'
                  : 'text-primary hover:bg-primary/[0.03]'
              }`}
            >
              <span className="block text-xs font-bold uppercase tracking-[0.14em]">
                {item.label}
              </span>
              <span
                className={`mt-1 block text-[0.7rem] ${
                  section === item.id ? 'text-white/55' : 'text-primary/40'
                }`}
              >
                {item.description}
              </span>
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-6">
              <nav className="border border-primary/10 bg-white">
                {sections.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSection(item.id)}
                    className={`w-full px-5 py-4 text-left transition ${
                      index > 0 ? 'border-t border-primary/10' : ''
                    } ${
                      section === item.id
                        ? 'bg-primary text-white'
                        : 'hover:bg-primary/[0.03]'
                    }`}
                  >
                    <span className="block text-xs font-bold uppercase tracking-[0.14em]">
                      {item.label}
                    </span>
                    <span
                      className={`mt-1 block text-xs ${
                        section === item.id
                          ? 'text-white/50'
                          : 'text-primary/40'
                      }`}
                    >
                      {item.description}
                    </span>
                  </button>
                ))}
              </nav>

              <div className="border border-primary/10 bg-white/60 p-4">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-primary/40">
                  Current language
                </p>
                <p className="mt-2 font-serif text-xl">
                  {localeLabels[locale]}
                </p>
              </div>
            </div>
          </aside>

          <main className="min-w-0">
            <div className="mb-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary/45">
                Editing language
              </p>
              <div className="grid grid-cols-3 border border-primary/10 bg-white">
                {(Object.keys(localeLabels) as Locale[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setLocale(item)}
                    className={`h-12 border-r border-primary/10 px-3 text-xs font-bold uppercase tracking-[0.12em] transition last:border-r-0 ${
                      locale === item
                        ? 'bg-accent text-white'
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

            {section === 'content' ? (
              <section>
                <div className="mb-6">
                  <p className="eyebrow mb-2 text-accent">Content</p>
                  <h2 className="font-serif text-3xl">Hero & SEO</h2>
                  <p className="mt-2 text-sm text-primary/55">
                    Edit the main message and search metadata for{' '}
                    {localeLabels[locale]}.
                  </p>
                </div>

                {loading ? (
                  <p className="text-sm text-primary/60">
                    Ielādē {localeLabels[locale]} saturu…
                  </p>
                ) : (
                  <form onSubmit={submit} className="space-y-8">
                    <section className="space-y-5 border border-primary/10 bg-white/60 p-5 sm:p-6">
                      <div>
                        <h3 className="font-serif text-2xl">
                          Hero · {locale.toUpperCase()}
                        </h3>
                        <p className="mt-1 text-xs uppercase tracking-widest text-primary/40">
                          Visible at the top of /{locale}
                        </p>
                      </div>

                      <label className="block">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-widest">
                          Title
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
                          Description
                        </span>
                        <textarea
                          value={form.heroDescription}
                          onChange={(e) =>
                            update('heroDescription', e.target.value)
                          }
                          required
                          maxLength={500}
                          rows={5}
                          className="w-full border border-primary/20 bg-white px-4 py-3 outline-none focus:border-accent"
                        />
                      </label>
                    </section>

                    <section className="space-y-5 border border-primary/10 bg-white/60 p-5 sm:p-6">
                      <div>
                        <h3 className="font-serif text-2xl">
                          SEO · {locale.toUpperCase()}
                        </h3>
                        <p className="mt-1 text-xs uppercase tracking-widest text-primary/40">
                          Google title & description
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
                          onChange={(e) =>
                            update('seoDescription', e.target.value)
                          }
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
                        {saving
                          ? 'Saglabā…'
                          : `Saglabāt ${locale.toUpperCase()}`}
                      </button>
                      {message && (
                        <p className="text-sm text-primary/65" role="status">
                          {message}
                        </p>
                      )}
                    </div>
                  </form>
                )}
              </section>
            ) : (
              <GalleryAdmin locale={locale} />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
