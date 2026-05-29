'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ActionLink from '@/components/ActionLink'
import Button from '@/components/Button'
import { SelectField, TextField, type FieldChangeEvent } from '@/components/FormField'
import Reveal from '@/components/Reveal'
import SectionHeader from '@/components/SectionHeader'
import type { BookingRequest } from '@/types'
import { useLanguage } from '@/lib/LanguageContext'

export default function BookingForm() {
  const { t, list } = useLanguage()
  const services = list<string>('booking.services')
  const [formData, setFormData] = useState<BookingRequest>({
    name: '',
    phone: '',
    service: '',
    email: '',
    comment: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: FieldChangeEvent) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError(t('booking.validation.name'))
      return false
    }
    if (!formData.phone.trim()) {
      setError(t('booking.validation.phone'))
      return false
    }
    if (!formData.service) {
      setError(t('booking.validation.service'))
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t('booking.validation.submit'))
      }

      console.log('Booking successful:', data)
      setSuccess(true)
      setFormData({
        name: '',
        phone: '',
        service: '',
        email: '',
        comment: '',
      })

      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('booking.validation.generic')
      console.error('Booking error:', errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="booking" className="bg-soft-beige py-16 md:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t('booking.eyebrow')}
          title={t('booking.title')}
          description={t('booking.description')}
          align="center"
          className="mb-12"
        />

        <Reveal
          delay={0.1}
          className="-mx-4 border-y border-primary/10 bg-ivory p-4 shadow-[0_30px_90px_rgba(23,19,15,0.08)] sm:mx-0 sm:border md:p-12"
        >
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 border border-green-200 bg-green-50 p-4 text-green-800"
            >
              <p className="font-semibold">{t('booking.successTitle')}</p>
              <p className="text-sm">{t('booking.successDescription')}</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 border border-red-200 bg-red-50 p-4 text-red-800"
            >
              <p className="font-semibold">{t('booking.errorTitle')}</p>
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <TextField
              label={t('booking.form.name')}
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Mara Chen"
              required
            />

            <TextField
              label={t('booking.form.phone')}
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (212) 731-8426"
              required
            />

            <TextField
              label={t('booking.form.email')}
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              placeholder="mara@example.com"
            />

            <SelectField
              label={t('booking.form.service')}
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              options={services}
              placeholder={t('booking.form.servicePlaceholder')}
              required
            />

            <TextField
              label={t('booking.form.comment')}
              id="comment"
              name="comment"
              value={formData.comment || ''}
              onChange={handleChange}
              placeholder={t('booking.form.commentPlaceholder')}
              rows={5}
              multiline
            />

            <div className="border border-primary/10 bg-soft-beige p-4 text-sm text-primary/60">
              <p>
                {t('booking.form.consentPrefix')}{' '}
                <a href="#" className="text-accent hover:underline">
                  {t('common.privacyPolicy')}
                </a>{' '}
                {t('booking.form.consentAnd')}{' '}
                <a href="#" className="text-accent hover:underline">
                  {t('common.termsOfService')}
                </a>
                .
              </p>
            </div>

            <Button type="submit" size="lg" disabled={isLoading} className="min-h-14 w-full">
              {isLoading ? t('booking.form.submitting') : t('booking.form.submit')}
            </Button>
          </form>

          <div className="mt-8 border-t border-primary/10 pt-8 text-center">
            <p className="mb-4 text-sm text-primary/60">{t('booking.form.direct')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <ActionLink
                href="https://wa.me/12127318426?text=Hello%20Maison%20Elise%2C%20I%20would%20like%20to%20request%20an%20appointment"
                target="_blank"
                rel="noopener noreferrer"
                compact
                className="flex-1 sm:flex-none sm:px-6"
              >
                {t('common.whatsApp')}
              </ActionLink>
              <ActionLink
                href="https://t.me/maisoneliseskin"
                target="_blank"
                rel="noopener noreferrer"
                compact
                className="flex-1 sm:flex-none sm:px-6"
              >
                {t('common.telegram')}
              </ActionLink>
              <ActionLink
                href="tel:+12127318426"
                compact
                className="flex-1 sm:flex-none sm:px-6"
              >
                {t('common.callUs')}
              </ActionLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
