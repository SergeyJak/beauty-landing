import Hero from '@/components/sections/Hero'
import TrustStrip from '@/components/TrustStrip'
import WhyElectrolysis from '@/components/sections/WhyElectrolysis'
import Benefits from '@/components/sections/Benefits'
import HairGrowthPhases from '@/components/sections/HairGrowthPhases'
import HowItWorks from '@/components/sections/HowItWorks'
import BeforeAfter from '@/components/sections/BeforeAfter'
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
      <WhyElectrolysis />
      <Benefits />
      <HairGrowthPhases />
      <HowItWorks />
      <BeforeAfter />
      <Reviews />
      <FAQ />
      <Contact />
      <BookingForm />
      <FloatingButtons />
    </PageTransition>
  )
}
