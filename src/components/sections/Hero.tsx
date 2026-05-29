'use client'

import { motion } from 'framer-motion'
import Button from '@/components/Button'
import OptimizedImage from '@/components/OptimizedImage'
import { useT } from '@/lib/LanguageContext'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=2100&h=1300&fit=crop&q=80'
const SIDECARD_IMAGE =
  'https://images.unsplash.com/photo-1576091160599-112ba8d25d1d?w=900&h=1200&fit=crop&q=80'

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
    <section className="relative min-h-[94vh] overflow-hidden bg-ivory pt-20 md:min-h-screen md:pt-24">
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
        className="relative z-10 grid min-h-[calc(94vh-5rem)] max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-24 sm:px-6 md:min-h-[calc(100vh-6rem)] md:pb-16 lg:mx-auto lg:grid-cols-[1.12fr_0.88fr] lg:px-8"
      >
        <div className="max-w-4xl">
          <motion.div variants={itemVariants} className="mb-8 flex items-center gap-4">
            <span className="eyebrow text-accent">{t('hero.eyebrow')}</span>
            <span className="reveal-line h-px w-24 bg-accent/35" />
          </motion.div>

          <motion.h1 variants={itemVariants} className="hero-heading mb-8 max-w-4xl">
            {t('hero.title')}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mb-10 max-w-2xl text-base leading-8 text-primary/72 md:text-lg md:leading-9"
          >
            {t('hero.description')}
          </motion.p>

          <motion.div variants={itemVariants} className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <a href="#booking" className="w-full sm:w-auto sm:min-w-[14rem]">
              <Button size="lg" className="min-h-14 w-full shadow-[0_22px_55px_rgba(23,19,15,0.22)]">
                {t('hero.primaryCTA')}
              </Button>
            </a>
            <a href="#why-electrolysis" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="min-h-14 w-full bg-ivory/80 backdrop-blur-sm">
                {t('hero.secondaryCTA')}
              </Button>
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-12 flex flex-wrap gap-x-5 gap-y-2 text-sm text-primary/58">
            <span className="font-medium text-primary/75">{t('hero.included')}</span>
            <span className="hidden text-accent/70 sm:inline" aria-hidden="true">
              /
            </span>
            <span>{t('hero.location')}</span>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid max-w-2xl grid-cols-3 border-y border-primary/10 bg-ivory/50 py-5 backdrop-blur-sm dark:bg-ivory/45"
          >
            <div>
              <p className="font-serif text-3xl text-primary md:text-4xl">{t('hero.stats.experienceNumber')}</p>
              <p className="eyebrow mt-1 text-primary/50">{t('hero.stats.experience')}</p>
            </div>
            <div className="border-x border-primary/10 px-4 md:px-6">
              <p className="font-serif text-3xl text-primary md:text-4xl">{t('hero.stats.approvedNumber')}</p>
              <p className="eyebrow mt-1 text-primary/50">{t('hero.stats.approved')}</p>
            </div>
            <div className="pl-4 md:pl-6">
              <p className="font-serif text-3xl text-primary md:text-4xl">{t('hero.stats.permanentNumber')}</p>
              <p className="eyebrow mt-1 text-primary/50">{t('hero.stats.permanent')}</p>
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
                src={SIDECARD_IMAGE}
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
