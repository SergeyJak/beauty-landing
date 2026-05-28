export interface Service {
  id: string
  title: string
  description: string
  price: string
  icon: string
  duration: string
}

export interface Review {
  id: string
  name: string
  title: string
  text: string
  rating: number
  avatar: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
}

export interface BookingRequest {
  name: string
  phone: string
  service: string
  email?: string
  comment?: string
}

export interface BeforeAfterImage {
  id: string
  before: string
  after: string
  title: string
  category: string
}
