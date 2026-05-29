'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useLanguage } from '@/lib/LanguageContext'

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-ivory/95 shadow-[0_16px_45px_rgba(23,19,15,0.08)]' : 'bg-ivory/72 backdrop-blur-md'
      }`}
    >
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="absolute -top-full left-4 z-50 inline-block bg-primary text-ivory px-4 py-2 rounded-b text-sm font-semibold focus:top-0 transition-top"
      >
        {t('header.skipToMain')}
      </a>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label={t('accessibility.mainNavigation')}>
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link href={`/${locale}`} className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center border border-accent/70 md:h-10 md:w-10">
              <span className="font-serif text-lg text-primary md:text-xl">E</span>
            </div>
            <span className="hidden font-serif text-xl text-primary sm:inline">
              {t('brand.name')}
            </span>
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="eyebrow text-primary/70 transition-colors hover:text-primary"
              >
                {t(link.key)}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher />
            <ThemeToggle />
            <a
              href="#booking"
              className="premium-sheen bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ivory shadow-[0_12px_32px_rgba(23,19,15,0.16)] transition-colors hover:bg-clay"
            >
              {t('header.bookNow')}
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="touch-manipulation -mr-3 p-3 transition-colors hover:bg-secondary focus-visible:rounded-lg"
              aria-label={t('header.toggleMenu')}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-primary/10 pb-2 md:hidden"
            role="navigation"
          >
            <div className="grid grid-cols-2 gap-2 px-2 py-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block min-h-12 border border-primary/10 px-3 py-3 text-center text-sm font-medium text-primary transition-colors hover:border-accent hover:text-accent"
                  onClick={() => setIsOpen(false)}
                >
                  {t(link.key)}
                </a>
              ))}
              <a
                href="#booking"
                className="col-span-2 mt-1 block min-h-12 bg-primary px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-clay"
                onClick={() => setIsOpen(false)}
              >
                {t('header.bookNow')}
              </a>
              <div className="col-span-2 mt-3 border-t border-primary/10 pt-4">
                <p className="eyebrow mb-3 text-center text-primary/45">
                  {t('languageSwitcher.label')}
                </p>
                <LanguageSwitcher variant="inline" />
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  )
}
