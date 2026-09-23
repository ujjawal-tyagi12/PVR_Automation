import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { clickThroughOverlays, dismissLocationAndSelectCity, grantMumbaiGeolocation, UAT_CITY, UAT_SUB_CITY } from '@utils/LocationHelper';

/**
 * Locators grounded against the real production site (www.pvrinox.com) via a read-only
 * headless-Playwright diagnostic pass on 2026-08-18 — see scratchpad inspect-*.js scripts
 * for how each was found. Real first-load flow discovered: an "Enable Location" modal blocks
 * the page (PRD UC 8), Cancel triggers manual city selection (PRD UC 9, incl. a sub-city
 * drawer for cities like Delhi-NCR), and there is no "Log in" button anywhere on the
 * homepage — login is reached via an icon-only header button (`<img alt="User Icon">`, no
 * text/aria-label of its own) that opens an "Account" side panel containing the actual
 * "Login" button. `goto()`/`openLogin()` below encode this real sequence.
 *
 * Not yet re-grounded: registration-details fields, OTP-screen specifics, deactivated-account
 * popup, multi-device warning, and most of the copy-matched `getByText(...)` locators below —
 * those are still the original best-effort guesses. TODO(heal): verify the rest the same way.
 *
 * Bug fix (2026-08-20): `goto()`/`openLogin()` previously used a private, single-attempt
 * version of location-dialog dismissal that didn't verify the dialog actually closed before
 * returning — the city-selection drawer is a slide-out (`data-vaul-drawer`) whose sub-city
 * click can silently no-op if fired mid-animation, leaving the modal open and covering the
 * header's User Icon button for every later `openLogin()` call (reproduced consistently
 * against production, not a one-off flake). Now uses the shared, retrying
 * `LocationHelper.dismissLocationAndSelectCity`/`clickThroughOverlays` — the same fix already
 * applied to the newer Global Search/Event Listing/Event Details/Experience pages.
 */
export class RegisterLoginPage {
  constructor(private page: Page) {}

  readonly userIconButton = () => this.page.getByRole('button', { name: 'User Icon' });
  readonly loginButtonInAccountPanel = () => this.page.getByRole('button', { name: /^login$/i });
  readonly phoneNumberInput = () => this.page.getByRole('textbox', { name: /phone number/i });
  readonly getOtpButton = () => this.page.getByRole('button', { name: /get otp/i });
  readonly continueAsGuestButton = () => this.page.getByRole('button', { name: /continue as guest/i });

  // Grounded 2026-08-18: the real OTP field is a single `<input name="otp" maxlength="6">`
  // with no accessible name (visually styled as 6 boxes via CSS) — getByRole(textbox, {name})
  // never matches it, hence the attribute selector here instead of the rest of this file's
  // role+name pattern.
  readonly otpInput = () => this.page.locator('input[name="otp"]');
  readonly editNumberButton = () => this.page.getByRole('button', { name: /edit/i });
  // Grounded 2026-08-18: real button text is "Resend Code", not "Resend OTP".
  readonly resendOtpButton = () => this.page.getByRole('button', { name: /resend code/i });

  readonly firstNameInput = () => this.page.getByRole('textbox', { name: /first name/i });
  readonly lastNameInput = () => this.page.getByRole('textbox', { name: /last name/i });
  // Grounded 2026-08-20: real accessible name is "Enter your email" (placeholder-derived) —
  // an anchored `/^email$/i` never matched it.
  readonly emailInput = () => this.page.getByRole('textbox', { name: /email/i });
  readonly verifyEmailButton = () => this.page.getByRole('button', { name: /verify email/i });
  readonly whatsappOptInCheckbox = () => this.page.getByRole('checkbox', { name: /whatsapp notifications for transactions/i });
  readonly promoOptInCheckbox = () => this.page.getByRole('checkbox', { name: /opt-in to all the notifications for promotions/i });
  readonly registrationSubmitButton = () => this.page.getByRole('button', { name: /submit/i });

  readonly fieldError = (fieldLabel: string | RegExp) =>
    this.page.getByText(fieldLabel instanceof RegExp ? fieldLabel : new RegExp(fieldLabel, 'i'));
  readonly otpErrorMessage = () => this.page.getByText(/invalid otp|otp expired|too many failed attempts/i);
  readonly sendOtpRateLimitMessage = () => this.page.getByText(/requested otp too many times/i);
  readonly deactivatedAccountPopup = () => this.page.getByText(/account has been deactivated/i);
  readonly copyContactButton = () => this.page.getByRole('button', { name: /copy/i });
  readonly emailVerifiedStatus = () => this.page.getByText(/^verified$/i);
  readonly emailUnverifiedStatus = () => this.page.getByText(/^unverified$/i);
  // Grounded 2026-08-24: the real account-panel affordance for an unverified email is a
  // button whose accessible name is exactly "Verify" (not "Verify Email" — see
  // `verifyEmailButton` above, which targets a different control on the registration form
  // itself). `getByText('Verify')` alone is ambiguous here (matches heading/email text too),
  // so this needs its own role-scoped locator.
  readonly accountPanelVerifyButton = () => this.page.getByRole('button', { name: /^verify$/i });
  readonly bookTicketsButton = () => this.page.getByRole('button', { name: /book tickets/i });
  // Grounded 2026-08-24 (REG-031): a plain `getByText(name)` is ambiguous on the account
  // panel — the same name can also appear in a "Hey, {name}!" greeting and, coincidentally,
  // as a case-insensitive substring inside an auto-generated test email. The account panel's
  // real DOM renders the name as a distinct `<h2>` heading — targeting that role is unambiguous.
  readonly profileName = (name: string) => this.page.getByRole('heading', { name, exact: true });

  // Grounded live 2026-08-24 (multi-device-login.spec.ts TC_ADM_037-040/046): these three
  // locators were previously unverified guesses (per this file's original TODO(heal) note) —
  // confirmed live against the real UAT app: the popup is a real `role="dialog"`, its heading
  // (`data-slot="dialog-title"`) is exactly "Device Limit Reached", and it has exactly two
  // buttons whose accessible names are exactly "Cancel" and "Continue". All three locators
  // below matched the real DOM exactly as originally guessed — no changes needed.
  readonly multiDeviceWarningPopup = () => this.page.getByText(/device limit reached/i);
  readonly multiDeviceCancelButton = () => this.page.getByRole('button', { name: /^cancel$/i });
  readonly multiDeviceContinueButton = () => this.page.getByRole('button', { name: /^continue$/i });
  // Added 2026-08-24 (TC_ADM_046 grounding): the popup's real dialog-description text
  // (`data-slot="dialog-description"`), confirmed live verbatim.
  readonly multiDeviceWarningDescription = () => this.page.getByText(/by logging in this device, you will be logged out of another device/i);

  // Grounded 2026-08-18: reuses the same header "User Icon" button used to reach Login — it's
  // the only account-entry-point button confirmed to exist. Whether its accessible name or
  // appearance actually changes once logged in (vs. staying "User Icon" for guests too) is
  // NOT yet verified — this locator proves the header icon renders, not distinctly that the
  // mocked login was accepted by the app. TODO(heal): confirm a real post-login signal.
  readonly profileIcon = () => this.userIconButton();
  readonly emailVerifiedIcon = () => this.page.getByText(/verified/i);

  // BUG FIX (2026-09-09): a loose /terms/i match now hits two real, distinct links ("Terms &
  // Conditions" and "Terms of Use") — anchored to the specific one this flow means.
  readonly termsLink = () => this.page.getByRole('link', { name: 'Terms & Conditions', exact: true });
  readonly privacyLink = () => this.page.getByRole('link', { name: /privacy/i });
  readonly captchaWidget = () => this.page.locator('iframe[title*="recaptcha" i], iframe[src*="recaptcha" i]');
  readonly networkErrorMessage = () => this.page.getByText(/unable to connect|please try again/i);
  readonly serverErrorMessage = () => this.page.getByText(/server (not responding|error)|something went wrong/i);
  readonly offerButton = () => this.page.getByRole('button', { name: /apply offer|offers/i });
  readonly mobileConflictError = () => this.page.getByText(/already linked to another account/i);
  readonly mobileExistsError = () => this.page.getByText(/mobile number already exists/i);
  readonly missingDetailsPhoneInput = () => this.page.getByRole('textbox', { name: /phone number/i });
  readonly missingDetailsGetOtpButton = () => this.page.getByRole('button', { name: /get otp/i });
  readonly otpResendSuccessMessage = () => this.page.getByText(/new otp sent successfully/i);
  readonly whatsappOptInLabelText = () => this.page.getByText('I agree to opt-in to whatsapp notifications for transactions.');

  /**
   * Bug fix (2026-08-20): `BASE_URL` now points to UAT (`.env.local`), not production —
   * discovered the hard way: production's default city/sub-city ('Delhi-NCR'/'Noida') doesn't
   * structurally exist on UAT, where 'Delhi-NCR' only has Delhi/Greater Noida/Faridabad/
   * Gurgaon/All as sub-cities (no plain "Noida"). Every retry/timing fix on the old
   * 'Delhi-NCR'/'Noida' pair was chasing a symptom — `subCityCard` was correctly waiting for
   * an element that never existed on this environment.
   *
   * Bug fix (2026-08-20), bigger one: pre-granting geolocation permission (real Mumbai
   * coordinates) *before* navigating skips the "Enable Location" modal — and the entire
   * fragile popular-city → sub-city click chain that sat behind it — on this environment
   * entirely. `dismissLocationAndSelectCity(..., UAT_CITY, UAT_SUB_CITY)` stays as a fallback
   * for the rare case the modal still renders anyway.
   */
  async goto(): Promise<void> {
    await grantMumbaiGeolocation(this.page);
    await this.page.goto('/');
    await dismissLocationAndSelectCity(this.page, UAT_CITY, UAT_SUB_CITY);
  }

  async openLogin(): Promise<void> {
    // BUG FIX (2026-09-10, multi-device-login.spec.ts grounding): confirmed live — under a 3rd+
    // simultaneous device context (several `browser.newContext()` sessions open against the same
    // UAT deployment at once, real site latency compounding), this click can succeed at the DOM
    // level without the account panel actually opening (the follow-up "Login" wait then times out
    // with no panel/dialog content anywhere in the page). Same "ordinary latency mistaken for a
    // block" class already fixed below for the second click — matching its reasoning and 15s cap.
    await clickThroughOverlays(this.page, () => this.userIconButton().click({ timeout: 15_000 }), { city: UAT_CITY, subCity: UAT_SUB_CITY });
    // BUG FIX (2026-08-20): this second click was unprotected — TC_ADM_021 caught the promo
    // popup reappearing between the two clicks and blocking it for the full test timeout.
    // BUG FIX (2026-08-20), follow-up: an initial 6_000ms cap (copied from the userIconButton
    // click above) was too tight — this button needs the account panel's own slide-open
    // animation to finish first, which can legitimately take longer than 6s under real site
    // latency. Unlike userIconButton, nothing normally blocks this click, so the original
    // un-timed version always passed; the short cap turned ordinary render latency into false
    // "blocked by an overlay" retries and broke previously-solid tests (TC_ADM_001 included).
    // 15s gives real per-attempt headroom while still bounded enough for retries to matter.
    await clickThroughOverlays(this.page, () => this.loginButtonInAccountPanel().click({ timeout: 15_000 }), { city: UAT_CITY, subCity: UAT_SUB_CITY });
  }

  async enterPhoneNumber(phone: string): Promise<void> {
    await this.phoneNumberInput().fill(phone);
  }

  async requestOtp(): Promise<void> {
    // BUG FIX (2026-08-20): also unprotected — TC_ADM_009 caught the same promo popup
    // reappearing later in the flow (after the OTP screen's own render), blocking this click.
    // BUG FIX (2026-08-20), follow-up: same 6s-too-tight issue as loginButtonInAccountPanel
    // above — "Get OTP" can take a moment to enable after the phone field's own validation
    // settles; 15s avoids mistaking that ordinary delay for an overlay block.
    await clickThroughOverlays(this.page, () => this.getOtpButton().click({ timeout: 15_000 }), { city: UAT_CITY, subCity: UAT_SUB_CITY });
  }

  async enterOtp(otp: string): Promise<void> {
    await this.otpInput().fill(otp);
  }

  /**
   * REG-006: simulates a real clipboard-paste entry into the OTP field, distinct from `enterOtp`'s
   * plain `.fill()`. A genuine OS-level paste (`context.grantPermissions(['clipboard-write'])` +
   * `navigator.clipboard.writeText` + `Ctrl+V`) is confirmed to hang indefinitely in this headless
   * sandbox (see `otp-screen.spec.ts` TC_ADM_069's grounding note) — this dispatches a real
   * `ClipboardEvent('paste', { clipboardData })` on the field instead, which any real paste-handler
   * on the input would observe, then applies the pasted value via the input's native value setter
   * (not `.fill()`) + a real `input` event, since a synthetic (untrusted) event's default browser
   * action (actually inserting the clipboard text) is not performed automatically. This is the
   * closest reliable, non-hanging proxy for "pasted" vs. "typed" entry available in this sandbox.
   */
  async pasteOtp(otp: string): Promise<void> {
    await this.otpInput().evaluate((el, value: string) => {
      /* eslint-disable @typescript-eslint/no-explicit-any -- no DOM lib configured for this Node
         project (see tsconfig.json's `lib`), so ClipboardEvent/DataTransfer/the native value
         setter are only reachable via `any` here. */
      const input = el as any;
      const win = input.ownerDocument.defaultView as any;
      input.focus();
      const dataTransfer = new win.DataTransfer();
      dataTransfer.setData('text/plain', value);
      const pasteEvent = new win.ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: dataTransfer });
      input.dispatchEvent(pasteEvent);
      const nativeValueSetter = win.Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value').set;
      nativeValueSetter.call(input, value);
      input.dispatchEvent(new win.Event('input', { bubbles: true }));
      /* eslint-enable @typescript-eslint/no-explicit-any */
    }, otp);
  }

  async resendOtp(): Promise<void> {
    await this.resendOtpButton().click();
  }

  async clickContinueAsGuest(): Promise<void> {
    // BUG FIX (2026-08-20): a one-time `dismissPromoPopup` call before this wasn't enough —
    // TC_ADM_013 still hung the full test timeout, meaning the popup can appear *after* that
    // check too. Wrapping in `clickThroughOverlays` (which now dismisses the promo popup on
    // every retry, not just the location modal) actually re-checks for it.
    await clickThroughOverlays(this.page, () => this.continueAsGuestButton().click({ timeout: 15_000 }), { city: UAT_CITY, subCity: UAT_SUB_CITY });
  }

  async fillRegistrationDetails(firstName: string, lastName: string, email: string): Promise<void> {
    await this.firstNameInput().fill(firstName);
    if (lastName) await this.lastNameInput().fill(lastName);
    await this.emailInput().fill(email);
  }

  // Grounded 2026-08-24: the real Submit button only enables after the app's own async
  // field-validation settles (a debounce, not instant) — clicking immediately after fill()
  // can silently no-op on a still-disabled button. Waiting for enabled first (same 15s
  // headroom pattern as the rest of this file) makes this reliable under real site latency.
  async submitRegistration(): Promise<void> {
    await expect(this.registrationSubmitButton()).toBeEnabled({ timeout: 15_000 });
    await this.registrationSubmitButton().click();
  }

  async requestEmailVerification(): Promise<void> {
    await this.verifyEmailButton().click();
  }

  async attemptBookTickets(): Promise<void> {
    await this.bookTicketsButton().click();
  }

  async attemptApplyOffer(): Promise<void> {
    await this.offerButton().click();
  }

  async clickTerms(): Promise<void> {
    // BUG FIX (2026-08-20): TC_ADM_022 caught the promo popup's backdrop intercepting this
    // click for the full test timeout — same unprotected-click issue as the others above.
    await clickThroughOverlays(this.page, () => this.termsLink().click({ timeout: 15_000 }), { city: UAT_CITY, subCity: UAT_SUB_CITY });
  }

  async clickPrivacy(): Promise<void> {
    await clickThroughOverlays(this.page, () => this.privacyLink().click({ timeout: 15_000 }), { city: UAT_CITY, subCity: UAT_SUB_CITY });
  }

  async clickCancelOnMultiDevicePopup(): Promise<void> {
    await this.multiDeviceCancelButton().click();
  }

  async clickContinueOnMultiDevicePopup(): Promise<void> {
    await this.multiDeviceContinueButton().click();
  }

  /**
   * Added 2026-08-24 (register-login.spec.ts REG-008/015/031 grounding): opens the header
   * account/profile panel via the User Icon WITHOUT proceeding to click "Login" inside it —
   * used to inspect the panel's own content. Live-grounded finding: for a guest/logged-out
   * session the panel shows only "Login / Customer Experience / Settings"; once authenticated
   * it instead shows the account's name, phone, email (with a "Verify" affordance next to an
   * unverified email), "My Bookings", etc., and no "Login" button at all — a reliable,
   * confirmed way to distinguish the two states.
   */
  async openAccountPanel(): Promise<void> {
    // Grounded 2026-08-24 (REG-015): the login/registration slide-in drawer (`data-vaul-drawer`,
    // class `register-page`) doesn't auto-close after a successful registration/login submit —
    // it stays mounted and keeps `aria-hidden="true"` on the header, blocking the User Icon
    // button. `clickThroughOverlays`'s reactive retry (dismiss-then-retry only AFTER a failed
    // attempt) wasn't reliably winning that race under real site latency. Proactively pressing
    // Escape and waiting for the header to actually un-hide first — confirmed live this closes
    // the drawer in ~1-2s — avoids burning a whole 15s attempt on a click that was never going
    // to succeed.
    const header = this.page.locator('header').first();
    if ((await header.getAttribute('aria-hidden').catch(() => null)) === 'true') {
      await this.page.keyboard.press('Escape').catch(() => undefined);
      await expect(header).not.toHaveAttribute('aria-hidden', 'true', { timeout: 5_000 }).catch(() => undefined);
    }
    await clickThroughOverlays(this.page, () => this.userIconButton().click({ timeout: 15_000 }), { city: UAT_CITY, subCity: UAT_SUB_CITY });
  }

  /**
   * Added 2026-08-24 (multi-device-login.spec.ts TC_ADM_036/038/039 grounding): a tolerant
   * variant of openAccountPanel() for a device that just completed a fresh EXISTING-USER
   * OTP-only login (no registration form shown, i.e. logging in on a 2nd/3rd/4th device with
   * an already-registered phone number). Grounded live via a failing test's error-context
   * snapshot: in that specific flow the same login drawer auto-transitions directly into the
   * account-panel view on OTP success, without literally closing and remounting — the
   * snapshot showed the account panel already fully open (name/email/phone/"My Bookings", no
   * "Login" button) at the exact moment openAccountPanel()'s click on the header "User Icon"
   * timed out, because that button isn't queryable by that accessible name while the panel is
   * already open this way. openAccountPanel()'s own aria-hidden/Escape handling (grounded for
   * the *registration* flow, where the drawer does stay mounted over a hidden header) doesn't
   * cover this different, OTP-only-login case. Swallowing a failed open attempt here is the
   * correct, grounded behavior: it means the panel was already open, not that opening failed.
   */
  async openAccountPanelTolerant(): Promise<void> {
    await this.openAccountPanel().catch(() => undefined);
  }
}
