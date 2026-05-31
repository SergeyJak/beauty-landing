/** Locale-agnostic business facts for schema, maps, and tel/mailto links. */
export const BUSINESS = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://crystals-electrolysis.lv',
  streetAddress: 'Latgales iela 267',
  addressLocality: 'Rīga',
  postalCode: 'LV-1063',
  addressCountry: 'LV',
  geo: {
    latitude: 56.9152,
    longitude: 24.1925,
  },
  phoneDisplay: '+371 28 821 341',
  phoneE164: '+37128821341',
  email: 'crystalstudio@gmail.com',
  whatsappNumber: '37128821341',
  instagram: 'https://instagram.com/crystal_e_studio',
  tiktok: 'https://tiktok.com/@crystal_e_studio',
  facebook: 'https://facebook.com/crystal_e_studio',
  priceRange: '€€',
  googleMapsEmbed:
    'https://www.google.com/maps?q=Latgales+iela+267,+R%C4%ABga,+LV-1063&output=embed',
  googleMapsDirections:
    'https://www.google.com/maps/dir/?api=1&destination=Latgales+iela+267,+R%C4%ABga,+LV-1063',
} as const

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`
}
