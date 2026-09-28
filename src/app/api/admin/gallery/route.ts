import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import {
  createGalleryItem,
  deleteGalleryItem,
  getGallery,
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
  revalidatePath('/lv')
  revalidatePath('/ru')
  revalidatePath('/en')
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
  const category = String(formData.get('category') || '').trim()
  const beforeFile = formData.get('before')
  const afterFile = formData.get('after')

  if (!title || !category) {
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
    const [beforeBuffer, afterBuffer] = await Promise.all([
      beforeFile.arrayBuffer(),
      afterFile.arrayBuffer(),
    ])

    const [beforeStored, afterStored] = await Promise.all([
      uploadOptimizedImage(
        'gallery',
        id,
        'before',
        Buffer.from(beforeBuffer)
      ),
      uploadOptimizedImage(
        'gallery',
        id,
        'after',
        Buffer.from(afterBuffer)
      ),
    ])

    const item = await createGalleryItem(locale, {
      title,
      category,
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
  const title = typeof body?.title === 'string' ? body.title : ''
  const category = typeof body?.category === 'string' ? body.category : ''

  const item = await updateGalleryText(id, locale, { title, category })
  if (!item) {
    return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
  }

  revalidatePath(`/${locale}`)
  return NextResponse.json({ item })
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
