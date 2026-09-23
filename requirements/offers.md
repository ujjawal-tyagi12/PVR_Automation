# Playwright: Offers — Promoted Offers listing/detail & home/food entry chips

## Acceptance criteria

- Offers section is reachable from the header **More** menu (`/offers`) and from a "Explore More" CTA / offer chips surfaced on Home, Movie Details, Events, Event Details, Curated Shows, and Food.
- Offers listing shows category tabs and only renders tabs for categories that actually have data from showbizz; each offer card shows banner, title, applicable-on, card/UPI name, and validity date.
- Offer Detail page opens on tap with banner, title, applicable-on, description, validity, Share icon, and Proceed to Book CTA; Share opens the native share sheet with a fixed pre-filled message and a working deep link back to the same offer.
- Priority-ranked, city-scoped, and time-window (start/expiry, including midnight rollover) offer visibility is enforced; expired/invalid-city offers are not shown.
- ~~Retail Offers (vouchers): ... QR + countdown timer ... ~~ — **removed from scope 2026-09-01, see Out of scope**: this flow does not exist on UAT as described. A real but different booking-flow upsell ("Offers For You" — Value/Family Bundle, F&B Voucher, add-to-cart only, no QR/activation) exists instead; not covered by this ticket.

## Navigation

1. **Promoted Offers:** Launch app/web → dismiss location prompt, select city (Mumbai-All) → header **More** menu → **Offers** (`/offers`). Alternate entries: Home "Explore Offers" section → Explore More CTA; offer chips under Now Showing cards, on Movie Details "Also playing", Events screen, Event Details "Also playing", and Curated Shows; Food screen promoted-offers section.
2. **Offer Detail:** From Offers listing, tap any offer card → Offer Detail page (grounded route pattern: `/more/offers/{id}?filter=all`).
3. ~~**Retail Offers (vouchers):** ...~~ — removed from scope 2026-09-01; see Out of scope below.

## Test coverage

- **Scope:** Complete — all feasible rows for this module from the source sheet.
- **Sheet rows included:** 42 of 78 in active scope (TC_App_001–042, plus TC_App_039/040/041's "Retail Offers"-labeled duplicates are now out of scope along with the rest of TC_App_043–076 — see below). 34 more rows are documented but moved to Out of scope.
- **Out of scope:**
  - TC_App_012 (Proceed to Book CTA navigation) — CTA is currently hidden by product decision ("as discussed with Nitin sir"); QA status is Deferred in the source sheet, not a live bug. Re-add once the CTA is re-enabled.
  - TC_App_066 (Partial Activation Failure) — requires simulating a backend failure for a subset of cart items; not achievable via UI-only E2E without API-level fault injection/mocking, which is out of scope for this framework's black-box Playwright tests.
  - **TC_App_039b–076, the entire Retail Offers voucher flow (34 scenarios: OFR-043–076) — CONFIRMED 2026-09-01 the feature as described does not exist on UAT.** Checked two real paths: (1) Food → Order Anytime, which has no "Explore Offers (Retail Offers)" CTA at all, just a generic bank-offers promo section; (2) the ticket-booking flow's "Offers For You" upsell screen (`/offers-for-you?ticketAmount=...&seatCount=...`, reached after seat selection — Value Bundle / Family Bundle / F&B Voucher cards, each with an "Add" button), which IS real but only bundles the item into the same ticket purchase — there is no separate "Activate Voucher," no QR code, no counter-redemption step, which TC_App_056/058 specifically require. Neither path matches the sheet's described flow (cinema detection → voucher listing → cart → QR-code activation). Moved out of scope rather than left indefinitely `test.fixme` — re-open if the product/dev team confirms this feature is planned, or if it's confirmed to have shipped under a different name.
- **Known live defects (source sheet Actual Result / grounded 2026-08-31 against UAT):** real `/offers` tabs are **All offers / Bank / Normal / GoogleWallet**, not the sheet's Bank/Payment-Wallet-UPI/Others naming — showbizz is currently only returning bank-category data (TC_App_002/004/005/006 should assert against the *current* tab set, with a comment noting the sheet's original expectation). Several rows have known-failing actual results in the source sheet (offer chip tap not redirecting — TC_App_039a; incorrect/broken share & deep-link URLs — TC_App_011/024/031; card/detail page missing applicable-on & validity fields — TC_App_007/008; loader shown instead of no-internet error — TC_App_017/029; priority ordering not applied — TC_App_013/030) — these are written as real assertions and are **expected to fail** against current UAT behavior until the underlying bugs are fixed; do not weaken the assertions to match the bug.
- **Re-grounded 2026-09-07 (OFR-032/034/035/036/038 un-fixme pass):**
  - **OFR-032** is real: the home "Offers" section's actual CTA is "View More" (`aria-label="View all offers"`), not the sheet's literal "Explore Offers"/"Explore More" wording — clicking it navigates to `/more/offers`, confirmed to render the identical listing as `/offers`.
  - **OFR-034/OFR-036** are real, using a movie/candidate-hopping approach (mirroring `MovieDetailsModule.openMovieFromHomepage`'s tile-hopping): the Also Playing offer chip is confirmed genuinely data-driven and volatile on two axes — which movie/candidate carries it, and which load of that same one does. OFR-036 reaches Event Details via the same id-driven catalog-probing route `EventDetailsModule.openLiveEventWithCinemaData` already established (the Events listing is confirmed absent — see OFR-035 below), since any live catalog id renders through the identical template.
  - **OFR-035 stays out of reach** (`test.fixme`): re-confirmed live 2026-09-07 that the Events screen itself — both the homepage carousel and the `/events` route — is genuinely absent right now, the same regression event-listing.spec.ts (EL-001/008/013) and home-screen.spec.ts (HOME-019/035/036/054) already track. There is no Events screen anywhere in the live UI to place or verify an offers chip on.
  - **OFR-038 is real, deliberately left failing:** confirmed live via a real click that tapping the homepage's offer/discount chip navigates to the movie's own detail page, never to `/more/offers/{id}` — this directly confirms the source sheet's own TC_App_039a "offer chip tap not redirecting" defect note above. Asserted against the correct expected behavior (offer chip → offer detail) rather than weakened to match the bug, per this file's own established policy for known live defects.

## Scenarios

- **Suggested journey:** `src/tests/offers.spec.ts`
- **Sheet:** `M6-website.pdf` (pages 1–3) → single "Website" test-execution table

- [ ] **OFR-001** — Verify user can navigate to Offers section | Steps: open app → tap More → tap Offers | Expected: navigated to Offers listing page | `@P0 @Regression`
- [ ] **OFR-002** — Verify Offer category tabs are displayed | Steps: navigate to Offers, observe tabs | Expected: category tabs shown (grounded: All offers/Bank/Normal/GoogleWallet) | `@P0 @Regression`
- [ ] **OFR-003** — Verify "All Offers" tab displays all offers | Steps: go to Offers → tap All Offers | Expected: all offers across categories shown | `@P0 @Regression`
- [ ] **OFR-004** — Verify "Bank" tab displays only bank offers | Steps: navigate to Offers → tap Bank tab | Expected: only bank-related offers shown | `@P0 @Regression`
- [ ] **OFR-005** — Verify "Others" tab displays only other offers | Steps: navigate to Offers → tap Others tab | Expected: only other offers shown | `@P0 @Regression`
- [ ] **OFR-006** — Verify Payment Wallet/UPI tab displays only wallet/UPI offers | Steps: navigate to Offers → tap Payment Wallet/UPI tab | Expected: only wallet/UPI offers shown | `@P0 @Regression`
- [ ] **OFR-007** — Verify Offer card details are displayed correctly | Steps: navigate to any offer category, observe cards | Expected: banner/image, title, applicable-on, card/UPI name, validity date shown | `@P0 @Regression`
- [ ] **OFR-008** — Verify user can open Offer Detail page | Steps: tap any offer card | Expected: Detail page opens with banner, title, applicable-on, description, validity, Share icon, Proceed to Book CTA | `@P0 @Regression`
- [ ] **OFR-009** — Verify Share icon opens native share sheet | Steps: on Offer Detail, tap Share → select channel | Expected: native share sheet opens with pre-filled "Check out this offer at PVR! <url>" message | `@P0 @Regression`
- [ ] **OFR-010** — Verify Offer URL navigates back to same offer's detail page | Steps: tap Share → select channel → tap back | Expected: navigates back to the same offer's detail page | `@P0 @Regression`
- [ ] **OFR-011** — Verify shared URL deep-links to the same offer | Steps: open shared offer link | Expected: navigated to same offer detail page (app if installed, else web) | `@P0 @Regression`
- [ ] **OFR-012** — Verify top-priority offers appear first | Steps: navigate to Offers | Expected: priority offers at top, remaining follow default sort | `@P1 @Regression`
- [ ] **OFR-013** — Verify Offers section hidden when no offers available | Steps: open app → check nav menu | Expected: "Offers" option not visible | `@P1 @Regression`
- [ ] **OFR-014** — Verify expired offers are not displayed | Steps: navigate to Offers | Expected: expired offers not shown | `@P0 @Regression`
- [ ] **OFR-015** — Verify offers not shown for invalid/unconfigured city | Steps: change city → navigate to Offers | Expected: "Offers" option not visible | `@P0 @Regression`
- [ ] **OFR-016** — Verify behavior with no internet connection | Steps: disable internet → open app → navigate to Offers | Expected: proper "No Internet Connection" error, offers not loaded | `@P0 @Regression`
- [ ] **OFR-017** — Verify incorrect/manipulated Offer URL handling | Steps: open manipulated offer link | Expected: error page shown, app does not crash | `@P1 @Regression`
- [ ] **OFR-018** — Verify tapping Share without internet | Steps: disable internet → open Offer Detail → tap Share | Expected: share sheet may open, URL not broken, no crash | `@P1 @Regression`
- [ ] **OFR-019** — Verify offer visibility on exact start date/time | Steps: launch app at configured start time → navigate to Offers | Expected: offer visible immediately, no delay | `@P1 @Regression`
- [ ] **OFR-020** — Verify offer behavior on exact expiry date/time | Steps: navigate to Offers just before/at expiry | Expected: visible until exact expiry time, then disappears automatically | `@P1 @Regression`
- [ ] **OFR-021** — Verify offer expiry at midnight | Steps: keep app open across midnight transition → observe listing | Expected: offer disappears exactly at configured time, no incorrect carry-forward | `@P2 @Regression`
- [ ] **OFR-022** — Verify deep-link behavior when offer expires after sharing | Steps: open shared URL after the offer has expired | Expected: proper "offer expired" message, no crash/broken page | `@P0 @Regression`
- [ ] **OFR-023** — Verify deep link when app is not installed | Steps: click shared offer link on a device without the app | Expected: opens in mobile browser, correct offer detail page displayed | `@P0 @Regression`
- [ ] **OFR-024** — Verify offer display after city change | Steps: open Offers in City A → change to City B → revisit Offers | Expected: City-A-only offer no longer visible in City B; only city-specific offers shown | `@P0 @Regression`
- [ ] **OFR-025** — Verify UI when offer banner image fails to load | Steps: open Offers page with a corrupted/missing image | Expected: placeholder image shown, UI layout intact, no crash | `@P1 @Regression`
- [ ] **OFR-026** — Verify behavior with very long offer title | Steps: navigate to Offers listing | Expected: title truncates with ellipsis, UI doesn't break, alignment stays proper | `@P1 @Regression`
- [ ] **OFR-027** — Verify switching tabs quickly | Steps: rapidly switch All → Bank → Wallet → Others | Expected: correct data loads each time, no category mix-up, no flicker/crash | `@P1 @Regression`
- [ ] **OFR-028** — Verify app behavior when internet drops mid-load | Steps: navigate to Offers → disable internet while loading | Expected: proper error state, retry option available, app doesn't freeze | `@P0 @Regression`
- [ ] **OFR-029** — Verify behavior when admin removes priority while user is on page | Steps: admin removes priority flag → user refreshes page | Expected: updated data reflected, that offer no longer shown first | `@P2 @Regression`
- [ ] **OFR-030** — Verify share message format integrity | Steps: tap Share → copy message → paste elsewhere | Expected: exact format "Check out this offer at PVR! <Offer URL>", URL clickable/correct, no extra characters | `@P0 @Regression`
- [ ] **OFR-031** — Verify offer visibility for guest vs. logged-in user | Steps: navigate to Offers logged out → log in → compare | Expected: offers visible to both guest and logged-in user | `@P0 @Regression`
- [ ] **OFR-032** — Verify "Explore More" CTA from home "Explore Offers" section | Steps: open home → tap Explore More under Explore Offers | Expected: redirected to Offers listing page | `@P0 @Regression`
- [ ] **OFR-033** — Verify offer chip below "Now Showing" movies on home | Steps: open home → tap offer chip below a movie | Expected: bottom sheet opens with the offers listing | `@P1 @Regression`
- [ ] **OFR-034** — Verify Offers chip on Movie Details "Also playing" section | Steps: open home → open movie details → check Also Playing | Expected: offers chip visible | `@P1 @Regression`
- [ ] **OFR-035** — Verify Offers chip on Events screen | Steps: open home → open Events screen | Expected: offers chip visible | `@P1 @Regression`
- [ ] **OFR-036** — Verify Offers chip on Event Details "Also playing" section | Steps: open home → open event details → check Also Playing | Expected: offers chip visible | `@P1 @Regression`
- [ ] **OFR-037** — Verify Offers chip on Curated Shows screen | Steps: open home → navigate to Curated Shows | Expected: offers chip visible | `@P1 @Regression`
- [ ] **OFR-038** — Verify tapping any offer chip (home/movie details/event/event details/curated shows) navigates to offer detail | Steps: tap offer chip → from bottom sheet tap an offer | Expected: redirects to offer detail screen | `@P0 @Regression` (source Actual Result: currently not working — expect failure until fixed)
- [ ] **OFR-039** — Verify offer tabs shown only when category data exists from showbizz | Steps: open app → navigate to Offers | Expected: only categories with available showbizz data render a tab | `@P1 @Regression`
- [ ] **OFR-040** — Verify back button from Offers screen | Steps: open Offers → tap back | Expected: redirected to the More screen | `@P1 @Regression`
- [ ] **OFR-041** — Verify promoted offers visible on Food screen | Steps: open app → navigate to Food screen | Expected: promoted offers visible | `@P1 @Regression`
- [ ] **OFR-042** — Verify tapping an offer from Food screen | Steps: navigate to Food screen → tap any offer | Expected: offer detail page shown | `@P1 @Regression`
**OFR-043–076 (Retail Offers voucher flow, 34 scenarios) — removed from active scope 2026-09-01.** See Out of scope above for the full finding; not listed here as checkboxes since the underlying feature doesn't exist to test. The original scenario definitions are preserved in git history if this needs to be reopened.

## E2E implementation notes

- **Layering:** `src/tests/offers.spec.ts` → `src/modules/OffersModule.ts` → `src/pages/OffersPage.ts`.
- **Frontend context:** No `dev-repo/` provided. Grounded via read-only headless Playwright against UAT (`inox-uat-web.pvrinox.com`, Mumbai-All), 2026-08-31: `/offers` route confirmed, real tab set is All offers/Bank/Normal/GoogleWallet, offer detail route pattern `/more/offers/{id}?filter=all`, and Food page has a "Book with Ticket"/"Order Anytime" tab pair at `/food`.
- **Reuse:** City/location bootstrap should reuse `LocationHelper.dismissLocationAndSelectCity` (see [[pvr-inox-grounding-technique]] memory / `EventListingPage.ts` precedent) — UAT needs `'Mumbai-All'`/`'Mumbai'`, and the "Enable Location" dialog's **Cancel** button must be dismissed before the manual city picker is interactable. Watch for the same `data-vaul-drawer` sub-city-click flakiness documented for Curated Shows/Event Listing grounding.
- **Locators:** Prefer accessibility-role locators grounded live (offer/voucher cards did not resolve via generic `[class*="card"]` selectors during exploration — resolve via visible offer/voucher title text or a real DOM inspection pass in `/playwright-mcp`).
- **Fixtures / mocks:** OFR-028/047/066 (network drop, location permission) should use Playwright's `context.setOffline()` and `context.grantPermissions()/clearPermissions()` rather than device-level simulation. OFR-071 (voucher expiry) needs either a fast-configurable test voucher or `page.clock` time control — check with backend/admin for a short-TTL test fixture.
- **Tags:** `@Regression` throughout (Complete coverage); `@P0` for the primary navigation/detail/cart/activation path, `@P1` for validation and secondary CTAs, `@P2` for cosmetic/low-priority edge cases, per source sheet Priority column (High/Medium/Low).
- **Run:** `npx playwright test src/tests/offers.spec.ts --project=chromium`

## Source

- **Seed method:** PDF-exported test-case table (pasted directly; no separate Excel/CSV file — Google Sheets link provided required login and could not be fetched headlessly)
- **File:** `M6-website.pdf` (pages 1–3)
- **Sheet:** N/A — single "Website" test-execution table, "Promoted offers" and "Retail Offers" module sections
- **Columns:** Test Summary=`Test case Title`, Test Objective=`Pre Conditions`, Test Steps=`Test Steps/validation point`, Expected Result=`Expected Result (ER)`, also carried: `Priority`, `Actual Result`, `QA Status`
- **Frontend repo:** not provided — grounded instead against live UAT (`inox-uat-web.pvrinox.com`)
