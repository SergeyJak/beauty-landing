// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// Contact Information
export const CONTACT_INFO = {
  phone: process.env.NEXT_PUBLIC_PHONE || '+1 (212) 555-0123',
  email: process.env.NEXT_PUBLIC_EMAIL || 'hello@electrolysisnyc.com',
  address: process.env.NEXT_PUBLIC_ADDRESS || '157 E 86th St, New York, NY 10028',
  hours: 'Tue-Fri: 10am-6pm | Sat: 10am-4pm | Sun-Mon: Closed',
}

// Social Links
export const SOCIAL_LINKS = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || 'https://wa.me/12125550123?text=Hello%20Electrolysis%20NYC%2C%20I%20would%20like%20to%20schedule%20a%20consultation',
  telegram: process.env.NEXT_PUBLIC_TELEGRAM || 'https://t.me/electrolysisnyc',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM || 'https://instagram.com/electrolysisnyc',
  facebook: 'https://facebook.com/electrolysisnyc',
  tiktok: 'https://tiktok.com/@electrolysisnyc',
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
