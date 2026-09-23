import type { Locator, Page } from '@playwright/test';

/**
 * Grounded 2026-09-08 against UAT (inox-uat-web.pvrinox.com, Mumbai geolocation granted) via a
 * read-only headless-Playwright diagnostic pass — see scratchpad `ground-about-us*.js` scripts.
 * Real route: `/about-us` (confirmed 200, real title "About PVR INOX – Leading Cinema Chain in
 * India", real `<h1>`-equivalent heading "The Company") — NOT `/more/about-us` (loads, but blank
 * shell). Matches this repo's established direct-URL pattern (`OffersPage.gotoOffersRoute`,
 * `EventListingPage.gotoEventsRoute`, `CuratedShowsPage.goto`).
 *
 * **Header "More" -> "About Us" click path IS reliable — the earlier "unreliable, like
 * CuratedShowsPage" finding was a locator bug in the grounding script, not a real site flake**:
 * confirmed 5/5 fresh-context attempts once the locators match the real accessible tree. Two
 * separate wrong assumptions caused the original false negatives:
 * 1. The "More" button's accessible name is **"More Arrow Down"**, not "More" — it's a Radix
 *    `dropdown-menu-trigger` whose adjacent `<img alt="Arrow Down">` chevron concatenates into
 *    the computed name (same class of concatenated-name finding as `milestoneButton`/
 *    `teamMemberButton` below). An exact or end-anchored match (`{ name: 'More', exact: true }`
 *    or `/^more$/i`) never matches; a leading-substring match (`/^more/i`) does.
 * 2. The dropdown's items are real `role="menuitem"` entries (a Radix `role="menu"` with 15
 *    items, confirmed live), NOT `role="link"` — `getByRole('link', { name: /about us/i })`
 *    always finds zero matches regardless of the button fix. `getByRole('menuitem', { name:
 *    'About Us', exact: true })` is correct.
 * Content scenarios still use direct URL navigation (matching this repo's established pattern),
 * but the menu path itself is now exercised for real by ABT-001/002 (see `about-us.spec.ts`).
 *
 * **The sheet's five "tabs" (Company / Our Journey / Team / Awards / Brands) are NOT show/hide
 * tab panels** — confirmed live: clicking the "Team" button does not change the URL and does not
 * hide "Company Strength" (still visible afterward). This is a single long page; each tab button
 * is a scroll-to-section control, and every section's heading is present in the DOM regardless of
 * which button was last clicked. Scenarios describing "tab switching"/"default tab" are
 * interpreted as "click the section's nav button and confirm its heading/content is present",
 * not a panel-visibility toggle.
 *
 * Milestone (Our Journey) and Team-member popups are both real `role="dialog"` **vaul drawers**
 * (`data-vaul-drawer`, `data-vaul-drawer-direction="right"`) — same component family as
 * `CuratedShowsPage.ts`'s "Learn More" popup. Their close control is icon-only (an `<svg>` X, no
 * accessible name) but carries the same `data-slot="drawer-close"` attribute, so the same
 * locator pattern applies. `Escape` also confirmed to close the dialog.
 *
 * Milestone/team-member accessible names concatenate two visual lines with no separator (e.g.
 * button name `"1991Inception of PVR Cinemas"`, `"Mr. Alok TandonChief Efficiency & Transformation
 * Officer, PVR INOX LIMITED"`) — matched here via a leading-substring regex, not an exact string.
 *
 * Awards year filter is a real button group (`All` / `2024` / `2025`, not a dropdown) driving a
 * real Swiper carousel (`.about-us-awards-swiper`) of exactly 2 award cards — confirmed live by
 * reading `.swiper-slide` content directly, not just `getByRole('heading')` (these cards render
 * with NO heading role at all, only an `<img alt="{award title}">` plus plain text nodes for
 * movie name + year, e.g. `"Best Adaptive ScreenplayConclave2024"`). Selecting "2024" genuinely
 * filters the DOM to 1 matching slide client-side (no network request fired) — a real, working
 * filter, not dead UI. Both currently-configured years (2024, 2025) have exactly one award each,
 * so there is no year with zero awards to exercise the sheet's "No Awards Found" empty state
 * against without Admin access or mocking.
 *
 * Brands section renders THREE resources, not one — confirmed live via full section HTML: an
 * `IMAX` logo image, a `PVR` logo image (both plain `<img alt="...">`, no click handler found),
 * and a "PVR INOX" branded card with a real, separate title text node (`"Brand Guidelines"`, a
 * `<div>` next to the logo, NOT part of the `Download` button's accessible name) whose Download
 * button navigates cross-origin to a CDN-hosted `.zip` (see `AboutUsModule.ts`).
 */
export class AboutUsPage {
  constructor(private page: Page) {}

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/about-us`);
  }

  /** Real accessible name is "More Arrow Down" (see class doc comment) — matched by leading
   * substring, not exact/anchored-end. */
  readonly moreMenuButton = () => this.page.getByRole('button', { name: /^more/i });
  /** Real role is `menuitem` (a Radix dropdown menu), not `link` — see class doc comment. */
  readonly aboutUsMenuItem = () => this.page.getByRole('menuitem', { name: 'About Us', exact: true });

  // Identity / top of page — "The Company" renders twice (grounded: a kicker + a heading with
  // identical text); `.first()` is the stable match.
  readonly pageHeading = () => this.page.getByRole('heading', { name: 'The Company', exact: true }).first();

  // Section nav buttons — scroll-to-section controls, not show/hide tabs (see class doc comment).
  readonly companyTabButton = () => this.page.getByRole('button', { name: 'Company', exact: true });
  readonly ourJourneyTabButton = () => this.page.getByRole('button', { name: 'Our Journey', exact: true });
  readonly teamTabButton = () => this.page.getByRole('button', { name: 'Team', exact: true });
  readonly awardsTabButton = () => this.page.getByRole('button', { name: 'Awards', exact: true });
  readonly brandsTabButton = () => this.page.getByRole('button', { name: 'Brands', exact: true });

  // Section headings (all present in the DOM regardless of which tab button was last clicked).
  readonly companyStrengthHeading = () => this.page.getByRole('heading', { name: 'Company Strength', exact: true });
  readonly ourJourneyHeading = () => this.page.getByRole('heading', { name: 'Our Journey', exact: true });
  readonly teamHeading = () => this.page.getByRole('heading', { name: 'TEAM', exact: true });
  readonly managementGroupHeading = () => this.page.getByRole('heading', { name: 'Management', exact: true });
  readonly boardOfDirectorsGroupHeading = () => this.page.getByRole('heading', { name: 'Board of Directors', exact: true });
  readonly awardsRecognitionHeading = () => this.page.getByRole('heading', { name: 'Awards & Recognition', exact: true });
  readonly brandsHeading = () => this.page.getByRole('heading', { name: 'Brands', exact: true });

  /** Milestone button accessible name is `"{year}{title}"` with no separator (grounded live). */
  readonly milestoneButton = (year: string) => this.page.getByRole('button', { name: new RegExp(`^${year}`) });

  /** Team member button accessible name is `"{name}{designation}"` with no separator (grounded live). */
  readonly teamMemberButton = (namePrefix: string) =>
    this.page.getByRole('button', { name: new RegExp(`^${AboutUsPage.escapeRegExp(namePrefix)}`) });

  // Vaul-drawer dialog shared by milestone and team-member popups (grounded: real
  // `data-slot="drawer-close"` icon-only close button, same family as CuratedShowsPage's dialog).
  readonly dialog = () => this.page.getByRole('dialog');
  readonly dialogCloseButton = () => this.dialog().locator('button[data-slot="drawer-close"]');

  /** Also matches the "All" reset button — its name is just a plain string like any year. */
  readonly awardsYearFilterButton = (year: string) => this.page.getByRole('button', { name: year, exact: true });

  /** Award cards have no heading role — matched by the real `<img alt="{title}">` (grounded live). */
  readonly awardCardImage = (title: string) => this.page.getByAltText(title, { exact: true });
  readonly awardSlide = (title: string) => this.page.locator('.swiper-slide').filter({ has: this.awardCardImage(title) });
  readonly awardSlides = () => this.page.locator('.about-us-awards-swiper .swiper-slide');

  readonly brandsDownloadButton = () => this.page.getByRole('button', { name: 'Download', exact: true });
  readonly imaxLogo = () => this.page.getByAltText('IMAX', { exact: true });
  readonly pvrLogo = () => this.page.getByAltText('PVR', { exact: true });
  readonly brandGuidelinesTitle = () => this.page.getByText('Brand Guidelines', { exact: true });

  /** ABT-047: no placeholder/fallback image was found anywhere on the page after blocking the
   * real banner request — see class doc comment. */
  readonly placeholderImages = () => this.page.locator('img[src*="placeholder"]');

  private static escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Same "scroll in steps, poll target visibility" mechanic as `HomeScreenPage.scrollUntilVisible`
   * — this page's Our Journey timeline is long enough that a target milestone/section can sit
   * well outside the initial viewport even though it's already attached to the DOM (grounded: all
   * five sections render on load — see class doc comment).
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
