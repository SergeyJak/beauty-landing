import { NextRequest, NextResponse } from 'next/server'
import { getTranslations, resolveLocale, t } from '@/lib/i18n'
import type { BookingRequest } from '@/types'

type BookingPayload = BookingRequest & {
  locale?: string
  honeypot?: string
}

const MAX_LENGTHS = {
  name: 100,
  phone: 40,
  service: 120,
  email: 254,
  comment: 1000,
} as const

function clean(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function isValidEmail(value: string): boolean {
  return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function sendTelegramMessage(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.warn('Booking delivery unavailable: Telegram is not configured.')
    return false
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    })

    if (!response.ok) {
      console.error('Booking delivery failed:', { status: response.status })
      return false
    }

    return true
  } catch {
    console.error('Booking delivery failed: Telegram request error')
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BookingPayload
    const locale = resolveLocale(body.locale)
    const translations = getTranslations(locale)

    if (body.honeypot) {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    const name = clean(body.name, MAX_LENGTHS.name)
    const phone = clean(body.phone, MAX_LENGTHS.phone)
    const service = clean(body.service, MAX_LENGTHS.service)
    const email = clean(body.email, MAX_LENGTHS.email)
    const comment = clean(body.comment, MAX_LENGTHS.comment)

    if (!name || !phone || !service) {
      return NextResponse.json(
        { error: t(translations, 'booking.api.missingFields') },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: t(translations, 'booking.validation.emailInvalid') },
        { status: 400 }
      )
    }

    const message = `
<b>🆕 New Booking Request</b>
<b>Locale:</b> ${locale.toUpperCase()}
<b>Name:</b> ${escapeHtml(name)}
<b>Phone:</b> ${escapeHtml(phone)}
<b>Service:</b> ${escapeHtml(service)}
<b>Email:</b> ${email ? escapeHtml(email) : 'N/A'}
<b>Comment:</b> ${comment ? escapeHtml(comment) : 'None'}
<b>Time:</b> ${new Date().toISOString()}
    `.trim()

    const delivered = await sendTelegramMessage(message)

    if (!delivered) {
      return NextResponse.json(
        { error: t(translations, 'booking.api.failed') },
        { status: 503 }
      )
    }

    console.info('Booking request delivered.', {
      timestamp: new Date().toISOString(),
      locale,
    })

    return NextResponse.json(
      {
        success: true,
        message: t(translations, 'booking.api.success'),
        bookingId: `BOOK_${Date.now()}`,
      },
      { status: 201 }
    )
  } catch {
    console.error('Booking request failed to process.')
    const translations = getTranslations('en')

    return NextResponse.json(
      { error: t(translations, 'booking.api.failed') },
      { status: 500 }
    )
  }
}
