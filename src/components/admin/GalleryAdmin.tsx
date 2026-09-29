'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'

type Locale = 'lv' | 'ru' | 'en'

type Asset = {
  url: string
  thumbnailUrl: string
  originalSize: number
  optimizedSize: number
  width: number
  height: number
}

type LocalizedText = {
  title: string
}

type GalleryItem = {
  id: string
  order: number
  categoryId: string | null
  text: Record<Locale, LocalizedText>
  before: Asset
  after: Asset
}

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

type Category = {
  id: string
  slug: string
  name: Record<Locale, string>
}

export default function GalleryAdmin({ locale }: { locale: Locale }) {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [before, setBefore] = useState<File | null>(null)
  const [after, setAfter] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [reordering, setReordering] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const beforeRef = useRef<HTMLInputElement>(null)
  const afterRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    setMessage('')
    try {
      const [response, categoriesResponse] = await Promise.all([
        fetch('/api/admin/gallery', { cache: 'no-store' }),
        fetch('/api/admin/gallery-categories', { cache: 'no-store' }),
      ])
      if (response.status === 401 || categoriesResponse.status === 401) {
        window.location.assign(`/login?next=/admin&lang=${locale}`)
        return
      }
      if (!response.ok || !categoriesResponse.ok) {
        throw new Error('Failed to load gallery')
      }
      const [payload, categoriesPayload] = await Promise.all([
        response.json(),
        categoriesResponse.json(),
      ])
      setItems(payload.items || [])
      setCategories(categoriesPayload.categories || [])
    } catch {
      setMessage('Neizdevās ielādēt galeriju.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const persistOrder = async (next: GalleryItem[]) => {
    setItems(next)
    setReordering(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: next.map((item) => item.id) }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to save order')
      }

      setItems(payload.items || next)
      setMessage('Gallery order saved.')
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Failed to save gallery order.'
      )
      await load()
    } finally {
      setReordering(false)
    }
  }

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= items.length || reordering) return

    const next = [...items]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)
    void persistOrder(next)
  }

  const dropOn = (targetId: string) => {
    if (!draggedId || draggedId === targetId || reordering) {
      setDraggedId(null)
      return
    }

    const from = items.findIndex((item) => item.id === draggedId)
    const to = items.findIndex((item) => item.id === targetId)
    if (from === -1 || to === -1) {
      setDraggedId(null)
      return
    }

    const next = [...items]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setDraggedId(null)
    void persistOrder(next)
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!before || !after) {
      setMessage('Izvēlies abus attēlus: Before un After.')
      return
    }

    setUploading(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.set('title', title)
      formData.set('categoryId', categoryId)
      formData.set('before', before)
      formData.set('after', after)

      const response = await fetch(`/api/admin/gallery?locale=${locale}`, {
        method: 'POST',
        body: formData,
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.error || 'Upload failed')
      }

      setItems((current) => [...current, payload.item])
      setTitle('')
      setCategoryId('')
      setBefore(null)
      setAfter(null)
      if (beforeRef.current) beforeRef.current.value = ''
      if (afterRef.current) afterRef.current.value = ''

      const original =
        payload.item.before.originalSize + payload.item.after.originalSize
      const optimized =
        payload.item.before.optimizedSize + payload.item.after.optimizedSize
      setMessage(
        `Uploaded once for all languages: ${formatBytes(original)} → ${formatBytes(optimized)}`
      )
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Neizdevās augšupielādēt.'
      )
    } finally {
      setUploading(false)
    }
  }

  const updateText = (
    id: string,
    field: keyof LocalizedText,
    value: string
  ) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              text: {
                ...item.text,
                [locale]: {
                  ...item.text[locale],
                  [field]: value,
                },
              },
            }
          : item
      )
    )
  }

  const changeCategory = async (item: GalleryItem, nextCategoryId: string) => {
    setItems((current) =>
      current.map((currentItem) =>
        currentItem.id === item.id
          ? { ...currentItem, categoryId: nextCategoryId || null }
          : currentItem
      )
    )

    const response = await fetch(
      `/api/admin/gallery?id=${item.id}&locale=${locale}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryOnly: true,
          categoryId: nextCategoryId || null,
        }),
      }
    )

    const payload = await response.json().catch(() => null)
    if (!response.ok) {
      setMessage(payload?.error || 'Category update failed.')
      await load()
      return
    }

    setItems((current) =>
      current.map((currentItem) =>
        currentItem.id === item.id ? payload.item : currentItem
      )
    )
    setMessage('Category updated.')
  }

  const saveText = async (item: GalleryItem) => {
    setSavingId(item.id)
    setMessage('')

    try {
      const response = await fetch(
        `/api/admin/gallery?id=${item.id}&locale=${locale}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.text[locale]),
        }
      )

      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Save failed')

      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === item.id ? payload.item : currentItem
        )
      )
      setMessage(`Saved ${locale.toUpperCase()} gallery text.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Save failed.')
    } finally {
      setSavingId(null)
    }
  }

  const remove = async (id: string) => {
    if (!window.confirm('Delete this Before / After pair for all languages?')) return

    const response = await fetch(`/api/admin/gallery?id=${id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      setItems((current) => current.filter((item) => item.id !== id))
      setMessage('Deleted from all languages.')
    } else {
      const payload = await response.json().catch(() => null)
      setMessage(payload?.error || 'Delete failed.')
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="eyebrow mb-2 text-accent">Gallery</p>
        <h2 className="font-serif text-3xl">Before / After</h2>
        <p className="mt-2 text-sm text-primary/55">
          Photos are shared across LV / RU / EN. Titles and categories are
          translated separately. Drag cards on desktop or use ↑ / ↓ on mobile
          to change their order.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="space-y-5 border border-primary/10 bg-white/60 p-5 sm:p-6"
      >
        <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary/45">
          New pair · initial text: {locale.toUpperCase()}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest">
              Title
            </span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              maxLength={120}
              className="w-full border border-primary/20 bg-white px-4 py-3 outline-none focus:border-accent"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest">
              Category
            </span>
            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              required
              className="w-full border border-primary/20 bg-white px-4 py-3 outline-none focus:border-accent"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name[locale] ||
                    category.name.lv ||
                    category.name.ru ||
                    category.name.en ||
                    category.slug}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest">
              Before
            </span>
            <input
              ref={beforeRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif"
              onChange={(event) => setBefore(event.target.files?.[0] || null)}
              required
              className="block w-full text-sm text-primary/60 file:mr-4 file:border-0 file:bg-primary file:px-4 file:py-3 file:text-xs file:font-bold file:uppercase file:tracking-wider file:text-white"
            />
            {before && (
              <span className="mt-2 block text-xs text-primary/45">
                {before.name} · {formatBytes(before.size)}
              </span>
            )}
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest">
              After
            </span>
            <input
              ref={afterRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif"
              onChange={(event) => setAfter(event.target.files?.[0] || null)}
              required
              className="block w-full text-sm text-primary/60 file:mr-4 file:border-0 file:bg-primary file:px-4 file:py-3 file:text-xs file:font-bold file:uppercase file:tracking-wider file:text-white"
            />
            {after && (
              <span className="mt-2 block text-xs text-primary/45">
                {after.name} · {formatBytes(after.size)}
              </span>
            )}
          </label>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="bg-primary px-7 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white disabled:opacity-50"
        >
          {uploading ? 'Processing…' : 'Upload shared pair'}
        </button>
      </form>

      {message && (
        <p className="text-sm text-primary/65" role="status">
          {message}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-primary/50">Loading gallery…</p>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-primary/15 px-6 py-10 text-center text-sm text-primary/45">
          No uploaded Before / After pairs yet.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {items.map((item, index) => {
            const text = item.text[locale]

            return (
              <article
                key={item.id}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => dropOn(item.id)}
                className={`overflow-hidden border bg-white transition ${
                  draggedId === item.id
                    ? 'border-accent opacity-60'
                    : 'border-primary/10'
                }`}
              >
                <div className="flex items-center justify-between border-b border-primary/10 bg-soft-beige/60 px-3 py-2">
                  <div
                    draggable={!reordering}
                    onDragStart={() => setDraggedId(item.id)}
                    onDragEnd={() => setDraggedId(null)}
                    className="hidden cursor-grab select-none items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-primary/45 active:cursor-grabbing sm:flex"
                    title="Drag to reorder"
                  >
                    <span className="text-base">↕</span>
                    Drag
                  </div>

                  <span className="text-xs font-semibold text-primary/35">
                    #{index + 1}
                  </span>

                  <div className="ml-auto flex gap-1 sm:ml-0">
                    <button
                      type="button"
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0 || reordering}
                      aria-label="Move up"
                      className="flex h-9 w-9 items-center justify-center border border-primary/10 text-base text-primary/55 disabled:opacity-25"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, 1)}
                      disabled={index === items.length - 1 || reordering}
                      aria-label="Move down"
                      className="flex h-9 w-9 items-center justify-center border border-primary/10 text-base text-primary/55 disabled:opacity-25"
                    >
                      ↓
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2">
                  <div>
                    <img
                      src={item.before.thumbnailUrl}
                      alt="Before"
                      className="aspect-square w-full object-cover"
                    />
                    <p className="px-3 py-2 text-[0.65rem] font-bold uppercase tracking-wider text-primary/45">
                      Before
                    </p>
                  </div>
                  <div className="border-l border-primary/10">
                    <img
                      src={item.after.thumbnailUrl}
                      alt="After"
                      className="aspect-square w-full object-cover"
                    />
                    <p className="px-3 py-2 text-[0.65rem] font-bold uppercase tracking-wider text-primary/45">
                      After
                    </p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-primary/10 p-4">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-accent">
                    Text · {locale.toUpperCase()}
                  </p>

                  <select
                    value={item.categoryId || ''}
                    onChange={(event) =>
                      changeCategory(item, event.target.value)
                    }
                    className="w-full border border-primary/15 px-3 py-2 text-sm outline-none focus:border-accent"
                  >
                    <option value="">Uncategorized</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name[locale] ||
                          category.name.lv ||
                          category.name.ru ||
                          category.name.en ||
                          category.slug}
                      </option>
                    ))}
                  </select>

                  <input
                    value={text.title}
                    onChange={(event) =>
                      updateText(item.id, 'title', event.target.value)
                    }
                    maxLength={120}
                    placeholder="Title"
                    className="w-full border border-primary/15 px-3 py-2 text-sm outline-none focus:border-accent"
                  />

                  <p className="text-xs text-primary/40">
                    Before {formatBytes(item.before.originalSize)} →{' '}
                    {formatBytes(item.before.optimizedSize)}
                    <br />
                    After {formatBytes(item.after.originalSize)} →{' '}
                    {formatBytes(item.after.optimizedSize)}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => saveText(item)}
                      disabled={savingId === item.id}
                      className="bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"
                    >
                      {savingId === item.id
                        ? 'Saving…'
                        : `Save ${locale.toUpperCase()} text`}
                    </button>

                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="border border-red-900/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-800 transition hover:bg-red-50"
                    >
                      Delete pair
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
