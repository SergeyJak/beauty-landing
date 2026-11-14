import TestimonialCards from '@/components/reviews/TestimonialCards'
import { getTestimonials, TESTIMONIAL_COPY } from '@/lib/testimonials'
import type { Locale } from '@/lib/i18n'

export default function ClientTestimonials({ locale }: { locale: Locale }) {
  const copy = TESTIMONIAL_COPY[locale]
  return (
    <section id="client-reviews" aria-labelledby="client-reviews-title" className="bg-soft-beige py-16 md:py-24">
      <div className="section-container">
        <div className="mb-10 max-w-3xl">
          <p className="eyebrow mb-4 text-primary/75">{copy.eyebrow}</p>
          <h2 id="client-reviews-title" className="section-heading mb-5 text-primary">{copy.title}</h2>
          <p className="text-base leading-relaxed text-primary/85">{copy.description}</p>
        </div>
        <TestimonialCards reviews={getTestimonials(locale)} copy={copy} />
        <div className="mt-8 flex flex-col gap-5 border-t border-primary/15 pt-6 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl text-sm leading-relaxed text-primary/75">{copy.note}{copy.translation && <> {copy.translation}</>}</p>
          <a href={`/${locale}#contact`} className="inline-flex min-h-12 shrink-0 items-center justify-center border border-primary/30 px-5 text-sm font-semibold text-primary hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{copy.cta}</a>
        </div>
      </div>
    </section>
  )
}
