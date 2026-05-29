import Hero from '@/components/sections/Hero'
import TrustStrip from '@/components/TrustStrip'
import ClinicalComparison from '@/components/sections/ClinicalComparison'
import Benefits from '@/components/sections/Benefits'
import HairGrowthPhases from '@/components/sections/HairGrowthPhases'
import HowItWorks from '@/components/sections/HowItWorks'
import BeforeAfter from '@/components/sections/BeforeAfter'
import Expertise from '@/components/sections/Expertise'
import Reviews from '@/components/sections/Reviews'
import FAQ from '@/components/sections/FAQ'
import Contact from '@/components/sections/Contact'
import BookingForm from '@/components/sections/BookingForm'
import FloatingButtons from '@/components/FloatingButtons'
import PageTransition from '@/components/PageTransition'

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <TrustStrip />
      <BeforeAfter />
      <Expertise />
      <ClinicalComparison />
      <Benefits />
      <HairGrowthPhases />
      <HowItWorks />
      <Reviews />
      <FAQ />
      <Contact />
      <BookingForm />
      <FloatingButtons />
    </PageTransition>
  )
}
