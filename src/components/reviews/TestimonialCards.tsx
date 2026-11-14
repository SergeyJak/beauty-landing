'use client'

import { useEffect, useRef, useState } from 'react'
import type { Testimonial, TestimonialCopy } from '@/lib/testimonials'

export default function TestimonialCards({ reviews, copy }: {
  reviews: Testimonial[]
  copy: TestimonialCopy
}) {
  const [expanded, setExpanded] = useState(false)
  const [selected, setSelected] = useState<Testimonial | null>(null)
  const [imageFailed, setImageFailed] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const featured = reviews.filter((review) => review.featured)
  const remaining = reviews.filter((review) => !review.featured)

  useEffect(() => {
    if (!selected) return
    const element = dialog.current
    element?.showModal()
    const previous = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      element?.close()
      document.documentElement.style.overflow = previous
    }
  }, [selected])

  const renderCard = (review: Testimonial, index = 0, isFeatured = false) => (
    <figure key={review.id} className={`${isFeatured && index >= 3 && !expanded ? 'hidden md:flex' : 'flex'} group relative flex-col overflow-hidden rounded-2xl border border-primary/10 bg-ivory p-5 shadow-[0_12px_40px_rgba(45,42,40,0.05)] transition-shadow hover:shadow-[0_18px_50px_rgba(45,42,40,0.10)] sm:p-7`}>
      <span aria-hidden="true" className="mb-2 font-serif text-4xl leading-none text-accent/75">“</span>
      <blockquote className="mb-5 flex-1 font-serif text-lg leading-[1.55] text-primary sm:text-xl">
        <p>{review.text}</p>
      </blockquote>
      <figcaption className="flex flex-wrap items-end justify-between gap-3 border-t border-primary/10 pt-4">
        <div><p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-primary/60">{copy.client}</p>
        <p className="mt-1 text-sm text-primary/80">{review.topic}</p></div>
        {review.image && (
          <button type="button" onClick={() => { setImageFailed(false); setSelected(review) }}
            aria-haspopup="dialog"
            aria-label={`${copy.original}: ${review.topic}`}
            className="ml-auto inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary underline decoration-accent/60 underline-offset-4 transition-colors hover:text-clay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            {copy.original}<span aria-hidden="true">↗</span>
          </button>
        )}
      </figcaption>
    </figure>
  )

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{featured.map((review, index) => renderCard(review, index, true))}</div>
      {remaining.length > 0 && (
        <>
          <div id="additional-client-reviews" hidden={!expanded} className="mt-4">
            {expanded && <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{remaining.map((review) => renderCard(review))}</div>}
          </div>
          <div className="mt-8 text-center">
            <button type="button" aria-expanded={expanded} aria-controls="additional-client-reviews"
              onClick={() => setExpanded((value) => !value)}
              className="min-h-12 rounded-full border border-primary/25 bg-ivory px-7 py-3 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              {expanded ? copy.less : copy.more}
            </button>
          </div>
        </>
      )}
      <dialog ref={dialog} aria-labelledby="original-review-heading" onClose={() => setSelected(null)}
        onKeyDown={(event) => {
          // The close button is this viewer's only interactive control.
          if (event.key === 'Tab') {
            event.preventDefault()
            dialog.current?.querySelector<HTMLButtonElement>('button')?.focus()
          }
        }}
        className="m-auto max-h-[min(88dvh,56rem)] w-[calc(100%-1.5rem)] max-w-2xl overflow-hidden rounded-2xl border border-primary/10 bg-ivory p-0 text-primary shadow-[0_30px_100px_rgba(0,0,0,0.3)] backdrop:bg-ink/70 backdrop:backdrop-blur-sm">
        {selected?.image && (
          <>
            <div className="flex items-center justify-between gap-4 border-b border-primary/10 bg-ivory px-5 py-4">
              <h3 id="original-review-heading" className="font-serif text-2xl">{copy.originalTitle}</h3>
              <button type="button" autoFocus onClick={() => dialog.current?.close()} aria-label={copy.close}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-soft-beige text-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">×</button>
            </div>
            <div className="max-h-[calc(min(88dvh,56rem)-5rem)] overflow-y-auto p-4 sm:p-6">
              {imageFailed ? <p role="alert" className="py-12">{copy.imageError}</p> : (
                <img src={selected.image.src} width={selected.image.width} height={selected.image.height}
                  alt={copy.imageAlt} decoding="async" onError={() => setImageFailed(true)}
                  className="mx-auto block h-auto max-h-[65dvh] w-auto max-w-full rounded-lg object-contain" />
              )}
              <p className="mt-4 text-sm leading-relaxed">{reviews.find((review) => review.id === selected.id)?.topic}</p>
            </div>
          </>
        )}
      </dialog>
    </>
  )
}
