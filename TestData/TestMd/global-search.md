# Playwright: Global Search (Web)

## Source

PVR INOX Regression Pack (App/Website/Msite), module "Global Search", the 7 rows tagged
`App/Web/Msite` (`APP-077`–`APP-083`).

## Acceptance criteria

Search returns matching movies/cinemas correctly and case-insensitively; unmatched searches
show a clear message; results update dynamically while typing; special/injection characters are
handled safely; results can be scoped by category.

## Navigation

Real, public path: an unlabeled header icon (between the nav and the account icon) opens a
"Search" dialog — a textbox and 3 category tabs (Movies/Events, Cinemas, Experiences). Grounded
via direct probe (2026-09-22). No "Recent Searches" section appears on reopen — confirmed
absent, not assumed. Special characters like `'` and `=` are silently stripped from the input by
the app itself — confirmed live.

## Test coverage

- **Scope:** Full — all 7 Web-tagged sheet rows for this module are covered.
- **Sheet rows included:** 7 (`APP-077`–`APP-083`).

## Scenarios

- **Suggested journey:** `src/tests/global-search.spec.ts`
- **Source:** PVR INOX Regression Pack (App/Website/Msite)

- [ ] **APP-077** — Real movie search returns matching results
- [ ] **APP-078** — Real cinema search (Cinemas tab) returns matching results
- [ ] **APP-079** — Real "No Result Found!" message for an unmatched search
- [ ] **APP-080** — Real predictive filtering: results update dynamically as the search term is
  typed (the same real mechanism proven by APP-077)
- [ ] **APP-081** — Adapted: confirmed live that no "Recent Searches" section exists anywhere
  on this dialog, on first open or on reopen
- [ ] **APP-082** — Real special-character/injection-string handling: confirmed live that the
  app strips unsafe characters from the input itself; no crash, no exposed error
- [ ] **APP-083** — Real category filter tabs (Movies/Events, Cinemas, Experiences)
