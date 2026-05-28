'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ThemeToggle from '@/components/ThemeToggle'

const navLinks = [
  { name: 'Services', href: '#services' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Reviews', href: '#reviews' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Contact', href: '#contact' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

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
        Skip to main content
      </a>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center border border-accent/70 md:h-10 md:w-10">
              <span className="font-serif text-lg text-primary md:text-xl">M</span>
            </div>
            <span className="hidden font-serif text-xl text-primary sm:inline">
              Maison Elise
            </span>
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="eyebrow text-primary/70 transition-colors hover:text-primary"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <a
              href="#booking"
              className="bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-clay"
            >
              Book Now
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="touch-manipulation -mr-3 p-3 transition-colors hover:bg-secondary focus-visible:rounded-lg"
              aria-label="Toggle navigation menu"
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-primary/10 pb-2 md:hidden"
          >
            <div className="grid grid-cols-2 gap-2 px-2 py-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block min-h-12 border border-primary/10 px-3 py-3 text-center text-sm font-medium text-primary transition-colors hover:border-accent hover:text-accent"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#booking"
                className="col-span-2 mt-1 block min-h-12 bg-primary px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-clay"
                onClick={() => setIsOpen(false)}
              >
                Book Now
              </a>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  )
}
