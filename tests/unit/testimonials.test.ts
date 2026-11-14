import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import path from 'node:path'
import records from '@/content/testimonials.json'
import { getTestimonials, TESTIMONIAL_COPY } from '@/lib/testimonials'

 describe('client testimonials', () => {
  it('uses only anonymous client quotations with complete translations', () => {
    expect(new Set(records.map((record) => record.id)).size).toBe(records.length)
    for (const locale of ['ru', 'en', 'lv'] as const) {
      const reviews = getTestimonials(locale)
      expect(reviews.filter((review) => review.featured)).toHaveLength(6)
      for (const review of reviews) {
        expect(review.text.trim().length).toBeGreaterThan(20)
        expect(review.topic.trim()).not.toBe('')
        expect(review).not.toHaveProperty('name')
        expect(review).not.toHaveProperty('rating')
        if (review.image) {
          expect(review.image.src).toMatch(/^\/reviews\/review-\d+\.webp$/)
          expect(review.image.width).toBeGreaterThan(0)
          expect(review.image.height).toBeGreaterThan(0)
          expect(existsSync(path.join(process.cwd(), 'public', review.image.src))).toBe(true)
        }
      }
    }
  })
  it('labels translations and retains the original discomfort caveat', () => {
    expect(TESTIMONIAL_COPY.en.translation).toBeTruthy()
    expect(TESTIMONIAL_COPY.lv.translation).toBeTruthy()
    expect(TESTIMONIAL_COPY.ru.translation).toBe('')
    expect(getTestimonials('ru').find((review) => review.id === 'review-19')?.text).toContain('Отек еще есть')
  })
})
