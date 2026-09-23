import type { Locator, Page } from '@playwright/test';

/**
 * Grounded 2026-08-21 against UAT (inox-uat-web.pvrinox.com, Mumbai) via a read-only
 * headless-Playwright diagnostic pass — see scratchpad ground-homescreen*.js scripts.
 *
 * Section headings are inconsistent: "IN THE SPOTLIGHT" (trending/spotlight carousel),
 * "Now Showing", "Discover the Experiences", and "Offers" ARE real `<h2>` headings — but
 * "Coming Soon", "Events", "Trailers" render with NO matching `<h2>`/heading element at all
 * (confirmed via `getByRole('heading')` enumeration after a full scroll), even though their
 * content is genuinely present on the page. The nav filter chip strip at the top ("Now
 * Showing" / "Events" / "Coming Soon" / "Experiences" / "Trailers" / "Offers") uses the SAME
 * text as `role="button"` elements, separate from any section heading — clicking a chip does
 * NOT navigate (URL unchanged), so it's an in-page scroll/filter toggle.
 *
 * Movie cards (Now Showing, Coming Soon) are Swiper-carousel `<div>` tiles with NO
 * `role="link"`/`href` — the title renders as an `<h3 style="cursor:pointer">` whose click
 * bubbles up to the swiper-slide's real click handler and navigates to
 * `/moviesessions/{city}/{slug}/{id}` (confirmed live). Event cards are different: real
 * `<a href="/eventsessions/{city}/{slug}/{id}">` links — same structure `EventListingPage.ts`
 * already grounded, so `HomeScreenModule` composes `EventListingPage`/`ExperiencePage` for
 * the Events/Experience sections rather than re-deriving those locators here.
 *
 * No `data-testid` found anywhere on this page (confirmed: 0 elements). No IMAX-related text
 * found anywhere (confirmed: 0 matches) — matches the source sheet's own "Not getting IMAX
 * data" status for the Experience-chips scenarios (HOME-020/021).
 *
 * Bug fix (2026-08-21): two locators grounded wrong initially, both confirmed live:
 * - City prompt: without geolocation permission the FIRST heading shown is "Enable Location"
 *   (an `<h1>`, confirmed the only heading present) — "Select Your City" only appears after
 *   clicking Cancel on that modal, so the prompt check matches either.
 * - `movieTiles()`: a plain `getByRole('heading', {level:3})` picks up "Discover the
 *   Experiences" as element [0] (also rendered as an h3 somewhere on the page, not just the
 *   h2 `experiencesHeading` — a real duplicate), which isn't a movie tile and breaks
 *   `.first()`-based clicks. Filtered out by name.
 * - "Quick Book" text does not exist anywhere on this page (confirmed: 0 matches) — HOME-052
 *   is `test.fixme` for this reason in the spec, not covered by a locator here.
 * - No "Events" heading of any kind exists on this pass (confirmed: `getByRole('heading')`
 *   filtered for "event" returns empty) despite `EventListingPage.ts`'s 2026-08-19 grounding
 *   claiming one — live content drift between passes. `HomeScreenModule` now checks the
 *   confirmed-visible events nav chip and a real event card instead of reusing that heading.
 *
 * Follow-up grounding (2026-08-21, second pass — Spotlight carousel & Trailers): the
 * Spotlight `.swiper` element exposes its live Swiper JS instance (`el.swiper`), confirmed via
 * direct inspection: `autoplay: { enabled: true, delay: 35000, pauseOnMouseEnter: false }`,
 * `loop: false`. Real autoplay exists but at a 35s interval, not the ~5s HOME-014 assumed —
 * `pauseOnMouseEnter: false` and `loop: false` both directly contradict HOME-015/HOME-016's
 * expected behavior (see home-screen.spec.ts for how those two findings are handled).
 * No `<video>` element exists anywhere in the page (confirmed twice, including after scrolling
 * to the Experience section specifically) — the only real video playback is a YouTube embed
 * (`iframe[src*="youtube.com/embed"]`) that loads on-demand after clicking a "Play video"
 * button in the Trailers section (confirmed via network capture: real youtube.com embed/player
 * requests fire). Blocking that embed request (simulating a trailer-load failure) renders no
 * error message at all — the iframe just silently points at a failed URL (see HOME-044).
 * Only one "Play video" button exists in the Trailers section on this pass — insufficient data
 * to confirm a "multiple trailers, selectable list" state (HOME-042). Now Showing movie cards
 * have zero button elements distinct from the card container — no separate "Watch Trailer" CTA
 * exists there (HOME-033). A missing-poster fallback IS real and confirmed: blocking a movie
 * tile's real poster image URL and reloading makes that `<img>` fall back to
 * `/assets/placeholder-image/movie-placeholder-portrait.svg` (HOME-045).
 */
export class HomeScreenPage {
  constructor(private page: Page) {}

  readonly cityButton = () => this.page.getByRole('button', { name: /map point icon/i });
  readonly cityPromptHeading = () => this.page.getByRole('heading', { name: /enable location|select your city/i });

  // "IN THE SPOTLIGHT" trending/spotlight carousel — grounded as a real `<h2>`.
  readonly spotlightHeading = () => this.page.getByRole('heading', { name: 'IN THE SPOTLIGHT', exact: true });

  // Now Showing — the one section confirmed as a real `<h2>`. Movie titles across every
  // carousel (Spotlight, Now Showing, Coming Soon) render as `<h3>` — grounded live: clicking
  // one by its exact title navigates to `/moviesessions/{city}/{slug}/{id}` via bubbling.
  readonly nowShowingHeading = () => this.page.getByRole('heading', { name: 'Now Showing', exact: true, level: 2 });
  readonly movieTiles = () => this.page.getByRole('heading', { level: 3 }).filter({ hasNotText: 'Discover the Experiences' });
  readonly movieCardByTitle = (title: string) => this.page.getByRole('heading', { name: title, exact: true, level: 3 });
  /** BUG FIX (2026-09-17, live run): the raw heading is a small target near the top of a
   * `hover:[box-shadow:...] transition-transform duration-300` card — clicking it directly hit a
   * real, reproducible instability (Playwright's "element is not stable"/intercepted-by-sibling
   * retries, 60s timeout) live, twice. Climbs to the real clickable card ancestor (same
   * `cursor-pointer`/`card-parent` shape `CuratedShowsPage.movieCard` already establishes for the
   * identical class of issue) — a much larger, stable click target; the click still bubbles to the
   * same navigation handler either way (see the class doc comment above confirming bubbling). */
  readonly movieCard = (heading: Locator) => heading.locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " card-parent ")][1]');

  // Grounded 2026-08-31 (HOME-028 pass, 3 independent headless runs): the 2026-08-21 "no filter
  // control on the homepage Now Showing strip" finding was wrong — real "Languages"/"Genre"
  // dropdown buttons render right next to the "Now Showing" heading, each with real checkbox
  // options; selecting one measurably changes the rendered movie-tile count (confirmed:
  // 127 -> 124 `movieTiles()` matches after selecting one genre, all 3 runs).
  readonly nowShowingGenreButton = () => this.page.getByRole('button', { name: 'Genre', exact: true });
  readonly nowShowingLanguagesButton = () => this.page.getByRole('button', { name: 'Languages', exact: true });
  readonly nowShowingGenreOptionCheckbox = () => this.page.locator('.checkmark').first();

  // Grounded: no heading element for these three, despite real content being present —
  // located by nav-chip button instead (the only reliable anchor confirmed for them).
  readonly comingSoonChip = () => this.page.getByRole('button', { name: 'Coming Soon', exact: true });
  readonly eventsChip = () => this.page.getByRole('button', { name: 'Events', exact: true });
  readonly trailersChip = () => this.page.getByRole('button', { name: 'Trailers', exact: true });
  readonly nowShowingChip = () => this.page.getByRole('button', { name: 'Now Showing', exact: true });
  readonly experiencesChip = () => this.page.getByRole('button', { name: 'Experiences', exact: true });
  readonly offersChip = () => this.page.getByRole('button', { name: 'Offers', exact: true });
  // Re-grounded 2026-08-31: unlike the six chips above (which filter/scroll content on the
  // same page), "Curated Shows" navigates to its own dedicated route (`/curated-shows`, real
  // `<h2>Curated Shows</h2>` heading) — confirmed reliably present and clickable across 3
  // independent headless runs. The 2026-08-21 "0 matches" finding for it does not reproduce;
  // "ScreenIT" (HOME-056) genuinely still has 0 matches, so that one stays correctly blocked.
  readonly curatedShowsChip = () => this.page.getByRole('button', { name: 'Curated Shows', exact: true });
  readonly curatedShowsHeading = () => this.page.getByRole('heading', { name: 'Curated Shows', exact: true });

  readonly experiencesHeading = () => this.page.getByRole('heading', { name: 'Discover the Experiences', exact: true });
  readonly experiencesViewMoreLink = () => this.page.getByRole('link', { name: /view more/i });

  readonly offersHeading = () => this.page.getByRole('heading', { name: 'Offers', exact: true, level: 2 });
  // Grounded 2026-09-07 (requirements/offers.md OFR-032): the home "Offers" section's CTA is a
  // real `<button aria-label="View all offers">` (visible text "View More") sitting right next
  // to the `offersHeading` — NOT literally "Explore More"/"Explore Offers" text as the source
  // sheet describes (no element with that exact wording exists anywhere on this page, confirmed
  // via a full-page text sweep). Clicking it confirmed live to navigate to `/more/offers`, which
  // renders the exact same Offers listing (same 4 category tabs, same offer cards) as the
  // `/offers` route `OffersPage.gotoOffersRoute` uses elsewhere in this suite.
  readonly offersViewMoreButton = () => this.page.getByRole('button', { name: 'View all offers', exact: true });
  // Grounded 2026-08-31: a movie-card discount badge (e.g. "Flat ₹150 off", a real `<button>`)
  // renders on some Now Showing tiles — this is the closest live equivalent to the source
  // sheet's "offer chip below Now Showing movies" (requirements/offers.md OFR-033). Tapping it
  // navigates straight to that movie's detail/booking page (`/moviesessions/...`), NOT a bottom
  // sheet with an offers listing as the sheet describes — see OffersModule for the real
  // assertion. The sticky filter-chip strip intercepts a plain click here (same class of issue
  // `dismissLocationAndSelectCity` documents elsewhere), so callers should scroll it into view
  // and click with `force: true`.
  readonly movieCardDiscountChip = () => this.page.getByText(/off$/i).first();

  readonly reReleaseTag = () => this.page.getByText('Re-Release', { exact: true });
  readonly footer = () => this.page.locator('footer');
  readonly topNav = () => this.page.getByRole('navigation').first();
  readonly downloadAppButton = () => this.page.getByRole('button', { name: /download app/i });

  // Trailers section (reached via `trailersChip`) — grounded 2026-08-21.
  readonly playVideoButton = () => this.page.getByRole('button', { name: 'Play video', exact: true });
  readonly trailerVideoFrame = () => this.page.locator('iframe[src*="youtube.com/embed"]');

  readonly moviePosterImageByAlt = (alt: string) => this.page.getByAltText(alt, { exact: true });
  // Grounded 2026-08-21: content renders behind a skeleton for several seconds after load (see
  // `LocationHelper.waitForHomepageReady` doc comment) — waiting for a real CDN poster image to
  // actually attach avoids reading `nowShowingPosterCandidates()` mid-skeleton.
  readonly anyRealPosterImage = () => this.page.locator('img[src*="uat-media.pvrinox.com"]');

  /**
   * Bug fix (2026-08-21, 3rd pass): originally scoped to the Now Showing section only, but a
   * live full-suite run showed Now Showing can have zero real (non-placeholder) posters at a
   * given moment even while Spotlight/Coming Soon do — the same per-movie missing-poster data
   * gap this check exists to test can, apparently, affect an entire section's movies at once.
   * Searches every real poster page-wide instead (still identified by the `uat-media.pvrinox.com`
   * CDN domain, excluding decorative/icon images by alt text) so the candidate pool isn't tied
   * to one section's current data state. Earlier bug fixes folded in: a page-wide
   * `.swiper-slide` + `movieTiles()` locator combo previously matched 2 slides for the same
   * title (Spotlight and Now Showing render the same movie) and, separately, a promo/placeholder
   * slide with no real `<img>` — both avoided here by reading `src`/`alt` directly instead of
   * locator-chaining through slide containers. An unqualified `alt.length > 0` filter also once
   * matched small UI icons (e.g. a 12x12 "Filter Icon"); excluded by name below.
   */
  async realMoviePosterCandidates(): Promise<{ src: string; alt: string }[]> {
    return this.page.evaluate(() => {
      type El = { querySelectorAll: (selector: string) => El[]; getAttribute: (name: string) => string | null };
      const doc = (globalThis as unknown as { document: { querySelectorAll: (selector: string) => El[] } }).document;
      return Array.from(doc.querySelectorAll('img'))
        .map((img) => ({ src: img.getAttribute('src') || '', alt: img.getAttribute('alt') || '' }))
        .filter((candidate) => candidate.alt.length > 0 && candidate.src.includes('uat-media.pvrinox.com') && !/icon|gif|background/i.test(candidate.alt));
    });
  }

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(baseUrl);
  }

  /**
   * Grounded 2026-08-21 — CONFIRMED BUG (product decision: treat as a real bug, same as
   * HOME-058): a raw diagnostic script polling `autoplay.running` every 2s showed it flips from
   * `true` to permanently `false` within ~2s of page load — consistent with the live config's
   * `disableOnInteraction: true` firing off the location-modal-dismiss interaction path (which
   * passes near/through the carousel). Reading `running` directly a few seconds after ready is
   * both faster and more precisely targeted at the actual mechanism than polling for a slide
   * change over the full 35s configured delay.
   */
  async spotlightAutoplayIsRunning(): Promise<boolean> {
    return this.page.evaluate(() => {
      const doc = (globalThis as unknown as { document: { querySelector: (selector: string) => { swiper?: { autoplay?: { running?: boolean } } } | null } }).document;
      const el = doc.querySelector('.swiper');
      return Boolean(el?.swiper?.autoplay?.running);
    });
  }

  /** Grounded 2026-08-21: reads the Spotlight swiper's live JS config (`autoplay.pauseOnMouseEnter`, `loop`) directly, rather than inferring it behaviorally. */
  async spotlightAutoplayConfig(): Promise<{ pauseOnMouseEnter: boolean; loop: boolean } | null> {
    return this.page.evaluate(() => {
      const doc = (globalThis as unknown as { document: { querySelector: (selector: string) => { swiper?: { params?: { autoplay?: { pauseOnMouseEnter?: boolean }; loop?: boolean } } } | null } }).document;
      const el = doc.querySelector('.swiper');
      if (!el?.swiper) return null;
      return { pauseOnMouseEnter: Boolean(el.swiper.params?.autoplay?.pauseOnMouseEnter), loop: Boolean(el.swiper.params?.loop) };
    });
  }

  /**
   * Offers/footer content is progressively lazy-rendered as the page scrolls (confirmed live —
   * a blind scroll-to-element doesn't work since the target isn't in the DOM until scrolled
   * near), so this scrolls in steps and polls the target's own visibility after each one
   * (a real conditional wait, not a fixed sleep) rather than guessing a fixed number of steps.
   */
  async scrollUntilVisible(target: () => Locator, maxSteps = 20): Promise<void> {
    for (let i = 0; i < maxSteps; i++) {
      const found = await target()
        .first()
        .waitFor({ state: 'visible', timeout: 300 })
        .then(() => true)
        .catch(() => false);
      if (found) return;
      await this.page.mouse.wheel(0, 800);
    }
  }
}
