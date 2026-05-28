'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ActionLink from '@/components/ActionLink'
import Button from '@/components/Button'
import { SelectField, TextField, type FieldChangeEvent } from '@/components/FormField'
import Reveal from '@/components/Reveal'
import SectionHeader from '@/components/SectionHeader'
import type { BookingRequest } from '@/types'

const services = [
  'Sculpt & Restore Facial',
  'Lymphatic Bodywork',
  'Gloss & Blowout',
  'Editorial Hands & Feet',
  'Event Preparation',
]

export default function BookingForm() {
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
      setError('Please enter your name')
      return false
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number')
      return false
    }
    if (!formData.service) {
      setError('Please select a service')
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
        throw new Error(data.error || 'Failed to submit booking')
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
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
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
          eyebrow="Reserve"
          title="Request a private appointment."
          description="Share your preferred treatment, timing, and any skin sensitivities or event deadlines. The studio will confirm availability and preparation notes."
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
              <p className="font-semibold">Booking submitted successfully.</p>
              <p className="text-sm">We'll contact you soon to confirm your appointment.</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 border border-red-200 bg-red-50 p-4 text-red-800"
            >
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <TextField
              label="Full Name"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Mara Chen"
              required
            />

            <TextField
              label="Phone Number"
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (212) 731-8426"
              required
            />

            <TextField
              label="Email Address"
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              placeholder="mara@example.com"
            />

            <SelectField
              label="Select Service"
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              options={services}
              placeholder="Select preferred treatment..."
              required
            />

            <TextField
              label="Additional Notes"
              id="comment"
              name="comment"
              value={formData.comment || ''}
              onChange={handleChange}
              placeholder="Example: sensitive skin, pregnancy-safe products, wedding makeup timeline, or preferred appointment window."
              rows={5}
              multiline
            />

            <div className="border border-primary/10 bg-soft-beige p-4 text-sm text-primary/60">
              <p>
                By submitting this form, you agree to our{' '}
                <a href="#" className="text-accent hover:underline">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="#" className="text-accent hover:underline">
                  Terms of Service
                </a>
                .
              </p>
            </div>

            <Button type="submit" size="lg" disabled={isLoading} className="min-h-14 w-full">
              {isLoading ? 'Submitting...' : 'Request Appointment'}
            </Button>
          </form>

          <div className="mt-8 border-t border-primary/10 pt-8 text-center">
            <p className="mb-4 text-sm text-primary/60">Prefer to contact us directly?</p>
            <div className="flex flex-wrap justify-center gap-4">
              <ActionLink
                href="https://wa.me/12127318426?text=Hello%20Maison%20Elise%2C%20I%20would%20like%20to%20request%20an%20appointment"
                target="_blank"
                rel="noopener noreferrer"
                compact
                className="flex-1 sm:flex-none sm:px-6"
              >
                WhatsApp
              </ActionLink>
              <ActionLink
                href="https://t.me/maisoneliseskin"
                target="_blank"
                rel="noopener noreferrer"
                compact
                className="flex-1 sm:flex-none sm:px-6"
              >
                Telegram
              </ActionLink>
              <ActionLink
                href="tel:+12127318426"
                compact
                className="flex-1 sm:flex-none sm:px-6"
              >
                Call Us
              </ActionLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
