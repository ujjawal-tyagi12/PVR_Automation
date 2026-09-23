# Out-of-Scope Test Cases — Mapped to Source Sheet (TC_WEB IDs)

**Client sheet:** `PVR INOX — Test Cases - M4 / Website.pdf` (TC_WEB_001–447)

Generated 2026-08-25. Source: `src/tests/*.spec.ts` (`test.fixme` calls) cross-referenced against
`requirements/{module}.md` scenario lines and their `Row:`/`Rows:` annotations (or, for modules that
map 1:1 with no per-line annotation, the module file's own header note stating the 1:1 range).

**Mapping method per module:**
- `global-search.md`, `event-listing.md`, `event-details.md`, `experience.md` (functional EXP-001–028)
  and the visual-conformance rows in `experience.md` that are implemented in `experience-visual.spec.ts`
  (EXP-029–068) — **no per-line "Rows:" annotation exists**; these files instead state an explicit 1:1
  mapping and exact `TC_WEB` range in their "Test coverage" header, confirmed by spot-checking specific
  rows named in that header text against the matching scenario. TC_WEB ID = offset + descriptive-ID number.
- `home-screen.md`, `cinemas-listing-detail.md`, `movie-details.md` — each scenario line carries its own
  explicit `Row:`/`Rows:` annotation, used directly.

Total skipped tests mapped: **186**. All 186 were mapped with a specific TC_WEB ID (or IDs). None were
left unmapped — every fixme ID had either a direct per-line annotation or a file-header-confirmed 1:1
offset. See "Confidence notes" at the end for the handful of rows that rely on the offset-formula method
rather than a literal per-line annotation.

---

## global-search.spec.ts → requirements/global-search.md (GS-XXX → TC_WEB_XXX, 1:1)

| Descriptive ID | TC_WEB ID(s) | Brief reason |
|---|---|---|
| GS-003 | TC_WEB_003 | No mic/voice affordance found inside the search dialog during grounding (2026-08-19); confirm on a real Web session or App/M-Site before automating |
| GS-006 | TC_WEB_006 | No dedicated Movie listing route confirmed on production (`/movies`, `/movie`, `/now-showing` all resolve to a generic stub page) |
| GS-023 | TC_WEB_023 | No mic/voice affordance found inside the search dialog during grounding (2026-08-19) |
| GS-024 | TC_WEB_024 | No mic/voice affordance found inside the search dialog during grounding (2026-08-19) |
| GS-025 | TC_WEB_025 | No mic/voice affordance found inside the search dialog during grounding (2026-08-19) |

## event-listing.spec.ts → requirements/event-listing.md (EL-XXX → TC_WEB_(25+XXX), 1:1)

| Descriptive ID | TC_WEB ID(s) | Brief reason |
|---|---|---|
| EL-002 | TC_WEB_027 | No "View All" CTA found near the Events section on either environment during grounding |
| EL-003 | TC_WEB_028 | Source sheet marks this Not Applicable, and there is no "Events" link in the header nav on either environment |
| EL-004 | TC_WEB_029 | No dedicated Event Listing page exists to hold filters |
| EL-005 | TC_WEB_030 | No dedicated Event Listing page exists to hold filters |
| EL-006 | TC_WEB_031 | No dedicated Event Listing page exists to hold filters |
| EL-009 | TC_WEB_034 | No distinct "Watch Promo" CTA confirmed on the homepage event cards during grounding |
| EL-010 | TC_WEB_035 | No distinct "Watch Promo" CTA confirmed on the homepage event cards during grounding |
| EL-011 | TC_WEB_036 | No distinct promo affordance confirmed on the homepage event cards during grounding |
| EL-012 | TC_WEB_037 | Source sheet marks this Not Applicable, and hover-triggered video was not confirmed during grounding |

## event-details.spec.ts → requirements/event-details.md (ED-XXX → TC_WEB_(38+XXX), 1:1)

| Descriptive ID | TC_WEB ID(s) | Brief reason |
|---|---|---|
| ED-002 | TC_WEB_040 | Page still had a loading spinner when interactive elements were inspected during grounding; Watch Trailer CTA not confirmed |
| ED-003 | TC_WEB_041 | Not confirmed during grounding (page still loading) |
| ED-004 | TC_WEB_042 | Not confirmed during grounding (page still loading) |
| ED-006 | TC_WEB_044 | Not confirmed during grounding (page still loading) |
| ED-007 | TC_WEB_045 | Not verifiable without a logged-in fixture with known favorites/history, and not confirmed during grounding |
| ED-008 | TC_WEB_046 | Not confirmed during grounding (page still loading) |
| ED-009 | TC_WEB_047 | Not confirmed during grounding (page still loading) |
| ED-010 | TC_WEB_048 | Not confirmed during grounding, and the source sheet leaves the expected message blank |
| ED-011 | TC_WEB_049 | Not confirmed during grounding, and the source sheet leaves the expected message blank |
| ED-012 | TC_WEB_050 | Needs a filter combination confirmed to return zero cinemas, not established during grounding |
| ED-013 | TC_WEB_051 | Needs network mocking of an unconfirmed promo-video API endpoint |
| ED-014 | TC_WEB_052 | Needs network mocking of an unconfirmed booking API endpoint, and the source sheet leaves the expected message blank |

## experience.spec.ts → requirements/experience.md (EXP-XXX → TC_WEB_(52+XXX), 1:1 — functional rows)

| Descriptive ID | TC_WEB ID(s) | Brief reason |
|---|---|---|
| EXP-001 | TC_WEB_053 | Source sheet marks this Not Applicable; this project automates Web/M-Site via a desktop browser, not a native App context |
| EXP-007 | TC_WEB_059 | Audi-count-based ordering is backend/admin data this project has no test-data control over |
| EXP-008 | TC_WEB_060 | Requires Admin Panel access to configure a priority override, out of scope for this Web spec |
| EXP-011 | TC_WEB_063 | Real CTA is "Learn More About {EXPERIENCE}" (not "Treasure the Experience"), and its click destination/video-list behavior was not confirmed during grounding |
| EXP-012 | TC_WEB_064 | Needs network mocking of the video API, and the real endpoint was not confirmed during grounding |
| EXP-015 | TC_WEB_067 | Grounded 2026-08-19 — clicking the mic icon produces no in-page DOM change; relies on the browser's native getUserMedia() permission prompt, which Playwright cannot assert on |
| EXP-016 | TC_WEB_068 | No separate "Now Showing" section confirmed on this page during grounding (only a single "Movies Showing in {EXPERIENCE}" list) |
| EXP-019 | TC_WEB_071 | No distinct "Watch Trailer" CTA confirmed separately from the card itself during grounding |
| EXP-020 | TC_WEB_072 | Source sheet marks this Not Applicable; hover-triggered video was not confirmed during grounding |
| EXP-022 | TC_WEB_074 | No separate "Coming Soon" section confirmed on this page during grounding |
| EXP-023 | TC_WEB_075 | Requires a logged-in session, and a distinct "Set Alert" CTA on the movie card was not confirmed during grounding |
| EXP-024 | TC_WEB_076 | Depends on EXP-023 (Set Alert) which is itself unconfirmed/login-gated |
| EXP-026 | TC_WEB_078 | Needs network mocking of the movie-list API, and the real endpoint was not confirmed during grounding |
| EXP-027 | TC_WEB_079 | Depends on EXP-026 (movie fetch failure mock) which is itself unconfirmed |
| EXP-028 | TC_WEB_080 | A real "missing poster" data state could not be forced during grounding (all sampled movies had posters) |

## experience-visual.spec.ts → requirements/experience.md (EXP-XXX → TC_WEB_(52+XXX), 1:1 — visual-conformance rows, TC_WEB_081–120)

| Descriptive ID | TC_WEB ID(s) | Brief reason |
|---|---|---|
| EXP-039 | TC_WEB_091 | Verifying carousel DOM order against admin-configured priority needs backend/test-data control not available here |
| EXP-040 | TC_WEB_092 | No description element distinct from the banner heading was confirmed during grounding (see EXP-010) |
| EXP-041 | TC_WEB_093 | No description element distinct from the banner heading was confirmed during grounding (see EXP-010) |
| EXP-052 | TC_WEB_104 | No distinct rating-badge element separate from the full movie-card text was confirmed during grounding |
| EXP-053 | TC_WEB_105 | No distinct experience-tag element separate from the full movie-card text was confirmed during grounding |
| EXP-054 | TC_WEB_106 | App/M-Site is out of scope for this desktop-browser Web spec |
| EXP-055 | TC_WEB_107 | Hover-triggered video was not confirmed during grounding (see EXP-020) |
| EXP-056 | TC_WEB_108 | No separate "Now Showing" section confirmed on this page during grounding (see EXP-016) |
| EXP-057 | TC_WEB_109 | No separate "Coming Soon" section confirmed on this page during grounding (see EXP-022) |
| EXP-058 | TC_WEB_110 | No separate "Coming Soon" section confirmed on this page during grounding (see EXP-022) |
| EXP-059 | TC_WEB_111 | Depends on EXP-023 (Set Alert), which is login-gated and unconfirmed |
| EXP-060 | TC_WEB_112 | Depends on EXP-023 (Set Alert), which is login-gated and unconfirmed |
| EXP-062 | TC_WEB_114 | Needs network mocking of the video API, and the real endpoint was not confirmed during grounding (see EXP-012) |
| EXP-064 | TC_WEB_116 | Same finding as EXP-015 — no in-page popup exists; the browser's native getUserMedia() prompt is not something Playwright can assert on |
| EXP-065 | TC_WEB_117 | A real "missing poster" data state could not be forced during grounding (see EXP-028) |
| EXP-067 | TC_WEB_119 | No locale switch or non-English content was confirmed reachable during grounding |

## home-screen.spec.ts → requirements/home-screen.md (HOME-XXX → per-line "Row(s):" annotation)

| Descriptive ID | TC_WEB ID(s) | Brief reason |
|---|---|---|
| HOME-004 | TC_WEB_125, TC_WEB_169, TC_WEB_237 | Verifying carousel order against admin-configured priority needs backend/test-data control not available here |
| HOME-005 | TC_WEB_126 | Needs comparing carousel content across two city selections against a known PAN-India admin flag |
| HOME-006 | TC_WEB_127 | Needs a movie confirmed admin-marked non-trending as negative test data; not available |
| HOME-007 | TC_WEB_128 | Needs a trending movie confirmed to have zero showtimes as test data; not available |
| HOME-008 | TC_WEB_129, TC_WEB_170, TC_WEB_238 | Needs a logged-in session with known booking/preference history to compare against; out of scope for this pass |
| HOME-009 | TC_WEB_130, TC_WEB_171, TC_WEB_239 | Backend sort logic, not verifiable by inspecting carousel DOM order alone without known show-count data per title |
| HOME-010 | TC_WEB_131, TC_WEB_172, TC_WEB_240 | Depends on HOME-004/008/009 admin/personalization/base-logic data, none independently confirmable here |
| HOME-012 | TC_WEB_132 | Needs known admin-priority test data to confirm which movie should be top |
| HOME-013 | TC_WEB_133 | Needs a city/moment with exactly one trending movie configured as test data; current data always has multiple |
| HOME-020 | TC_WEB_139 | Source sheet itself marks this "Not getting IMAX data"; confirmed live — zero IMAX-related text found anywhere on the page |
| HOME-021 | TC_WEB_140 | Same as HOME-020 — the chips themselves were never confirmed present |
| HOME-022 | TC_WEB_141, TC_WEB_177, TC_WEB_245 | Backend/admin data, not verifiable via carousel DOM order alone |
| HOME-024 | TC_WEB_142 | Confirmed live (2026-08-21) — no `<video>` element exists anywhere on this page; only real video playback is an on-demand YouTube embed in Trailers, not an ambient autoplaying banner video |
| HOME-025 | TC_WEB_143 | Needs a specific experience confirmed to have no video as test data |
| HOME-028 | TC_WEB_180, TC_WEB_248 | No filter control confirmed present on the homepage Now Showing strip during grounding |
| HOME-029 | TC_WEB_146, TC_WEB_181, TC_WEB_207, TC_WEB_249, TC_WEB_275 | Backend sort logic, not verifiable via DOM order without known showtime-count data per title |
| HOME-030 | TC_WEB_147 | Needs a movie confirmed to have zero showtimes as negative test data |
| HOME-032 | TC_WEB_150, TC_WEB_198, TC_WEB_266 | Needs a Now Showing movie confirmed to have no trailer as test data |
| HOME-033 | TC_WEB_183, TC_WEB_251 | Confirmed live (2026-08-21) — a Now Showing movie card has zero button elements distinct from the card container; no separate "Watch Trailer" CTA exists there |
| HOME-034 | TC_WEB_184, TC_WEB_252 | No "Book Now" button confirmed present on homepage movie cards during grounding (0 matches) |
| HOME-037 | TC_WEB_157 | EventListingPage.ts's own grounding note confirms no "View All" CTA or dedicated Event Listing page/route exists on this environment |
| HOME-040 | TC_WEB_160 | Confirmed live (2026-08-21) — no `<video>` element exists anywhere on this page; trailer playback only happens on-demand |
| HOME-042 | TC_WEB_195, TC_WEB_263 | Confirmed live (2026-08-21) — only 1 "Play video" button/trailer exists in the Trailers section on this pass |
| HOME-043 | TC_WEB_164, TC_WEB_201, TC_WEB_269 | Confirmed live (2026-08-21) via full network capture — no discoverable client-side API for trending/movie carousel data; content is server-rendered (Next.js) |
| HOME-046 | TC_WEB_204, TC_WEB_272 | Needs comparing carousel content across two cities against known per-city trending data; not available |
| HOME-048 | TC_WEB_210, TC_WEB_278 | Needs a movie confirmed to have advance-opened showtimes as test data; not independently confirmed during grounding |
| HOME-050 | TC_WEB_217, TC_WEB_285 | This project automates Web via a desktop browser; bottom navigation is an App/M-Site-only pattern not applicable here |
| HOME-052 | TC_WEB_219, TC_WEB_287 | Grounded 2026-08-21 — no "Quick Book" text found anywhere on this page (0 matches, case-insensitive) |
| HOME-053 | TC_WEB_220, TC_WEB_288 | App/M-Site-only section per source sheet; out of scope for this desktop-browser Web spec |
| HOME-056 | TC_WEB_223, TC_WEB_291 | Grounded 2026-08-21 — no "ScreenIT" text or nav chip found anywhere on this page |
| HOME-057 | TC_WEB_224, TC_WEB_292 | Grounded 2026-08-21 — no "Curated Shows" text or nav chip found anywhere on this page |
| HOME-059 | TC_WEB_227, TC_WEB_295 | This project's Playwright config runs the chromium project only; cross-browser coverage needs a separate project configuration |
| HOME-060 | TC_WEB_230, TC_WEB_298 | Re-grounded 2026-08-21 (2nd pass) — no favorite/wishlist icons found anywhere on the homepage; no concretely identified restricted homepage action to trigger against |

## cinemas-listing-detail.spec.ts → requirements/cinemas-listing-detail.md (CIN-XXX → per-line "Row(s):" annotation)

| Descriptive ID | TC_WEB ID(s) | Brief reason |
|---|---|---|
| CIN-002 | TC_WEB_305 | Grounded 2026-08-21 — `/cinemas/Mumbai` loads full cinema content even in a fresh context with no geolocation permission granted; no location/city gate blocks this route |
| CIN-004 | TC_WEB_307 | Map View button visibility was inconsistent across grounding passes (sometimes not rendered at all) |
| CIN-005 | TC_WEB_308 | Needs a logged-in session with a pre-marked favorite as test data; not independently confirmed this pass |
| CIN-006 | TC_WEB_310 | Verifying distance-based sort order needs known per-cinema distance data; only 3 cinemas exist in this city's test data |
| CIN-009 | TC_WEB_313 | A cinema with real shows is confirmed reachable, but the specific expand/collapse control was not independently grounded this pass |
| CIN-010 | TC_WEB_314 | No movie title long enough to observe truncation was confirmed as test data during grounding |
| CIN-011 | TC_WEB_315 | Map View instability (see CIN-004) |
| CIN-012 | TC_WEB_316 | Map View instability (see CIN-004) |
| CIN-013 | TC_WEB_317 | Map View instability (see CIN-004) |
| CIN-014 | TC_WEB_318 | Map View instability (see CIN-004) |
| CIN-015 | TC_WEB_319 | Map View instability (see CIN-004) |
| CIN-016 | TC_WEB_320 | Map View instability |
| CIN-017 | TC_WEB_321 | Map View instability (see CIN-004) |
| CIN-018 | TC_WEB_322, TC_WEB_376 | Map View instability (see CIN-004) |
| CIN-019 | TC_WEB_323 | Map View instability (see CIN-004) |
| CIN-022 | TC_WEB_326 | Grounded 2026-08-21, second pass — no search textbox exists on this cinema-first view even with real showtimes present |
| CIN-023 | TC_WEB_327 | Same as CIN-022 — no search UI exists on this view to attach voice search to |
| CIN-024 | TC_WEB_328 | Grounded 2026-08-21, third pass — "Experiences" filter button present in a full text sweep but consistently failed visibility/scroll checks across three checks |
| CIN-025 | TC_WEB_329 | Grounded 2026-08-21, second pass — no separate "Accessibility" filter found; may be inside the generic "Filter" panel |
| CIN-026 | TC_WEB_330 | Same as CIN-025 — no separate "Genre" filter button was found; may be inside the generic "Filter" panel |
| CIN-027 | TC_WEB_331 | Same as CIN-025 — no separate "Language" filter button was found; may be inside the generic "Filter" panel |
| CIN-028 | TC_WEB_332 | Grounded 2026-08-21, third pass — "Price Range" filter button present in a full text sweep but consistently failed visibility checks (see CIN-024) |
| CIN-030 | TC_WEB_334 | Applying a restrictive filter combination to intentionally reach zero results was not independently grounded this pass |
| CIN-031 | TC_WEB_335, TC_WEB_373 | A cinema with real shows is confirmed reachable, but the movie-card expand/collapse interaction itself was not independently grounded this pass |
| CIN-033 | TC_WEB_337 | Hover-tooltip interaction was not independently grounded this pass |
| CIN-036 | TC_WEB_341 | No collapse/expand control for the listing panel was confirmed during grounding |
| CIN-037 | TC_WEB_342 | Depends on CIN-036 which is itself unconfirmed |
| CIN-038 | TC_WEB_343 | Map View instability (see CIN-004) |
| CIN-039 | TC_WEB_344 | Map View instability (see CIN-004) |
| CIN-040 | TC_WEB_345 | Needs a real detected-city-differs-from-saved-city scenario, not reliably reproducible via geolocation mocking alone |
| CIN-041 | TC_WEB_346 | Depends on CIN-040 |
| CIN-042 | TC_WEB_347 | Depends on CIN-040 |
| CIN-043 | TC_WEB_348 | Needs multiple cinemas confirmed at the exact same distance as test data; only 3 cinemas exist, distances not confirmed equal |
| CIN-044 | TC_WEB_349 | Needs 2+ favorited cinemas as test data and a login session; not set up this pass |
| CIN-045 | TC_WEB_350 | Needs 2+ movies confirmed at the exact same showtime count as test data; not independently confirmed this pass |
| CIN-046 | TC_WEB_351 | "(Adfree shows)" text observed appended directly to a cinema's name in test data, not confirmed as a distinct, independently-testable label component |
| CIN-048 | TC_WEB_353 | No movie title long enough to observe truncation was confirmed as test data during grounding |
| CIN-049 | TC_WEB_354 | Grounded 2026-08-21 — a guest clicking the favorite icon triggers a login prompt instead of toggling; this scenario genuinely needs a logged-in session |
| CIN-050 | TC_WEB_356 | Map View instability (see CIN-004) |
| CIN-051 | TC_WEB_357 | Map View instability (see CIN-004) |
| CIN-054 | TC_WEB_360 | Grounded 2026-08-21, third pass — "Experiences" filter button present in a full text sweep but consistently failed visibility checks (see CIN-024) |
| CIN-055 | TC_WEB_361, TC_WEB_371 | Needs a confirmed past/lapsed showtime as negative test data to verify exclusion against; grounded showtimes were all future/available |
| CIN-056 | TC_WEB_362 | Movie-card expand/collapse interaction was not independently grounded this pass |
| CIN-057 | TC_WEB_363 | Same as CIN-056 |
| CIN-058 | TC_WEB_364 | Only 1 movie was confirmed listed on the cinema with real shows during grounding — insufficient movie count to verify relative sort order |
| CIN-059 | TC_WEB_366 | Showtime format grouping was not independently verified against real config this pass — only language ("Hindi") was confirmed on showtime buttons |
| CIN-060 | TC_WEB_367 | Clicking a showtime on this cinema-first view was not independently followed through to a popup/booking screen this pass |
| CIN-061 | TC_WEB_368 | No search textbox was found during grounding (see CIN-022) |
| CIN-062 | TC_WEB_369 | Depends on CIN-061/022 search UI which was not reachable |
| CIN-063 | TC_WEB_370 | Depends on CIN-061/022 search UI which was not reachable |
| CIN-065 | TC_WEB_374 | 6 filter buttons are confirmed reachable, but their exact visual/DOM order was not reliably captured this pass |
| CIN-066 | TC_WEB_375 | Map View instability (see CIN-004) |
| CIN-067 | TC_WEB_377 | "Show Time" filter button confirmed reachable, but its internal range-picker panel was not opened/inspected this pass |
| CIN-068 | TC_WEB_378 | No separate "Language" filter button was found (see CIN-027) — may be inside the generic "Filter" panel |
| CIN-069 | TC_WEB_379 | No separate "Genre" filter button was found (see CIN-026) — may be inside the generic "Filter" panel |
| CIN-070 | TC_WEB_380 | "Experiences" filter button confirmed reachable, but its option list/ordering was not opened/inspected this pass; priority-logic ordering also needs admin data not available here |
| CIN-071 | TC_WEB_381 | No separate "Accessibility" filter button was found (see CIN-025) — may be inside the generic "Filter" panel |
| CIN-072 | TC_WEB_382 | Grounded 2026-08-21, third pass — "Price Range" filter button present in a full text sweep but consistently failed visibility checks (see CIN-024) |
| CIN-073 | TC_WEB_383 | Map View instability (see CIN-004) |
| CIN-074 | TC_WEB_384 | Accessibility icon locators on cinema cards were not individually grounded this pass |
| CIN-075 | TC_WEB_385 | Depends on CIN-061/022 search UI which was not reachable |

## movie-details.spec.ts → requirements/movie-details.md (MOV-XXX → per-line "Row(s):" annotation)

| Descriptive ID | TC_WEB ID(s) | Brief reason |
|---|---|---|
| MOV-002 | TC_WEB_387 | Cinema listing chaining into a movie with real showtimes was not independently grounded this pass — most listed cinemas showed "0 Shows" |
| MOV-003 | TC_WEB_388 | Experience-page-to-movie-detail chaining was not independently grounded this pass |
| MOV-005 | TC_WEB_395 | Video-autoplay state verification is unreliable via DOM inspection alone; source sheet marks this Fail on manual QA too |
| MOV-007 | TC_WEB_397, TC_WEB_446 | Needs network mocking of the trailer/video API, and the real endpoint was not confirmed during grounding |
| MOV-011 | TC_WEB_401 | Mic icon/voice-search flow on the movie detail search box was not independently grounded this pass |
| MOV-012 | TC_WEB_402 | Same as MOV-011 |
| MOV-013 | TC_WEB_403 | No "Reset"/"Clear" button was found during grounding (0 matches), confirmed across two separate grounding passes |
| MOV-014 | TC_WEB_404 | Color-coded status (Available/Filling Fast/Sold Out/Lapsed) was not independently verified against real CSS values this pass |
| MOV-015 | TC_WEB_405 | Needs a confirmed Sold Out showtime as test data; the one movie/cinema grounded had only Available slots |
| MOV-017 | TC_WEB_407 | Needs network mocking of the booking-initiation API, and the real endpoint was not confirmed during grounding |
| MOV-019 | TC_WEB_409 | The Pickup Your Time form fields were not independently grounded this pass |
| MOV-020 | TC_WEB_410 | Same as MOV-019, plus needs network mocking of the submit API |
| MOV-021 | TC_WEB_411 | Same as MOV-019 |
| MOV-023 | TC_WEB_413 | Restrictive-filter interaction was not independently grounded this pass |
| MOV-025 | TC_WEB_415 | Needs a movie confirmed to have no trailer as test data; the anchor movie has a trailer |
| MOV-026 | TC_WEB_417 | Watch Trailer CTA's click-through to a trailer list/player was not independently grounded this pass |
| MOV-027 | TC_WEB_418 | Not independently grounded this pass |
| MOV-029 | TC_WEB_422 | Depends on MOV-003 (open from Experience page) which is itself unconfirmed |
| MOV-030 | TC_WEB_423 | Grounded 2026-08-21, second pass — no distance filter or "Enable Location" CTA found on this movie's Book Movie tab at all (0 matches) |
| MOV-031 | TC_WEB_424 | No distinct "applied filters" summary area found separate from the filter buttons themselves during grounding |
| MOV-033 | TC_WEB_426 | Needs a logged-in session with a favorited cinema as test data; only 1 cinema has real showtimes for this movie |
| MOV-034 | TC_WEB_427 | Same as MOV-033 |
| MOV-035 | TC_WEB_428 | Same as MOV-033 — insufficient cinema count with real showtimes to verify sort order |
| MOV-036 | TC_WEB_429 | Cinema-card expand/collapse state was not independently grounded this pass |
| MOV-037 | TC_WEB_430 | Same as MOV-036 |
| MOV-039 | TC_WEB_432 | Needs a confirmed lapsed (past) showtime as test data; grounded showtimes were all future/available |
| MOV-040 | TC_WEB_433 | Hover-tooltip interaction was not independently grounded this pass |
| MOV-041 | TC_WEB_435 | No popups were triggered for the anchor movie/cinema combination during grounding |
| MOV-042 | TC_WEB_436 | The anchor movie ("Spider-Man: Brand New Day", rated A) did not trigger this popup when booking directly — needs independent re-grounding of the trigger condition |
| MOV-043 | TC_WEB_437 | The anchor movie's one cinema/showtime combination didn't trigger this popup; needs a confirmed IMAX-cinema + non-IMAX-show pairing as test data |
| MOV-044 | TC_WEB_439 | Not independently grounded this pass |
| MOV-045 | TC_WEB_440 | Not independently grounded this pass |
| MOV-047 | TC_WEB_443 | Cast member tap-through was not independently grounded this pass |
| MOV-048 | TC_WEB_444 | Backdrop gallery was not independently grounded this pass |
| MOV-049 | TC_WEB_445 | App/M-Site-only per source sheet; out of scope for this desktop-browser Web spec |

---

## Totals per module

| Module | Skipped count |
|---|---|
| global-search | 5 |
| event-listing | 9 |
| event-details | 12 |
| experience | 15 |
| experience-visual | 16 |
| home-screen | 33 |
| cinemas-listing-detail | 61 |
| movie-details | 35 |
| **Total** | **186** |

## Confidence notes

All 186 fixme entries were mapped to at least one TC_WEB ID. None had a missing/unfindable requirements
scenario line. Two tiers of confidence:

1. **Direct per-line annotation (high confidence)** — `home-screen.md`, `cinemas-listing-detail.md`,
   `movie-details.md`: every scenario line used has its own explicit `Row:` or `Rows:` text, read directly,
   no arithmetic involved.
2. **File-header-stated 1:1 offset (high confidence, but formula-derived rather than a literal per-line
   tag)** — `global-search.md`, `event-listing.md`, `event-details.md`, and both `experience.md`-derived
   spec files (`experience.spec.ts`, `experience-visual.spec.ts`). These files do not print a `Rows:` tag
   on every line; instead their "Test coverage" section states the exact 1:1 `TC_WEB` range and scenario
   count for the module, and this was cross-checked against specific rows the header text names by number
   in context (e.g. `event-listing.md` explicitly ties TC_WEB_028 to the App/M-Site nav row = EL-003, and
   TC_WEB_037 to hover autoplay = EL-012; `event-details.md` explicitly ties TC_WEB_041/042/048/049/052 to
   ED-003/004/010/011/014 by describing their content inline). Every one of these cross-checks matched the
   1:1 offset formula, so the offset was applied uniformly across each file's full range. Flagging this
   distinction per the task's request to not silently treat a formula as equivalent to a literal
   annotation — but confidence is high given the confirmed spot-checks and the files' own explicit
   "1:1, same order, same count" scope statements.
