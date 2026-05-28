'use client'

import { motion } from 'framer-motion'
import Card from '@/components/Card'
import ConversionCTA from '@/components/ConversionCTA'
import Reveal from '@/components/Reveal'
import SectionHeader from '@/components/SectionHeader'
import type { Review } from '@/types'

const reviews: Review[] = [
  {
    id: '1',
    name: 'Nina Patel',
    title: 'Monthly facial client',
    text: 'The Sculpt & Restore facial is the first treatment that made my skin look lifted without feeling stripped. I left with a real plan for the next six weeks.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    id: '2',
    name: 'Claire Rosen',
    title: 'Pre-wedding client',
    text: 'Elise mapped out my appointments before the wedding and kept everything calm. My makeup sat better, my skin was even, and nothing felt overdone.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  {
    id: '3',
    name: 'Avery Brooks',
    title: 'Creative director',
    text: 'The gloss and blowout photographed beautifully at a campaign dinner. Soft, expensive-looking shine, no stiff finish, and it held through the whole night.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
  {
    id: '4',
    name: 'Leah Morgan',
    title: 'Post-travel recovery',
    text: 'I booked lymphatic bodywork after a long-haul trip and felt noticeably less puffy the next morning. The room, pacing, and pressure were exactly right.',
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
          eyebrow="Client notes"
          title="A quieter kind of five-star experience."
          description="Clients come back for measured technique, practical aftercare, and results that feel polished without announcing the appointment."
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
          {reviews.map((review) => (
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
                <p className="eyebrow text-primary/35">Verified client</p>
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
            <div className="mb-2 font-serif text-5xl text-accent">4.9/5</div>
            <p className="eyebrow text-primary/45">Average Rating</p>
          </motion.div>
          <motion.div className="border-y border-primary/10 py-8 sm:border-x sm:border-y-0" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
            <div className="mb-2 font-serif text-5xl text-accent">1,200+</div>
            <p className="eyebrow text-primary/45">Appointments</p>
          </motion.div>
          <motion.div className="py-8" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
            <div className="mb-2 font-serif text-5xl text-accent">98%</div>
            <p className="eyebrow text-primary/45">Satisfaction Rate</p>
          </motion.div>
        </Reveal>

        <ConversionCTA
          eyebrow="Ready when you are"
          title="Request a time and we will confirm the right treatment."
          description="Use the booking form for preferred dates, sensitivity notes, and event deadlines. You will receive a confirmation before the appointment is held."
          secondaryLabel="Contact Studio"
          secondaryHref="#contact"
        />
      </div>
    </section>
  )
}
