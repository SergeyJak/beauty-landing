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

type GalleryItem = {
  id: string
  title: string
  category: string
  before: Asset
  after: Asset
}

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export default function GalleryAdmin({ locale }: { locale: Locale }) {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [before, setBefore] = useState<File | null>(null)
  const [after, setAfter] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const beforeRef = useRef<HTMLInputElement>(null)
  const afterRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch(`/api/admin/gallery?locale=${locale}`, {
        cache: 'no-store',
      })
      if (response.status === 401) {
        window.location.assign(`/login?next=/admin&lang=${locale}`)
        return
      }
      if (!response.ok) throw new Error('Failed to load gallery')
      const payload = await response.json()
      setItems(payload.items || [])
    } catch {
      setMessage('Neizdevās ielādēt galeriju.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [locale])

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
      formData.set('category', category)
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
      setCategory('')
      setBefore(null)
      setAfter(null)
      if (beforeRef.current) beforeRef.current.value = ''
      if (afterRef.current) afterRef.current.value = ''

      const original =
        payload.item.before.originalSize + payload.item.after.originalSize
      const optimized =
        payload.item.before.optimizedSize + payload.item.after.optimizedSize
      setMessage(
        `Uploaded: ${formatBytes(original)} → ${formatBytes(optimized)}`
      )
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Neizdevās augšupielādēt.'
      )
    } finally {
      setUploading(false)
    }
  }

  const remove = async (id: string) => {
    if (!window.confirm('Delete this Before / After pair?')) return

    const response = await fetch(`/api/admin/gallery?id=${id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      setItems((current) => current.filter((item) => item.id !== id))
      setMessage('Deleted.')
    } else {
      const payload = await response.json().catch(() => null)
      setMessage(payload?.error || 'Delete failed.')
    }
  }

  return (
    <section className="mt-10 space-y-6 border-t border-primary/10 pt-10">
      <div>
        <p className="eyebrow mb-2 text-accent">Gallery</p>
        <h2 className="font-serif text-3xl">
          Before / After · {locale.toUpperCase()}
        </h2>
        <p className="mt-2 text-sm text-primary/55">
          Up to 15 MB per original. Images are automatically resized,
          compressed to WebP and stripped of EXIF/GPS data.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="space-y-5 border border-primary/10 bg-white/60 p-6"
      >
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
            <input
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              required
              maxLength={160}
              className="w-full border border-primary/20 bg-white px-4 py-3 outline-none focus:border-accent"
            />
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
          {uploading ? 'Processing…' : 'Upload pair'}
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
          No uploaded Before / After pairs for {locale.toUpperCase()} yet.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden border border-primary/10 bg-white"
            >
              <div className="grid grid-cols-2">
                <div>
                  <img
                    src={item.before.thumbnailUrl}
                    alt={`${item.title} before`}
                    className="aspect-square w-full object-cover"
                  />
                  <p className="px-3 py-2 text-[0.65rem] font-bold uppercase tracking-wider text-primary/45">
                    Before
                  </p>
                </div>
                <div className="border-l border-primary/10">
                  <img
                    src={item.after.thumbnailUrl}
                    alt={`${item.title} after`}
                    className="aspect-square w-full object-cover"
                  />
                  <p className="px-3 py-2 text-[0.65rem] font-bold uppercase tracking-wider text-primary/45">
                    After
                  </p>
                </div>
              </div>

              <div className="space-y-2 border-t border-primary/10 p-4">
                <h3 className="font-serif text-xl">{item.title}</h3>
                <p className="text-sm text-primary/55">{item.category}</p>
                <p className="text-xs text-primary/40">
                  Before {formatBytes(item.before.originalSize)} →{' '}
                  {formatBytes(item.before.optimizedSize)}
                  <br />
                  After {formatBytes(item.after.originalSize)} →{' '}
                  {formatBytes(item.after.optimizedSize)}
                </p>

                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="mt-2 border border-red-900/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-800 transition hover:bg-red-50"
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
