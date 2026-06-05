'use client'

import { motion } from 'framer-motion'
import Button from '@/components/Button'
import OptimizedImage from '@/components/OptimizedImage'
import { SOCIAL_LINKS } from '@/lib/constants'
import { useT } from '@/lib/LanguageContext'
import specialistPhoto from '@/components/foto/340949596_3542884339364963_3036902857413467716_n.jpg'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=2100&h=1300&fit=crop&q=80'

export default function Hero() {
  const t = useT()
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <section className="relative min-h-[calc(94vh-7rem)] overflow-hidden bg-ivory pt-4 md:min-h-[calc(100vh-7rem)] md:pt-5">
      <div className="absolute inset-0 z-0">
        <OptimizedImage
          src={HERO_IMAGE}
          alt={t('hero.sidecard.imageAlt')}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center motion-safe:animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.92)_40%,rgba(255,255,255,0.3)_70%,rgba(45,42,40,0.15)_100%)] dark:bg-[linear-gradient(90deg,rgba(20,19,18,0.98)_0%,rgba(20,19,18,0.94)_40%,rgba(20,19,18,0.36)_72%,rgba(45,42,40,0.42)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ivory via-ivory/60 to-transparent dark:from-ivory dark:via-ivory/58" />
        <div className="absolute right-[8%] top-28 hidden h-[68%] w-px bg-accent/35 lg:block" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 grid min-h-[calc(94vh-9rem)] max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-24 sm:px-6 md:min-h-[calc(100vh-11rem)] md:pb-16 lg:mx-auto lg:grid-cols-[1.12fr_0.88fr] lg:px-8"
      >
        <div className="max-w-4xl">
          <motion.div variants={itemVariants} className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-accent/60" />
            <span className="eyebrow text-accent">{t('hero.eyebrow')}</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="hero-heading mb-6 max-w-4xl tracking-tighter">
            {t('hero.title')}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mb-8 max-w-2xl text-base leading-relaxed text-primary/80 md:text-lg md:leading-relaxed"
          >
            {t('hero.description')}
          </motion.p>

          <motion.div variants={itemVariants} className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-stretch">
            <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="group w-full sm:w-auto sm:min-w-[16rem]">
              <button className="relative flex h-12 w-full items-center justify-center overflow-hidden border border-accent/60 bg-transparent px-7 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-primary transition-all hover:border-accent hover:shadow-[0_8px_30px_rgba(172,145,110,0.25)]">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative z-10 flex items-center">
                  {t('hero.primaryCTA')}
                  <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </a>
            <a href="#contact" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="h-12 w-full border-primary/20 bg-ivory/40 backdrop-blur-md hover:border-primary/40">
                {t('hero.secondaryCTA')}
              </Button>
            </a>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-primary/10 pt-8"
          >
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-widest text-primary/60">{t('hero.included')}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-widest text-primary/60">{t('hero.location')}</span>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid max-w-2xl grid-cols-3 border-y border-primary/10 bg-ivory/50 py-5 backdrop-blur-sm dark:bg-ivory/45"
          >
            <div>
              <p className="font-serif text-3xl font-light tracking-tight text-accent">{t('hero.stats.experienceNumber')}</p>
              <p className="mt-1 text-[0.55rem] font-bold uppercase tracking-[0.25em] text-primary/35">{t('hero.stats.experience')}</p>
            </div>
            <div className="border-x border-primary/10 px-4 md:px-6">
              <p className="font-serif text-3xl font-light tracking-tight text-accent">{t('hero.stats.approvedNumber')}</p>
              <p className="mt-1 text-[0.55rem] font-bold uppercase tracking-[0.25em] text-primary/35">{t('hero.stats.approved')}</p>
            </div>
            <div className="pl-4 md:pl-6">
              <p className="font-serif text-3xl font-light tracking-tight text-accent">{t('hero.stats.permanentNumber')}</p>
              <p className="mt-1 text-[0.55rem] font-bold uppercase tracking-[0.25em] text-primary/35">{t('hero.stats.permanent')}</p>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="hidden lg:block">
          <div className="premium-sheen relative ml-auto max-w-sm border border-ivory/70 bg-ivory/78 p-4 shadow-[0_35px_120px_rgba(45,42,40,0.24)] backdrop-blur">
            <div className="absolute -left-16 top-12 border border-accent/35 bg-ivory/86 px-5 py-4 shadow-[0_18px_50px_rgba(45,42,40,0.14)] backdrop-blur">
              <p className="eyebrow text-accent">{t('hero.sidecard.eyebrow')}</p>
              <p className="mt-2 font-serif text-3xl text-primary">{t('hero.sidecard.title')}</p>
            </div>
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <OptimizedImage
                src={specialistPhoto}
                alt={t('hero.sidecard.imageAlt')}
                fill
                sizes="(max-width: 1024px) 0vw, 400px"
                className="object-cover"
              />
            </div>
            <div className="flex items-center justify-between px-2 pt-4">
              <p className="eyebrow text-primary/60">{t('hero.sidecard.location')}</p>
              <p className="text-sm text-primary/70">{t('hero.sidecard.specialist')}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
