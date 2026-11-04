# Review Findings Implementation Plan

> Execute inline with regression tests before behavior changes.

**Goal:** Resolve all five findings from the review of b905deb.
**Architecture:** Keep Next.js and existing services. Gate client analytics on stored or newly granted consent, share a recoverable MongoDB connection promise, and require Telegram delivery before confirming a booking.
**Tech Stack:** Next.js, React, TypeScript, MongoDB driver, Vitest, Playwright.
**Spec:** User request to fix all findings in the preceding review.

## Global Constraints

- No new application dependencies or production service configuration changes.
- Preserve LV/RU/EN translations and existing admin authorization.
- Work on fix/review-findings; do not merge or deploy.

## Review Focus

- Missing or declined consent must not load trackers; acceptance must work without a reload.
- Repeated mounts must not duplicate initialization or initial PageView.
- Concurrent MongoDB readers must share one attempt and recover after rejection.
- Telegram HTTP failures, network errors, and missing credentials must not produce booking confirmation.
- All public navigation must point to mounted sections or standalone localized routes.

## Tasks

- [x] Analytics: add behavior tests for no consent, decline, accept, missing IDs, and repeated initialization; see failures. Move tracking into a client helper called by CookieConsent after consent; replace the broken pixel queue. Verify tests pass.
- [x] MongoDB: add tests for transient failure and concurrent readers through content/gallery/categories; see failures. Add src/lib/mongodb.ts getMongoClient(): Promise<MongoClient>, clearing rejected attempts. Use it from all three consumers. Verify tests pass.
- [x] Booking: add route tests for missing credentials, HTTP/network/API failures, success and HTML characters; see failures. Return localized 502 on delivery failure and escape Telegram HTML. Verify tests pass.
- [x] Navigation: replace stale footer anchors with localized homepage/gallery paths, remove reviews link, and point comparison navigation at #comparison. Add rendered regression checks and run public route/browser checks.
- [x] Verification: run the complete unit suite, typecheck, production build and available browser checks; review the full diff.

## Verification results

- Unit suite: 45 passed.
- TypeScript and production build: passed.
- Chromium mobile/desktop: 35 passed, 3 viewport-specific skips.
- Consent/navigation rerun after strengthening the no-network assertion: 6 passed.
- Independent read-only review: no material findings.
- MongoDB and Telegram failures use boundary test doubles; live service credentials were not used.

## Required CI security check

The first CI run stopped at npm audit on pre-existing vulnerable dependencies. Updated Next.js to 16.4.5, Vitest to 5.1.0 and compatible transitive dependencies. Audit now reports 0 vulnerabilities. Repeated the 45-test unit suite, typecheck, production build and full Chromium suite (35 passed, 3 viewport-specific skips) on these versions.
