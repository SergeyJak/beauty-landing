import Reveal from '@/components/Reveal'

interface SectionHeaderProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center' | 'split'
  light?: boolean
  className?: string
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'split',
  light = false,
  className = '',
}: SectionHeaderProps) {
  const eyebrowClass = light ? 'text-champagne' : 'text-accent'
  const titleClass = light ? 'text-parchment' : 'text-primary'
  const descriptionClass = light ? 'text-parchment/65' : 'text-primary/65'

  if (align === 'center') {
    return (
      <Reveal className={`mb-16 text-center ${className}`}>
        <p className={`eyebrow mb-5 ${eyebrowClass}`}>{eyebrow}</p>
        <h2 className={`section-heading mb-6 ${titleClass}`}>{title}</h2>
        {description && (
          <p className={`mx-auto max-w-2xl text-lg leading-8 ${descriptionClass}`}>
            {description}
          </p>
        )}
      </Reveal>
    )
  }

  if (align === 'left') {
    return (
      <Reveal className={`mb-16 ${className}`}>
        <p className={`eyebrow mb-5 ${eyebrowClass}`}>{eyebrow}</p>
        <h2 className={`section-heading mb-6 ${titleClass}`}>{title}</h2>
        {description && <p className={`max-w-2xl text-lg leading-8 ${descriptionClass}`}>{description}</p>}
      </Reveal>
    )
  }

  return (
    <Reveal className={`mb-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] ${className}`}>
      <div>
        <p className={`eyebrow mb-5 ${eyebrowClass}`}>{eyebrow}</p>
        <h2 className={`section-heading ${titleClass}`}>{title}</h2>
      </div>
      {description && (
        <p className={`max-w-2xl self-end text-lg leading-8 ${descriptionClass}`}>
          {description}
        </p>
      )}
    </Reveal>
  )
}
