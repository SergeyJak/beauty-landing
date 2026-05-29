'use client'

import { motion } from 'framer-motion'
import { Check, Shield, GraduationCap, Microscope } from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'
import Card from '@/components/Card'
import { useLanguage } from '@/lib/LanguageContext'

export default function Expertise() {
  const { t } = useLanguage()

  const expertiseItems = [
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: t('expertise.certified.title') || 'Certified Electrologist',
      description: t('expertise.certified.description') || 'Trained and certified by international medical-grade electrolysis standards.',
    },
    {
      icon: <Microscope className="h-6 w-6" />,
      title: t('expertise.hygiene.title') || 'Medical Hygiene',
      description: t('expertise.hygiene.description') || 'Strict sterilization protocols using medical-grade equipment for every patient.',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: t('expertise.experience.title') || 'Clinical Experience',
      description: t('expertise.experience.description') || 'Over 15 years specializing exclusively in permanent hair removal.',
    },
    {
      icon: <Check className="h-6 w-6" />,
      title: t('expertise.consultation.title') || 'Expert Consultation',
      description: t('expertise.consultation.description') || 'In-depth skin and hair analysis to create a personalized treatment plan.',
    },
  ]

  return (
    <section className="bg-ivory py-20 md:py-32 overflow-hidden">
      <div className="section-container">
        <SectionHeader
          eyebrow={t('expertise.eyebrow') || 'Our Expertise'}
          title={t('expertise.title') || 'Professional Excellence in Permanent Hair Removal'}
          description={t('expertise.description') || 'We combine clinical precision with a patient-first approach to deliver the highest standard of electrolysis care.'}
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {expertiseItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Card className="h-full border-none bg-soft-beige/50 p-8 hover:bg-white hover:shadow-xl transition-all duration-500">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-sm bg-accent/10 text-accent">
                  {item.icon}
                </div>
                <h3 className="mb-4 font-serif text-xl font-bold text-primary tracking-tight">
                  {item.title}
                </h3>
                <p className="body-small text-primary/60 leading-relaxed">
                  {item.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 relative p-8 md:p-16 border border-primary/5 bg-white shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="eyebrow text-accent mb-4 block">Medical Standards</span>
              <h3 className="section-heading text-4xl mb-6">Uncompromising Hygiene Protocols</h3>
              <p className="body-base text-primary/70 mb-8 leading-relaxed">
                Your safety is our absolute priority. We adhere to the highest clinical hygiene standards, ensuring a sterile and safe environment for every session.
              </p>
              <ul className="space-y-4">
                {[
                  'Single-use sterile disposable probes',
                  'Medical-grade sterilization of all tools',
                  'Clinical environment following RKI guidelines',
                  'Regular professional hygiene audits',
                ].map((point, i) => (
                  <li key={i} className="flex items-center gap-3 body-small font-semibold text-primary/80">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm grayscale-[0.5] hover:grayscale-0 transition-all duration-700">
              <img 
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80" 
                alt="Medical Equipment" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
