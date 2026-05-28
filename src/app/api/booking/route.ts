import { NextRequest, NextResponse } from 'next/server'
import { BookingRequest } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json()

    // Validate required fields
    if (!body.name || !body.phone || !body.service) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Log booking request
    console.log('📋 New Booking Request:', {
      timestamp: new Date().toISOString(),
      ...body,
    })

    // In production, you would:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Notify admin
    // 4. Integrate with calendar system

    return NextResponse.json(
      {
        success: true,
        message: 'Booking request received! We will contact you soon.',
        bookingId: `BOOK_${Date.now()}`,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Failed to process booking request' },
      { status: 500 }
    )
  }
}
