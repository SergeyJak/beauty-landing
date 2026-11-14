import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ connect: vi.fn() }))
vi.mock('mongodb', async (original) => ({
  ...await original<typeof import('mongodb')>(),
  MongoClient: class { connect() { return mocks.connect() } },
}))

const savedContent = {
  locale: 'en', heroTitle: 'Saved hero', heroDescription: 'Saved description',
  seoTitle: 'Saved SEO', seoDescription: 'Saved SEO description',
}
const client = { db: () => ({ collection: () => ({
  findOne: async () => savedContent,
  find: () => ({ sort: () => ({ toArray: async () => [] }) }),
}) }) }

beforeEach(() => {
  vi.resetModules()
  mocks.connect.mockReset()
  delete global.__beautyMongoClientPromise
  vi.stubEnv('MONGODB_URI', 'mongodb://unused.invalid')
  vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => { delete global.__beautyMongoClientPromise; vi.unstubAllEnvs() })

describe('shared MongoDB connection recovery', () => {
  it.each(['content', 'gallery', 'categories'])('recovers after a failed first attempt from %s', async (source) => {
    mocks.connect.mockRejectedValueOnce(new Error('temporary outage')).mockResolvedValue(client)
    const { getEditableContent } = await import('@/lib/content')
    const { getGallery } = await import('@/lib/gallery')
    const { getGalleryCategories } = await import('@/lib/gallery-categories')
    if (source === 'content') expect(await getEditableContent('en')).toBeNull()
    if (source === 'gallery') expect(await getGallery()).toEqual([])
    if (source === 'categories') await expect(getGalleryCategories()).rejects.toThrow('temporary outage')
    expect(await getEditableContent('en')).toEqual(savedContent)
    expect(await getGallery()).toEqual([])
    expect(await getGalleryCategories()).toEqual([])
    expect(mocks.connect).toHaveBeenCalledTimes(2)
  })
  it('shares one in-flight attempt across content, gallery and categories', async () => {
    let resolve!: (value: typeof client) => void
    mocks.connect.mockReturnValue(new Promise((done) => { resolve = done }))
    const { getEditableContent } = await import('@/lib/content')
    const { getGallery } = await import('@/lib/gallery')
    const { getGalleryCategories } = await import('@/lib/gallery-categories')
    const requests = [getEditableContent('en'), getGallery(), getGalleryCategories()]
    resolve(client)
    expect(await Promise.all(requests)).toEqual([savedContent, [], []])
    expect(mocks.connect).toHaveBeenCalledTimes(1)
  })
})
