import type { Page } from '@playwright/test';

/**
 * Grounded 2026-08-21 against UAT (inox-uat-web.pvrinox.com, Mumbai) via a read-only
 * headless-Playwright diagnostic pass — see scratchpad ground-moviedetails*.js scripts.
 *
 * Movie tile click (see `HomeScreenPage.ts`) navigates to `/moviesessions/{city}/{slug}/{id}`.
 * Not every movie has real showtimes — "Spider-Man: Brand New Day" was confirmed to
 * ("6 Shows IN 1 Cinema"), so it's the anchor movie for this grounding pass; other movies may
 * be in the same "0 Shows" state observed on `CinemasListingDetailPage.ts`.
 *
 * Confirmed present on this movie's Book Movie tab (the default tab): cinema card with name/
 * address/distance/"Get Directions", a real `<input placeholder="Search for Cinema(s)">`, date
 * buttons (`"21Fri"` etc.), showtime buttons (`"08:00 PM" + language + experience name` as one
 * flowing text block — not separate chips), "Unable to find your convenient showtime?" (the
 * Pickup Your Time trigger), and an "Also playing" strip. Clicking a showtime navigates
 * straight to `/seatLayout/...` with real seat categories/prices — no adult-content or
 * experience-mismatch popup interrupted for this specific movie (not A-rated / not an
 * IMAX-only cinema), so those popups stay unconfirmed.
 *
 * The "Movie Details" tab (a real button, confirmed) shows Ratings, Synopsis, Cast (real
 * names), Trailers, and Also playing headings.
 *
 * Follow-up grounding (2026-08-21, second/third pass): the same filter-button *text* found on
 * `CinemasListingDetailPage.ts` also shows up here in a full button-text sweep — "Filter",
 * "Recliner only", "Show Time", "Price Range", "Sort By", "Experiences" — but unlike that page,
 * "Experiences" specifically DID pass a real `toBeVisible()` check here (confirmed twice); the
 * other five did not (same unreliable-visibility finding as Cinemas Listing's chip strip — see
 * that page's doc comment). Only `experiencesFilterButton` is kept as a locator. Also confirmed:
 * "Read More" and "Share" (a real button, not just an icon). "Pickup Your Time" is a real
 * button/heading text, a more reliable locator than the longer "Unable to find your convenient
 * showtime?" copy this page relied on before. The "no Reset/Clear button, no distance filter"
 * finding from this pass was superseded 2026-08-31 — see the FILTER BY dialog locators below.
 *
 * Third grounding pass (2026-08-25, headless-Playwright diagnostic, see scratchpad
 * ground1..14 scripts): filling the cinema search box with a garbage string (no real cinema
 * could match) renders a real, confirmed message: "Sorry, no cinemas found under the selected
 * filter." — used by MOV-023. A real promotional banner image IS present (confirmed twice, two
 * distinct `<img>`s: `alt="Movie-Banner"` and `alt="Fallback Banner"`, both visible) — used by
 * MOV-027, which the source sheet's `@P2` cosmetic scenario actually maps to.
 * `dateButtons()`/`showtimeButtons()` are confirmed already-visible on first load with zero
 * clicks (no separate "expand" interaction needed) — the anchor movie only had 1 real cinema
 * card so a *second/other* card's collapsed state couldn't be cross-checked, but "first card
 * expanded by default" (MOV-036) itself is confirmed.
 */
export class MovieDetailsPage {
  constructor(private page: Page) {}

  readonly movieTitleHeading = (title: string) => this.page.getByRole('heading', { name: title, exact: true });
  readonly showCountText = () => this.page.getByText(/^\d+ Shows? IN \d+ Cinemas?$/i);

  readonly bookMovieTabButton = () => this.page.getByRole('button', { name: /book movie/i });
  readonly movieDetailsTabButton = () => this.page.getByRole('button', { name: /movie details/i });

  readonly cinemaSearchInput = () => this.page.getByPlaceholder('Search for Cinema(s)');
  readonly getDirectionsButton = () => this.page.getByRole('button', { name: 'Get Directions', exact: true });

  readonly dateButtons = () => this.page.getByRole('button').filter({ hasText: /^\d{1,2}[A-Za-z]{3}$/ });
  readonly showtimeButtons = () => this.page.getByRole('button').filter({ hasText: /\d{1,2}:\d{2}\s*(AM|PM)/i });
  // Grounded 2026-08-26: each showtime button's time-text (e.g. "08:00 AM") is its own `<p>`,
  // one level down — the real status color-coding signal (see MovieDetailsModule doc comment).
  readonly showtimeTimeText = (index = 0) => this.showtimeButtons().nth(index).locator('p').first();
  // Bug fix (2026-08-21): the heading ("Unable to find your convenient showtime?") and the CTA
  // button ("Pickup Your Time") both contain matching text — a combined `getByText` regex
  // resolved to both and threw a strict-mode violation. Targeting the button specifically by
  // role, which is also the more semantically correct target for a "CTA is reachable" check.
  readonly pickupYourTimeCta = () => this.page.getByRole('button', { name: 'Pickup Your Time', exact: true });

  readonly watchTrailerButton = () => this.page.getByRole('button', { name: /watch trailer/i });
  readonly shareButton = () => this.page.getByRole('button', { name: /share/i });
  readonly alsoPlayingHeading = () => this.page.getByRole('heading', { name: 'Also playing', exact: true });
  // Grounded 2026-09-01 (requirements/offers.md OFR-034): an "Also Playing" movie card can
  // carry the same discount-badge button seen on the homepage carousel (e.g. "Flat ₹150 off") —
  // see `HomeScreenPage.movieCardDiscountChip`. Confirmed on a real movie ("Dhurandhar(Hindi)").
  // Re-grounded 2026-09-07: confirmed genuinely volatile on BOTH axes — not just per-movie, but
  // per-load of the SAME movie too (Dhurandhar's Also Playing carried this chip on two
  // back-to-back checks, then had none moments later via a different route to the same movie
  // id). `MovieDetailsModule.openMovieWithAlsoPlayingOfferChip` hops through both axes (several
  // anchor movies, several reloads each) rather than assuming either the first movie or the
  // first load has it.
  readonly alsoPlayingDiscountChip = () => this.page.getByText(/off$/i).first();

  readonly experiencesFilterButton = () => this.page.getByRole('button', { name: 'Experiences', exact: true });

  /**
   * Re-grounded 2026-08-31 (MOV-013 pass, 3 independent headless runs): the 2026-08-21 "no
   * Reset/Clear button found" finding doesn't reproduce — whichever chip in the "Filter"/
   * "Showtime"/"Price Range"/"Sort By"/"Experiences" strip renders opens the same "FILTER BY"
   * `role="dialog"` already confirmed on `CinemasListingDetailPage.ts`, with **8** real tabs
   * here (one more than Cinema Detail's 7): Accessibility, Distance, Experiences, Languages,
   * Price Range, Showtime, Sort By — plus a real "Clear All" button. The Distance tab has a
   * real, live "0 km"–"25 km" range with 2 sliders — contradicting MOV-030/044/045's "no
   * distance filter exists" finding too; those need their own re-grounding pass, not assumed
   * fixed by this one.
   */
  readonly filterChip = (name: string) => this.page.getByRole('button', { name, exact: true }).first();
  readonly filterByDialog = () => this.page.getByRole('dialog');
  readonly filterByDialogClearAllButton = () => this.filterByDialog().getByRole('button', { name: 'Clear All', exact: true });
  // Grounded 2026-08-31 (MOV-031 pass, 3 independent headless runs): starts as plain "Show
  // Results" with no count, and updates live to "Show N Results (In N Cinema)" the moment any
  // filter option is selected — the real "applied filters" feedback signal MOV-031 needs; there
  // is no separate removable-chip list, but this dynamic count is the confirmed, reproducible
  // UI response to an applied filter.
  readonly filterByDialogShowResultsButton = () => this.filterByDialog().getByRole('button', { name: /^show( \d+)? results?/i });
  readonly filterByDialogTab = (
    name: 'Accessibility' | 'Distance' | 'Experiences' | 'Languages' | 'Price Range' | 'Showtime' | 'Sort By',
  ) => this.filterByDialog().getByRole('button', { name, exact: true });

  // Grounded 2026-09-09 (MOV-030 pass, headless diagnostic scripts, deleted after use): with no
  // geolocation permission granted (a real "location not shared" state, not a mocked one), the
  // Distance tab replaces its "0 km"–"25 km" slider with this real, confirmed message instead —
  // the actual "Enable Location" CTA equivalent MOV-030 was looking for.
  readonly filterByDialogEnableLocationMessage = () => this.filterByDialog().getByText(/turn on location/i);

  // Grounded 2026-08-25: real, confirmed-visible message after a no-match cinema search.
  readonly noCinemasFoundMessage = () => this.page.getByText(/no cinemas found under the selected filter/i);
  // Grounded 2026-08-25: real `<img>`s, confirmed twice — the "configured" banner and its
  // fallback both use this alt-text naming convention.
  readonly promoBanner = () => this.page.getByAltText(/movie-banner|fallback banner/i);

  // Movie Details tab content — headings, confirmed real.
  readonly ratingsHeading = () => this.page.getByRole('heading', { name: 'Ratings', exact: true });
  readonly synopsisHeading = () => this.page.getByRole('heading', { name: 'Synopsis', exact: true });
  readonly castHeading = () => this.page.getByRole('heading', { name: 'Cast', exact: true });
  // Grounded 2026-08-31 (MOV-047 pass, 2/3 independent headless runs — 3rd blocked on the
  // unrelated "View Movie Details" tab-click flakiness, not this locator): each cast member is
  // a real `<a href="/cast-detail/{personId}/{movieId}">`, not the ambiguous "first image
  // following the heading" probe the 2026-08-25 grounding relied on (which mismatched onto the
  // Trailers section's play icon). 19 real links found for this movie.
  readonly castMemberLinks = () => this.page.locator('a[href*="cast-detail"]');
  readonly trailersHeading = () => this.page.getByRole('heading', { name: 'Trailers', exact: true });

  // Seat layout page reached after clicking a showtime.
  readonly seatInfoHeading = () => this.page.getByRole('heading', { name: 'SEAT INFO', exact: true });
  readonly billDetailsHeading = () => this.page.getByRole('heading', { name: 'BILL DETAILS', exact: true });
  readonly bookingDetailsHeading = () => this.page.getByRole('heading', { name: 'Booking Details', exact: true });

  /**
   * Grounded 2026-09-09 (MOV-019/020/021 pass, headless diagnostic scripts, deleted after use):
   * "Pickup Your Time" opens a real Radix drawer (`[data-slot="drawer-content"]`, confirmed) —
   * language options (e.g. "English", "English with subtitles"), a "Select Time" trigger, and a
   * "Next" button. Clicking "Select Time" opens a SECOND element that also carries
   * `role="dialog"` — a `[data-slot="popover-content"]` time-picker popover — so a generic
   * `page.getByRole('dialog')` (as used elsewhere on this page for the Filter By dialog)
   * resolves to 2 elements the moment the popover is open and throws a strict-mode violation.
   * Scoping to the drawer/popover `data-slot` attributes specifically avoids that ambiguity.
   * The time picker itself is a custom scroll-wheel widget (Hour/Minutes/AM-PM columns as plain
   * `<span>`s inside a `transform: translate3d()`-animated container) — the Minutes and AM/PM
   * spans are directly clickable and reliably enable "Next"; the Hour column's spans intercept
   * pointer events from the underlying drawer's content and are skipped (a default/unset hour
   * does not block "Next" from enabling).
   */
  readonly pickupYourTimeDrawer = () => this.page.locator('[data-slot="drawer-content"]');
  readonly pickupYourTimeLanguageOption = (language: string) =>
    this.pickupYourTimeDrawer().getByText(language, { exact: true }).first();
  readonly pickupYourTimeSelectTimeTrigger = () => this.pickupYourTimeDrawer().getByText('Select Time', { exact: true });
  readonly pickupYourTimeNextButton = () => this.pickupYourTimeDrawer().getByRole('button', { name: 'Next', exact: true });
  readonly timePickerPopover = () => this.page.locator('[data-slot="popover-content"]');
  readonly timePickerMinuteOption = (minute: string) => this.timePickerPopover().getByText(minute, { exact: true }).first();
  readonly timePickerPeriodOption = (period: 'AM' | 'PM') => this.timePickerPopover().getByText(period, { exact: true }).first();

  async goto(baseUrl: string, city: string, slug: string, id: string): Promise<void> {
    await this.page.goto(`${baseUrl}/moviesessions/${city}/${slug}/${id}`);
  }
}
