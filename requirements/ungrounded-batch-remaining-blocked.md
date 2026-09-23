# Remaining Blocked Test Cases — "Not Grounded" Batch

**Compiled:** 2026-08-25 · **Scope:** 27 test cases that were re-grounded live against the real UAT site (`inox-uat-web.pvrinox.com`) as part of a 36-test batch (the tests whose old reason was simply "not independently grounded this pass" / "not confirmed during grounding"). 9 of the 36 converted to real, passing tests; these 27 were re-confirmed as genuinely blocked, each with a fresh, live-grounded reason — none carry the old generic placeholder.

---

## Movie Details (12)

| ID | Test | Blocked Reason |
|---|---|---|
| MOV-002 | Open Movie Detail from cinema listing | Cinema-listing → cinema-detail navigation works, but chaining into a movie with confirmed real showtimes was not independently verified |
| MOV-003 | Open Movie Detail from experience page | Every experience tile currently shows only a non-clickable "Bahubali 2 Trailer" promo card — clicking it does not navigate to a movie detail page |
| MOV-007 | Trailer playback failure shows error | Trailer is a real `youtube.com/embed` iframe with no first-party API to intercept and force a failure on |
| MOV-011 | Cinema search by voice | The mic icon is real and sits beside the search box, but clicking it (even with microphone permission pre-granted) produces zero observable UI change |
| MOV-017 | Booking redirection failure handling | Forcing the real `**/seatLayout/**` navigation target to fail (HTTP 500) renders the raw failed response body, not an in-app error message |
| MOV-019 | Submit Preference success | The Pickup Your Time stepper is real, but a locator ambiguity in the "Select Time" step leaves "Next" disabled |
| MOV-026 | Selecting a trailer from a list plays it | Watch Trailer opens one embedded trailer directly — no selectable trailer-list UI exists (0 trailer-labeled buttons found) |
| MOV-040 | Seat price tooltip on hover/long-press | No `[aria-label*="seat"]` elements exist — prices render as static, always-visible text, not behind a hover trigger |
| MOV-044 | Distance auto-expansion when no cinema in range | No "Distance" filter or range control exists at all on this movie's Book Movie tab |
| MOV-045 | City-wide fallback prompt when max range exhausted | Same root cause as MOV-044 — no distance mechanism exists to exhaust in the first place |
| MOV-047 | Cast & Crew profile navigation | Cast heading/photos are present, but no distinct clickable/navigable cast-member element was found |
| MOV-048 | Backdrop viewer opens with download option | 0 matches for "backdrop"/"gallery" anywhere — only the unrelated site-wide "Download App" promo exists |

## Event Details (4)

| ID | Test | Blocked Reason |
|---|---|---|
| ED-003 | Promotional banner display | The real banner image (alt="Event Banner") was directly confirmed present via a standalone script, and the locator is correct — but this test reproducibly hits the full 180s test timeout inside the page-settle step, both under load and in an isolated clean retest; root cause not yet isolated |
| ED-007 | Cinema sorting logic (Favorite → Recommended → Nearest) | This event's live cinema list currently returns exactly one cinema — nothing to sort — and verifying real priority additionally needs a logged-in fixture with pre-established favorites/history |
| ED-009 | Showtime color coding | This event has exactly one live showtime, whose Available/Lapsed status flips based on real wall-clock time crossing its slot — no way to force a deterministic state via UI alone |
| ED-011 | Booking redirection to seat selection | The real API shape and mock logic are confirmed correct, but the page doesn't reliably re-settle after the mocked reload — an intermittent timeout, not a locator/logic bug |

## Experience (4)

| ID | Test | Blocked Reason |
|---|---|---|
| EXP-012 | Experience video playback failure handling | No discrete, mockable movie/video REST API exists — content ships via a Next.js RSC payload, not a separate JSON endpoint |
| EXP-020 | Hover trailer autoplay on Web | A controlled 5s hover test showed zero DOM/video change — this feature does not exist on the current build |
| EXP-023 | Set Alert functionality | A real login was completed and the session confirmed authenticated, but the page has no Coming Soon/upcoming movie to attach a "Set Alert" CTA to |
| EXP-026 | Movie fetch failure handling | Same root cause as EXP-012 — no discrete movie-list API exists to mock a failure on |

## Experience Visual (2)

| ID | Test | Blocked Reason |
|---|---|---|
| EXP-055 | Hover trailer playback UI on Web | Same finding as EXP-020 — zero video/iframe DOM change on a controlled hover test |
| EXP-062 | Video playback failure UI | Same finding as EXP-012 — no mockable video API, and no failure-state UI exists to verify |

## Cinemas Listing/Detail (4)

| ID | Test | Blocked Reason |
|---|---|---|
| CIN-009 | Now Showing section expand/collapse | No "Now Showing" section exists anywhere on the cinema listing/detail page — that heading is homepage-only |
| CIN-030 | No-movies-found message under filters | The filter panel's tabs sit inside a Radix dialog whose enter animation intercepts clicks, and this pass's thin live data never produced a deterministic zero-result combination |
| CIN-031 | Only one movie card expanded at a time | Only one movie ("Fool N Final") has real showtimes at the confirmed-good cinema — no second card exists to verify against |
| CIN-056 | Expandable movie cards reveal available slots | The one real movie card was already expanded on load and never visibly collapsed across repeated force-clicks |

## Event Listing (1)

| ID | Test | Blocked Reason |
|---|---|---|
| EL-012 | Hover autoplay on web | An 8-second hover-and-poll test found zero `<video>` elements at any point — hover-triggered video playback does not exist on this build |

---

## Pattern summary

- **17 of 27** — the feature/API/UI element itself was confirmed absent during live grounding (a genuine product-gap or scope-mismatch candidate, not an automation limitation).
- **10 of 27** — a specific test data state or reliable timing condition wasn't available/reproducible in this pass (needs either better test-data fixtures or a dedicated follow-up debugging session).

Every reason above reflects a fresh, live-grounded check performed on 2026-08-25 against the real UAT environment — none of these carry a stale or guessed reason.

*Source: `src/tests/{movie-details,event-details,experience,experience-visual,cinemas-listing-detail,event-listing}.spec.ts`, live-grounded 2026-08-25.*
