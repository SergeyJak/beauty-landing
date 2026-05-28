# Development Guide

## Getting Started

### Initial Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

## Development Workflow

### Code Organization

- **Components**: Reusable UI components in `src/components/`
- **Sections**: Page sections in `src/components/sections/`
- **Types**: TypeScript interfaces in `src/types/`
- **Utilities**: Helper functions in `src/lib/`
- **Hooks**: Custom React hooks in `src/hooks/`

### Adding New Components

1. Create component file in `src/components/`
2. Use TypeScript for type safety
3. Export as default
4. Use Framer Motion for animations
5. Follow the existing style patterns

Example:
```typescript
'use client'

import { motion } from 'framer-motion'

interface MyComponentProps {
  title: string
}

export default function MyComponent({ title }: MyComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold">{title}</h2>
    </motion.div>
  )
}
```

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Use custom colors from config:
  - `bg-primary` - Dark gray
  - `bg-accent` - Gold
  - `bg-soft-beige` - Light beige
  - `bg-secondary` / `bg-warm-gray` - Light gray

### Animation Best Practices

- Use Framer Motion for smooth animations
- Import `motion` from `framer-motion`
- Common patterns:
  - Fade-in on scroll: `whileInView={{ opacity: 1 }}`
  - Hover effects: `whileHover={{ scale: 1.05 }}`
  - Tap effects: `whileTap={{ scale: 0.95 }}`

## API Development

### Booking API Endpoint

**File**: `src/app/api/booking/route.ts`

**Request**:
```json
{
  "name": "string",
  "phone": "string",
  "service": "string",
  "email": "string (optional)",
  "comment": "string (optional)"
}
```

**Response Success**:
```json
{
  "success": true,
  "message": "string",
  "bookingId": "string"
}
```

**Response Error**:
```json
{
  "error": "string"
}
```

### Adding New API Routes

1. Create file in `src/app/api/[resource]/route.ts`
2. Export POST, GET, etc. functions
3. Handle request validation
4. Return NextResponse

Example:
```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Your logic here
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

## Database Integration

### For production, you'll need:

1. **Database**: Choose PostgreSQL, MongoDB, or Firebase
2. **ORM**: Consider Prisma or Drizzle
3. **Authentication**: Implement user authentication if needed

### Steps:

1. Install your chosen database ORM
2. Update `.env.local` with database URL
3. Create database schema
4. Update API routes to use database
5. Add error handling

## Environment Variables

See `.env.example` for available variables.

To use:
1. Copy `.env.example` to `.env.local`
2. Update values for your setup
3. Restart dev server for changes to take effect

## Testing

### Manual Testing Checklist

- [ ] Hero section displays correctly
- [ ] Services grid is responsive
- [ ] Gallery images load and modal works
- [ ] Reviews section scrolls smoothly
- [ ] FAQ accordion opens/closes
- [ ] Contact map displays
- [ ] Booking form validates
- [ ] Floating buttons work on mobile
- [ ] Mobile menu opens/closes
- [ ] All links work
- [ ] Animations play smoothly

### Browser Testing

Test in:
- Chrome/Chromium
- Firefox
- Safari
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## Performance Optimization

### Image Optimization

```typescript
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={400}
  height={300}
  priority={false}
/>
```

### Code Splitting

- Automatic with Next.js App Router
- Use `next/dynamic` for large components if needed

### Bundle Analysis

```bash
# Generate bundle analysis
npm run build -- --analyze
```

## Common Issues

### Issue: Form submission fails
- Check network tab in DevTools
- Ensure API route is correct
- Check console for errors
- Verify request body format

### Issue: Animations don't play
- Check if component is visible
- Ensure Framer Motion is imported correctly
- Check viewport property in whileInView

### Issue: Styles not applying
- Clear `.next` folder: `rm -rf .next`
- Restart dev server
- Check Tailwind config paths

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: add feature description"

# Push and create pull request
git push origin feature/feature-name
```

## Deployment Checklist

Before deploying:
- [ ] All tests pass
- [ ] No console errors
- [ ] SEO metadata configured
- [ ] Environment variables set
- [ ] Images optimized
- [ ] Mobile responsive tested
- [ ] Performance acceptable
- [ ] Security review done

## Useful Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Clean build
rm -rf .next && npm run build
```

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

---

Happy coding! 🎨
