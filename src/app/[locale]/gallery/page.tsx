import PublicGallery from '@/components/gallery/PublicGallery'
import { getGallery } from '@/lib/gallery'
import { getGalleryCategories } from '@/lib/gallery-categories'
import { isValidLocale } from '@/lib/i18n'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ locale: string }>
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
