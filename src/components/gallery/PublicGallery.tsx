'use client'

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import BeforeAfterSlider from '@/components/BeforeAfterSlider'

type Locale = 'lv' | 'ru' | 'en'

type Category = {
  id: string
  slug: string
  name: Record<Locale, string>
}

type Item = {
  id: string
  categoryId: string | null
  before: string
  after: string
  title: string
}

const copy: Record<Locale, {
  eyebrow: string
  title: string
  description: string
  all: string
  empty: string
}> = {
  lv: {
    eyebrow: 'Rezultāti',
    title: 'Galerija',
    description: 'Pirms un pēc rezultāti, sakārtoti pa kategorijām.',
    all: 'Visi',
    empty: 'Šajā kategorijā vēl nav foto.',
  },
  ru: {
    eyebrow: 'Результаты',
    title: 'Галерея',
    description: 'Результаты до и после, разбитые по категориям.',
    all: 'Все',
    empty: 'В этой категории пока нет фотографий.',
  },
  en: {
    eyebrow: 'Results',
    title: 'Gallery',
    description: 'Before and after results, organised by category.',
    all: 'All',
    empty: 'There are no photos in this category yet.',
  },
}

export default function PublicGallery({
  locale,
  categories,
  items,
}: {
  locale: Locale
  categories: Category[]
  items: Item[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = copy[locale]
  const categorySlug = searchParams.get('category')
  const activeCategory =
    categories.find((category) => category.slug === categorySlug) || null

  const visibleItems = useMemo(
    () =>
      activeCategory
        ? items.filter((item) => item.categoryId === activeCategory.id)
        : items,
    [activeCategory, items]
  )

  const selectCategory = (slug?: string) => {
    const next = new URLSearchParams(searchParams.toString())

    if (slug) {
      next.set('category', slug)
    } else {
      next.delete('category')
    }

    const query = next.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const categoryLabel = (category: Category) =>
    category.name[locale] ||
    category.name.lv ||
    category.name.ru ||
    category.name.en ||
    category.slug

  return (
    <div className="min-h-screen bg-ivory pt-28 lg:pt-36">
      <section className="section-container pb-10 text-center sm:pb-14">
        <p className="eyebrow mb-3 text-accent">{t.eyebrow}</p>
        <h1 className="font-serif text-5xl text-primary sm:text-6xl">
          {t.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-primary/60">
          {t.description}
        </p>
      </section>

      <section className="section-container pb-20">
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => selectCategory()}
            className={`shrink-0 border px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] transition ${
              !activeCategory
                ? 'border-primary bg-primary text-ivory'
                : 'border-primary/15 bg-white text-primary/60 hover:border-accent hover:text-accent dark:bg-secondary'
            }`}
          >
            {t.all}
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => selectCategory(category.slug)}
              className={`shrink-0 border px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] transition ${
                activeCategory?.id === category.id
                  ? 'border-primary bg-primary text-ivory'
                  : 'border-primary/15 bg-white text-primary/60 hover:border-accent hover:text-accent dark:bg-secondary'
              }`}
            >
              {categoryLabel(category)}
            </button>
          ))}
        </div>

        {visibleItems.length === 0 ? (
          <div className="border border-dashed border-primary/15 bg-white/50 px-6 py-16 text-center text-sm text-primary/45 dark:bg-secondary/50">
            {t.empty}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden border border-primary/10 bg-white shadow-[0_20px_60px_rgba(23,19,15,0.05)] dark:bg-secondary"
              >
                <BeforeAfterSlider
                  beforeImage={item.before}
                  afterImage={item.after}
                  className="aspect-[4/5]"
                />
                {item.title && (
                  <div className="border-t border-primary/10 px-5 py-4">
                    <h2 className="font-serif text-xl text-primary">
                      {item.title}
                    </h2>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
