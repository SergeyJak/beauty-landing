import records from '@/content/testimonials.json'
import images from '@/content/testimonial-images.json'
import type { Locale } from '@/lib/i18n'

export type TestimonialImage = { src: string; width: number; height: number }
export type Testimonial = {
  id: string
  featured: boolean
  text: string
  topic: string
  image?: TestimonialImage
}

export function getTestimonials(locale: Locale): Testimonial[] {
  const assets = images as Record<string, TestimonialImage>
  return records.map((record) => ({
    id: record.id,
    featured: record.featured,
    text: record.text[locale],
    topic: record.topic[locale],
    // Only reviewed, anonymized files belong in this manifest.
    image: assets[record.id],
  }))
}

export const TESTIMONIAL_COPY = {
  ru: {
    eyebrow: 'Личный опыт', title: 'Отзывы клиентов',
    description: 'О внимании к деталям, ощущениях и результатах — словами тех, кто уже побывал в студии.',
    client: 'Отзыв клиента', original: 'Открыть оригинал', more: 'Больше отзывов', less: 'Свернуть отзывы',
    close: 'Закрыть оригинал отзыва', originalTitle: 'Оригинал отзыва',
    imageAlt: 'Обезличенный скриншот сообщения клиента на русском языке',
    imageError: 'Не удалось загрузить скриншот. Закройте окно и попробуйте ещё раз.',
    note: 'Цитаты из реальных сообщений, опубликованные с согласия клиентов. Персональные данные скрыты. Ощущения, заживление и результаты индивидуальны.',
    translation: '', cta: 'Обсудить процедуру',
  },
  en: {
    eyebrow: 'Personal experiences', title: 'Words from our clients',
    description: 'Attention to detail, treatment experience and results — in the words of people who have visited the studio.',
    client: 'Client feedback', original: 'View original', more: 'More reviews', less: 'Show fewer reviews',
    close: 'Close original review', originalTitle: 'Original review',
    imageAlt: 'Anonymized screenshot of the original client message in Russian',
    imageError: 'The screenshot could not be loaded. Close this window and try again.',
    note: 'Excerpts from real messages, published with client consent. Personal details are hidden. Sensations, healing and results vary from person to person.',
    translation: 'Translated from Russian.', cta: 'Discuss your treatment',
  },
  lv: {
    eyebrow: 'Personīgā pieredze', title: 'Klientu atsauksmes',
    description: 'Par uzmanību detaļām, sajūtām un rezultātiem — to cilvēku vārdiem, kuri jau apmeklējuši studiju.',
    client: 'Klienta atsauksme', original: 'Skatīt oriģinālu', more: 'Vairāk atsauksmju', less: 'Rādīt mazāk atsauksmju',
    close: 'Aizvērt atsauksmes oriģinālu', originalTitle: 'Atsauksmes oriģināls',
    imageAlt: 'Anonimizēts klienta sākotnējā ziņojuma ekrānuzņēmums krievu valodā',
    imageError: 'Ekrānuzņēmumu neizdevās ielādēt. Aizveriet logu un mēģiniet vēlreiz.',
    note: 'Īstu ziņojumu fragmenti, publicēti ar klientu piekrišanu. Personas dati ir paslēpti. Sajūtas, dzīšana un rezultāti katram ir individuāli.',
    translation: 'Tulkots no krievu valodas.', cta: 'Pārrunāt procedūru',
  },
} satisfies Record<Locale, Record<string, string>>
export type TestimonialCopy = typeof TESTIMONIAL_COPY[Locale]
