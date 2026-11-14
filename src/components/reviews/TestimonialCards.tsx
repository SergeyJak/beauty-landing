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
    <figure key={review.id} className={`${isFeatured && index >= 3 && !expanded ? 'hidden md:flex' : 'flex'} min-h-72 flex-col border border-primary/15 bg-ivory p-6 sm:p-8`}>
      <span aria-hidden="true" className="mb-3 font-serif text-5xl leading-none text-accent">“</span>
      <blockquote className="mb-6 flex-1 font-serif text-xl leading-relaxed text-primary sm:text-2xl">
        <p>{review.text}</p>
      </blockquote>
      <figcaption className="border-t border-primary/10 pt-5">
        <p className="text-sm font-semibold text-primary">{copy.client}</p>
        <p className="mt-1 text-sm text-primary/75">{review.topic}</p>
        {review.image && (
          <button type="button" onClick={() => { setImageFailed(false); setSelected(review) }}
            aria-haspopup="dialog"
            aria-label={`${copy.original}: ${review.topic}`}
            className="mt-3 inline-flex min-h-11 items-center gap-2 border-b border-accent text-sm font-semibold text-primary transition-colors hover:text-clay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
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
              className="min-h-12 border border-primary/30 px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
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
        className="m-auto max-h-[90svh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto border border-primary/20 bg-ivory p-0 text-primary shadow-2xl backdrop:bg-black/70">
        {selected?.image && (
          <>
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-primary/15 bg-ivory px-4 py-3">
              <h3 id="original-review-heading" className="font-serif text-xl">{copy.originalTitle}</h3>
              <button type="button" autoFocus onClick={() => dialog.current?.close()} aria-label={copy.close}
                className="flex h-11 w-11 shrink-0 items-center justify-center border border-primary/20 text-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">×</button>
            </div>
            <div className="p-4">
              {imageFailed ? <p role="alert" className="py-12">{copy.imageError}</p> : (
                <img src={selected.image.src} width={selected.image.width} height={selected.image.height}
                  alt={copy.imageAlt} decoding="async" onError={() => setImageFailed(true)}
                  className="mx-auto block h-auto max-h-[70svh] w-auto max-w-full object-contain" />
              )}
              <p className="mt-4 text-sm leading-relaxed">{reviews.find((review) => review.id === selected.id)?.topic}</p>
            </div>
          </>
        )}
      </dialog>
    </>
  )
}
