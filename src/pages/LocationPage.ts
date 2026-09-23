import type { Page } from '@playwright/test';

/**
 * Ticket: requirements/location.md (72 scenarios, TC_WEB_030-101). Grounded 2026-09-22 against
 * UAT (inox-uat-web.pvrinox.com) via headless Playwright (Playwright MCP's interactive browser
 * tool fails in this sandbox — no display server, see the `pvr-inox-grounding-technique` project
 * memory); scratchpad `ground-location*.js` scripts hold the raw diagnostics this comment
 * summarizes.
 *
 * **Real "Enable Location" modal, confirmed live**: exactly two buttons — "Cancel" and "Enable"
 * — plus static copy ("Turn on location services to allow "PVR" to experience more accurate
 * movie recommendations."). This directly contradicts the PRD's granular native-app options
 * (Allow while using the app / Allow this time / Don't allow / Settings) and its web-banner
 * options (Allow while visiting the site / Allow this time / Never allow) — NEITHER exists on
 * this Web build. `LocationModule`'s doc comments and `location.spec.ts` document exactly which
 * ticket scenarios this affects (`test.fixme` with the real finding, not asserted as passing).
 *
 * **"Cancel" opens manual city selection** — confirmed to be the exact same `CitySelectionPage`
 * dialog ("Select Your City" panel) the City Selection module already automates. `LocationModule`
 * composes `CitySelectionPage`/`CitySelectionModule` for all manual-entry interactions rather
 * than duplicating those locators here.
 *
 * **"Enable" button, real finding**: clicking it does NOT reliably close the modal or update the
 * header city within a reasonable wait, even when geolocation permission is granted
 * (`context.grantPermissions(['geolocation'])`) immediately before the click — confirmed live,
 * repeated attempts. This is a different code path than the in-panel "Tap to share location"
 * button (`CitySelectionPage.shareLocationButton`, proven working — see CTY-010 in
 * city-selection.spec.ts), which DOES complete detection when permission is granted mid-session.
 * Also confirmed: clicking "Enable" while permission is blocked (`permissions: []`) leaves the
 * modal open silently — no error message is ever shown, contradicting the PRD's "displays an
 * error message" expectation for detection-failure scenarios.
 *
 * **City-change nudge**: the real dialog is `role="dialog"` containing "Change your city?" /
 * "Your current city seems to be {city}. Shall we update?" with "Not Now"/"Switch To Current
 * City" buttons, and the saved city genuinely lives in a `cityDetails` cookie (not localStorage,
 * confirmed empty there) — already proven live and automated in
 * `CinemasListingDetailModule.triggerCityChangeNudge()` (2026-09-07 grounding, re-confirmed
 * unchanged today). This page redeclares the same locators rather than importing
 * `CinemasListingDetailPage` across module boundaries.
 *
 * **No client-side max-length on manual entry**: the search input carries no `maxlength`
 * attribute — confirmed via `getAttribute`. There is no separate "exceeds maximum length"
 * validation path to automate; a very long string is simply filtered like any other keyword (see
 * `LocationModule`'s search-matrix doc comment).
 */
export class LocationPage {
  constructor(private page: Page) {}

  readonly enableLocationDialog = () => this.page.getByRole('dialog').filter({ hasText: 'Enable Location' });
  readonly cancelButton = () => this.page.getByRole('button', { name: /^cancel$/i });
  readonly enableButton = () => this.page.getByRole('button', { name: /^enable$/i });

  readonly changeCityDialog = () => this.page.getByRole('dialog').filter({ hasText: 'Change your city?' });
  readonly switchToCurrentCityButton = () => this.page.getByRole('button', { name: 'Switch To Current City', exact: true });
  readonly notNowCityButton = () => this.page.getByRole('button', { name: 'Not Now', exact: true });

  // BUG FIX (2026-09-22): logged-in homepages can render a second "Map Point Icon" inside the
  // Quick Book cinema-selector widget (a `data-slot="popover-trigger"` button showing the
  // nearest cinema's address) — confirmed live via a strict-mode-violation failure (2 matches).
  // The real header city control is always the first match (a simple nav-bar button); `.first()`
  // disambiguates the same way CitySelectionPage's own locators handle other duplicate-match
  // traps on this site.
  readonly headerCityButton = () => this.page.locator('button').filter({ has: this.page.getByAltText('Map Point Icon') }).first();

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton().click();
  }

  async clickEnable(): Promise<void> {
    await this.enableButton().click();
  }
}
