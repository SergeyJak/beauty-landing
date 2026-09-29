'use client'

import { FormEvent, useEffect, useState } from 'react'
import GalleryAdmin from '@/components/admin/GalleryAdmin'
import CategoriesAdmin from '@/components/admin/CategoriesAdmin'

type Locale = 'lv' | 'ru' | 'en'
type AdminSection = 'content' | 'categories' | 'gallery'

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

const ADMIN_SECTION_STORAGE_KEY = 'crystal-admin-section'
const ADMIN_LOCALE_STORAGE_KEY = 'crystal-admin-locale'

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
  { id: 'content', label: 'Content', description: 'Hero & SEO' },
  { id: 'categories', label: 'Categories', description: 'Gallery groups' },
  { id: 'gallery', label: 'Gallery', description: 'Before / After' },
]

export default function AdminPage() {
  const [section, setSection] = useState<AdminSection>('content')
  const [menuOpen, setMenuOpen] = useState(false)
  const [locale, setLocale] = useState<Locale>('lv')
  const [preferencesReady, setPreferencesReady] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const currentSection =
    sections.find((item) => item.id === section) || sections[0]

  useEffect(() => {
    const savedSection = window.localStorage.getItem(ADMIN_SECTION_STORAGE_KEY)
    const savedLocale = window.localStorage.getItem(ADMIN_LOCALE_STORAGE_KEY)

    if (savedSection && sections.some((item) => item.id === savedSection)) {
      setSection(savedSection as AdminSection)
    }

    if (savedLocale && savedLocale in localeLabels) {
      setLocale(savedLocale as Locale)
    }

    setPreferencesReady(true)
  }, [])

  useEffect(() => {
    if (!preferencesReady) return
    window.localStorage.setItem(ADMIN_SECTION_STORAGE_KEY, section)
  }, [preferencesReady, section])

  useEffect(() => {
    if (!preferencesReady) return
    window.localStorage.setItem(ADMIN_LOCALE_STORAGE_KEY, locale)
  }, [locale, preferencesReady])

  useEffect(() => {
    if (!preferencesReady || section !== 'content') return

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
  }, [locale, preferencesReady, section])

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

  const chooseSection = (next: AdminSection) => {
    setSection(next)
    setMenuOpen(false)
  }

  return (
    <div className="admin-theme admin-shell min-h-screen">
      <header className="sticky top-0 z-40 border-b border-[#ded8d1] bg-white/95 px-4 py-4 backdrop-blur-xl sm:px-6">
        <div className="relative mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow mb-1 text-accent">Crystal E Studio</p>
            <div className="flex items-baseline gap-3">
              <h1 className="font-serif text-2xl sm:text-3xl">CMS</h1>
              <span
                data-testid="admin-current-section"
                className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-primary/35"
              >
                {currentSection.label}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Open CMS menu"
            aria-expanded={menuOpen}
            className="flex h-11 w-11 shrink-0 items-center justify-center border border-primary/15 bg-white text-2xl leading-none text-primary transition hover:border-accent hover:text-accent"
          >
            ⋮
          </button>

          {menuOpen && (
            <>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-40 cursor-default bg-transparent"
              />
              <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(19rem,calc(100vw-2rem))] overflow-hidden border border-primary/10 bg-white shadow-[0_24px_70px_rgba(23,19,15,0.16)]">
                <div className="border-b border-primary/10 px-4 py-3">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary/35">
                    CMS navigation
                  </p>
                </div>

                <nav>
                  {sections.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => chooseSection(item.id)}
                      data-testid={`admin-section-${item.id}`}
                      className={`flex w-full items-center justify-between gap-4 border-b border-primary/10 px-4 py-4 text-left transition last:border-b-0 ${
                        section === item.id
                          ? 'bg-primary text-white'
                          : 'hover:bg-primary/[0.03]'
                      }`}
                    >
                      <span>
                        <span className="block text-xs font-bold uppercase tracking-[0.14em]">
                          {item.label}
                        </span>
                        <span
                          className={`mt-1 block text-xs ${
                            section === item.id
                              ? 'text-white/55'
                              : 'text-primary/40'
                          }`}
                        >
                          {item.description}
                        </span>
                      </span>
                      {section === item.id && (
                        <span className="text-sm text-white/65">✓</span>
                      )}
                    </button>
                  ))}
                </nav>

                <div className="border-t border-primary/10 bg-soft-beige/35 p-3">
                  <a
                    href={`/${locale}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="flex h-11 w-full items-center px-3 text-xs font-bold uppercase tracking-[0.14em] text-primary/60 transition hover:bg-white hover:text-accent"
                  >
                    View site
                  </a>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex h-11 w-full items-center px-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-red-800/75 transition hover:bg-white hover:text-red-800"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
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
                data-testid={`admin-locale-${item}`}
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
                <section className="admin-card space-y-5 p-5 sm:p-6">
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
                      className="admin-input px-4 py-3"
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
                      className="admin-input px-4 py-3"
                    />
                  </label>
                </section>

                <section className="admin-card space-y-5 p-5 sm:p-6">
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
                      className="admin-input px-4 py-3"
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
                      className="admin-input px-4 py-3"
                    />
                  </label>
                </section>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={saving}
                    className="admin-button-primary px-8 py-3 text-xs font-bold uppercase tracking-[0.18em] disabled:opacity-50"
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
        ) : section === 'categories' ? (
          <CategoriesAdmin locale={locale} />
        ) : (
          <GalleryAdmin locale={locale} />
        )}
      </main>
    </div>
  )
}
