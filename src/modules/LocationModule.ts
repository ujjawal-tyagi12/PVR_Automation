import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { LocationPage } from '@pages/LocationPage';
import { CitySelectionPage } from '@pages/CitySelectionPage';
import { CitySelectionModule } from '@modules/CitySelectionModule';
import {
  UAT_BASE_URL,
  MUMBAI_GEOLOCATION,
  DELHI_GEOLOCATION,
  GURGAON_GEOLOCATION,
  NON_SERVICEABLE_GEOLOCATION,
  dismissPromoPopup,
  waitForHomepageReady,
} from '@utils/LocationHelper';
import { Logger } from '@utils/Logger';
import { WaitHelper } from '@utils/WaitHelper';

/**
 * Ticket: requirements/location.md — 72 scenarios (TC_WEB_030-101). See `LocationPage.ts`'s doc
 * comment for the full 2026-09-22 grounding trail this module's methods build on.
 *
 * Manual city entry (LOC-021, 029, 035-072) is the exact same "Select Your City" dialog the City
 * Selection module already automates — this module composes `CitySelectionPage`/
 * `CitySelectionModule` for that surface instead of duplicating locators/logic.
 *
 * **Real finding on the manual-entry search-as-validator matrix (LOC-035-072)**: the search box
 * is a plain client-side substring filter over the preloaded city list — it does NOT run any
 * server-side validation and does NOT specially detect or reject SQL/XSS/HTML/JSON/XML/YAML/CSS/
 * command-injection/path-traversal/buffer-overflow syntax. Confirmed live:
 * - `' OR '1'='1` (a SQL-injection fragment) returns real matches (Bangalore, Gorakhpur, Indore,
 *   Jorhat, Mysore — all coincidentally contain "or") — NOT the PRD's assumed "city not
 *   recognized" error.
 * - `Delhi😀` (emoji-suffixed) returns real matches (Delhi, Delhi-NCR) — the emoji is effectively
 *   ignored by the substring match, again NOT the PRD's assumed rejection.
 * - `<script>alert(1)</script>`, `<b>Delhi</b>`, `../../etc/passwd`, and a 300-char string all
 *   show "City Not Found!" — but only because they happen to contain no real city-name substring,
 *   not because of any deliberate sanitization/rejection logic. No `dialog` (`alert`/`confirm`)
 *   ever fired for the script-tag payload — confirmed no script execution.
 * - A purely numeric string ("123456") leaves the full unfiltered Popular/All-cities view
 *   showing, same as CitySelectionModule's already-proven below-2-char/disallowed-character
 *   finding (CTY-022/CTY-023).
 * - The input carries no `maxlength` attribute — there is no separate "exceeds maximum length"
 *   code path to automate distinct from the general substring-match/no-match behavior above.
 *
 * `location.spec.ts`'s data-driven matrix asserts these REAL, verified outcomes rather than the
 * ticket's per-payload-type assumptions.
 *
 * **Real finding on logged-in city persistence (LOC-018/030), corrected 2026-09-22**: an initial
 * pass wrongly concluded city selection syncs to the account, because it tested with a value
 * (Mumbai) that happens to equal the universal default every fresh account gets regardless of any
 * prior session — a confound, not a real signal. A proper 2-session comparison using a
 * DIFFERENT, explicitly-selected city (Chennai) as the control disproved it: session B, logging in
 * with the SAME phone number right after session A manually selected Chennai, still showed
 * "Mumbai" — the universal default, not the previously selected city. City selection is NOT
 * synced to the account across sessions; only the local `cityDetails` cookie (LOC-017/029) persists.
 * LOC-018/030 are `test.fixme` with this corrected, confirmed finding.
 */
export class LocationModule {
  private readonly locationPage: LocationPage;
  private readonly citySelectionPage: CitySelectionPage;
  private readonly citySelectionModule: CitySelectionModule;

  constructor(private page: Page) {
    this.locationPage = new LocationPage(page);
    this.citySelectionPage = new CitySelectionPage(page);
    this.citySelectionModule = new CitySelectionModule(page);
  }

  /** LOC-001/032: fresh context, no geolocation permission granted — the real starting state for "detection not yet resolved". */
  async gotoFresh(): Promise<void> {
    Logger.info('Opening a fresh UAT session with no geolocation permission granted (Location module)');
    await this.locationPage.goto(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
  }

  /** LOC-001/032: confirms the app reacted to the fresh load by surfacing the real "Enable Location" modal (Cancel/Enable only — see LocationPage.ts doc comment). */
  async expectEnableLocationModalVisible(): Promise<void> {
    await expect(this.locationPage.cancelButton()).toBeVisible({ timeout: 15_000 });
    await expect(this.locationPage.enableButton()).toBeVisible();
  }

  /**
   * LOC-013: confirmed live 2026-09-22 — pressing Escape does NOT dismiss the Enable Location
   * modal and does NOT open manual city selection (both the Cancel/Enable buttons and the modal
   * itself remain exactly as they were). Contradicts the PRD's "triggers manual city selection"
   * expectation for a dismissed prompt — the only real dismiss path is the "Cancel" button
   * (LOC-003).
   */
  async pressEscapeOnEnableLocationModal(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }

  /**
   * LOC-015: confirmed live 2026-09-22 — literal open-ocean coordinates (nowhere near any
   * serviceable city) still resolve to a real saved city (`"Delhi"`) rather than hanging or
   * showing a "non-serviceable" message. See `LocationHelper.NON_SERVICEABLE_GEOLOCATION`'s doc
   * comment for the wider finding (detection appears to only ever resolve to the nearer of
   * "Mumbai"/"Delhi", not genuine reverse-geocoding against the full city database).
   */
  async detectNonServiceableLocation(): Promise<void> {
    Logger.info('Granting open-ocean (non-serviceable) geolocation before navigation');
    await this.page.context().grantPermissions(['geolocation']);
    await this.page.context().setGeolocation(NON_SERVICEABLE_GEOLOCATION);
    await this.locationPage.goto(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
    await expect.poll(() => this.getSavedCityName(), { timeout: 15_000 }).toBeTruthy();
  }

  /**
   * LOC-016: confirmed live 2026-09-22 — real Gurgaon coordinates resolve to `cityName:"Delhi"`,
   * NOT `"Delhi-NCR"` as the PRD's "defaults the detected city to Delhi NCR" claim assumes. See
   * `LocationHelper.GURGAON_GEOLOCATION`'s doc comment for the wider finding.
   */
  async detectGurgaonLocation(): Promise<void> {
    Logger.info('Granting Gurgaon (Delhi-NCR sub-city) geolocation before navigation');
    await this.page.context().grantPermissions(['geolocation']);
    await this.page.context().setGeolocation(GURGAON_GEOLOCATION);
    await this.locationPage.goto(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
    await expect.poll(() => this.getSavedCityName(), { timeout: 15_000 }).toBeTruthy();
  }

  /** LOC-002: geolocation granted before navigation — real, proven auto-detect path (same mechanism as LocationHelper.grantMumbaiGeolocation). */
  async detectLocationAutomatically(): Promise<void> {
    Logger.info('Granting Mumbai geolocation before navigation and expecting auto-detected homepage content');
    await this.page.context().grantPermissions(['geolocation']);
    await this.page.context().setGeolocation(MUMBAI_GEOLOCATION);
    await this.locationPage.goto(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
    await waitForHomepageReady(this.page, 'Mumbai-All', 'Mumbai');
  }

  async expectHeaderCity(city: string): Promise<void> {
    await expect(this.locationPage.headerCityButton()).toContainText(city, { timeout: 15_000 });
  }

  /** LOC-003: clicking "Cancel" on the Enable Location modal opens manual city selection — the real, proven fallback path. */
  async clickCancelOpensManualSelection(): Promise<void> {
    await this.locationPage.clickCancel();
    await expect(this.citySelectionPage.panelHeading()).toBeVisible({ timeout: 15_000 });
  }

  async selectCityManually(city: string): Promise<void> {
    await this.citySelectionPage.clickPopularCity(city);
    await expect(this.citySelectionPage.panelHeading()).toBeHidden({ timeout: 15_000 });
  }

  /** LOC-017/029: guest city storage genuinely lives in a `cityDetails` cookie (confirmed empty in localStorage) — same mechanism CinemasListingDetailModule already proved for the nudge flow. */
  async getSavedCityName(): Promise<string | undefined> {
    const cookies = await this.page.context().cookies();
    const cityDetails = cookies.find((c) => c.name === 'cityDetails');
    if (!cityDetails) return undefined;
    try {
      const parsed = JSON.parse(decodeURIComponent(cityDetails.value)) as { cityName?: string };
      return parsed.cityName;
    } catch {
      return undefined;
    }
  }

  /**
   * LOC-026: confirmed live 2026-09-22 — the real `cityDetails` cookie carries a genuine ~30-day
   * expiry (not a short browser-session cookie). Waiting that out isn't practical in a test, so
   * this simulates a guest session expiring by force-expiring the cookie directly
   * (`context.addCookies` with a past `expires`) and clearing geolocation permission (so the app
   * can't silently just re-detect instead of re-prompting) before reloading — confirmed to
   * reliably bring back the real Enable Location modal, a clean proxy for "session expired, guest
   * is re-prompted".
   */
  async expireSavedCityAndReload(): Promise<void> {
    const cookies = await this.page.context().cookies();
    const cityDetails = cookies.find((c) => c.name === 'cityDetails');
    expect(cityDetails, 'expected a cityDetails cookie to already exist before simulating expiry').toBeTruthy();
    await this.page.context().addCookies([{ ...cityDetails!, expires: Math.floor(Date.now() / 1000) - 3_600 }]);
    await this.page.context().clearPermissions();
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await dismissPromoPopup(this.page);
  }

  /**
   * LOC-012/019: reproduces a genuine detected-city-differs-from-saved-city mismatch — grounded
   * 2026-09-07 in `CinemasListingDetailModule.triggerCityChangeNudge()` and re-confirmed live
   * today. Requires a real saved city to already exist (call `detectLocationAutomatically()`
   * first) — a fresh context has nothing to conflict with, so the app just adopts whatever it
   * detects.
   */
  async triggerCityChangeNudge(): Promise<void> {
    await this.page.context().setGeolocation(DELHI_GEOLOCATION);
    await this.page.reload();
    await dismissPromoPopup(this.page);
  }

  async expectCityChangeNudgeVisible(): Promise<void> {
    await expect(this.locationPage.changeCityDialog()).toBeVisible({ timeout: 15_000 });
    await expect(this.locationPage.changeCityDialog()).toContainText(/your current city seems to be/i);
  }

  /** LOC-022/051: confirms the saved city updates to the detected one. */
  async acceptCityChange(): Promise<void> {
    await this.locationPage.switchToCurrentCityButton().click({ timeout: 8_000 });
    await expect(this.locationPage.changeCityDialog()).toBeHidden({ timeout: 10_000 });
  }

  /** LOC-023/052: confirms the previously saved city is retained. */
  async declineCityChange(): Promise<void> {
    await this.locationPage.notNowCityButton().click({ timeout: 8_000 });
    await expect(this.locationPage.changeCityDialog()).toBeHidden({ timeout: 10_000 });
  }

  /**
   * LOC-031: confirmed live 2026-09-22 — after the nudge is shown once for a given mismatch and
   * declined, reloading again with the SAME still-unresolved mismatch does NOT show the nudge a
   * second time (a real one-time-trigger, not a per-reload prompt).
   */
  async expectCityChangeNudgeNotVisible(): Promise<void> {
    await expect(this.locationPage.changeCityDialog()).toBeHidden({ timeout: 8_000 });
  }

  /** LOC-029: reloads the page (dismissing the promo popup that can reappear on a fresh load) — used to confirm a saved city survives navigation within the same session. */
  async reload(): Promise<void> {
    await this.page.reload();
    await dismissPromoPopup(this.page);
  }

  /** LOC-033/062: a genuinely offline context fails navigation outright (`ERR_INTERNET_DISCONNECTED`) before any app JS runs — confirmed live there is no in-app error banner to assert on for true offline; the observable, correct behavior is that `page.goto()` itself rejects. */
  async gotoOfflineAndExpectNavigationFails(): Promise<void> {
    await this.page.context().setOffline(true);
    await expect(this.locationPage.goto(UAT_BASE_URL)).rejects.toThrow(/ERR_INTERNET_DISCONNECTED|net::/i);
    await this.page.context().setOffline(false);
  }

  // --- Manual-entry search matrix (LOC-035-072): thin wrappers over CitySelectionModule, which
  // already owns the "Select Your City" dialog's proven search/assertion logic. ---

  async openManualSelection(): Promise<void> {
    await this.citySelectionModule.gotoCitySelection();
  }

  async searchCity(keyword: string): Promise<void> {
    await this.citySelectionModule.searchCity(keyword);
  }

  async expectCityNotFound(): Promise<void> {
    await this.citySelectionModule.expectCityNotFound();
  }

  async expectFullListStillShown(): Promise<void> {
    await this.citySelectionModule.expectFullListStillShown();
  }

  async expectSearchResultsInclude(cityNames: string[]): Promise<void> {
    await this.citySelectionModule.expectSearchResultsInclude(cityNames);
  }

  async expectSearchResultsIdentical(keywordA: string, keywordB: string): Promise<void> {
    await this.citySelectionModule.expectSearchResultsIdentical(keywordA, keywordB);
  }

  /**
   * LOC-050/052-060: for payload types not individually confirmed to coincidentally substring-
   * match a real city name (JSON/XML/YAML/CSS/command-injection/buffer-overflow-style strings),
   * the one honestly assertable, real-grounded property is "no script execution, no crash" — a
   * native `dialog` event (alert/confirm/prompt) firing would prove script execution; none did
   * for the verified script-tag payload. Also confirms the panel survives (doesn't blank/crash).
   */
  async expectNoScriptExecutionOnSearch(payload: string): Promise<void> {
    const firedDialogs: string[] = [];
    const onDialog = (dialog: { message(): string; dismiss: () => Promise<void> }) => {
      firedDialogs.push(dialog.message());
      void dialog.dismiss();
    };
    this.page.on('dialog', onDialog);
    try {
      await this.citySelectionModule.searchCity(payload);
      await WaitHelper.forNetworkIdle(this.page, 5_000).catch(() => undefined);
      expect(firedDialogs, `payload "${payload}" must not trigger a native browser dialog (proves no script execution)`).toEqual([]);
      await expect(this.citySelectionPage.dialog()).toBeVisible();
    } finally {
      this.page.off('dialog', onDialog);
    }
  }
}
