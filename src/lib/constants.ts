import { BUSINESS, buildWhatsAppUrl } from '@/lib/business'

export const CONTACT_INFO = {
  phone: BUSINESS.phoneDisplay,
  email: BUSINESS.email,
  address: `${BUSINESS.streetAddress}, ${BUSINESS.addressLocality}, ${BUSINESS.postalCode}`,
  hours: 'Tue-Fri: 10am-6pm | Sat: 10am-4pm | Sun-Mon: Closed',
}

export const SOCIAL_LINKS = {
  whatsapp: buildWhatsAppUrl(
    'Hello! I would like to book a free electrolysis consultation in Riga.'
  ),
  telegram: process.env.NEXT_PUBLIC_TELEGRAM || 'https://t.me/electrolizeriga',
  instagram: BUSINESS.instagram,
  facebook: BUSINESS.facebook,
  tiktok: BUSINESS.tiktok,
}

export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
}

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}
