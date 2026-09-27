import { NextRequest, NextResponse } from 'next/server'
import {
  getEditableContent,
  saveEditableContent,
} from '@/lib/content'
import { isValidLocale } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') || 'lv'

  if (!isValidLocale(locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
  }

  const content = await getEditableContent(locale)
  return NextResponse.json({ content })
}

export async function PUT(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') || 'lv'

  if (!isValidLocale(locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
  }

  try {
    const body = await request.json()
    const content = await saveEditableContent(locale, body)
    return NextResponse.json({ content })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to save content'

    return NextResponse.json({ error: message }, { status: 400 })
  }
}
