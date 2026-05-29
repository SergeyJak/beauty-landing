import Hero from '@/components/sections/Hero'
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
import StickyMobileCTA from '@/components/StickyMobileCTA'

export default function Home() {
  return (
    <>
      <Hero />
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
      <StickyMobileCTA />
    </>
  )
}
