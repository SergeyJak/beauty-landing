'use client'

import { FormEvent, useEffect, useState } from 'react'

type Locale = 'lv' | 'ru' | 'en'

type Category = {
  id: string
  slug: string
  order: number
  name: Record<Locale, string>
}

export default function CategoriesAdmin({ locale }: { locale: Locale }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/gallery-categories', {
        cache: 'no-store',
      })
      if (response.status === 401) {
        window.location.assign(`/login?next=/admin&lang=${locale}`)
        return
      }
      if (!response.ok) throw new Error('Failed to load categories')
      const payload = await response.json()
      setCategories(payload.categories || [])
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Failed to load categories.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const create = async (event: FormEvent) => {
    event.preventDefault()
    setMessage('')

    const response = await fetch(
      `/api/admin/gallery-categories?locale=${locale}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      }
    )

    const payload = await response.json()
    if (!response.ok) {
      setMessage(payload.error || 'Create failed.')
      return
    }

    setCategories((current) => [...current, payload.category])
    setName('')
    setMessage('Category created.')
  }

  const updateLocal = (id: string, value: string) => {
    setCategories((current) =>
      current.map((category) =>
        category.id === id
          ? {
              ...category,
              name: {
                ...category.name,
                [locale]: value,
              },
            }
          : category
      )
    )
  }

  const save = async (category: Category) => {
    setSavingId(category.id)
    setMessage('')

    try {
      const response = await fetch(
        `/api/admin/gallery-categories?id=${category.id}&locale=${locale}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: category.name[locale] }),
        }
      )
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Save failed')

      setCategories((current) =>
        current.map((item) =>
          item.id === category.id ? payload.category : item
        )
      )
      setMessage(`Saved ${locale.toUpperCase()} category name.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Save failed.')
    } finally {
      setSavingId(null)
    }
  }

  const remove = async (id: string) => {
    if (!window.confirm('Delete this category? Existing photos will become uncategorized.')) {
      return
    }

    const response = await fetch(`/api/admin/gallery-categories?id=${id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      setCategories((current) =>
        current.filter((category) => category.id !== id)
      )
      setMessage('Category deleted.')
    } else {
      const payload = await response.json().catch(() => null)
      setMessage(payload?.error || 'Delete failed.')
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="eyebrow mb-2 text-accent">Categories</p>
        <h2 className="font-serif text-3xl">Gallery categories</h2>
        <p className="mt-2 text-sm text-primary/55">
          Categories are shared across the site. Their names can be translated
          separately for LV / RU / EN.
        </p>
      </div>

      <form
        onSubmit={create}
        className="flex flex-col gap-3 border border-primary/10 bg-white/60 p-5 sm:flex-row sm:items-end"
      >
        <label className="flex-1">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest">
            New category · {locale.toUpperCase()}
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={100}
            placeholder="Category name"
            className="w-full border border-primary/20 bg-white px-4 py-3 outline-none focus:border-accent"
          />
        </label>
        <button
          type="submit"
          className="h-12 bg-primary px-6 text-xs font-bold uppercase tracking-[0.16em] text-white"
        >
          Create
        </button>
      </form>

      {message && (
        <p className="text-sm text-primary/65" role="status">
          {message}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-primary/50">Loading categories…</p>
      ) : categories.length === 0 ? (
        <div className="border border-dashed border-primary/15 px-6 py-10 text-center text-sm text-primary/45">
          No categories yet.
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((category, index) => (
            <article
              key={category.id}
              className="border border-primary/10 bg-white p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent">
                    Category #{index + 1}
                  </p>
                  <p className="mt-1 text-xs text-primary/35">
                    /{category.slug}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={category.name[locale]}
                  onChange={(event) =>
                    updateLocal(category.id, event.target.value)
                  }
                  maxLength={100}
                  placeholder={`Name · ${locale.toUpperCase()}`}
                  className="flex-1 border border-primary/15 px-3 py-2 text-sm outline-none focus:border-accent"
                />

                <button
                  type="button"
                  onClick={() => save(category)}
                  disabled={savingId === category.id}
                  className="bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"
                >
                  {savingId === category.id
                    ? 'Saving…'
                    : `Save ${locale.toUpperCase()}`}
                </button>

                <button
                  type="button"
                  onClick={() => remove(category.id)}
                  className="border border-red-900/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-800"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
