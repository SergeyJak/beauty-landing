import Hero from '@/components/sections/Hero'
import TrustStrip from '@/components/TrustStrip'
import ClinicalComparison from '@/components/sections/ClinicalComparison'
import Benefits from '@/components/sections/Benefits'
import HairGrowthPhases from '@/components/sections/HairGrowthPhases'
import HowItWorks from '@/components/sections/HowItWorks'
import Expertise from '@/components/sections/Expertise'
import Reviews from '@/components/sections/Reviews'
import FAQ from '@/components/sections/FAQ'
import Contact from '@/components/sections/Contact'
import FloatingButtons from '@/components/FloatingButtons'
import PageTransition from '@/components/PageTransition'
import { getEditableContent } from '@/lib/content'
import { isValidLocale } from '@/lib/i18n'

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
      <Hero
        title={editable?.heroTitle}
        description={editable?.heroDescription}
      />
      <TrustStrip />
            <Expertise />
      <ClinicalComparison />
      <Benefits />
      <HairGrowthPhases />
      <HowItWorks />
      <Reviews />
      <FAQ />
      <Contact />
      <FloatingButtons />
    </PageTransition>
  )
}
