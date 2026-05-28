'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-ink py-16 text-parchment md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center border border-accent">
                <span className="font-serif text-xl text-champagne">M</span>
              </div>
              <span className="font-serif text-xl">Maison Elise</span>
            </div>
            <p className="text-sm leading-7 text-parchment/55">
              Tailored facials, bodywork, gloss treatments, and event beauty in a private Flatiron studio.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="eyebrow mb-4 text-champagne">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-parchment/55">
              <li>
                <a href="#services" className="transition-colors hover:text-champagne">
                  Services
                </a>
              </li>
              <li>
                <a href="#gallery" className="transition-colors hover:text-champagne">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#reviews" className="transition-colors hover:text-champagne">
                  Reviews
                </a>
              </li>
              <li>
                <a href="#faq" className="transition-colors hover:text-champagne">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="eyebrow mb-4 text-champagne">
              Services
            </h3>
            <ul className="space-y-2 text-sm text-parchment/55">
              <li>
                <a href="#services" className="transition-colors hover:text-champagne">
                  Sculpt & Restore Facial
                </a>
              </li>
              <li>
                <a href="#services" className="transition-colors hover:text-champagne">
                  Lymphatic Bodywork
                </a>
              </li>
              <li>
                <a href="#services" className="transition-colors hover:text-champagne">
                  Gloss & Blowout
                </a>
              </li>
              <li>
                <a href="#services" className="transition-colors hover:text-champagne">
                  Editorial Hands & Feet
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="eyebrow mb-4 text-champagne">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center border border-parchment/15 bg-white/5 transition-colors hover:bg-accent"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                  <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.88 1.44 1.44 0 010 2.88z" />
                </svg>
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center border border-parchment/15 bg-white/5 transition-colors hover:bg-accent"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center border border-parchment/15 bg-white/5 transition-colors hover:bg-accent"
                aria-label="Pinterest"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.66 10.66 0 01-7-2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between text-sm text-parchment/45 md:flex-row">
            <p>&copy; {currentYear} Maison Elise Skin Studio. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="transition-colors hover:text-champagne">
                Privacy Policy
              </a>
              <a href="#" className="transition-colors hover:text-champagne">
                Terms of Service
              </a>
              <a href="#" className="transition-colors hover:text-champagne">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
