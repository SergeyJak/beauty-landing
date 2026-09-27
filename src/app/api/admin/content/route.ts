import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import {
  getEditableContent,
  saveEditableContent,
  type EditablePageContent,
} from '@/lib/content'
import {
  getNestedValue,
  getTranslations,
  isValidLocale,
} from '@/lib/i18n'

export const dynamic = 'force-dynamic'

function getFallbackContent(locale: 'lv' | 'ru' | 'en'): EditablePageContent {
  const translations = getTranslations(locale)

  return {
    locale,
    heroTitle: getNestedValue(translations, 'hero.title', ''),
    heroDescription: getNestedValue(translations, 'hero.description', ''),
    seoTitle: getNestedValue(translations, 'metadata.title', ''),
    seoDescription: getNestedValue(translations, 'metadata.description', ''),
  }
}

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') || 'lv'

  if (!isValidLocale(locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
  }

  const saved = await getEditableContent(locale)
  return NextResponse.json({
    content: saved || getFallbackContent(locale),
    source: saved ? 'database' : 'fallback',
  })
}

export async function PUT(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') || 'lv'

  if (!isValidLocale(locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
  }

  try {
    const body = await request.json()
    const content = await saveEditableContent(locale, body)
    revalidatePath(`/${locale}`)

    return NextResponse.json({ content })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to save content'

    return NextResponse.json({ error: message }, { status: 400 })
  }
}
