import type { Page } from '@playwright/test';
import { clickThroughOverlays, UAT_CITY, UAT_SUB_CITY } from '@utils/LocationHelper';

/**
 * Grounded 2026-08-19 against the real production site (www.pvrinox.com) via a read-only
 * headless-Playwright diagnostic pass — see scratchpad inspect-search*.js scripts for how
 * each was found. Real flow: a search icon (unlabeled `<svg class="lucide-search">`, no
 * aria-label) opens a `role="dialog"` overlay containing a single text input
 * (`placeholder="Search movies/events/cinemas"`) and three `role="tab"` category switches
 * ("Movies/Events", "Cinemas", "Experiences"). With no keyword typed, the default
 * "Movies/Events" tab already shows suggestive movie results as `role="button"` cards (no
 * distinct link/CTA per card other than the card itself). The "enable location" CTA's real
 * text is "Enable location to get directions" (plural "directions", not "direction" as in
 * the source sheet).
 *
 * Re-grounded 2026-08-19 against UAT (inox-uat-web.pvrinox.com, Mumbai): the real no-results
 * copy is **"No Result Found!"** (singular "Result", exclamation mark) — not "no matches/
 * results found" as originally guessed. Also confirmed: switching category tabs with an
 * empty keyword does NOT filter results to that category — all three tabs show the same
 * generic suggestive list until a keyword is typed, so `expectCategorySelected` only proves
 * the tab is selected, not that its results differ.
 *
 * Live movie/event titles rotate (a title confirmed present in one grounding pass was gone
 * in the next) — page methods below intentionally avoid hardcoding a title, operating on
 * "whichever result is first" instead, and callers should do the same rather than pinning to
 * a specific movie name.
 *
 * Not yet re-grounded: clear-icon, mic/voice-search affordance (no mic icon found inside the
 * search dialog during this pass — only video-player-control icons were present, suggesting
 * an autoplaying background trailer; voice search may be App/M-Site-only).
 */
export class GlobalSearchPage {
  constructor(private page: Page) {}

  readonly searchIconButton = () => this.page.locator('button').filter({ has: this.page.locator('svg.lucide-search') }).first();
  readonly searchDialog = () => this.page.getByRole('dialog');
  readonly searchInput = () => this.page.getByPlaceholder('Search movies/events/cinemas');
  readonly categoryTab = (name: 'Movies/Events' | 'Cinemas' | 'Experiences') => this.page.getByRole('tab', { name });
  readonly resultCards = () => this.searchDialog().getByRole('button');
  // Grounded 2026-08-28 (GS-017 re-grounding): `resultCards()` also matches non-result chrome
  // buttons in the dialog (a mic/close icon-only button with no accessible text renders before
  // any real result), so `.first()` on it doesn't reliably land on an actual result card.
  // Movie result cards carry a real duration string ("1h", "2h 3m" — same card shape confirmed
  // on ExperiencePage.ts's movie cards) that chrome buttons don't, making this a reliable scope.
  readonly movieResultCards = () => this.resultCards().filter({ hasText: /\d+h|\d+m/ });
  // .first(): multiple category panels can each render a same-named result (see doc comment).
  readonly resultCardByTitle = (title: string) => this.searchDialog().getByRole('button', { name: new RegExp(title, 'i') }).first();
  // .first(): grounded 2026-08-19 — this renders once per cinema result, so multiple can match.
  readonly enableLocationCta = () => this.page.getByRole('button', { name: /enable location to get directions/i }).first();

  // TODO(heal): not confirmed against the live dialog — best-effort guesses from sheet copy only.
  readonly clearIconButton = () => this.searchDialog().getByRole('button', { name: /clear/i });
  readonly micIconButton = () => this.searchDialog().locator('img[alt="Microphone Icon"], button[aria-label*="voice" i]').first();
  readonly micPermissionPopup = () => this.page.getByText(/microphone access|allow.*microphone/i);
  readonly voiceRecognitionFailureMessage = () => this.page.getByText(/couldn.t (recognize|hear)|recognition failed/i);
  // Grounded 2026-08-19 (UAT, Mumbai): real copy is "No Result Found!" (singular, with "!").
  // .first(): renders once per hidden category tab panel, so multiple can match at once.
  readonly noResultsMessage = () => this.searchDialog().getByText(/no result found/i).first();

  async openSearch(): Promise<void> {
    // Grounded 2026-08-19: overlays (location modal / ad-video) can render late and intercept
    // this click even after an earlier dismissal — see LocationHelper.clickThroughOverlays.
    await clickThroughOverlays(this.page, () => this.searchIconButton().click({ timeout: 6_000 }), { city: UAT_CITY, subCity: UAT_SUB_CITY });
    await this.searchDialog().waitFor({ state: 'visible' });
  }

  async typeKeyword(keyword: string): Promise<void> {
    await this.searchInput().fill(keyword);
  }

  async clearKeyword(): Promise<void> {
    await this.searchInput().fill('');
  }

  async selectCategory(name: 'Movies/Events' | 'Cinemas' | 'Experiences'): Promise<void> {
    await clickThroughOverlays(this.page, () => this.categoryTab(name).click({ timeout: 6_000 }), { city: UAT_CITY, subCity: UAT_SUB_CITY });
  }

  async clickResultByTitle(title: string): Promise<void> {
    await this.resultCardByTitle(title).click();
  }

  /** Robust against live-data rotation — reads whatever result is actually first, rather than a hardcoded title. */
  async firstResultText(): Promise<string> {
    return (await this.resultCards().first().innerText()).trim();
  }

  async clickFirstResult(): Promise<void> {
    await this.resultCards().first().click();
  }
}
