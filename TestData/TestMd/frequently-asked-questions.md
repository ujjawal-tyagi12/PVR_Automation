# Playwright: Frequently Asked Questions — admin CRUD for per-country FAQ records

## Acceptance criteria

- Admin can view (India/Sri Lanka tabs), search, add/edit/delete FAQs (Country/Sequence/
  Question/Answer), and activate/deactivate, with field-level validation and per-country
  duplicate-question checking.

## Navigation

1. Real, public path: footer **Support → FAQ** → `/faq` — the real public FAQ accordion
   (confirmed live: "Can tickets be cancelled immediately?", "When will the refund be
   processed?", "5 Simple Steps to Buy Tickets Online.").
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Static Management →
   FAQ**.

## Test coverage

- **Scope:** Full — all 30 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 30 (`FAQ-001`–`FAQ-034`, non-contiguous IDs).

## Scenarios

- **Suggested journey:** `src/tests/frequently-asked-questions.spec.ts`
- **Sheet:** sixth 150-row batch

- [ ] **FAQ-001** — Listing page shows tabs and table columns (adapted; real accordion instead)
- [ ] **FAQ-002** — Switch country tabs shows respective FAQs (adapted)
- [ ] **FAQ-003** — Search by keyword filters across both tabs (adapted)
- [ ] **FAQ-004** — Truncated field shows full text on hover (adapted)
- [ ] **FAQ-005** — Add FAQ with valid inputs (adapted)
- [ ] **FAQ-006** — New FAQ appears first in listing (adapted)
- [ ] **FAQ-007** — Edit FAQ updates fields (adapted)
- [ ] **FAQ-008** — Deactivate FAQ hides it from frontend (adapted)
- [ ] **FAQ-009** — Activate FAQ shows it on frontend (adapted)
- [ ] **FAQ-010** — Delete FAQ removes it permanently (adapted)
- [ ] **FAQ-015** — Add blocked when Country not selected (adapted)
- [ ] **FAQ-016** — Add blocked when Question below minimum length (adapted)
- [ ] **FAQ-017** — Add blocked when Question exceeds maximum length (adapted)
- [ ] **FAQ-018** — Add blocked when Answer below minimum length (adapted)
- [ ] **FAQ-019** — Add blocked when Answer exceeds maximum length (adapted)
- [ ] **FAQ-020** — Duplicate Question for same country rejected (adapted)
- [ ] **FAQ-021** — Search below minimum characters (adapted)
- [ ] **FAQ-022** — Search with no matches (adapted)
- [ ] **FAQ-023** — Cancel Add discards entry (adapted)
- [ ] **FAQ-024** — Cancel Edit discards changes (adapted)
- [ ] **FAQ-025** — Cancel Delete retains FAQ (adapted)
- [ ] **FAQ-026** — API failure during save/update/delete (adapted)
- [ ] **FAQ-027** — Data load failure shows retry (adapted)
- [ ] **FAQ-028** — Session expiry during Add/Edit (adapted)
- [ ] **FAQ-029** — Network failure shows connectivity error (adapted)
- [ ] **FAQ-030** — Unauthorized role cannot access FAQ section `[Negative]` (adapted)
- [ ] **FAQ-031** — No FAQs exist → empty state (adapted; real page always has content)
- [ ] **FAQ-032** — Question/Answer at exact boundary lengths accepted (adapted)
- [ ] **FAQ-033** — Same question allowed across different countries (adapted)
- [ ] **FAQ-034** — Partial failure shows partial success message (adapted)

## E2E implementation notes

- **Layering:** `src/tests/frequently-asked-questions.spec.ts` →
  `src/modules/FrequentlyAskedQuestionsModule.ts` → `src/pages/FrequentlyAskedQuestionsPage.ts`.
- **Frontend context:** `/faq` (real, public) shows a genuine accordion of real questions —
  confirmed live: clicking "Can tickets be cancelled immediately?" expands a real answer. This is
  a single, country-agnostic, view-only accordion — not an India/Sri Lanka-tabbed admin CRUD
  table; no Add/Edit/Delete control, no Country/Sequence field, and no search bar exist anywhere
  on this app — checked directly, not assumed.
- **Tags:** `@Regression @P2`.
- **Run:** `npx playwright test src/tests/frequently-asked-questions.spec.ts --project=chromium`

## Source

- **Seed method:** Google Sheet (CSV export)
- **Row range:** `FAQ-001`–`FAQ-034` (sixth 150-row batch)
