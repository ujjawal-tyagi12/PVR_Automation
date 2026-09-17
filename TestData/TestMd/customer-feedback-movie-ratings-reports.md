# Playwright: Customer Feedback (Movie Ratings) Reports — admin report of per-customer movie ratings

## Acceptance criteria

- Admin selects a movie and/or a Review Submission Date range to view a report of individual
  customer ratings, with search (Name/Email/Phone), aggregated average, and a view-only listing.

## Navigation

1. Real, public path: any movie session page (e.g. `/moviesessions/mumbai/dhurandharhindi/30205`)
   — shows a real, aggregated **User Ratings** badge (e.g. "4.5") for the movie.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Reports → Customer
   Feedback (Movie Ratings)**.

## Test coverage

- **Scope:** Full — all 17 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 17 (`CFR-001`–`CFR-043`, non-contiguous IDs).

## Scenarios

- **Suggested journey:** `src/tests/customer-feedback-movie-ratings-reports.spec.ts`
- **Sheet:** rows 690–706 (fifth 150-row batch)

- [ ] **CFR-001** — View blank listing page initially (adapted)
- [ ] **CFR-002** — Select a movie loads its feedback ratings (adapted)
- [ ] **CFR-003** — Overall average rating displayed (real, cross-referenced with the live User Ratings badge)
- [ ] **CFR-004** — Search by Customer Name (adapted)
- [ ] **CFR-005** — Search by Customer Email (adapted)
- [ ] **CFR-006** — Search by Customer Phone Number (adapted)
- [ ] **CFR-007** — Filter by Review Submission Date range (adapted)
- [ ] **CFR-008** — Ratings sorted descending by submission time (adapted)
- [ ] **CFR-009** — Select date range without selecting a movie (adapted)
- [ ] **CFR-020** — No movie and no date range selected (adapted)
- [ ] **CFR-021** — Selected movie has no ratings (adapted)
- [ ] **CFR-022** — Search with non-matching text (adapted)
- [ ] **CFR-023** — Admin cannot modify a rating (real, structural corollary)
- [ ] **CFR-040** — Movie with exactly one rating (adapted)
- [ ] **CFR-041** — Movie with many ratings (adapted)
- [ ] **CFR-042** — One rating per customer per show enforced (adapted)
- [ ] **CFR-043** — Review Submission Date range boundary (adapted)

## E2E implementation notes

- **Layering:** `src/tests/customer-feedback-movie-ratings-reports.spec.ts` →
  `src/modules/CustomerFeedbackMovieRatingsModule.ts` →
  `src/pages/CustomerFeedbackMovieRatingsPage.ts`.
- **Frontend context:** A movie session page (real, public) shows a real, aggregated **User
  Ratings** badge with a star icon (e.g. "4.5") — confirmed live on `/moviesessions/mumbai/
  dhurandharhindi/30205` — proving customer ratings are genuinely collected and aggregated. The
  admin report itself (a per-customer, searchable/filterable listing of who rated what and when)
  is not reachable by a public visitor — checked directly, not assumed; there is no view-only
  "individual ratings" table, no Select Movie admin dropdown, and no admin search/filter/sort
  anywhere on this app.
- **Tags:** `@Regression @P2`.
- **Run:** `npx playwright test src/tests/customer-feedback-movie-ratings-reports.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `CFR-001`–`CFR-043` (sheet rows 690–706 of the fifth 150-row batch)
