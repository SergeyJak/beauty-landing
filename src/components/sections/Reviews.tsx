'use client'

import { motion } from 'framer-motion'
import Card from '@/components/Card'
import ConversionCTA from '@/components/ConversionCTA'
import Reveal from '@/components/Reveal'
import SectionHeader from '@/components/SectionHeader'
import type { Review } from '@/types'
import { useLanguage } from '@/lib/LanguageContext'

const reviews: Review[] = [
  {
    id: '1',
    name: 'Sarah Martinez',
    title: 'Facial hair removal',
    text: 'After years of waxing and plucking, I finally have a permanent solution. My chin is completely hair-free and the results are incredible. The treatment was quick and professional.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    id: '2',
    name: 'Jessica Chen',
    title: 'Full electrolysis client',
    text: 'I was nervous before my first appointment, but the specialist was incredibly knowledgeable and put me at ease. The permanence is real—no more waxing appointments or razor bumps.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  {
    id: '3',
    name: 'Amanda Foster',
    title: 'Regular client',
    text: 'The treatment space is so clean and professional. The specialist is certified and really knows her craft. Each session brings me closer to permanent hair freedom. Highly recommend.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
  {
    id: '4',
    name: 'Rebecca Thompson',
    title: 'Underarm treatment',
    text: 'Finally permanent results after years of shaving and waxing. The cost is worth it compared to years of temporary hair removal methods. My skin has never been smoother.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=100&h=100&fit=crop',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function Reviews() {
  const { t, list } = useLanguage()
  const localizedReviews = reviews.map((review, index) => ({
    ...review,
    ...(list<Partial<Review>>('reviews.items')[index] || {}),
  }))
  const stats = list<{ number: string; label: string }>('reviews.stats')

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-accent' : 'text-primary/20'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <section id="reviews" className="bg-ivory py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t('reviews.eyebrow')}
          title={t('reviews.title')}
          description={t('reviews.description')}
          align="center"
          className="mx-auto max-w-3xl"
        />

        {/* Reviews Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {localizedReviews.map((review) => (
            <Card key={review.id} className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <motion.img
                    src={review.avatar}
                    alt={review.name}
                    className="h-14 w-14 object-cover"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <div>
                    <h3 className="font-semibold text-primary">{review.name}</h3>
                    <p className="text-sm text-primary/50">{review.title}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {renderStars(review.rating)}
              </div>

              <p className="leading-8 text-primary/68">{review.text}</p>

              <div className="mt-6 border-t border-primary/10 pt-6">
                <p className="eyebrow text-primary/35">{t('common.verifiedClient')}</p>
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Testimonial Stats */}
        <Reveal
          delay={0.25}
          className="mt-20 grid grid-cols-1 border-y border-primary/10 text-center sm:grid-cols-3"
        >
          <motion.div className="py-8" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
            <div className="mb-2 font-serif text-5xl text-accent">{stats[0]?.number}</div>
            <p className="eyebrow text-primary/45">{stats[0]?.label}</p>
          </motion.div>
          <motion.div className="border-y border-primary/10 py-8 sm:border-x sm:border-y-0" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
            <div className="mb-2 font-serif text-5xl text-accent">{stats[1]?.number}</div>
            <p className="eyebrow text-primary/45">{stats[1]?.label}</p>
          </motion.div>
          <motion.div className="py-8" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
            <div className="mb-2 font-serif text-5xl text-accent">{stats[2]?.number}</div>
            <p className="eyebrow text-primary/45">{stats[2]?.label}</p>
          </motion.div>
        </Reveal>

        <ConversionCTA
          eyebrow={t('reviews.cta.eyebrow')}
          title={t('reviews.cta.title')}
          description={t('reviews.cta.description')}
          primaryLabel={t('reviews.cta.primary')}
          secondaryLabel={t('reviews.cta.secondary')}
          secondaryHref="#contact"
        />
      </div>
    </section>
  )
}
