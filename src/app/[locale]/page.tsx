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
import FloatingButtons from '@/components/FloatingButtons'
import PageTransition from '@/components/PageTransition'
import { getEditableContent } from '@/lib/content'
import { getGallery } from '@/lib/gallery'
import { isValidLocale } from '@/lib/i18n'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: Props) {
  const { locale } = await params
  const [editable, gallery] = isValidLocale(locale)
    ? await Promise.all([getEditableContent(locale), getGallery()])
    : [null, []]

  return (
    <PageTransition>
      <Hero
        title={editable?.heroTitle}
        description={editable?.heroDescription}
      />
      <TrustStrip />
      <BeforeAfter
        images={gallery.map((item) => ({
          id: item.id,
          before: item.before.url,
          after: item.after.url,
          title:
            item.text[locale].title ||
            item.text.lv.title ||
            item.text.ru.title ||
            item.text.en.title,
          category:
            item.text[locale].category ||
            item.text.lv.category ||
            item.text.ru.category ||
            item.text.en.category,
        }))}
      />
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
