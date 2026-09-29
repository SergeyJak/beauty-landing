import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const mocks = vi.hoisted(() => ({
  reorderGalleryCategories: vi.fn(),
  revalidatePath: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: mocks.revalidatePath,
}))

vi.mock('@/lib/gallery-categories', () => ({
  createGalleryCategory: vi.fn(),
  deleteGalleryCategory: vi.fn(),
  getGalleryCategories: vi.fn(),
  reorderGalleryCategories: mocks.reorderGalleryCategories,
  updateGalleryCategoryName: vi.fn(),
}))

import { PUT } from '@/app/api/admin/gallery-categories/route'

function request(body: unknown) {
  return new NextRequest('http://localhost/api/admin/gallery-categories', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('PUT /api/admin/gallery-categories', () => {
  beforeEach(() => {
    mocks.reorderGalleryCategories.mockReset()
    mocks.revalidatePath.mockReset()
  })

  it('rejects an empty category order', async () => {
    const response = await PUT(request({ orderedIds: [] }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'Missing category order',
    })
    expect(mocks.reorderGalleryCategories).not.toHaveBeenCalled()
  })

  it('passes the requested order to the category backend and returns it', async () => {
    const categories = [
      { id: 'b', slug: 'body', order: 0 },
      { id: 'a', slug: 'face', order: 1 },
    ]
    mocks.reorderGalleryCategories.mockResolvedValue(categories)

    const response = await PUT(request({ orderedIds: ['b', 'a'] }))

    expect(response.status).toBe(200)
    expect(mocks.reorderGalleryCategories).toHaveBeenCalledWith(['b', 'a'])
    await expect(response.json()).resolves.toEqual({ categories })
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/lv/gallery')
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/ru/gallery')
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/en/gallery')
  })

  it('returns a safe 400 response when backend validation rejects the order', async () => {
    mocks.reorderGalleryCategories.mockRejectedValue(
      new Error('Category order must include every category exactly once')
    )

    const response = await PUT(request({ orderedIds: ['a'] }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'Category order must include every category exactly once',
    })
  })
})
