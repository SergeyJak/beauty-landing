import Hero from '@/components/sections/Hero'
import TrustStrip from '@/components/TrustStrip'
import Benefits from '@/components/sections/Benefits'
import HowItWorks from '@/components/sections/HowItWorks'
import TreatmentAdvice from '@/components/sections/TreatmentAdvice'
import Expertise from '@/components/sections/Expertise'
import ClientTestimonials from '@/components/sections/ClientTestimonials'
import FAQ from '@/components/sections/FAQ'
import Contact from '@/components/sections/Contact'
import FloatingButtons from '@/components/FloatingButtons'
import PageTransition from '@/components/PageTransition'
import { getEditableContent } from '@/lib/content'
import { isValidLocale } from '@/lib/i18n'
import StructuredData from '@/components/StructuredData'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: Props) {
  const { locale } = await params
  const editable = isValidLocale(locale)
    ? await getEditableContent(locale)
    : null

  return (
    <PageTransition>
      {isValidLocale(locale) && <StructuredData locale={locale} />}
      <Hero
        title={editable?.heroTitle}
        description={editable?.heroDescription}
      />
      <TrustStrip />
      <Expertise />
      <Benefits />
      <HowItWorks />
      <TreatmentAdvice />
      {isValidLocale(locale) && <ClientTestimonials locale={locale} />}
      <FAQ />
      <Contact />
      <FloatingButtons />
    </PageTransition>
  )
}
