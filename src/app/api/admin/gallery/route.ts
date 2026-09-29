import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import {
  createGalleryItem,
  deleteGalleryItem,
  getGallery,
  reorderGallery,
  updateGalleryCategory,
  updateGalleryText,
} from '@/lib/gallery'
import {
  MAX_IMAGE_BYTES,
  deleteR2Objects,
  uploadOptimizedImage,
} from '@/lib/r2-storage'
import { isValidLocale } from '@/lib/i18n'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getLocale(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') || 'lv'
  return isValidLocale(locale) ? locale : null
}

function revalidateGalleryPages() {
  revalidatePath('/lv/gallery')
  revalidatePath('/ru/gallery')
  revalidatePath('/en/gallery')
}

async function uploadGalleryImage(
  id: string,
  slot: 'before' | 'after',
  file: File
) {
  const source = await file.arrayBuffer()
  return uploadOptimizedImage('gallery', id, slot, Buffer.from(source))
}

export async function GET() {
  const items = await getGallery()
  return NextResponse.json({ items })
}

export async function POST(request: NextRequest) {
  const locale = getLocale(request)
  if (!locale) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
  }

  const formData = await request.formData()
  const title = String(formData.get('title') || '').trim()
  const categoryIdRaw = String(formData.get('categoryId') || '').trim()
  const categoryId = categoryIdRaw || null
  const beforeFile = formData.get('before')
  const afterFile = formData.get('after')

  if (!title || !categoryId) {
    return NextResponse.json(
      { error: 'Title and category are required' },
      { status: 400 }
    )
  }

  if (!(beforeFile instanceof File) || !(afterFile instanceof File)) {
    return NextResponse.json(
      { error: 'Before and after images are required' },
      { status: 400 }
    )
  }

  for (const file of [beforeFile, afterFile]) {
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: 'Each image must be 15 MB or smaller' },
        { status: 413 }
      )
    }
  }

  const id = crypto.randomUUID()
  const cleanupKeys = [
    `gallery/${id}/before.webp`,
    `gallery/${id}/before-thumb.webp`,
    `gallery/${id}/after.webp`,
    `gallery/${id}/after-thumb.webp`,
  ]

  try {
    const beforeStored = await uploadGalleryImage(id, 'before', beforeFile)
    const afterStored = await uploadGalleryImage(id, 'after', afterFile)

    const item = await createGalleryItem(locale, {
      title,
      categoryId,
      before: {
        ...beforeStored,
        originalSize: beforeFile.size,
      },
      after: {
        ...afterStored,
        originalSize: afterFile.size,
      },
    })

    revalidateGalleryPages()
    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    await deleteR2Objects(cleanupKeys).catch(() => undefined)
    console.error('Gallery upload failed:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to upload gallery images',
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  const locale = getLocale(request)
  const id = request.nextUrl.searchParams.get('id')

  if (!locale) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
  }

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const body = await request.json().catch(() => null)
  if (body?.categoryOnly === true) {
    const categoryId =
      typeof body?.categoryId === 'string' && body.categoryId
        ? body.categoryId
        : null
    const item = await updateGalleryCategory(id, categoryId)
    if (!item) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
    }
    revalidateGalleryPages()
    return NextResponse.json({ item })
  }

  const title = typeof body?.title === 'string' ? body.title : ''

  const item = await updateGalleryText(id, locale, { title })
  if (!item) {
    return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
  }

  revalidatePath(`/${locale}`)
  return NextResponse.json({ item })
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const orderedIds = Array.isArray(body?.orderedIds)
    ? body.orderedIds.filter((id: unknown): id is string => typeof id === 'string')
    : []

  if (!orderedIds.length) {
    return NextResponse.json({ error: 'Missing gallery order' }, { status: 400 })
  }

  try {
    const items = await reorderGallery(orderedIds)
    revalidateGalleryPages()
    return NextResponse.json({ items })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to reorder gallery' },
      { status: 400 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const item = await deleteGalleryItem(id)
  if (!item) {
    return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
  }

  await deleteR2Objects([
    item.before.key,
    item.before.thumbKey,
    item.after.key,
    item.after.thumbKey,
  ])

  revalidateGalleryPages()
  return NextResponse.json({ ok: true })
}
