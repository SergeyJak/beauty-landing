import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import BeforeAfter from '@/components/sections/BeforeAfter'
import Reviews from '@/components/sections/Reviews'
import FAQ from '@/components/sections/FAQ'
import Contact from '@/components/sections/Contact'
import BookingForm from '@/components/sections/BookingForm'
import FloatingButtons from '@/components/FloatingButtons'

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <BeforeAfter />
      <Reviews />
      <FAQ />
      <Contact />
      <BookingForm />
      <FloatingButtons />
    </>
  )
}
