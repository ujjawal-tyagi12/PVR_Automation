import type { Page } from '@playwright/test';
import { clickThroughOverlays, UAT_CITY, UAT_SUB_CITY } from '@utils/LocationHelper';

/**
 * Grounded 2026-08-19 against the real production site (www.pvrinox.com/experiences) via a
 * read-only headless-Playwright diagnostic pass — see scratchpad inspect-experiences*.js
 * scripts. Real flow: header "Experiences" nav link (`href="/experiences"`) opens a page
 * titled "Luxury Cinema Experience in Noida | PVR INOX Movies" with a default-selected
 * experience (DIRECTOR'S CUT on this pass), a movie search input whose placeholder is
 * dynamic per selected experience (`"Movie showing in {EXPERIENCE}"`), and a movie list
 * rendered as `role="button"` cards (poster/title/duration/language/rating/genre) — the same
 * card shape as Global Search results. A microphone icon (`img[alt="Microphone Icon"]`) IS
 * present on this page (unlike the Global Search dialog).
 *
 * Real discrepancy vs. the source sheet: the CTA button text is
 * **"Learn More About {EXPERIENCE}"** (e.g. "Learn More About DIRECTOR'S CUT"), not
 * "Treasure the Experience" as TC_WEB_063 states — the sheet's exact CTA copy is outdated or
 * describes a different build.
 *
 * The experience carousel is a Swiper.js instance (`.swiper-slide` / `.swiper-wrapper`
 * classes) whose visible tile *codes* were observed to differ between grounding passes —
 * one pass showed "4DX"/"PLAYHOUSE"/"PXL"/"GOLD"/"IMAX", a later pass on the same page showed
 * "Kiddles"/"ONYX DINER"/"MX4D"/"ScreenX" instead (the carousel evidently rotates or paginates
 * its tile set). No `role="tab"`/`role="listitem"` semantics were found either, so
 * `experienceTileIcon` clicks the icon element itself (relies on click-event bubbling to
 * whatever wrapping element owns the click handler). **Do not hardcode a specific tile code**
 * — `experienceTileIcons()` returns the raw `.swiper-slide img[alt]` collection; tile-selection
 * logic (skipping known chrome icons, hopping until a target renders) lives in
 * `ExperienceModule.ts`, not here — this page only exposes locators. No distinct "Now
 * Showing"/"Coming Soon" headings were found on this page during grounding (only a single
 * "Movies Showing in {EXPERIENCE}" list) — TODO(heal): confirm whether Coming Soon is a
 * separate section, a filter, or not present for this page at all.
 *
 * Similarly, the *default* selected experience (e.g. INSIGNIA for Mumbai) sometimes has zero
 * movies configured right now — a real, valid "no movies for this experience" content state,
 * not a bug — see `ExperienceModule.selectTileWithMovies()` for the tile-hopping workaround.
 */
export class ExperiencePage {
  constructor(private page: Page) {}

  readonly navLink = () => this.page.getByRole('link', { name: 'Experiences', exact: true });
  readonly pageHeading = (experience: string | RegExp) =>
    this.page.getByRole('heading', { name: experience instanceof RegExp ? experience : new RegExp(`Movies Showing in ${experience}`, 'i') });
  readonly learnMoreCta = () => this.page.getByRole('button', { name: /learn more about/i });
  readonly experienceTileIcon = (code: string) => this.page.getByAltText(code, { exact: true });
  // Grounded 2026-08-19: the carousel is a Swiper.js instance — scope to its slides so the
  // exact tile *codes* (which were observed to change between passes) don't matter.
  readonly experienceTileIcons = () => this.page.locator('.swiper-slide img[alt]');
  readonly movieSearchInput = () => this.page.getByPlaceholder(/movie showing in/i);
  readonly micIconButton = () => this.page.getByAltText('Microphone Icon', { exact: true });
  // Grounded 2026-08-19: durations render as "Xh Ym" OR just "Xm" (short runtimes/trailers) —
  // broadened from an "Xh Ym"-only match, which missed real cards during grounding.
  readonly movieCards = () => this.page.getByRole('button').filter({ hasText: /\d+h|\d+m/ });
  // Grounded 2026-08-31 (EXP-052 pass): each movie card renders its censor rating as a plain
  // `<p>` (not a styled "badge" chip — the 2026-08-21 "no distinct badge element" finding was
  // right about the visual shape, but it IS a distinct, individually-locatable text element
  // with its own resolved CSS, matching real Indian censor rating codes.
  readonly movieCardCensorRating = () => this.movieCards().first().getByText(/^(U|UA|U\/A|A|S)$/, { exact: true });
  readonly movieCardByTitle = (title: string) => this.page.getByRole('button', { name: new RegExp(title, 'i') });
  readonly noExperienceIcon = () => this.page.getByAltText('No Experience Icon', { exact: true });
  // Grounded 2026-08-19: real heading text on first load before a city/location is set.
  readonly locationPermissionPopupHeading = () => this.page.getByRole('heading', { name: /enable location/i });
  // Grounded 2026-08-19: no `<main>` landmark exists on this page (confirmed count 0) — the
  // page heading's own container (an unnamed `<div>`) is the closest real scoping available.
  readonly bannerRegion = () => this.pageHeading(/movies showing in/i).locator('xpath=ancestor::div[1]');
  // Grounded 2026-08-31 (EXP-040/041 pass, 3 independent headless runs): the 2026-08-21 "no
  // description element" finding was wrong — a real prose description paragraph (e.g.
  // "Insignia is a premium cinema brand...") does render, alongside a separate amenities-list
  // paragraph. Both are real `<p>` elements with 60+ chars of text; the description is
  // consistently the *last* of the two (amenities list renders first), reproduced all 3 runs.
  readonly experienceDescriptionText = () => this.page.locator('p').filter({ hasText: /.{60,}/ }).last();

  // TODO(heal): not confirmed against a live run — best-effort guesses from sheet copy only.
  readonly noMoviesMessage = () => this.page.getByText(/no movies (showing|available)/i);
  readonly videoLoadErrorMessage = () => this.page.getByText(/unable to play video/i);
  readonly movieLoadErrorMessage = () => this.page.getByText(/unable to load movies/i);
  readonly micPermissionPopup = () => this.page.getByText(/microphone access|allow.*microphone/i);
  readonly setAlertButton = (movieTitle: string) => this.movieCardByTitle(movieTitle).getByRole('button', { name: /set alert/i });
  readonly deleteAlertButton = (movieTitle: string) => this.movieCardByTitle(movieTitle).getByRole('button', { name: /delete alert|remove alert/i });

  /**
   * Grounded 2026-08-25 (EXP-011 re-grounding): the site has visibly changed since the
   * 2026-08-19 pass above — the "Learn More About {EXPERIENCE}" CTA text button is gone from
   * this build (confirmed live: `learnMoreCta()` now matches 0 elements on every carousel
   * tile tried, and the existing EXP-006 test that depends on it now fails at baseline for
   * this same reason — a pre-existing site-drift break, out of scope to fix here). In its
   * place, the banner's still cinema-hall photo has a small round icon-only "play" button
   * (an SVG with class `lucide-play`, `aria-hidden="true"`, no `aria-label`/accessible name of
   * its own) — clicking it embeds and autoplays a YouTube video inline (confirmed live via a
   * `page.locator('iframe').count()` delta and a screenshot showing the video mid-playback).
   * Not present for every experience (confirmed absent on the "Kiddles" tile during the same
   * pass) — same "hop tiles until the target renders" situation as `learnMoreCta`/movie cards,
   * see `ExperienceModule.selectTileWithBannerVideo`. No accessible name exists to scope this
   * more tightly than "first play-icon button on the page" — acceptable here since only one
   * banner is ever on screen at a time.
   */
  readonly bannerPlayButton = () => this.page.locator('button:has(svg.lucide-play)').first();
  // Grounded 2026-08-25: the video that plays after clicking `bannerPlayButton` is a real
  // `<iframe src="https://www.youtube.com/embed/...">`, not a native `<video>` element.
  readonly bannerVideoFrame = () => this.page.locator('iframe[src*="youtube.com/embed"]');

  async goto(): Promise<void> {
    // Grounded 2026-08-19: overlays (location modal / ad-video) can render late and intercept
    // this click even after an earlier dismissal — see LocationHelper.clickThroughOverlays.
    await clickThroughOverlays(this.page, () => this.navLink().click({ timeout: 6_000 }), { city: UAT_CITY, subCity: UAT_SUB_CITY });
  }

  async selectExperienceTile(code: string): Promise<void> {
    await clickThroughOverlays(this.page, () => this.experienceTileIcon(code).click({ timeout: 6_000 }), { city: UAT_CITY, subCity: UAT_SUB_CITY });
  }

  async searchMovie(keyword: string): Promise<void> {
    await clickThroughOverlays(this.page, () => this.movieSearchInput().fill(keyword, { timeout: 6_000 }), { city: UAT_CITY, subCity: UAT_SUB_CITY });
  }
}
