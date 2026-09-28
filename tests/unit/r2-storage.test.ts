import { describe, expect, it } from 'vitest'
import { MAX_IMAGE_BYTES, optimizeImage } from '@/lib/r2-storage'

describe('gallery image optimization', () => {
  it('caps accepted source files at 15 MB', () => {
    expect(MAX_IMAGE_BYTES).toBe(15 * 1024 * 1024)
  })

  it('creates WebP-friendly full and thumbnail variants within size bounds', async () => {
    const svg = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" width="3000" height="2000"><rect width="3000" height="2000" fill="#d8c2a4"/></svg>'
    )

    const optimized = await optimizeImage(svg)

    expect(optimized.width).toBeLessThanOrEqual(2200)
    expect(optimized.height).toBeLessThanOrEqual(2200)
    expect(optimized.full.length).toBeGreaterThan(0)
    expect(optimized.thumbnail.length).toBeGreaterThan(0)
    expect(optimized.thumbnail.length).toBeLessThan(optimized.full.length)
  })
})
