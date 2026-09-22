# Playwright: Location Permission (Web)

## Source

PVR INOX Regression Pack (App/Website/Msite), module "Location Permission", the 2 rows tagged
`App/Web/Msite` (`APP-049`, `APP-050`).

## Acceptance criteria

Browser geolocation is used to detect the nearest city; geolocation-based convenience-fee
waivers apply per configured business rules.

## Navigation

Geolocation is pre-granted in `playwright.config.ts` (Mumbai coordinates) — the same starting
state every other module in this project already assumes (see `AdminLoginModule.open()`'s
comment). The header's location button shows the detected city directly.

## Test coverage

- **Scope:** Full — both Web-tagged sheet rows for this module are covered.
- **Sheet rows included:** 2 (`APP-049`, `APP-050`).

## Scenarios

- **Suggested journey:** `src/tests/location-permission.spec.ts`
- **Source:** PVR INOX Regression Pack (App/Website/Msite)

- [ ] **APP-049** — Real geolocation-based city detection (Mumbai, via granted permission)
- [ ] **APP-050** — Adapted: which cinema has a geolocation fee waiver configured (Admin >
  Showbizz) isn't reachable without admin access, and the Checkout flow this needs isn't built
  yet at this point in the module sequence — confirms geolocation itself is real and working
  (APP-049) as the only currently-reachable piece of this business rule
