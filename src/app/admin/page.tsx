'use client'

import { FormEvent, useEffect, useState } from 'react'

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

export default function AdminPage() {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/admin/content?locale=lv', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Failed to load content')
        return response.json()
      })
      .then(({ content }) => {
        if (content) {
          setForm({
            heroTitle: content.heroTitle || '',
            heroDescription: content.heroDescription || '',
            seoTitle: content.seoTitle || '',
            seoDescription: content.seoDescription || '',
          })
        }
      })
      .catch(() => {
        setMessage(
          'Datubāzes saturs vēl nav pieejams. Aizpildi laukus, lai izveidotu pirmo versiju.'
        )
      })
      .finally(() => setLoading(false))
  }, [])

  const update = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/content?locale=lv', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to save content')
      }

      setMessage('Saglabāts. LV lapa un SEO tagi izmantos jauno saturu.')
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Neizdevās saglabāt saturu.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivory px-4 py-12 text-primary sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 border-b border-primary/10 pb-6">
          <p className="eyebrow mb-2 text-accent">Crystal E Studio</p>
          <h1 className="font-serif text-4xl">Satura administrēšana</h1>
          <p className="mt-3 text-sm text-primary/60">
            Pirmais CMS posms: LV sākuma ekrāns un SEO.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-primary/60">Ielādē…</p>
        ) : (
          <form onSubmit={submit} className="space-y-8">
            <section className="space-y-5 border border-primary/10 bg-white/60 p-6">
              <div>
                <h2 className="font-serif text-2xl">Hero</h2>
                <p className="mt-1 text-xs uppercase tracking-widest text-primary/40">
                  Redzams /lv lapas augšdaļā
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
                <h2 className="font-serif text-2xl">SEO</h2>
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
                {saving ? 'Saglabā…' : 'Saglabāt'}
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
