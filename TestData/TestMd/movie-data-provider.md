# Playwright: Movie Data Provider — admin tool to import movie data from TMDB/Moviesbuff

## Acceptance criteria

- Admin can search a movie by name/ID against TMDB or Moviesbuff, select cast/crew/synopsis
  assets, and import them into Movie Master.

## Navigation

1. Real, public path checked: header nav, footer, and the home page — no admin movie-data-import
   UI reachable without admin credentials. This is an internal admin tooling concept with no
   customer-facing equivalent.
2. Sheet-described admin path (not reachable on this app): Admin Panel → **Movie Data
   Provider**.

## Test coverage

- **Scope:** Full — all 30 sheet rows for this module are covered in this batch.
- **Sheet rows included:** 30 (`MDP-001`–`MDP-034`, non-contiguous IDs).

## Scenarios

- **Suggested journey:** `src/tests/movie-data-provider.spec.ts`
- **Sheet:** eighth 200-row batch

- [ ] **MDP-001**–**MDP-034** — No admin movie-data-import surface exists anywhere on this app
  (all adapted; confirmed absent, not assumed)
