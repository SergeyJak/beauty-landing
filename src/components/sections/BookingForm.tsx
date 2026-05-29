'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import ActionLink from '@/components/ActionLink'
import Button from '@/components/Button'
import { SelectField, TextField, type FieldChangeEvent } from '@/components/FormField'
import Reveal from '@/components/Reveal'
import SectionHeader from '@/components/SectionHeader'
import type { BookingRequest } from '@/types'
import { useLanguage } from '@/lib/LanguageContext'
import { isValidEmail, isValidPhone } from '@/lib/utils'

export default function BookingForm() {
  const { t, list, locale } = useLanguage()
  const services = list<string>('booking.services')
  
  const [formData, setFormData] = useState<BookingRequest & { honeypot?: string }>({
    name: '',
    phone: '',
    service: '',
    email: '',
    comment: '',
    honeypot: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: FieldChangeEvent) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = t('booking.validation.name')
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t('booking.validation.phone')
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = t('booking.validation.phoneInvalid') || 'Invalid phone format'
    }
    
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = t('booking.validation.emailInvalid') || 'Invalid email format'
    }
    
    if (!formData.service) {
      newErrors.service = t('booking.validation.service')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error(t('booking.errorTitle'))
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, locale }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t('booking.validation.submit'))
      }

      toast.success(t('booking.successTitle'), {
        description: t('booking.successDescription'),
      })
      
      setFormData({
        name: '',
        phone: '',
        service: '',
        email: '',
        comment: '',
        honeypot: '',
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('booking.validation.generic')
      toast.error(t('booking.errorTitle'), {
        description: errorMessage,
      })
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
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot */}
            <div className="hidden">
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={(e) => setFormData(prev => ({ ...prev, honeypot: e.target.value }))}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <TextField
              label={t('booking.form.name')}
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('booking.form.placeholders.name')}
              required
              error={errors.name}
              aria-required="true"
            />

            <TextField
              label={t('booking.form.phone')}
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t('booking.form.placeholders.phone')}
              required
              error={errors.phone}
              aria-required="true"
            />

            <TextField
              label={t('booking.form.email')}
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              placeholder={t('booking.form.placeholders.email')}
              error={errors.email}
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
              error={errors.service}
              aria-required="true"
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

            <div className="border border-primary/10 bg-soft-beige p-4 text-xs text-primary/60">
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

            <Button 
              type="submit" 
              size="lg" 
              isLoading={isLoading} 
              className="min-h-14 w-full"
            >
              {t('booking.form.submit')}
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
