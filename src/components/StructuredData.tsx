import {
  buildFaqPageSchema,
  buildLocalBusinessSchema,
  buildWebSiteSchema,
} from '@/lib/seo/schema'
import { getArray, getTranslations, type Locale } from '@/lib/i18n'
import type { FAQItem } from '@/types'

type StructuredDataProps = {
  locale: Locale
}

export default function StructuredData({ locale }: StructuredDataProps) {
  const translations = getTranslations(locale)
  const brand = translations.brand as { name?: string }
  const metadata = translations.metadata as { description?: string }
  const schema = translations.schema as {
    openingHours?: string[]
  }
  const faqItems = getArray<FAQItem>(translations, 'faq.items').map((item, index) => ({
    ...item,
    id: item.id ?? String(index + 1),
  }))

  const businessName = brand?.name || 'Electrolysis Riga'
  const graphs = [
    buildWebSiteSchema(locale, businessName),
    buildLocalBusinessSchema(locale, {
      name: businessName,
      description: metadata?.description || '',
      openingHours: schema?.openingHours || [],
    }),
    ...(faqItems.length ? [buildFaqPageSchema(faqItems)] : []),
  ]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graphs) }}
    />
  )
}
