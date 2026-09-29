import { MongoClient, ObjectId } from 'mongodb'
import type { Locale } from '@/lib/i18n'

export type StoredGalleryAsset = {
  key: string
  thumbKey: string
  url: string
  thumbnailUrl: string
  originalSize: number
  optimizedSize: number
  width: number
  height: number
}

export type GalleryText = {
  title: string
}

export type GalleryItem = {
  id: string
  order: number
  categoryId: string | null
  before: StoredGalleryAsset
  after: StoredGalleryAsset
  text: Record<Locale, GalleryText>
  createdAt: string
}

type GalleryDocument = Omit<GalleryItem, 'id' | 'createdAt' | 'categoryId'> & {
  categoryId?: string | null
  createdAt: Date
}

const DB_NAME = process.env.MONGODB_DB || 'beauty_prod'
const COLLECTION = 'gallery'

declare global {
  // eslint-disable-next-line no-var
  var __beautyMongoClientPromise: Promise<MongoClient> | undefined
}

async function getDb() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not configured')

  if (!global.__beautyMongoClientPromise) {
    global.__beautyMongoClientPromise = new MongoClient(uri).connect()
  }

  const client = await global.__beautyMongoClientPromise
  return client.db(DB_NAME)
}

function emptyText(): Record<Locale, GalleryText> {
  return {
    lv: { title: '' },
    ru: { title: '' },
    en: { title: '' },
  }
}

function withCurrentPublicUrl(asset: StoredGalleryAsset): StoredGalleryAsset {
  const base = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, '')
  if (!base) return asset

  return {
    ...asset,
    url: `${base}/${asset.key}`,
    thumbnailUrl: `${base}/${asset.thumbKey}`,
  }
}

function mapGalleryDocument(
  doc: GalleryDocument & { _id: ObjectId }
): GalleryItem {
  return {
    id: doc._id.toHexString(),
    order: doc.order,
    categoryId: doc.categoryId || null,
    before: withCurrentPublicUrl(doc.before),
    after: withCurrentPublicUrl(doc.after),
    text: {
      ...emptyText(),
      ...(doc.text || {}),
    },
    createdAt: doc.createdAt.toISOString(),
  }
}

export async function getGallery(): Promise<GalleryItem[]> {
  if (!process.env.MONGODB_URI) return []

  try {
    const db = await getDb()
    const docs = await db
      .collection<GalleryDocument>(COLLECTION)
      .find({})
      .sort({ order: 1, createdAt: 1 })
      .toArray()

    return docs.map((doc) =>
      mapGalleryDocument(doc as GalleryDocument & { _id: ObjectId })
    )
  } catch (error) {
    console.error('Failed to load gallery:', error)
    return []
  }
}

export async function createGalleryItem(
  locale: Locale,
  input: {
    title: string
    categoryId: string | null
    before: StoredGalleryAsset
    after: StoredGalleryAsset
  }
) {
  const db = await getDb()
  const collection = db.collection<GalleryDocument>(COLLECTION)
  const last = await collection.find({}).sort({ order: -1 }).limit(1).next()

  const text = emptyText()
  text[locale] = {
    title: input.title.trim().slice(0, 120),
  }

  const doc: GalleryDocument = {
    order: (last?.order ?? -1) + 1,
    categoryId: input.categoryId,
    before: input.before,
    after: input.after,
    text,
    createdAt: new Date(),
  }

  const result = await collection.insertOne(doc)
  return mapGalleryDocument({ ...doc, _id: result.insertedId })
}

export async function updateGalleryText(
  id: string,
  locale: Locale,
  input: GalleryText
) {
  if (!ObjectId.isValid(id)) return null

  const db = await getDb()
  const collection = db.collection<GalleryDocument>(COLLECTION)
  const _id = new ObjectId(id)
  const title = input.title.trim().slice(0, 120)

  await collection.updateOne(
    { _id },
    {
      $set: {
        [`text.${locale}.title`]: title,
      },
    }
  )

  const updated = await collection.findOne({ _id })
  return updated
    ? mapGalleryDocument(updated as GalleryDocument & { _id: ObjectId })
    : null
}

export async function updateGalleryCategory(
  id: string,
  categoryId: string | null
) {
  if (!ObjectId.isValid(id)) return null

  const db = await getDb()
  const collection = db.collection<GalleryDocument>(COLLECTION)
  const _id = new ObjectId(id)

  await collection.updateOne(
    { _id },
    { $set: { categoryId } }
  )

  const updated = await collection.findOne({ _id })
  return updated
    ? mapGalleryDocument(updated as GalleryDocument & { _id: ObjectId })
    : null
}

export async function reorderGallery(ids: string[]) {
  if (!ids.length || ids.some((id) => !ObjectId.isValid(id))) {
    throw new Error('Invalid gallery order')
  }

  const db = await getDb()
  const collection = db.collection<GalleryDocument>(COLLECTION)

  await collection.bulkWrite(
    ids.map((id, order) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order } },
      },
    }))
  )

  return getGallery()
}

export async function deleteGalleryItem(id: string) {
  if (!ObjectId.isValid(id)) return null

  const db = await getDb()
  const collection = db.collection<GalleryDocument>(COLLECTION)
  const _id = new ObjectId(id)
  const existing = await collection.findOne({ _id })
  if (!existing) return null

  await collection.deleteOne({ _id })
  return mapGalleryDocument(existing as GalleryDocument & { _id: ObjectId })
}
