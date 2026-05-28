'use client'

import { motion } from 'framer-motion'
import ConversionCTA from '@/components/ConversionCTA'
import SectionHeader from '@/components/SectionHeader'
import type { Service } from '@/types'

const services: Service[] = [
  {
    id: '01',
    title: 'Sculpt & Restore Facial',
    description: 'Double cleanse, enzyme polish, buccal-inspired facial massage, LED therapy, and a barrier-supporting mask selected after skin analysis.',
    price: '$165 - $240',
    icon: 'SR',
    duration: '75-100 min',
  },
  {
    id: '02',
    title: 'Lymphatic Bodywork',
    description: 'A slow-pressure treatment focused on fluid movement, shoulder release, and nervous-system downshifting before travel or high-stress weeks.',
    price: '$180 - $260',
    icon: 'LB',
    duration: '75-105 min',
  },
  {
    id: '03',
    title: 'Gloss & Blowout',
    description: 'Tonal refresh, bond-support conditioning, and a soft brush finish for reflective hair that still moves naturally.',
    price: '$125 - $285',
    icon: 'HG',
    duration: '75-120 min',
  },
  {
    id: '04',
    title: 'Editorial Hands & Feet',
    description: 'Detailed shaping, dry cuticle refinement, soft callus work, and a sheer, gel, or classic polish finish.',
    price: '$70 - $120',
    icon: 'EH',
    duration: '50-90 min',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
}

export default function Services() {
  return (
    <section id="services" className="bg-ivory py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Treatment menu"
          title="Treatments built around the condition of the day."
          description="Every appointment starts with a brief consultation, then adapts actives, pressure, finish, and aftercare to your skin, hair, calendar, and comfort."
          className="lg:grid-cols-[0.8fr_1.2fr]"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="border-y border-primary/10"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ x: 8, backgroundColor: 'rgba(185, 144, 88, 0.035)' }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="group grid gap-4 border-b border-primary/10 py-6 last:border-b-0 md:gap-6 md:py-8 sm:grid-cols-[auto_1fr] sm:items-start md:grid-cols-[0.25fr_0.75fr_1.3fr_0.45fr] md:items-center"
            >
              <p className="hidden font-serif text-3xl text-accent/80 transition-colors duration-500 group-hover:text-accent sm:block md:block whitespace-nowrap">{service.id}</p>
              <div>
                <p className="eyebrow mb-1 text-primary/45 sm:mb-2">{service.icon}</p>
                <h3 className="font-serif text-2xl sm:text-3xl text-primary leading-tight">{service.title}</h3>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-primary/65 sm:col-span-2 md:col-auto md:text-base md:leading-7">{service.description}</p>
              <div className="sm:col-span-2 md:col-auto md:text-right">
                <p className="font-semibold text-primary">{service.price}</p>
                <p className="mt-1 text-sm text-primary/50">{service.duration}</p>
                <a href="#booking" className="eyebrow mt-4 inline-block text-accent transition-all duration-500 hover:translate-x-1 hover:text-primary">
                  Reserve
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <ConversionCTA
          eyebrow="Not sure what to book?"
          title="Start with a consultation-led appointment."
          description="Choose the closest treatment and note your skin goals, event date, or recovery window. The studio will adjust the plan before confirming."
          secondaryLabel="Ask a Question"
          secondaryHref="mailto:hello@maisonelise.studio"
        />
      </div>
    </section>
  )
}
