import { MongoClient } from 'mongodb'
import type { Locale } from '@/lib/i18n'

export type EditablePageContent = {
  locale: Locale
  heroTitle: string
  heroDescription: string
  seoTitle: string
  seoDescription: string
  updatedAt?: string
}

const DB_NAME = process.env.MONGODB_DB || 'beauty_prod'
const COLLECTION = 'site_content'

declare global {
  // eslint-disable-next-line no-var
  var __beautyMongoClientPromise: Promise<MongoClient> | undefined
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not configured')
  }

  if (!global.__beautyMongoClientPromise) {
    const client = new MongoClient(uri)
    global.__beautyMongoClientPromise = client.connect()
  }

  return global.__beautyMongoClientPromise
}

export function sanitizeEditableContent(
  input: Partial<EditablePageContent>,
  locale: Locale
): EditablePageContent {
  const clean = (value: unknown, max: number) =>
    typeof value === 'string' ? value.trim().slice(0, max) : ''

  return {
    locale,
    heroTitle: clean(input.heroTitle, 180),
    heroDescription: clean(input.heroDescription, 500),
    seoTitle: clean(input.seoTitle, 120),
    seoDescription: clean(input.seoDescription, 320),
  }
}

export async function getEditableContent(
  locale: Locale
): Promise<EditablePageContent | null> {
  if (!process.env.MONGODB_URI) {
    return null
  }

  try {
    const client = await getClientPromise()
    const doc = await client
      .db(DB_NAME)
      .collection<EditablePageContent>(COLLECTION)
      .findOne({ locale }, { projection: { _id: 0 } })

    if (!doc) return null

    return {
      ...doc,
      updatedAt:
        doc.updatedAt instanceof Date
          ? doc.updatedAt.toISOString()
          : doc.updatedAt
            ? String(doc.updatedAt)
            : undefined,
    }
  } catch (error) {
    console.error('Failed to load editable page content:', error)
    return null
  }
}

export async function saveEditableContent(
  locale: Locale,
  input: Partial<EditablePageContent>
): Promise<EditablePageContent> {
  const content = sanitizeEditableContent(input, locale)

  if (
    !content.heroTitle ||
    !content.heroDescription ||
    !content.seoTitle ||
    !content.seoDescription
  ) {
    throw new Error('All content fields are required')
  }

  const client = await getClientPromise()
  const updatedAt = new Date()

  await client
    .db(DB_NAME)
    .collection(COLLECTION)
    .updateOne(
      { locale },
      { $set: { ...content, updatedAt } },
      { upsert: true }
    )

  return {
    ...content,
    updatedAt: updatedAt.toISOString(),
  }
}
