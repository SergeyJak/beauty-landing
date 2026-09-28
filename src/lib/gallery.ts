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

export type GalleryItem = {
  id: string
  locale: Locale
  title: string
  category: string
  order: number
  before: StoredGalleryAsset
  after: StoredGalleryAsset
  createdAt: string
}

type GalleryDocument = Omit<GalleryItem, 'id' | 'createdAt'> & {
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

function mapGalleryDocument(
  doc: GalleryDocument & { _id: ObjectId }
): GalleryItem {
  return {
    id: doc._id.toHexString(),
    locale: doc.locale,
    title: doc.title,
    category: doc.category,
    order: doc.order,
    before: doc.before,
    after: doc.after,
    createdAt: doc.createdAt.toISOString(),
  }
}

export async function getGallery(locale: Locale): Promise<GalleryItem[]> {
  if (!process.env.MONGODB_URI) return []

  try {
    const db = await getDb()
    const docs = await db
      .collection<GalleryDocument>(COLLECTION)
      .find({ locale })
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
    category: string
    before: StoredGalleryAsset
    after: StoredGalleryAsset
  }
) {
  const db = await getDb()
  const collection = db.collection<GalleryDocument>(COLLECTION)
  const last = await collection
    .find({ locale })
    .sort({ order: -1 })
    .limit(1)
    .next()

  const doc: GalleryDocument = {
    locale,
    title: input.title.trim().slice(0, 120),
    category: input.category.trim().slice(0, 160),
    order: (last?.order ?? -1) + 1,
    before: input.before,
    after: input.after,
    createdAt: new Date(),
  }

  const result = await collection.insertOne(doc)
  return mapGalleryDocument({ ...doc, _id: result.insertedId })
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
