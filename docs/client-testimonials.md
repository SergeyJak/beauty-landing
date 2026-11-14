# Client testimonials

## Content and provenance

`src/content/testimonials.json` contains excerpts transcribed from the screenshots supplied in the task conversation, in their original upload order (`sourceNumber`). These are message counts, not a count of distinct clients. No identity, date, rating or verification badge is inferred. The Russian excerpts retain the clients' words; punctuation and spacing are normalized, emoji and unrelated replies are omitted. English and Latvian texts are translations, explicitly labelled in the UI. Topic labels are editorial navigation labels, not client quotations.

Six entries have `featured: true`; three are initially visible on phones and six on larger screens. Other entries open on explicit request. Add a new record with a stable `id`, source reference, three text/topic translations and `featured: false`. Read the original and translations together before publishing. Never add invented names, star ratings, dates, outcomes or aggregate rating schema.

## Prepared original screenshots

The published screenshots supplied in `foto1.zip` have been matched to their review records and published as WebP crops in `public/reviews/`. The manifest contains a source and exact dimensions for every review. Untouched screenshots and the archive stay outside Git. Names, profile pictures, identifying facial features, QR codes, reply previews containing client names, and irrelevant replies are excluded by cropping. Public references to the specialist or studio within a client message are retained. Each resulting crop was visually inspected.

The Russian excerpts for reviews 18 and 20, and their translations, were shortened to match the exact client messages in the cropped originals. No words or identities were invented. The optimized images are requested only after opening the viewer; none are loaded in the initial card layout.

## Preparing originals

Keep untouched files outside `public/` and outside Git, for example `private-review-sources/` (ignored). Never commit raw screenshots, image editing project files, or a config containing private paths. Crop to the client's message, excluding the phone status bar, Story captions/background where possible, replies and unrelated conversations. Hide client names, account handles, profile photos, quoted reply identities, faces, QR codes and third-party identities with irreversible opaque masks. If a face/result photo cannot be safely excluded, omit that part; the text is sufficient evidence.

Create a private JSON crop config, e.g.:

```json
[
  {
    "id": "review-01",
    "input": "01.jpg",
    "privacyReviewed": true,
    "crop": { "left": 24, "top": 200, "width": 420, "height": 300 },
    "redactions": [{ "left": 0, "top": 0, "width": 150, "height": 32 }]
  }
]
```

The sample coordinates are illustrative; determine them individually from each image. Run from the repository root:

```sh
node scripts/prepare-review-images.mjs /private/path/review-crops.json
```

The script writes only flattened WebP crops to `public/reviews/`, strips metadata by re-encoding, and updates the manifest with explicit dimensions. It never copies raw sources. Inspect every resulting crop visually at full resolution before committing it and the manifest. Check that the visible quote matches its record. `privacyReviewed` records the operator's review, it is not automatic personal-data detection.

## UI and verification

The main page sends only the selected language to the client. Initial cards contain text, no Story screenshots or remote assets. Originals are requested only after a click; their dimensions are explicit. The native modal provides focus containment, Escape, close button and browser focus restoration. The document reserves its scrollbar gutter to avoid width shifts on opening. No autoplay, timers or entrance animations are used in the section.

Run `npm test`, `npm run typecheck`, `npm run build`, and `npm run test:e2e -- tests/e2e/testimonials.spec.ts`. Browser tests cover the actual mobile and desktop layout, expansion, localized copy and internal CTA. Browser tests open every original on desktop and mobile and assert that all published images load, focus returns after closing, and no originals are requested before interaction.

## Implementation status and validation

This branch is stacked on `fix/review-findings` (PR #19), which has not been merged into main. Review this PR against that branch, then retarget to main once #19 is merged.

- 49 unit tests, TypeScript and production build passed.
- All 23 actual crops were visually inspected at source resolution for personal information and quote correspondence.
- Asset preparation has a pixel-level regression test ensuring masks are flattened before resizing and metadata is removed.
- Full real-image Chromium suite: 41 passed, 3 viewport-specific skips. All 23 originals load on both mobile and desktop, no originals are requested initially, and keyboard focus containment, Escape/close and focus restoration passed.
- The source archive and untouched screenshots are not committed or served by the application.

Reviews 05 and 14 were removed at the studio’s request; review 14 contained a comparison with another hair-removal method. Review 18 includes the consented before-and-after close-up of the upper lip, cropped to exclude identifying facial features and unrelated replies.
