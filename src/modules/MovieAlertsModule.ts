import type { Page, Request } from '@playwright/test';
import { expect } from '@playwright/test';
import { MovieAlertsPage } from '@pages/MovieAlertsPage';
import { RegisterLoginPage } from '@pages/RegisterLoginPage';
import { ComingSoonModule } from '@modules/ComingSoonModule';
import { RegisterLoginModule } from '@modules/RegisterLoginModule';
import { RegistrationModule } from '@modules/RegistrationModule';
import { ProfileCompletionModule } from '@modules/ProfileCompletionModule';
import { Logger } from '@utils/Logger';

// BUG FIX (2026-09-17, live run): confirmed live via a direct network listener — the real save
// endpoint is `POST /api/movie-alerts/create` (delete is `DELETE /api/movie-alerts/delete`), not
// this guessed `/movie/api/v1/coming-soon/alert` path, which never matched any real request. Every
// caller (ALT-021/022/023) was silently mocking/counting against a route that never fired —
// ALT-021's fabricated failure never appeared, ALT-022 counted 0 real POSTs instead of the real
// request, and ALT-023's fabricated 401 never intercepted the real save.
const ALERT_SAVE_ROUTE_PATTERN = '**/api/movie-alerts/create';

export interface NewAlertUserDetails {
  phone: string;
  firstName: string;
  email: string;
  /** Defaults to true — matches the real, confirmed-live default-checked registration checkbox. */
  whatsappOptIn?: boolean;
}

/**
 * Ticket: requirements/movie-alerts.md — reconciled 2026-09-02 from the `TC_Web_177–195` sheet.
 * Grounded 2026-09-02 against UAT (`inox-uat-web.pvrinox.com`), Mumbai-All — see
 * `MovieAlertsPage.ts`'s class doc comment for the full live-grounding trail (panel structure,
 * WhatsApp/SMS message wording, the no-max-limit finding, delete's two-step confirmation, "My
 * Movie Alerts", session-expiry and save-failure behavior).
 *
 * Composes `ComingSoonModule` (entry navigation), `RegisterLoginModule`/`RegistrationModule`/
 * `ProfileCompletionModule` (login/registration/onboarding-nudge preconditions this module needs
 * but doesn't own) rather than duplicating any of that — none of those files were modified. The
 * one real gap those modules don't cover — the onboarding nudge's "Skip Anyway" confirmation
 * sub-dialog — is handled via this module's own `MovieAlertsPage`.
 */
export class MovieAlertsModule {
  private readonly movieAlertsPage: MovieAlertsPage;
  private readonly registerLoginPage: RegisterLoginPage;
  private readonly comingSoonModule: ComingSoonModule;
  private readonly registerLoginModule: RegisterLoginModule;
  private readonly registrationModule: RegistrationModule;
  private readonly profileCompletionModule: ProfileCompletionModule;

  constructor(private page: Page) {
    this.movieAlertsPage = new MovieAlertsPage(page);
    this.registerLoginPage = new RegisterLoginPage(page);
    this.comingSoonModule = new ComingSoonModule(page);
    this.registerLoginModule = new RegisterLoginModule(page);
    this.registrationModule = new RegistrationModule(page);
    this.profileCompletionModule = new ProfileCompletionModule(page);
  }

  // ---- Navigation / entry point ----

  async gotoMovieDetail(movieName: string): Promise<void> {
    await this.comingSoonModule.gotoComingSoon();
    await this.comingSoonModule.openMovieDetail(movieName);
  }

  async clickSetAlert(): Promise<void> {
    await this.movieAlertsPage.clickSetAlert();
  }

  /** ALT-001: guest click on "Set Alert" surfaces the shared login screen. */
  async expectLoginPromptShown(): Promise<void> {
    await this.registerLoginModule.expectOnLoginScreen();
  }

  /**
   * Confirmed live: a fresh phone number's OTP success leads into the registration-details form
   * (First Name/Email), then the "Select Your Preferences" onboarding nudge, which itself needs a
   * two-step skip ("I'll miss out" then "Skip Anyway") before the page is usable again. Both
   * post-registration steps are optional/defensive (skipped if not shown), matching
   * `ProfileCompletionModule.dismissNudgeIfPresent`'s own defensive shape for the case a
   * `profile-nudge-dismissed` flag suppresses the nudge.
   *
   * BUG FIX (2026-09-02, first full-suite run): the nudge can render measurably later than the
   * registration form actually closing under real UAT load (matches the
   * `sandbox-resource-constraints` project memory's "UAT under load" pattern) — an initial 8s
   * visibility check was consistently too tight under a parallel run (18/19 real scenarios failed
   * at the SAME later `clickSetAlert()` call, blocked by a still-fully-open, never-dismissed
   * nudge dialog). Raised to 20s here, matching `expectRegistrationSubmitted`'s own 20s headroom,
   * plus `ensureNoOnboardingNudgeBlocking()` re-checks defensively right before the second Set
   * Alert click too, in case the nudge renders even later than that.
   */
  async registerAndCompleteOnboarding(details: NewAlertUserDetails): Promise<void> {
    Logger.info(`Registering new user for Movie Alerts (whatsappOptIn=${details.whatsappOptIn ?? true})`);
    if (details.whatsappOptIn === false) {
      await this.registerLoginModule.submitPhoneNumber(details.phone);
      await this.registerLoginModule.submitOtp('739416');
      await this.registrationModule.fillRegistrationDetails(details.firstName, '', details.email);
      await this.registrationModule.uncheckWhatsappOptIn();
      await this.registrationModule.submitRegistrationForm();
    } else {
      await this.registrationModule.registerNewUser({ phone: details.phone, firstName: details.firstName, email: details.email });
    }
    await this.registrationModule.expectRegistrationSubmitted();
    await this.dismissOnboardingNudgeIfShown(20_000);
  }

  /**
   * BUG FIX (2026-09-02, first full-suite run): `Locator.isVisible({ timeout })`'s `timeout`
   * option is explicitly documented as deprecated/ignored — it does NOT wait for the element to
   * become visible, it checks the CURRENT state and returns immediately. Using it here originally
   * meant this check ran essentially instantly after the registration form closed, before the
   * onboarding nudge had necessarily rendered yet, so `shown` was always `false` and the whole
   * dismissal was silently skipped — 18/19 real scenarios then failed at a LATER click, blocked by
   * the still-fully-open, never-dismissed nudge. `waitFor({ state: 'visible' })` (which genuinely
   * polls) is the correct primitive for an optional-and-possibly-delayed element, matching
   * `CitySelectionModule.gotoCitySelection`'s identical `expect(...).toBeVisible(...).then(() =>
   * true).catch(() => false)` shape for the same "is this optional thing here" question.
   */
  private async dismissOnboardingNudgeIfShown(timeoutMs = 20_000): Promise<void> {
    const shown = await this.movieAlertsPage
      .onboardingNudgeHeading()
      .waitFor({ state: 'visible', timeout: timeoutMs })
      .then(() => true)
      .catch(() => false);
    if (!shown) return;
    await this.profileCompletionModule.dismissWithMaybeLater();
    const skipAnywayShown = await this.movieAlertsPage
      .onboardingSkipAnywayButton()
      .waitFor({ state: 'visible', timeout: 10_000 })
      .then(() => true)
      .catch(() => false);
    if (skipAnywayShown) await this.movieAlertsPage.clickSkipAnyway();
    // Confirm the underlying wizard is actually gone before returning — clicking "I'll miss out"
    // alone only opens the "Skip Anyway" sub-dialog on top of it (see MovieAlertsPage.ts's class
    // doc comment); the wizard heading staying visible here would otherwise silently block every
    // later click on this page, exactly the failure this bug fix addresses.
    await this.movieAlertsPage
      .onboardingNudgeHeading()
      .waitFor({ state: 'hidden', timeout: 10_000 })
      .catch(() => undefined);
  }

  /**
   * Defensive re-check used right before the second Set Alert click — see the bug-fix note on
   * `dismissOnboardingNudgeIfShown` for why the nudge can still be open at this point even after
   * that method's own dismissal attempt.
   */
  private async ensureNoOnboardingNudgeBlocking(): Promise<void> {
    const stillShown = await this.movieAlertsPage
      .onboardingNudgeHeading()
      .waitFor({ state: 'visible', timeout: 3_000 })
      .then(() => true)
      .catch(() => false);
    if (stillShown) await this.dismissOnboardingNudgeIfShown(3_000);
  }

  /**
   * Composes the full "reach a real, open Set Alert panel" precondition most scenarios need:
   * navigate to the movie detail page, tap Set Alert (surfaces login for a guest), complete
   * login/registration/onboarding, then tap Set Alert AGAIN — confirmed live the first click only
   * ever opens the login drawer, never the real panel.
   */
  async openSetAlertPanelAsNewUser(movieName: string, details: NewAlertUserDetails): Promise<void> {
    await this.gotoMovieDetail(movieName);
    await this.clickSetAlert();
    await this.registerAndCompleteOnboarding(details);
    await this.ensureNoOnboardingNudgeBlocking();
    await this.movieAlertsPage.clickSetAlert();
    await expect(this.movieAlertsPage.panelHeading()).toBeVisible({ timeout: 15_000 });
  }

  // ---- Panel UI ----

  async expectPanelVisible(movieName: string): Promise<void> {
    await expect(this.movieAlertsPage.panelHeading()).toBeVisible({ timeout: 15_000 });
    await expect(this.movieAlertsPage.movieNameInPanel(movieName)).toBeVisible({ timeout: 15_000 });
  }

  async expectCityShownInPanel(city: string): Promise<void> {
    await expect(this.movieAlertsPage.cityBadgeInPanel(city)).toBeVisible({ timeout: 10_000 });
  }

  async expectAnyCinemaToggleVisible(): Promise<void> {
    await expect(this.movieAlertsPage.anyCinemaToggle()).toBeVisible({ timeout: 10_000 });
  }

  async expectCinemaSearchVisible(): Promise<void> {
    await expect(this.movieAlertsPage.cinemaSearchInput()).toBeVisible({ timeout: 10_000 });
    await expect(this.movieAlertsPage.cinemaMicButton()).toBeVisible({ timeout: 10_000 });
  }

  async expectAtLeastOneCinemaOptionVisible(name: string): Promise<void> {
    await expect(this.movieAlertsPage.cinemaOption(name)).toBeVisible({ timeout: 10_000 });
  }

  // ---- Cinema selection ----

  async selectCinema(name: string): Promise<void> {
    await this.movieAlertsPage.selectCinema(name);
  }

  async toggleAnyCinema(): Promise<void> {
    await this.movieAlertsPage.toggleAnyCinema();
  }

  /** ALT-004: confirmed live — turning Any Cinema on is enough to enable Save on its own. */
  async expectAnyCinemaChecked(checked: boolean): Promise<void> {
    await expect(this.movieAlertsPage.anyCinemaToggle()).toHaveAttribute('aria-checked', String(checked), { timeout: 10_000 });
  }

  /** ALT-005: confirmed live — every individual cinema option becomes disabled once Any Cinema is on. */
  async expectCinemaOptionDisabled(name: string): Promise<void> {
    await expect(this.movieAlertsPage.cinemaOption(name)).toBeDisabled({ timeout: 10_000 });
  }

  async searchCinema(keyword: string): Promise<void> {
    await this.movieAlertsPage.searchCinema(keyword);
  }

  async expectCinemaVisible(name: string): Promise<void> {
    await expect(this.movieAlertsPage.cinemaOption(name)).toBeVisible({ timeout: 10_000 });
  }

  /** ALT-007: confirmed live — a genuinely unmatched keyword shows a real "No cinemas found" message. */
  async expectNoCinemasFoundShown(): Promise<void> {
    await expect(this.movieAlertsPage.noCinemasFoundMessage()).toBeVisible({ timeout: 10_000 });
  }

  // ---- Mic / voice search ----

  async clickCinemaMic(): Promise<void> {
    await this.movieAlertsPage.clickCinemaMic();
  }

  /** ALT-009: reuses ComingSoonModule's own permission-override technique, not duplicated here. */
  async forceMicrophonePermissionDenied(): Promise<void> {
    await this.comingSoonModule.forceMicrophonePermissionDenied();
  }

  /**
   * ALT-009: confirmed live real native `alert()` — "Microphone permission is blocked. Please
   * enable it in your browser settings." (IDENTICAL wording to ComingSoonModule's own mic-denied
   * alert, unlike Curated Shows' distinct copy). A real `alert()` blocks the page's JS thread
   * synchronously, so the dialog must be raced alongside the click, not awaited after it — same
   * fix `ComingSoonModule.expectMicDeniedAlertShown` documents.
   */
  async expectMicDeniedAlertShown(): Promise<void> {
    let message: string | undefined;
    const dialogHandled = new Promise<void>((resolve) => {
      this.page.once('dialog', (dialog) => {
        message = dialog.message();
        void dialog.dismiss().then(resolve);
      });
    });
    await Promise.all([dialogHandled, this.movieAlertsPage.clickCinemaMic()]);
    expect(message).toBe('Microphone permission is blocked. Please enable it in your browser settings.');
  }

  // ---- WhatsApp / SMS opt-in ----

  /** ALT-010: only renders when the account hasn't already globally opted into WhatsApp. */
  async expectWhatsappToggleVisible(): Promise<void> {
    await expect(this.movieAlertsPage.whatsappToggle()).toBeVisible({ timeout: 10_000 });
  }

  async expectWhatsappToggleChecked(checked: boolean): Promise<void> {
    await expect(this.movieAlertsPage.whatsappToggle()).toHaveAttribute('aria-checked', String(checked), { timeout: 10_000 });
  }

  async disableWhatsappToggle(): Promise<void> {
    const checked = await this.movieAlertsPage.whatsappToggle().getAttribute('aria-checked');
    if (checked === 'true') await this.movieAlertsPage.toggleWhatsapp();
  }

  // ---- Save / Update ----

  async expectSaveDisabled(): Promise<void> {
    await expect(this.movieAlertsPage.panelSubmitButton()).toBeDisabled({ timeout: 10_000 });
  }

  async expectSaveEnabled(): Promise<void> {
    await expect(this.movieAlertsPage.panelSubmitButton()).toBeEnabled({ timeout: 10_000 });
  }

  async save(): Promise<void> {
    await this.movieAlertsPage.clickPanelSubmit();
  }

  async expectWhatsappSuccessMessage(movieName: string): Promise<void> {
    await expect(this.movieAlertsPage.saveOrUpdateSuccessMessage(movieName)).toBeVisible({ timeout: 15_000 });
    await expect(this.movieAlertsPage.whatsappSuccessSubtext()).toBeVisible({ timeout: 15_000 });
  }

  async expectSmsSuccessMessage(movieName: string): Promise<void> {
    await expect(this.movieAlertsPage.saveOrUpdateSuccessMessage(movieName)).toBeVisible({ timeout: 15_000 });
    await expect(this.movieAlertsPage.smsSuccessSubtext()).toBeVisible({ timeout: 15_000 });
  }

  async expectAlertCount(count: number): Promise<void> {
    await expect(this.movieAlertsPage.alertCountText(count)).toBeVisible({ timeout: 15_000 });
  }

  // ---- Edit / Delete ----

  async clickEditAlert(): Promise<void> {
    await this.movieAlertsPage.clickEditAlert();
  }

  async clickDeleteAlert(): Promise<void> {
    await this.movieAlertsPage.clickDeleteAlert();
  }

  /** ALT-014: delete is a real two-step flow — this confirms via the real "I'll Miss Out" button. */
  async confirmDelete(): Promise<void> {
    await expect(this.movieAlertsPage.deleteConfirmHeading()).toBeVisible({ timeout: 10_000 });
    await this.movieAlertsPage.confirmDelete();
  }

  async expectDeleteSuccessMessage(): Promise<void> {
    await expect(this.movieAlertsPage.deleteSuccessMessage()).toBeVisible({ timeout: 15_000 });
  }

  async expectSetAlertButtonVisible(): Promise<void> {
    await expect(this.movieAlertsPage.setAlertButton()).toBeVisible({ timeout: 15_000 });
  }

  // ---- My Movie Alerts ----

  /** ALT-020: reuses RegisterLoginModule.openAccountPanel() rather than reimplementing the header User Icon click. */
  async openMyMovieAlertsPage(): Promise<void> {
    await this.registerLoginModule.openAccountPanel();
    await this.movieAlertsPage.clickMyMovieAlertsLink();
    await expect(this.movieAlertsPage.myMovieAlertsPageSubheading()).toBeVisible({ timeout: 15_000 });
  }

  async expectAlertVisibleInMyMovieAlerts(movieName: string): Promise<void> {
    await expect(this.movieAlertsPage.alertCardInMyMovieAlerts(movieName)).toBeVisible({ timeout: 10_000 });
  }

  // ---- Save-failure fault injection (ALT-021) ----

  /**
   * ALT-021: confirmed live — the app surfaces the mocked response's own `message` field verbatim,
   * not a fixed generic string (unlike ProfileCompletionPage's own save-failure toast).
   */
  async mockSaveAlertFailure(message: string, status = 500): Promise<void> {
    await this.page.route(ALERT_SAVE_ROUTE_PATTERN, async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ statusCode: status, message }) });
      } else {
        await route.continue();
      }
    });
  }

  async expectErrorMessageShown(message: string): Promise<void> {
    await expect(this.movieAlertsPage.genericErrorMessage(message)).toBeVisible({ timeout: 10_000 });
  }

  // ---- Duplicate-click handling (ALT-022) ----

  /**
   * ALT-022: confirmed live — rapid double-clicking Save fires exactly one POST to the alert-save
   * endpoint (the button disables itself immediately on the first click). Counts real network
   * requests during the action rather than a fixed sleep, per this repo's no-hard-waits rule —
   * `expectAlertCount` below polls until the UI settles before the count is read.
   */
  async saveTwiceRapidlyAndCountRequests(expectedCinemaCount: number): Promise<number> {
    let postCount = 0;
    const handler = (req: Request): void => {
      if (req.url().includes('/api/movie-alerts/create') && req.method() === 'POST') postCount++;
    };
    this.page.on('request', handler);
    await Promise.all([this.movieAlertsPage.clickPanelSubmit(), this.movieAlertsPage.clickPanelSubmit()]);
    await this.expectAlertCount(expectedCinemaCount);
    this.page.off('request', handler);
    return postCount;
  }

  // ---- Session expiry (ALT-023) ----

  /**
   * BUG FIX (2026-09-02, live test run, two rounds): a first attempt cleared cookies only — the
   * save call still succeeded (`201`), since the token this endpoint checks also lives in
   * localStorage/sessionStorage. Clearing all three sometimes reproduced a real `403
   * SESSION_EXPIRED` response but NOT reliably (confirmed via repeated live runs with the
   * identical sequence — one run `201`, another `403`), too flaky for an automated assertion.
   * Mocking the EXACT confirmed real error shape deterministically reproduces the real client
   * behavior instead — see `MovieAlertsPage.ts`'s class doc comment for the full grounding trail
   * and the real finding this uncovered (a real redirect to `?sidebar=login`, not an inline
   * message as an earlier single, non-reproducible manual observation had suggested).
   */
  async mockSessionExpired(): Promise<void> {
    await this.page.route(ALERT_SAVE_ROUTE_PATTERN, async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({ statusCode: 403, error: 'SESSION_EXPIRED', message: 'SESSION_EXPIRED', type: 'Forbidden' }),
        });
      } else {
        await route.continue();
      }
    });
  }

  /**
   * ALT-023: confirmed live via the deterministic mock above — a real `403 SESSION_EXPIRED`
   * response makes the whole page navigate away from the movie detail page to the real homepage.
   *
   * BUG FIX (2026-09-02, live test run): the phone-number input is NOT auto-visible right after
   * this navigation — confirmed live via a full accessibility snapshot at the failure moment: the
   * real homepage (nav, "Now Showing"/"Coming Soon" content, header "User Icon" button) renders
   * normally, but no phone-entry form is open, even after a generous 15s wait. Asserting on the
   * header's real "User Icon" button (present in every observed snapshot) is the honest,
   * reliably-true signal that this redirected back to the homepage/login-marked state, without
   * over-claiming a specific drawer-open mechanism that wasn't actually observed working.
   *
   * BUG FIX (2026-09-17, live run): the URL itself is NOT a stable signal — confirmed live via a
   * 15s polling trace: it hops `/coming-soon/{id}` → `?sidebar=register` (transient, ~1.5s) →
   * settles at the bare homepage (`/`, no query param at all) from ~6s onward. Neither
   * `?sidebar=login` (the original, always-wrong assumption) nor `?sidebar=register` (a real but
   * transient intermediate hop) is the actual final state — asserts the real settled state
   * instead: navigated away from the `/coming-soon/{id}` alert-save context, same page.
   */
  async expectRedirectedToLogin(): Promise<void> {
    await expect(this.page).not.toHaveURL(/\/coming-soon\//, { timeout: 15_000 });
    await expect(this.registerLoginPage.userIconButton()).toBeVisible({ timeout: 15_000 });
  }
}
