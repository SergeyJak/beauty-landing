# Crystal E Studio quality standard

## Delivery flow

Every non-trivial change follows:

1. Create a feature/fix branch from `main`.
2. Open a pull request.
3. Wait for GitHub CI to pass.
4. Verify the Railway preview deployment.
5. Run focused manual smoke for the changed feature.
6. Merge only after CI + preview + smoke are green.
7. Verify the production deployment after merge.

Do not use production as a test environment.

## Required PR gates

Every PR must pass:

- TypeScript typecheck
- Unit/API tests
- Next.js production build
- Playwright smoke tests on mobile and desktop
- Railway preview deployment

A red gate blocks merge.

## Test priorities

Tests should protect business risk, not chase line coverage.

Highest priority:

- Admin authentication and session security
- LV / RU / EN routing and content isolation
- CMS writes must not erase unrelated Mongo data
- Gallery category assignment and ordering
- R2 upload validation, image compression, and cleanup
- Public gallery routing and filtering
- Mobile layout regressions, including horizontal overflow
- Production-critical navigation and login flows

## Data safety

Automated tests must never mutate production MongoDB or production R2.

Data-writing integration tests must use mocks, fixtures, or an isolated test database/bucket.

Destructive operations require regression tests before merge.

## Regression rule

Every confirmed bug that can reasonably be automated gets a regression test with the fix.

Examples:

- horizontal mobile page overflow
- locale mix-ups
- broken login redirects
- gallery category/data loss
- orphaned R2 objects

## Test structure

- `tests/unit`: pure logic, security, API validation, image processing
- `tests/e2e`: browser smoke and critical user journeys
- Future integration tests: Mongo/R2 against isolated test resources only

## Merge discipline

No direct feature work in `main`.

Emergency production fixes are the exception, and must be followed by a regression test immediately after stabilization.
