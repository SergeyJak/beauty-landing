// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// Contact Information
export const CONTACT_INFO = {
  phone: process.env.NEXT_PUBLIC_PHONE || '+1 (212) 731-8426',
  email: process.env.NEXT_PUBLIC_EMAIL || 'hello@maisonelise.studio',
  address: process.env.NEXT_PUBLIC_ADDRESS || '118 W 18th St, Suite 602, New York, NY 10011',
  hours: 'Tue-Fri: 10am-7pm | Sat: 9am-5pm | Sun-Mon: Closed',
}

// Social Links
export const SOCIAL_LINKS = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || 'https://wa.me/12127318426?text=Hello%20Maison%20Elise%2C%20I%20would%20like%20to%20request%20an%20appointment',
  telegram: process.env.NEXT_PUBLIC_TELEGRAM || 'https://t.me/maisoneliseskin',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM || 'https://instagram.com/maisoneliseskin',
  facebook: 'https://facebook.com/maisoneliseskin',
  tiktok: 'https://tiktok.com/@maisoneliseskin',
}

// Animation Duration
export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
}

// Breakpoints
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}
