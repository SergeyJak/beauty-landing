# Client testimonials

## Content and provenance

`src/content/testimonials.json` contains excerpts transcribed from the 23 screenshots supplied in the task conversation, in their original upload order (`sourceNumber`). These are message counts, not a count of distinct clients. No identity, date, rating or verification badge is inferred. The Russian excerpts retain the clients' words; punctuation and spacing are normalized, emoji and unrelated replies are omitted. English and Latvian texts are translations, explicitly labelled in the UI. Topic labels are editorial navigation labels, not client quotations.

Six entries have `featured: true`; three are initially visible on phones and six on larger screens. Other entries open on explicit request. Add a new record with a stable `id`, source reference, three text/topic translations and `featured: false`. Read the original and translations together before publishing. Never add invented names, star ratings, dates, outcomes or aggregate rating schema.

## Source files are still required

The conversation images are visible to the author, but their downloadable binary files were not attached to the execution workspace or repository. Consequently `testimonial-images.json` starts empty. No replacement screenshot has been fabricated and no broken original links are shown. The code reveals the original button only when an anonymized asset is present in that manifest. Supply the 23 files to complete the image publication step.

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

Run `npm test`, `npm run typecheck`, `npm run build`, and `npm run test:e2e -- tests/e2e/testimonials.spec.ts`. Browser tests cover the actual mobile and desktop layout, expansion, localized copy and internal CTA. Add binary originals before the final original-viewer acceptance check; missing-source status is not a completed publication step.

## Implementation status and validation

This branch is stacked on `fix/review-findings` (PR #19), which has not been merged into main. Review this PR against that branch, then retarget to main once #19 is merged.

- 48 unit tests, TypeScript and production build passed.
- Full Chromium suite: 33 passed, 9 skipped (viewport conditions, analytics test IDs absent, and two original-viewer tests awaiting source binaries).
- A temporary synthetic image exercised the crop/redaction tool and original viewer at 390 and 1440 px. Escape, focus containment/restoration, and zero scrollbar-width shift passed; observed review-section CLS was 0 in these checks. The fixture was removed and is not part of this PR.
- Asset preparation has a pixel-level regression test ensuring masks are flattened before resizing and metadata is removed.
- npm audit reports 0 vulnerabilities on the stacked base.
- Remaining acceptance item: obtain the original screenshots, crop/redact them individually, inspect the outputs and rerun real-image viewer checks. This is why the PR remains a draft.
