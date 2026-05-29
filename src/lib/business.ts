/** Locale-agnostic business facts for schema, maps, and tel/mailto links. */
export const BUSINESS = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://elektrolizeriga.lv',
  streetAddress: 'Elizabetes iela 45',
  addressLocality: 'Rīga',
  postalCode: 'LV-1010',
  addressCountry: 'LV',
  geo: {
    latitude: 56.9496,
    longitude: 24.1134,
  },
  phoneDisplay: '+371 26 123 456',
  phoneE164: '+37126123456',
  email: 'info@elektrolizeriga.lv',
  whatsappNumber: '37126123456',
  instagram: 'https://instagram.com/electrolizeriga',
  tiktok: 'https://tiktok.com/@electrolizeriga',
  facebook: 'https://facebook.com/electrolizeriga',
  priceRange: '€€',
  googleMapsEmbed:
    'https://www.google.com/maps?q=Elizabetes+iela+45,+R%C4%ABga,+LV-1010&output=embed',
  googleMapsDirections:
    'https://www.google.com/maps/dir/?api=1&destination=Elizabetes+iela+45,+R%C4%ABga,+LV-1010',
} as const

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`
}
