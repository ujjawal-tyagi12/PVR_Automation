import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { RegisterLoginPage } from '@pages/RegisterLoginPage';
import { dismissPromoPopup } from '@utils/LocationHelper';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class RegisterLoginModule {
  private readonly registerLoginPage: RegisterLoginPage;

  constructor(private page: Page) {
    this.registerLoginPage = new RegisterLoginPage(page);
  }

  async gotoLogin(): Promise<void> {
    Logger.info('Navigating to Login screen');
    await this.registerLoginPage.goto();
    await dismissPromoPopup(this.page);
    await this.registerLoginPage.openLogin();
  }

  async submitPhoneNumber(phone: string): Promise<void> {
    Logger.info(`Submitting phone number ending in ${phone.slice(-4)}`);
    await this.registerLoginPage.enterPhoneNumber(phone);
    await this.registerLoginPage.requestOtp();
  }

  async submitOtp(otp: string): Promise<void> {
    Logger.info('Submitting OTP');
    await this.registerLoginPage.enterOtp(otp);
  }

  /** REG-006: OTP entered via a real paste event rather than typed/filled entry — see
   * RegisterLoginPage.pasteOtp's doc comment for why this differs from a real OS-level clipboard
   * paste (which hangs indefinitely in this headless sandbox). */
  async pasteOtp(otp: string): Promise<void> {
    Logger.info('Pasting OTP');
    await this.registerLoginPage.pasteOtp(otp);
  }

  async loginWithPhoneAndOtp(phone: string, otp = config.otpBypassCode): Promise<void> {
    await this.submitPhoneNumber(phone);
    await this.submitOtp(otp);
  }

  async continueAsGuest(): Promise<void> {
    Logger.info('Continuing as guest');
    await this.registerLoginPage.goto();
    // BUG FIX (2026-08-20): unlike `gotoLogin()`, this flow never called `dismissPromoPopup` —
    // TC_ADM_013 caught the trailer popup blocking `clickContinueAsGuest()` for the full test
    // timeout.
    await dismissPromoPopup(this.page);
    await this.registerLoginPage.clickContinueAsGuest();
  }

  async resendOtp(): Promise<void> {
    Logger.info('Resending OTP');
    await this.registerLoginPage.resendOtp();
  }

  /**
   * Polls (not a fixed sleep) up to `timeoutMs` for the resend cooldown to lift. Grounded
   * 2026-08-20: the real cooldown is longer than the sheet's "60s" title suggests — took ~128s
   * in isolation, and longer under parallel-worker contention (crossed 150s in a 3-worker run).
   * Caller should pass an explicit `timeoutMs` sized to its own test timeout budget.
   */
  async expectResendOtpEnabled(timeoutMs = 150_000): Promise<void> {
    await expect(this.registerLoginPage.resendOtpButton()).toBeEnabled({ timeout: timeoutMs });
  }

  async attemptBookTicketsAsGuest(): Promise<void> {
    await this.registerLoginPage.attemptBookTickets();
  }

  async attemptAccessProfileAsGuest(): Promise<void> {
    await this.registerLoginPage.profileIcon().click();
  }

  async expectLoggedIn(): Promise<void> {
    await expect(this.registerLoginPage.profileIcon()).toBeVisible();
  }

  /**
   * Grounded 2026-08-20: on UAT (`inox-uat-web.pvrinox.com`), the URL doesn't change after a
   * successful OTP submission — it stays on `/`, so `toHaveURL` can't distinguish "logged in"
   * from "still on the login panel". The OTP input disappearing is the concrete, confirmed
   * signal that the submission was accepted and the panel closed.
   *
   * BUG FIX (2026-09-10, multi-device-login.spec.ts grounding on `uat-web.pvrinox.com`):
   * confirmed live via a timed diagnostic — a repeat login for an already-registered phone
   * (the common case this function is actually used for) keeps the OTP input visible, filled,
   * and disabled for up to ~2s before it unmounts (a brand-new registration's OTP input clears
   * faster, under 500ms, which is why this went uncaught elsewhere). The default `expect` 5s
   * timeout is only tight under real multi-context test load (multi-device tests run several
   * browser contexts at once); bumping to the same 15s headroom already used elsewhere in this
   * file for genuine UI latency (see `openLogin`'s doc comment) covers it reliably.
   */
  async expectOnHome(): Promise<void> {
    await expect(this.registerLoginPage.otpInput()).toBeHidden({ timeout: 15_000 });
  }

  /**
   * Grounded 2026-08-20: a promotional trailer popup (independent of the location-modal
   * chain — see LocationHelper.dismissPromoPopup) can cover the login panel and hide whatever
   * error text this is checking for. Dismiss it defensively first — it doesn't appear every
   * time, so this is a no-op most of the time.
   */
  async expectFieldError(fieldLabel: string | RegExp): Promise<void> {
    await dismissPromoPopup(this.page);
    await expect(this.registerLoginPage.fieldError(fieldLabel)).toBeVisible();
  }

  async expectOtpError(message: string | RegExp): Promise<void> {
    await expect(this.registerLoginPage.otpErrorMessage()).toContainText(message);
  }

  async expectDeactivatedAccountPopup(): Promise<void> {
    await expect(this.registerLoginPage.deactivatedAccountPopup()).toBeVisible();
  }

  async expectRestrictedActionRedirectsToLogin(triggerRestrictedAction: () => Promise<void>): Promise<void> {
    await triggerRestrictedAction();
    await expect(this.registerLoginPage.phoneNumberInput()).toBeVisible();
  }

  async expectSendOtpRateLimited(): Promise<void> {
    await expect(this.registerLoginPage.sendOtpRateLimitMessage()).toBeVisible();
  }

  async expectProfileName(name: string): Promise<void> {
    await expect(this.registerLoginPage.profileName(name)).toBeVisible();
  }

  /** The account panel's unverified-email affordance — see RegisterLoginPage.accountPanelVerifyButton. */
  async expectVerifyEmailAffordanceVisible(): Promise<void> {
    await expect(this.registerLoginPage.accountPanelVerifyButton()).toBeVisible({ timeout: 15_000 });
  }

  async attemptApplyOfferAsGuest(): Promise<void> {
    await this.registerLoginPage.attemptApplyOffer();
  }

  async openTerms(): Promise<void> {
    await this.registerLoginPage.clickTerms();
  }

  async openPrivacyPolicy(): Promise<void> {
    await this.registerLoginPage.clickPrivacy();
  }

  async expectNetworkErrorMessage(): Promise<void> {
    await expect(this.registerLoginPage.networkErrorMessage()).toBeVisible();
  }

  async expectServerErrorMessage(): Promise<void> {
    await expect(this.registerLoginPage.serverErrorMessage()).toBeVisible();
  }

  async expectCaptchaVisible(): Promise<void> {
    await expect(this.registerLoginPage.captchaWidget()).toBeVisible();
  }

  async cancelMultiDeviceWarning(): Promise<void> {
    await this.registerLoginPage.clickCancelOnMultiDevicePopup();
  }

  async continueMultiDeviceWarning(): Promise<void> {
    await this.registerLoginPage.clickContinueOnMultiDevicePopup();
  }

  async expectMultiDeviceWarningVisible(): Promise<void> {
    await expect(this.registerLoginPage.multiDeviceWarningPopup()).toBeVisible();
  }

  /**
   * Added 2026-08-24 (multi-device-login.spec.ts TC_ADM_037-040/046 grounding): same check as
   * expectMultiDeviceWarningVisible() but with a longer, configurable timeout — the real
   * device-limit dialog only renders after a live OTP round trip on an account already at this
   * build's real (grounded) 3-device cap, and Playwright's 5s default expect timeout doesn't
   * leave enough headroom for that under real UAT latency (same reasoning as
   * expectOtpScreenLoaded's 15s timeout above). Added as a new method rather than changing
   * expectMultiDeviceWarningVisible()'s existing default, per this pass's additive-only
   * constraint on shared files.
   */
  async expectMultiDeviceWarningVisibleWithinTimeout(timeoutMs = 20_000): Promise<void> {
    await expect(this.registerLoginPage.multiDeviceWarningPopup()).toBeVisible({ timeout: timeoutMs });
  }

  async expectMultiDeviceWarningHidden(): Promise<void> {
    await expect(this.registerLoginPage.multiDeviceWarningPopup()).toBeHidden();
  }

  /**
   * Added 2026-08-24 (TC_ADM_046 grounding): asserts the device-limit warning popup's real
   * layout — title, description copy, and both Cancel/Continue buttons — all grounded live
   * against the real UAT dialog (see RegisterLoginPage.ts's grounding note on these locators).
   */
  async expectMultiDeviceWarningLayout(): Promise<void> {
    await expect(this.registerLoginPage.multiDeviceWarningPopup()).toBeVisible();
    await expect(this.registerLoginPage.multiDeviceWarningDescription()).toBeVisible();
    await expect(this.registerLoginPage.multiDeviceCancelButton()).toBeVisible();
    await expect(this.registerLoginPage.multiDeviceContinueButton()).toBeVisible();
  }

  async fillMissingDetailsPhone(phone: string): Promise<void> {
    await this.registerLoginPage.missingDetailsPhoneInput().fill(phone);
    await this.registerLoginPage.missingDetailsGetOtpButton().click();
  }

  async expectOtpResendSuccessMessage(): Promise<void> {
    await expect(this.registerLoginPage.otpResendSuccessMessage()).toBeVisible();
  }

  async expectNoOtpOrTokenInUrl(): Promise<void> {
    const url = this.page.url();
    expect(url).not.toMatch(/[?&](otp|token)=/i);
  }

  async fillPhoneNumberOnly(value: string): Promise<void> {
    await this.registerLoginPage.enterPhoneNumber(value);
  }

  async expectPhoneInputValue(expected: string): Promise<void> {
    await expect(this.registerLoginPage.phoneNumberInput()).toHaveValue(expected);
  }

  async expectGetOtpButtonDisabled(): Promise<void> {
    await expect(this.registerLoginPage.getOtpButton()).toBeDisabled();
  }

  /**
   * Grounded 2026-08-27 (TC_ADM_060): re-confirmed live — the login panel is a client-side
   * drawer/overlay on the homepage route, not a separate URL. A `page.reload()` while it's open
   * doesn't preserve any login state (phone entry included) — it just re-renders the plain
   * homepage underneath, panel gone entirely. The sheet's "clean phone-entry state" premise is
   * wrong; the real reset target is the homepage itself. Checks the phone input is gone AND a
   * real homepage-only element ("Now Showing") is back, rather than reusing `expectOnHome`'s
   * OTP-input-hidden signal (semantically about a *successful login*, not this unrelated reset).
   */
  async expectResetToHomepageAfterReload(): Promise<void> {
    await expect(this.registerLoginPage.phoneNumberInput()).toBeHidden();
    await expect(this.page.getByRole('heading', { name: /now showing/i })).toBeVisible({ timeout: 15_000 });
  }

  async expectOnLoginScreen(): Promise<void> {
    await expect(this.registerLoginPage.phoneNumberInput()).toBeVisible();
  }

  async expectContinueAsGuestVisible(): Promise<void> {
    await expect(this.registerLoginPage.continueAsGuestButton()).toBeVisible();
    await expect(this.registerLoginPage.continueAsGuestButton()).toBeEnabled();
  }

  /**
   * Grounded 2026-08-26 (TC_ADM_027): "Continue as Guest" is confirmed, repeatedly, not to exist
   * anywhere on this UAT build — neither the login screen nor the header "User Icon" account
   * panel render it (matches TC_ADM_013/TC_ADM_030/REG-012/REG-013's independent findings). A
   * regression guard against the *real* current state, rather than the sheet's assumption.
   */
  async expectContinueAsGuestAbsent(): Promise<void> {
    await expect(this.registerLoginPage.continueAsGuestButton()).toHaveCount(0);
  }

  /**
   * Grounded 2026-08-20: user confirmed manually the OTP screen renders reliably — the real
   * cause of TC_ADM_002/006 failing under parallel-worker load was the same too-tight-timeout
   * pattern as the click fixes above, not a product issue. Playwright's default `expect`
   * timeout (5s, unset in playwright.config.ts) doesn't leave enough headroom for the screen
   * transition under real site latency, so this now matches the 15s used for the clicks that
   * lead into it.
   */
  async expectOtpScreenLoaded(): Promise<void> {
    await expect(this.registerLoginPage.otpInput()).toBeVisible({ timeout: 15_000 });
    await expect(this.registerLoginPage.editNumberButton()).toBeVisible({ timeout: 15_000 });
    await expect(this.registerLoginPage.resendOtpButton()).toBeDisabled({ timeout: 15_000 });
  }

  async editMobileNumber(): Promise<void> {
    await this.registerLoginPage.editNumberButton().click();
  }

  async expectOtpInputCleared(): Promise<void> {
    await expect(this.registerLoginPage.otpInput()).toBeHidden();
  }

  async expectNotLoggedIn(): Promise<void> {
    await expect(this.registerLoginPage.profileIcon()).toBeHidden();
  }

  async expectResendDisabled(): Promise<void> {
    await expect(this.registerLoginPage.resendOtpButton()).toBeDisabled();
  }

  async expectResendEnabled(): Promise<void> {
    await expect(this.registerLoginPage.resendOtpButton()).toBeEnabled();
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Bug fix (2026-08-27): confirmed live via `document.activeElement` inspection — "Get OTP" is
   * a real `disabled` `<button type="submit">` until a valid phone number is entered, and a
   * disabled button is never keyboard-focusable at all. Tabbing from an *empty* phone input (the
   * original implementation) never reaches it — focus instead cycles through an unrelated icon
   * button and a focus-trap sentinel. Filling a real, valid number first is what makes "Get OTP"
   * enabled and reachable via Tab, matching what a real user's keyboard-only flow would do.
   */
  async pressTabFromPhoneInput(phone: string): Promise<void> {
    await this.registerLoginPage.phoneNumberInput().fill(phone);
    await this.page.keyboard.press('Tab');
  }

  async expectGetOtpButtonFocused(): Promise<void> {
    await expect(this.registerLoginPage.getOtpButton()).toBeFocused();
  }

  async expectOtpErrorTextIsUserFriendly(): Promise<void> {
    const text = (await this.registerLoginPage.otpErrorMessage().textContent()) ?? '';
    expect(text).not.toMatch(/exception|stack trace|error code|null|undefined/i);
    expect(text.trim().length).toBeGreaterThan(0);
  }

  async expectFieldErrorTextIsUserFriendly(fieldLabel: string | RegExp): Promise<void> {
    const text = (await this.registerLoginPage.fieldError(fieldLabel).textContent()) ?? '';
    expect(text).not.toMatch(/exception|stack trace|error code|null|undefined/i);
    expect(text.trim().length).toBeGreaterThan(0);
  }

  /**
   * Added 2026-08-24 (REG-008/015/031 grounding): opens the account panel for inspection —
   * see RegisterLoginPage.openAccountPanel's grounding note for what distinguishes a
   * logged-in vs. guest panel.
   */
  async openAccountPanel(): Promise<void> {
    await this.registerLoginPage.openAccountPanel();
  }

  /**
   * Added 2026-08-24 (REG-015 grounding): confirms an authenticated session by opening the
   * account panel and checking the "Login" button is absent — live-grounded, the one
   * confirmed panel-level signal that distinguishes a logged-in session from a guest/
   * logged-out one on this build (the header User Icon itself is present either way).
   */
  async expectLoggedInViaAccountPanel(): Promise<void> {
    await this.openAccountPanel();
    await expect(this.registerLoginPage.loginButtonInAccountPanel()).toBeHidden();
  }

  /**
   * Added 2026-08-24 (multi-device-login.spec.ts TC_ADM_038/040 grounding): the inverse of
   * expectLoggedInViaAccountPanel() — confirms a session is NOT authenticated (e.g. a device
   * whose login was cancelled/abandoned on the device-limit warning popup) via the same
   * grounded panel-level signal, rather than `expectNotLoggedIn()`'s `profileIcon` check,
   * which this pass found unreliable here: the header "User Icon" button renders regardless of
   * auth state (per this file's own note on `profileIcon`), so it can't distinguish "never
   * logged in" from "logged in" on its own — only the account panel's "Login" button can.
   */
  async expectNotLoggedInViaAccountPanel(): Promise<void> {
    await this.openAccountPanel();
    await expect(this.registerLoginPage.loginButtonInAccountPanel()).toBeVisible();
  }

  /**
   * Added 2026-08-24 (multi-device-login.spec.ts TC_ADM_036/039 grounding): use instead of
   * expectLoggedInViaAccountPanel() for a device that just completed a fresh EXISTING-USER
   * OTP-only login (e.g. a 2nd/3rd/4th device logging in with an already-registered phone, or
   * right after choosing "Continue" on the device-limit warning popup) — see
   * RegisterLoginPage.openAccountPanelTolerant's grounding note for why the plain open can
   * spuriously fail here.
   */
  async expectLoggedInViaAccountPanelAfterFreshLogin(): Promise<void> {
    await this.registerLoginPage.openAccountPanelTolerant();
    await expect(this.registerLoginPage.loginButtonInAccountPanel()).toBeHidden();
  }

  /**
   * Added 2026-08-24 (multi-device-login.spec.ts TC_ADM_038 grounding): the "not logged in"
   * counterpart to expectLoggedInViaAccountPanelAfterFreshLogin() — for a device whose login
   * attempt was cancelled/abandoned right on the device-limit warning popup (same auto-
   * transitioning-drawer flow, see RegisterLoginPage.openAccountPanelTolerant's note).
   */
  async expectNotLoggedInViaAccountPanelAfterFreshLogin(): Promise<void> {
    await this.registerLoginPage.openAccountPanelTolerant();
    await expect(this.registerLoginPage.loginButtonInAccountPanel()).toBeVisible();
  }
}
