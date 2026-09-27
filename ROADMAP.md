# Beauty Landing Roadmap

## Goal

Evolve the current multilingual electrolysis landing page into a maintainable production service where the owner can update current information, photos and SEO content without code changes.

## Phase 0 — Infrastructure migration

- [ ] Create a dedicated Railway project for `beauty-landing`
- [ ] Deploy `main` to Railway production
- [ ] Add Railway public domain and verify `/lv`, `/ru`, `/en`
- [ ] Add health/deploy checks
- [ ] Keep the existing Vercel deployment alive until Railway is verified
- [ ] Add PR/preview deployment approach
- [ ] Document required environment variables

## Phase 1 — Content model and MongoDB

Use the existing MongoDB Atlas cluster, but keep Beauty isolated in its own database.

Target database:

```
beauty_prod
```

Initial collections:

- `site_content` — editable page text by locale
- `services` — services, descriptions, prices and visibility
- `faq` — FAQ items and ordering
- `gallery` — before/after and other page images
- `seo` — metadata by locale
- `settings` — contacts, social links and business settings
- `admins` — admin authentication/authorization if stored in DB

Rules:

- no collections shared with Inventory/HeySmart
- separate DB name and environment variables
- schema validation at application boundary
- backups included before content becomes business-critical

## Phase 2 — Lightweight admin CMS

Create a simple protected `/admin` area focused on the actual owner workflow.

Sections:

1. **Content**
   - hero title/subtitle
   - descriptions
   - procedure information
   - current notices/promotions

2. **Services & Prices**
   - edit service names/descriptions/prices
   - enable/disable services
   - control display order

3. **Photos**
   - upload/replace images
   - alt text per locale
   - reorder/hide images
   - preview before publishing

4. **FAQ**
   - create/edit/delete
   - reorder
   - locale-specific text

5. **SEO**
   - page title
   - meta description
   - Open Graph title/description/image
   - canonical settings where needed
   - preview search/social snippets

6. **Contacts**
   - phone
   - WhatsApp
   - Instagram
   - address
   - working hours

## Phase 3 — SEO foundation

- [ ] Dynamic metadata for `lv`, `ru`, `en`
- [ ] Canonical URLs
- [ ] `hreflang` links between locales
- [ ] `sitemap.xml`
- [ ] `robots.txt`
- [ ] Open Graph metadata
- [ ] meaningful image alt text
- [ ] structured data for the local beauty/electrolysis service
- [ ] verify indexability and no accidental duplicate pages
- [ ] add Google Search Console verification
- [ ] review Core Web Vitals after CMS/image changes

## Phase 4 — Publishing workflow

Start simple:

```
Admin edit -> Save -> Database -> Website renders updated content
```

Then add when needed:

- draft/published state
- preview before publish
- change history
- restore previous version
- last-updated timestamp

## Phase 5 — Quality and operations

- [ ] unit tests for content validation
- [ ] API tests for admin/content endpoints
- [ ] smoke tests for all locales
- [ ] SEO checks in CI
- [ ] broken-image and broken-link checks
- [ ] admin authentication tests
- [ ] backup/restore test for `beauty_prod`
- [ ] production monitoring and error logging

## First implementation slice

The first vertical slice should be deliberately small:

1. Railway production deployment
2. Mongo connection with isolated `beauty_prod`
3. one editable content entity: **SEO + hero text for LV**
4. protected admin page to edit it
5. render saved values on `/lv`
6. tests for read/update/fallback behavior

Once that works end to end, extend the same pattern to RU/EN, services, FAQ and photos.

## Non-goals for the first iteration

- no heavyweight third-party CMS
- no shared Beauty/Inventory collections
- no complex role system
- no full CRM yet
- no Vercel shutdown before Railway is verified
