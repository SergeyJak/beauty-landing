'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ConversionCTA from '@/components/ConversionCTA'
import SectionHeader from '@/components/SectionHeader'
import type { BeforeAfterImage } from '@/types'
import { useLanguage } from '@/lib/LanguageContext'

const galleryImages: BeforeAfterImage[] = [
  {
    id: '1',
    before: 'https://images.unsplash.com/photo-1559056199-641a0ac8b8d5?w=400&h=400&fit=crop',
    after: 'https://images.unsplash.com/photo-1559056199-641a0ac8b8d5?w=400&h=400&fit=crop',
    title: 'Facial Hair Removal',
    category: 'Chin, upper lip, cheeks',
  },
  {
    id: '2',
    before: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    after: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    title: 'Underarm Hair Removal',
    category: 'Permanent smoothness',
  },
  {
    id: '3',
    before: 'https://images.unsplash.com/photo-1521575215127-fa158febef6f?w=400&h=400&fit=crop',
    after: 'https://images.unsplash.com/photo-1521575215127-fa158febef6f?w=400&h=400&fit=crop',
    title: 'Bikini Line Treatment',
    category: 'Complete hair removal',
  },
  {
    id: '4',
    before: 'https://images.unsplash.com/photo-1573496359142-b8d1ff25e828?w=400&h=400&fit=crop',
    after: 'https://images.unsplash.com/photo-1573496359142-b8d1ff25e828?w=400&h=400&fit=crop',
    title: 'Full Leg Electrolysis',
    category: 'Permanent leg smoothness',
  },
]

export default function BeforeAfter() {
  const { t, list } = useLanguage()
  const [selectedImage, setSelectedImage] = useState<BeforeAfterImage | null>(null)
  const localizedImages = galleryImages.map((image, index) => ({
    ...image,
    ...(list<Partial<BeforeAfterImage>>('results.gallery')[index] || {}),
  }))

  return (
    <section id="gallery" className="bg-ink py-20 text-parchment md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t('results.eyebrow')}
          title={t('results.title')}
          description={t('results.description')}
          light
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4"
        >
          {localizedImages.map((image) => (
            <motion.button
              key={image.id}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setSelectedImage(image)}
              className="premium-sheen group relative cursor-pointer overflow-hidden border border-parchment/12 text-left focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <div className="relative aspect-[4/5] bg-ink">
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={image.before}
                    alt={`${image.title} - Before`}
                    className="h-full w-full object-cover grayscale-[0.15] transition duration-700 ease-smooth group-hover:scale-[1.025]"
                  />
                </div>

                <motion.div
                  initial={{ x: '100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 overflow-hidden"
                >
                  <img
                    src={image.after}
                    alt={`${image.title} - After`}
                    className="h-full w-full object-cover"
                  />
                </motion.div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-5 pt-16 transition-transform duration-500 ease-smooth group-hover:-translate-y-1">
                  <p className="font-serif text-2xl text-parchment">{image.title}</p>
                  <p className="eyebrow mt-2 text-champagne">{image.category}</p>
                </div>

                <div className="absolute right-3 top-3 border border-parchment/30 bg-ink/55 px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-parchment backdrop-blur">
                  {t('common.beforeAfter')}
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        <ConversionCTA
          eyebrow={t('results.cta.eyebrow')}
          title={t('results.cta.title')}
          description={t('results.cta.description')}
          primaryLabel={t('results.cta.primary')}
          secondaryLabel={t('results.cta.secondary')}
          secondaryHref="#why-electrolysis"
          dark
        />

        {/* Modal */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 18 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0, y: 18 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden bg-ivory shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-primary/10 p-6">
                <h3 className="text-2xl font-semibold text-primary">{selectedImage.title}</h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 transition-colors hover:bg-soft-beige"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="eyebrow mb-3 text-primary/50">{t('common.before')}</p>
                    <img
                      src={selectedImage.before}
                      alt={t('common.before')}
                      className="h-auto w-full"
                    />
                  </div>
                  <div>
                    <p className="eyebrow mb-3 text-primary/50">{t('common.after')}</p>
                    <img
                      src={selectedImage.after}
                      alt={t('common.after')}
                      className="h-auto w-full"
                    />
                  </div>
                </div>
                <div className="border border-primary/10 bg-soft-beige p-4">
                  <p className="text-primary/65">
                    {t('common.category')}: <span className="font-semibold text-primary">{selectedImage.category}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
