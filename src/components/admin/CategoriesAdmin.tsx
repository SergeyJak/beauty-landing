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
  const [reordering, setReordering] = useState(false)
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


  const persistOrder = async (next: Category[]) => {
    setCategories(next)
    setReordering(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/gallery-categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: next.map((category) => category.id) }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Failed to save order')
      setCategories(payload.categories || next)
      setMessage('Category order saved.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to save category order.')
      await load()
    } finally {
      setReordering(false)
    }
  }

  const moveCategory = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= categories.length || reordering) return

    const next = [...categories]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)
    void persistOrder(next)
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
        className="admin-card flex flex-col gap-3 p-5 sm:flex-row sm:items-end"
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
            className="admin-input px-4 py-3"
          />
        </label>
        <button
          type="submit"
          className="admin-button-primary h-12 px-6 text-xs font-bold uppercase tracking-[0.16em]"
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
              className="admin-panel p-4"
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
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveCategory(index, -1)}
                    disabled={index === 0 || reordering}
                    aria-label="Move category up"
                    className="flex h-9 w-9 items-center justify-center border border-primary/10 text-base text-primary/55 disabled:opacity-25"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveCategory(index, 1)}
                    disabled={index === categories.length - 1 || reordering}
                    aria-label="Move category down"
                    className="flex h-9 w-9 items-center justify-center border border-primary/10 text-base text-primary/55 disabled:opacity-25"
                  >
                    ↓
                  </button>
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
                  className="admin-input flex-1 px-3 py-2 text-sm"
                />

                <button
                  type="button"
                  onClick={() => save(category)}
                  disabled={savingId === category.id}
                  className="admin-button-primary px-4 py-2 text-xs font-bold uppercase tracking-wider disabled:opacity-50"
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
