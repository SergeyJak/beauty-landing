import type { Metadata } from 'next'
import PublicGallery from '@/components/gallery/PublicGallery'
import { getGallery } from '@/lib/gallery'
import { getGalleryCategories } from '@/lib/gallery-categories'
import {
  getBaseUrl,
  getHreflangAlternates,
  getOpenGraphLocale,
  isValidLocale,
  LOCALES,
} from '@/lib/i18n'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ locale: string }>
}


const GALLERY_META = {
  lv: {
    title: 'Galerija',
    description: 'Crystal E Studio elektrolīzes rezultāti pirms un pēc, sakārtoti pa kategorijām.',
  },
  ru: {
    title: 'Галерея',
    description: 'Результаты электроэпиляции Crystal E Studio до и после, разбитые по категориям.',
  },
  en: {
    title: 'Gallery',
    description: 'Crystal E Studio electrolysis before-and-after results, organised by category.',
  },
} as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}

  const baseUrl = getBaseUrl()
  const canonicalUrl = `${baseUrl}/${locale}/gallery`
  const copy = GALLERY_META[locale]
  const ogImage = `${baseUrl}/${locale}/opengraph-image`

  return {
    title: copy.title,
    description: copy.description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
      languages: getHreflangAlternates('/gallery'),
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      type: 'website',
      locale: getOpenGraphLocale(locale),
      alternateLocale: LOCALES.filter((item) => item !== locale).map(getOpenGraphLocale),
      url: canonicalUrl,
      images: [{ url: ogImage, width: 1200, height: 630, alt: copy.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
      images: [ogImage],
    },
  }
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const [categories, items] = await Promise.all([
    getGalleryCategories(),
    getGallery(),
  ])

  return (
    <PublicGallery
      locale={locale}
      categories={categories}
      items={items.map((item) => ({
        id: item.id,
        categoryId: item.categoryId,
        before: item.before.url,
        after: item.after.url,
        title:
          item.text[locale].title ||
          item.text.lv.title ||
          item.text.ru.title ||
          item.text.en.title,
      }))}
    />
  )
}
