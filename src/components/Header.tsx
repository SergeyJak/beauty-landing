'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useLanguage } from '@/lib/LanguageContext'
import { cn } from '@/lib/utils'
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

  useEffect(() => {
    document.body.classList.toggle('menu-open', isOpen)

    return () => document.body.classList.remove('menu-open')
  }, [isOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled ? 'h-16 lg:h-22 bg-white/95 shadow-[0_15px_60px_rgba(23,19,15,0.05)] backdrop-blur-xl' : 'h-20 lg:h-28 bg-white/95 backdrop-blur-xl'
      }`}
    >
      <a
        href="#main-content"
        className="absolute -top-full left-4 z-50 inline-block bg-primary text-ivory px-4 py-2 rounded-b text-sm font-semibold focus:top-0 transition-top"
      >
        {t('header.skipToMain')}
      </a>

      <nav className="section-container h-full" role="navigation" aria-label={t('accessibility.mainNavigation')}>
        <div className="flex h-full items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center space-x-2 md:space-x-4 group flex-shrink-0">
            <div className="flex h-10 md:h-12 w-10 md:w-12 items-center justify-center border-2 border-primary/10 transition-all group-hover:border-accent">
              <span className="font-serif text-lg md:text-2xl text-primary">E</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xs md:text-2xl font-semibold text-primary leading-tight">
                {t('brand.name')}
              </span>
              <span className="hidden md:inline text-[0.6rem] font-bold uppercase tracking-[0.2em] text-accent">Certified Electrolysis Specialist</span>
            </div>
          </Link>

          <div className="hidden xl:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-primary/80 transition-all hover:text-accent hover:-translate-y-0.5"
              >
                {t(link.key)}
              </a>
            ))}
          </div>

          <div className="hidden xl:flex items-center gap-6">
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

          <div className="flex xl:hidden items-center gap-4">
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
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 z-[100] w-full max-w-xs bg-white dark:bg-secondary shadow-[-30px_0_90px_rgba(23,19,15,0.25)] flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10 flex-shrink-0">
                <span className="font-serif text-lg text-primary">
                  {t('brand.name')}
                </span>

                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-primary/5 active:scale-95 transition-all"
                  aria-label={t('header.toggleMenu')}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M1 1l16 16M17 1L1 17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <nav className="px-6 py-3">
                <ul>
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center py-3 text-base font-semibold text-primary hover:text-accent border-b border-primary/10 transition-colors"
                      >
                        {t(link.key)}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="flex-shrink-0 px-6 pb-6 pt-4 border-t border-primary/10 space-y-4">
                <div className="flex items-center justify-between">
                  <LanguageSwitcher upward />
                  <ThemeToggle />
                </div>

                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="flex h-12 w-full items-center justify-center bg-primary text-white text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors"
                >
                  {t('header.bookNow')}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
