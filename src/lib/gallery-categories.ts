import { MongoClient, ObjectId } from 'mongodb'
import type { Locale } from '@/lib/i18n'

export type GalleryCategory = {
  id: string
  slug: string
  order: number
  name: Record<Locale, string>
  createdAt: string
}

type CategoryDocument = Omit<GalleryCategory, 'id' | 'createdAt'> & {
  createdAt: Date
}

const DB_NAME = process.env.MONGODB_DB || 'beauty_prod'
const COLLECTION = 'gallery_categories'

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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function mapCategory(doc: CategoryDocument & { _id: ObjectId }): GalleryCategory {
  return {
    id: doc._id.toHexString(),
    slug: doc.slug,
    order: doc.order,
    name: {
      lv: doc.name?.lv || '',
      ru: doc.name?.ru || '',
      en: doc.name?.en || '',
    },
    createdAt: doc.createdAt.toISOString(),
  }
}

export async function getGalleryCategories(): Promise<GalleryCategory[]> {
  if (!process.env.MONGODB_URI) return []

  const db = await getDb()
  const docs = await db
    .collection<CategoryDocument>(COLLECTION)
    .find({})
    .sort({ order: 1, createdAt: 1 })
    .toArray()

  return docs.map((doc) =>
    mapCategory(doc as CategoryDocument & { _id: ObjectId })
  )
}

export async function createGalleryCategory(
  locale: Locale,
  categoryName: string
) {
  const nameValue = categoryName.trim().slice(0, 100)
  if (!nameValue) throw new Error('Category name is required')

  const db = await getDb()
  const collection = db.collection<CategoryDocument>(COLLECTION)
  const last = await collection.find({}).sort({ order: -1 }).limit(1).next()
  const baseSlug = slugify(nameValue) || crypto.randomUUID().slice(0, 8)

  let slug = baseSlug
  let suffix = 2
  while (await collection.findOne({ slug })) {
    slug = `${baseSlug}-${suffix++}`
  }

  const name: Record<Locale, string> = { lv: '', ru: '', en: '' }
  name[locale] = nameValue

  const doc: CategoryDocument = {
    slug,
    order: (last?.order ?? -1) + 1,
    name,
    createdAt: new Date(),
  }

  const result = await collection.insertOne(doc)
  return mapCategory({ ...doc, _id: result.insertedId })
}

export async function updateGalleryCategoryName(
  id: string,
  locale: Locale,
  name: string
) {
  if (!ObjectId.isValid(id)) return null

  const db = await getDb()
  const collection = db.collection<CategoryDocument>(COLLECTION)
  const _id = new ObjectId(id)

  await collection.updateOne(
    { _id },
    { $set: { [`name.${locale}`]: name.trim().slice(0, 100) } }
  )

  const updated = await collection.findOne({ _id })
  return updated
    ? mapCategory(updated as CategoryDocument & { _id: ObjectId })
    : null
}


export async function reorderGalleryCategories(ids: string[]) {
  if (
    !ids.length ||
    ids.some((id) => !ObjectId.isValid(id)) ||
    new Set(ids).size !== ids.length
  ) {
    throw new Error('Invalid category order')
  }

  const db = await getDb()
  const collection = db.collection<CategoryDocument>(COLLECTION)
  const existingIds = (await collection.find({}, { projection: { _id: 1 } }).toArray())
    .map((doc) => doc._id.toHexString())

  if (
    ids.length !== existingIds.length ||
    existingIds.some((id) => !ids.includes(id))
  ) {
    throw new Error('Category order must include every category exactly once')
  }

  await collection.bulkWrite(
    ids.map((id, order) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order } },
      },
    }))
  )

  return getGalleryCategories()
}

export async function deleteGalleryCategory(id: string) {
  if (!ObjectId.isValid(id)) return false

  const db = await getDb()
  const _id = new ObjectId(id)
  const result = await db.collection<CategoryDocument>(COLLECTION).deleteOne({ _id })

  if (result.deletedCount > 0) {
    await db.collection('gallery').updateMany(
      { categoryId: id },
      { $set: { categoryId: null } }
    )
  }

  return result.deletedCount > 0
}
