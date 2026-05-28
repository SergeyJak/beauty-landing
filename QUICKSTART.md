# 🚀 Quick Start Guide

Get your beauty service landing page running in minutes!

## Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

## Installation (3 Steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to: **http://localhost:3000**

That's it! You now have a running beauty service landing page. 🎉

---

## 📝 Quick Customization

### Change Business Info

Edit `src/lib/constants.ts`:
```typescript
export const CONTACT_INFO = {
  phone: '+1 (555) 123-4567',
  email: 'info@beautyservice.com',
  address: '123 Beauty Street, NY 10001',
}
```

### Update Services

Edit `src/components/sections/Services.tsx`:
```typescript
const services: Service[] = [
  {
    id: '1',
    title: 'Your Service Name',
    description: 'Service description...',
    price: '$XX - $YY',
    icon: '✨',
    duration: '60 min',
  },
  // Add more services...
]
```

### Update Reviews

Edit `src/components/sections/Reviews.tsx`:
```typescript
const reviews: Review[] = [
  {
    id: '1',
    name: 'Client Name',
    title: 'Client Title',
    text: 'Their review text...',
    rating: 5,
    avatar: 'image-url',
  },
  // Add more reviews...
]
```

### Change Colors

Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: '#1a1a1a',      // Change dark color
  accent: '#d4a574',       // Change gold/highlight color
  'soft-beige': '#f9f5f1', // Change light background
}
```

### Update Social Links

Edit `src/components/FloatingButtons.tsx`:
```typescript
href="https://wa.me/YOUR_PHONE_NUMBER"
href="https://t.me/YOUR_TELEGRAM_USERNAME"
```

---

## 🎯 Key Files to Know

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Main page structure |
| `src/components/Header.tsx` | Navigation header |
| `src/components/sections/*` | Page sections |
| `src/app/globals.css` | Global styles |
| `tailwind.config.ts` | Tailwind configuration |
| `src/types/index.ts` | TypeScript types |
| `src/lib/constants.ts` | App constants |

---

## 🔧 Build & Deploy

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)
```bash
# Push to GitHub first
git push origin main

# Then connect to Vercel dashboard
# https://vercel.com
```

### Other Platforms
- Build command: `npm run build`
- Start command: `npm start`
- Node version: 18.17+

---

## 📱 Testing

### Mobile Testing
1. Open DevTools (F12)
2. Click device toggle icon
3. Select mobile device
4. Test navigation and forms

### Responsive Sizes
- Mobile: 320px - 640px
- Tablet: 640px - 1024px
- Desktop: 1024px+

---

## 🐛 Common Issues

### Port Already in Use
```bash
npm run dev -- -p 3001
```

### Installation Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
rm -rf .next
npm run build
```

---

## 📚 Next Steps

1. **Customize content** in section components
2. **Update contact information** in `constants.ts`
3. **Set up database** for form submissions
4. **Configure email notifications**
5. **Add real images** to gallery
6. **Set up analytics** (Google Analytics, etc.)
7. **Add domain name**
8. **Deploy to production**

---

## 🎓 Learning Resources

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

## 💡 Pro Tips

✅ **Do:**
- Use TypeScript for better code quality
- Keep components small and focused
- Test on mobile devices early
- Use Tailwind for consistent styling
- Follow the existing code patterns

❌ **Don't:**
- Edit files during npm install
- Commit `node_modules` to git
- Ignore TypeScript errors
- Skip mobile testing
- Use inline styles

---

## 🤔 Help & Support

### Check Documentation
- See `README.md` for full documentation
- See `DEVELOPMENT.md` for development guide
- See `FEATURES.md` for features overview

### Common Questions

**Q: How do I change the logo?**
A: Edit the logo in `src/components/Header.tsx` (currently shows "B" circle)

**Q: How do I add more sections?**
A: Create new component in `src/components/sections/` and add to `src/app/page.tsx`

**Q: Where do form submissions go?**
A: API route is at `src/app/api/booking/route.ts`. Currently logs to console.

**Q: Can I use external images?**
A: Yes, replace placeholder URLs with your image URLs or use Next.js Image component.

---

## 🎉 You're Ready!

Your beauty service landing page is ready to customize and deploy.

Have questions? Check the documentation files or explore the code comments.

Happy building! 💄✨

---

**Version:** 0.1.0  
**Last Updated:** May 2026
