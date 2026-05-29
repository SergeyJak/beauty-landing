import { NextRequest, NextResponse } from 'next/server'
import { getTranslations, resolveLocale, t } from '@/lib/i18n'
import type { BookingRequest } from '@/types'

type BookingPayload = BookingRequest & {
  locale?: string
  honeypot?: string
}

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

async function sendTelegramMessage(message: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram credentials missing, skipping message.')
    return false
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    })
    return response.ok
  } catch (error) {
    console.error('Telegram error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingPayload = await request.json()
    const locale = resolveLocale(body.locale)
    const translations = getTranslations(locale)

    // Anti-spam honeypot
    if (body.honeypot) {
      console.log('Spam detected via honeypot')
      return NextResponse.json({ success: true }, { status: 200 })
    }

    if (!body.name || !body.phone || !body.service) {
      return NextResponse.json(
        { error: t(translations, 'booking.api.missingFields') },
        { status: 400 }
      )
    }

    const message = `
<b>🆕 New Booking Request</b>
<b>Locale:</b> ${locale.toUpperCase()}
<b>Name:</b> ${body.name}
<b>Phone:</b> ${body.phone}
<b>Service:</b> ${body.service}
<b>Email:</b> ${body.email || 'N/A'}
<b>Comment:</b> ${body.comment || 'None'}
<b>Time:</b> ${new Date().toLocaleString()}
    `.trim()

    await sendTelegramMessage(message)

    console.log('📋 New Booking Request:', {
      timestamp: new Date().toISOString(),
      locale,
      name: body.name,
      phone: body.phone,
      service: body.service,
    })

    return NextResponse.json(
      {
        success: true,
        message: t(translations, 'booking.api.success'),
        bookingId: `BOOK_${Date.now()}`,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Booking error:', error)
    const translations = getTranslations('en')
    return NextResponse.json(
      { error: t(translations, 'booking.api.failed') },
      { status: 500 }
    )
  }
}
