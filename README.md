# Beauty Service Landing Page MVP

A premium, modern landing page for beauty services built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## 🎨 Features

- **Modern Premium Design** - Clean, minimalist aesthetic with smooth animations
- **Responsive Layout** - Mobile-first design that works seamlessly on all devices
- **Smooth Animations** - Framer Motion animations for a polished user experience
- **Multiple Sections**
  - Hero section with CTA
  - Services grid with pricing
  - Before/after image gallery with modal preview
  - Client testimonials and reviews
  - FAQ accordion
  - Contact information with embedded map
  - Booking form with validation
- **Floating Action Buttons** - WhatsApp, Telegram, and booking shortcuts
- **Sticky Header** - Navigation that adapts to scroll position
- **Mobile Menu** - Responsive burger menu for mobile devices
- **Form Handling** - Booking form with API integration
- **SEO Optimized** - Metadata, Open Graph tags, semantic HTML
- **Performance Optimized** - Image optimization, lazy loading, code splitting

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Form Handling**: React built-in forms

## 📋 Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

## 🛠️ Installation

1. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Set up environment variables** (if needed):
   ```bash
   cp .env.example .env.local
   ```

## 🏃 Development

1. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

2. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

The page auto-reloads when you make changes.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── booking/
│   │       └── route.ts          # Booking API endpoint
│   ├── layout.tsx                 # Root layout with metadata
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles
├── components/
│   ├── Button.tsx                 # Reusable button component
│   ├── Card.tsx                   # Reusable card component
│   ├── Header.tsx                 # Sticky header with mobile menu
│   ├── Footer.tsx                 # Footer section
│   ├── FloatingButtons.tsx        # Floating action buttons
│   └── sections/
│       ├── Hero.tsx               # Hero section
│       ├── Services.tsx           # Services grid
│       ├── BeforeAfter.tsx        # Before/after gallery
│       ├── Reviews.tsx            # Testimonials
│       ├── FAQ.tsx                # FAQ accordion
│       ├── Contact.tsx            # Contact section
│       └── BookingForm.tsx        # Booking form
├── types/
│   └── index.ts                   # TypeScript interfaces
├── tailwind.config.ts             # Tailwind configuration
└── tsconfig.json                  # TypeScript configuration
```

## 🎯 Customization

### Colors
Edit the color palette in `tailwind.config.ts`:
```typescript
colors: {
  primary: '#1a1a1a',      // Dark gray
  secondary: '#f5f5f5',    // Light gray
  accent: '#d4a574',       // Gold
  'soft-beige': '#f9f5f1', // Beige
  'warm-gray': '#e8e8e8',  // Warm gray
}
```

### Content
- **Services**: Edit the `services` array in `src/components/sections/Services.tsx`
- **Reviews**: Edit the `reviews` array in `src/components/sections/Reviews.tsx`
- **FAQ**: Edit the `faqItems` array in `src/components/sections/FAQ.tsx`
- **Gallery**: Edit the `galleryImages` array in `src/components/sections/BeforeAfter.tsx`

### Contact Information
- Update links in `src/components/sections/Contact.tsx`
- Update floating buttons in `src/components/FloatingButtons.tsx`

## 📝 Booking Form

The booking form submits to `/api/booking` endpoint. Currently, it logs requests to console.

### To integrate with your backend:
1. Update the API endpoint in `src/components/sections/BookingForm.tsx`
2. Add validation and storage logic in `src/app/api/booking/route.ts`
3. Configure email notifications or database integration

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Deploy with one click

### Other Platforms
Build command: `npm run build`
Start command: `npm start`

## 📱 Performance Tips

1. **Image Optimization**: Use Next.js Image component for all images
2. **Lazy Loading**: Gallery images are lazy loaded by default
3. **Code Splitting**: Each section is code-split automatically
4. **Caching**: Configure browser caching for static assets

## 🔍 SEO

- Metadata configured in `src/app/layout.tsx`
- Open Graph tags for social sharing
- Semantic HTML throughout
- Mobile-responsive design

## 🐛 Troubleshooting

### Port 3000 is already in use
```bash
npm run dev -- -p 3001
```

### Build errors
```bash
rm -rf .next
npm run build
```

### TypeScript errors
```bash
npx tsc --noEmit
```

## 📄 License

This project is available for commercial use.

## 🤝 Support

For issues or questions, please contact the development team.

---

**Version**: 0.1.0  
**Last Updated**: May 2026
