'use client'

import ActionLink from '@/components/ActionLink'
import Reveal from '@/components/Reveal'
import { SOCIAL_LINKS } from '@/lib/constants'
import { useT } from '@/lib/LanguageContext'

interface ConversionCTAProps {
  eyebrow: string
  title: string
  description: string
  primaryLabel?: string
  secondaryLabel?: string
  secondaryHref?: string
  dark?: boolean
}

export default function ConversionCTA({
  eyebrow,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  secondaryHref,
  dark = false,
}: ConversionCTAProps) {
  const t = useT()
  const shellClass = dark
    ? 'border-parchment/15 bg-parchment/[0.04] text-parchment'
    : 'border-primary/10 bg-soft-beige text-primary'
  const copyClass = dark ? 'text-parchment/62' : 'text-primary/62'
  const primaryClass = dark
    ? 'border-champagne/45 bg-champagne text-ink hover:bg-parchment hover:text-ink'
    : 'border-primary bg-primary text-ivory hover:bg-clay hover:text-ivory'

  return (
    <Reveal
      delay={0.12}
      className={`mt-12 grid gap-6 border p-5 sm:p-6 md:grid-cols-[1fr_auto] md:items-center ${shellClass}`}
    >
      <div>
        <p className="eyebrow mb-3 text-accent">{eyebrow}</p>
        <h3 className="font-serif text-3xl leading-tight md:text-4xl">{title}</h3>
        <p className={`mt-3 max-w-2xl leading-7 ${copyClass}`}>{description}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
        <ActionLink href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className={`premium-sheen min-h-12 items-center ${primaryClass}`}>
          {primaryLabel || t('hero.primaryCTA')}
        </ActionLink>
        {secondaryLabel && secondaryHref && (
          <ActionLink
            href={secondaryHref}
            className={dark ? 'border-parchment/25 text-parchment hover:bg-parchment hover:text-ink' : ''}
          >
            {secondaryLabel}
          </ActionLink>
        )}
      </div>
    </Reveal>
  )
}
