import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import {
  createGalleryCategory,
  deleteGalleryCategory,
  getGalleryCategories,
  updateGalleryCategoryName,
} from '@/lib/gallery-categories'
import { isValidLocale } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

function localeFrom(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') || 'lv'
  return isValidLocale(locale) ? locale : null
}

function revalidateGallery() {
  revalidatePath('/lv/gallery')
  revalidatePath('/ru/gallery')
  revalidatePath('/en/gallery')
}

export async function GET() {
  return NextResponse.json({ categories: await getGalleryCategories() })
}

export async function POST(request: NextRequest) {
  const locale = localeFrom(request)
  if (!locale) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
  }

  const body = await request.json().catch(() => null)
  const name = typeof body?.name === 'string' ? body.name : ''

  try {
    const category = await createGalleryCategory(locale, name)
    revalidateGallery()
    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Create failed' },
      { status: 400 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  const locale = localeFrom(request)
  const id = request.nextUrl.searchParams.get('id')
  if (!locale || !id) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const body = await request.json().catch(() => null)
  const name = typeof body?.name === 'string' ? body.name : ''
  const category = await updateGalleryCategoryName(id, locale, name)

  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }

  revalidateGallery()
  return NextResponse.json({ category })
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const deleted = await deleteGalleryCategory(id)
  if (!deleted) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }

  revalidateGallery()
  return NextResponse.json({ ok: true })
}
