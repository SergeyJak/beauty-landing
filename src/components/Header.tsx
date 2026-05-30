'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useLanguage } from '@/lib/LanguageContext'
import { cn } from '@/lib/utils'
import Button from '@/components/Button'
import { SOCIAL_LINKS } from '@/lib/constants'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { locale, t } = useLanguage()

  const navLinks = [
    { key: 'header.navigation.why', href: '#why-electrolysis' },
    { key: 'header.navigation.benefits', href: '#benefits' },
    { key: 'header.navigation.howWorks', href: '#how-it-works' },
    { key: 'header.navigation.results', href: '#gallery' },
    { key: 'header.navigation.faq', href: '#faq' },
    { key: 'header.navigation.contact', href: '#contact' },
  ]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled ? 'h-22 bg-white/95 shadow-[0_15px_60px_rgba(23,19,15,0.05)] backdrop-blur-xl' : 'h-28 bg-transparent'
      }`}
    >
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="absolute -top-full left-4 z-50 inline-block bg-primary text-ivory px-4 py-2 rounded-b text-sm font-semibold focus:top-0 transition-top"
      >
        {t('header.skipToMain')}
      </a>

      <nav className="section-container h-full" role="navigation" aria-label={t('accessibility.mainNavigation')}>
        <div className="flex h-full items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center space-x-4 group">
            <div className="flex h-12 w-12 items-center justify-center border-2 border-primary/10 transition-all group-hover:border-accent">
              <span className="font-serif text-2xl text-primary md:text-2xl">E</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-semibold text-primary leading-tight">
                {t('brand.name')}
              </span>
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-accent">Certified Electrolysis Specialist</span>
            </div>
          </Link>

          <div className="hidden items-center space-x-10 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-primary/60 transition-all hover:text-accent hover:-translate-y-0.5"
              >
                {t(link.key)}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-6 lg:flex">
            <LanguageSwitcher />
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('header.bookNow')}
              className="premium-sheen relative h-14 bg-primary px-8 flex items-center justify-center text-[0.7rem] font-bold uppercase tracking-[0.2em] text-ivory shadow-[0_20px_50px_rgba(23,19,15,0.15)] transition-all hover:bg-clay hover:-translate-y-1"
            >
              {t('header.bookNow')}
            </a>
          </div>

          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={toggleMenu}
              className="group flex h-14 w-14 flex-col items-center justify-center gap-1.5 transition-all hover:bg-primary/5 active:scale-95"
              aria-label={t('header.toggleMenu')}
              aria-expanded={isOpen}
            >
              <div className={cn("h-0.5 w-6 bg-primary transition-all duration-500", isOpen ? "translate-y-2 rotate-45" : "")} />
              <div className={cn("h-0.5 w-6 bg-primary transition-all duration-500", isOpen ? "opacity-0" : "")} />
              <div className={cn("h-0.5 w-6 bg-primary transition-all duration-500", isOpen ? "-translate-y-2 -rotate-45" : "")} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 z-[101] w-full max-w-sm bg-white shadow-[-30px_0_90px_rgba(23,19,15,0.1)] md:max-w-md"
              >
                <div className="flex flex-col h-full p-8 pt-28">
                  <nav className="flex-1">
                    <ul className="space-y-6">
                      {navLinks.map((link, index) => (
                        <motion.li
                          key={link.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <a
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="font-serif text-4xl text-primary hover:text-accent transition-colors"
                          >
                            {t(link.key)}
                          </a>
                        </motion.li>
                      ))}
                    </ul>
                  </nav>
                  
                  <div className="mt-auto pt-10 border-t border-primary/10">
                    <div className="mb-8">
                      <p className="eyebrow mb-4 opacity-40">{t('languageSwitcher.label')}</p>
                      <LanguageSwitcher variant="inline" />
                    </div>
                    <div className="flex items-center justify-between mb-8">
                      <ThemeToggle />
                    </div>
                    <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                      <Button size="lg" className="h-18 w-full">{t('header.bookNow')}</Button>
                    </a>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
