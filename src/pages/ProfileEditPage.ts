import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Locators grounded LIVE against real UAT (`inox-uat-web.pvrinox.com`) on 2026-08-25 — replaces
 * the original best-effort guesses (no live grounding had been done for this screen). Confirmed
 * via a real registration -> Personal Information round trip and direct DOM/network inspection
 * (see scratchpad `pe_ground*.js` scripts). Key structural findings that drove every locator
 * below:
 *
 * - This is a DIFFERENT screen from `ProfileCompletionPage.ts` (the post-registration "Complete
 *   Your Profile" onboarding nudge, steps 1-4). This one — "Edit Your Details" — is reached from
 *   Account -> Personal Information for an already-logged-in user, via the header "User Icon" ->
 *   any account-panel sub-section (e.g. "My Preferences") -> the left-nav sidebar's "Personal
 *   Information" link that then renders alongside it (URL ends up at `/dashboard?tab=profile`).
 *   A raw `page.goto('/dashboard?tab=profile')` right after registration looked reliable in ad
 *   hoc scratch scripts but is NOT under the real Playwright test runner — see `openProfile()`'s
 *   own bug-fix note for why in-app client-side navigation replaced it.
 * - The real save button reads "Update", NOT "Save" as the original guess assumed. There is NO
 *   Cancel/Discard/Reset button anywhere on this screen (confirmed: every button's accessible
 *   name was enumerated, zero matches for cancel|discard|reset) — TC_ADM_185/201 in the spec
 *   file account for this.
 * - Mandatory fields (marked with a visible `*` in the real UI): First Name, Phone Number,
 *   Email. Last Name has NO asterisk and is genuinely optional (confirmed live: blurring it
 *   empty produces no inline error and Update still succeeds) — this contradicts the sheet's
 *   TC_ADM_174 premise ("Mandatory validation for First & Last Name"); only First Name is
 *   actually enforced by this build. Both First and Last Name silently STRIP non-letter
 *   characters as you type (no error shown) — confirmed two independent ways: an XSS payload
 *   lost every `<>="_` character (see `profile-edit.spec.ts` TC_ADM_190), and a digit suffix
 *   used to build a "unique" test value was silently dropped (see TC_ADM_186's grounding — this
 *   is why every generated Name value in that spec file is letters-only).
 * - Update starts DISABLED with zero edits made (confirmed live: right after the form's fields
 *   finish populating from the customer-detail fetch, Update is disabled) — but once ANY field
 *   is touched, it enables and STAYS enabled even if that field is then made invalid (e.g. First
 *   Name cleared to empty still shows "Please enter a valid first name." inline, but Update
 *   doesn't re-disable). So the real rule is "dirty", not "valid": callers that need Update
 *   enabled must make some edit first; validation errors surface inline, not via a re-disabled
 *   button.
 * - Email left in an invalid format -> "Please enter a valid email. Email should be in the
 *   format name@example.com." — identical copy to the registration form's own email validator
 *   (`RegisterLoginModule` / `login.spec.ts` TC_ADM_010).
 * - Phone Number is a real disabled `<input>` (confirmed via `isDisabled()`).
 * - Gender ("Male"/"Female"/"Other") and Marital Status ("Single"/"Married") use the SAME
 *   non-`role="radio"` pattern as `ProfileCompletionPage.ts` — each option is an
 *   `aria-hidden="true"` `<input type="radio">` paired with a `label[for="..."]` that is the
 *   real click target (`getByRole('radio', ...)` matches nothing here either — same design
 *   system, reused directly rather than re-discovered).
 * - Date of Birth and Anniversary are calendar-only pickers (a "Select date" button opening a
 *   react-day-picker popover), structurally identical to `ProfileCompletionPage.ts`: targeted via
 *   the fixed field-label text's following-sibling button
 *   (`xpath=.//label[contains(., "...")]/following-sibling::button[1]`), a month/year
 *   `role="combobox"` pair in the popover header, and day cells by accessible name (NOT the
 *   `data-day` CSS attribute — see `ProfileCompletionPage.calendarDay`'s own bug-fix note on why
 *   that was unreliable). The Anniversary field only renders once Marital Status = Married is
 *   selected (same conditional-visibility behavior as `ProfileCompletionPage.ts`).
 * - Real, confirmed business rules (same backend/validation as `ProfileCompletionPage.ts`'s
 *   wizard step 1 — this build shares the DOB/Anniversary rules across both screens):
 *     - DOB: "You must be at least 13 years old to continue." (identical copy, confirmed live).
 *     - Anniversary future dates: blocked at the calendar-UI level — selecting a future year
 *       disables every day cell (identical mechanism to `ProfileCompletionPage.ts`).
 *   NOT independently re-confirmed here: `ProfileCompletionPage.ts`'s "Anniversary must be at
 *   least 18 years after date of birth" cross-field rule — not exercised in this pass's live
 *   grounding; tests that would need it are written defensively (DOB well before Anniversary).
 * - Save success is a real, visible message: "Your profile has been updated successfully."
 *   (confirmed live — distinct copy from `ProfileCompletionPage.ts`'s wizard, which has NO
 *   success message at all, only a silent step-advance). The real, network-observable save
 *   endpoint is `PATCH https://inox-uat-web.pvrinox.com/api/update-customer-detail` — the SAME
 *   endpoint `ProfileCompletionModule.UPDATE_CUSTOMER_DETAIL_PATTERN` uses for the wizard's Save
 *   & Next, NOT the `inox-uat-web.pvrinox.com/api/.../profile/edit`-shaped guess the original
 *   `ProfileEditMock.ts` made, and NOT the coincidental cross-origin
 *   `uat-api.pvrinox.com/customer/api/v1/customer` PATCH that fires once automatically as part of
 *   post-login session sync (an early scratch-script grounding pass mistook that one for this).
 *   See `ProfileEditModule.PROFILE_UPDATE_PATTERN`.
 * - Email-change OTP verification is REAL (unlike the login/registration SMS OTP, which this
 *   environment's real backend accepts any 6-digit code for — see `login.spec.ts`'s file header).
 *   Confirmed live: entering a wrong 6-digit code for the email OTP shows a real inline error,
 *   "You have entered an invalid OTP.", and the real backend call (`POST /api/verify-email-otp`)
 *   responds 400 with that exact message. This means the SUCCESS path (correct OTP -> Verified)
 *   can't be driven end-to-end without a real inbox for the changed address — only the failure
 *   path is testable here (see the spec file's TC_ADM_177/181 fixme reasons). Real endpoints
 *   (both same-origin, `inox-uat-web.pvrinox.com`): `POST /api/send-email-otp` (fired by clicking
 *   "Verify" next to Email) and `POST /api/verify-email-otp`. The OTP input on this screen is
 *   `input[name="pin"]` (maxlength 6) — NOT the login flow's `input[name="otp"]` — and it
 *   auto-submits once 6 digits are entered (no separate submit button, only "Resend Code", same
 *   pattern as `input[name="otp"]` on `RegisterLoginPage.ts`).
 */
export class ProfileEditPage {
  constructor(private page: Page) {}

  readonly heading = () => this.page.getByRole('heading', { name: /edit your details/i });

  // "Personal Information" only appears in a left-nav sidebar that renders once ANY
  // account-panel sub-section is opened (e.g. "My Preferences") — see this file's header and
  // `openProfile()`'s own bug-fix note for why a raw `page.goto()` was replaced with this
  // in-app client-side navigation.
  readonly accountPreferencesEntry = () => this.page.getByRole('button', { name: /my preferences/i }).first();
  readonly personalInformationLink = () => this.page.getByRole('button', { name: /personal information/i }).first();

  readonly firstNameInput = () => this.page.getByRole('textbox', { name: /first name/i });
  readonly lastNameInput = () => this.page.getByRole('textbox', { name: /last name/i });
  readonly phoneNumberField = () => this.page.getByRole('textbox', { name: /phone number/i });
  readonly emailInput = () => this.page.getByRole('textbox', { name: /email/i });

  readonly genderOptionLabel = (value: 'male' | 'female' | 'other') => this.page.locator(`label[for="${value}"]`);
  readonly genderOptionInput = (value: 'male' | 'female' | 'other') => this.page.locator(`input[type="radio"][value="${value}"]`);

  readonly maritalOptionLabel = (value: 'single' | 'married') => this.page.locator(`label[for="${value}"]`);
  readonly maritalOptionInput = (value: 'single' | 'married') => this.page.locator(`input[type="radio"][value="${value}"]`);

  readonly dobTrigger = () => this.page.locator('xpath=.//label[contains(., "date of birth")]/following-sibling::button[1]');
  readonly anniversaryTrigger = () => this.page.locator('xpath=.//label[contains(., "anniversary")]/following-sibling::button[1]');
  readonly anniversaryFieldLabel = () => this.page.getByText(/select your\s*anniversary date/i);

  readonly underageDobError = () => this.page.getByText(/you must be at least 13 years old/i);

  readonly updateButton = () => this.page.getByRole('button', { name: /^update$/i });

  // BUG FIX (2026-09-22): a real run found the bare name-matched locator resolves to 2 elements —
  // this page now also has an unrelated amber "Verify" button elsewhere (no `-form-item` ancestor,
  // per the strict-mode violation's DOM dump). Scope to the form-item container that wraps the
  // email textbox itself, since that container's id has an unstable React-generated prefix
  // (`_r_4l_-form-item` etc.) that can't be hardcoded.
  readonly emailVerifyButton = () =>
    this.page
      .locator('[id$="-form-item"]')
      .filter({ has: this.page.getByRole('textbox', { name: /email/i }) })
      .getByRole('button', { name: /^verify$/i });
  readonly emailOtpInput = () => this.page.locator('input[name="pin"]');
  readonly resendOtpButton = () => this.page.getByRole('button', { name: /resend code/i });
  // BUG FIX (2026-09-09): real UAT email-OTP rejection text is now "Unable to verify OTP. Please
  // request a new one." (confirmed live, a genuine `404 OTP_NOT_FOUND` from `verify-email-otp`)
  // — not the originally-assumed "invalid OTP" wording. Matches both in case the exact real text
  // depends on the rejection reason (e.g. a truly-wrong-but-live code vs. an expired/missing one).
  readonly otpInvalidError = () => this.page.getByText(/you have entered an invalid otp|unable to verify otp/i);

  readonly fieldError = (text: string | RegExp) => this.page.getByText(text instanceof RegExp ? text : new RegExp(text, 'i'));
  readonly firstNameRequiredError = () => this.page.getByText(/please enter a valid first name/i);
  readonly emailFormatError = () => this.page.getByText(/please enter a valid email/i);
  readonly saveSuccessMessage = () => this.page.getByText(/your profile has been updated successfully/i);

  // The active calendar popover is always the LAST `role="dialog"` while open — same convention
  // as `ProfileCompletionPage.ts`.
  readonly calendarPopover = () => this.page.getByRole('dialog').last();
  readonly calendarMonthCombobox = () => this.calendarPopover().getByRole('combobox').nth(0);
  readonly calendarYearCombobox = () => this.calendarPopover().getByRole('combobox').nth(1);
  readonly calendarDayButtons = () => this.calendarPopover().locator('button[data-day]');
  readonly calendarDay = (date: Date) => {
    const ordinal = (n: number): string => {
      const suffixes = ['th', 'st', 'nd', 'rd'];
      const v = n % 100;
      return `${n}${suffixes[(v - 20) % 10] ?? suffixes[v] ?? suffixes[0]}`;
    };
    const weekday = date.toLocaleString('en-US', { weekday: 'long' });
    const month = date.toLocaleString('en-US', { month: 'long' });
    const label = `${weekday}, ${month} ${ordinal(date.getDate())}, ${date.getFullYear()}`;
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.calendarPopover().getByRole('button', { name: new RegExp(`^${escaped}`) });
  };

  /**
   * BUG FIX (2026-08-25): the original version did a raw `page.goto('/dashboard?tab=profile')`
   * right after registration — reliable in ad hoc scratch scripts (which had generous manual
   * `waitForTimeout` buffers after each step) but NOT under the real Playwright test runner's own
   * overhead (tracing/video/screenshot capture), where a hard navigation fired before the
   * post-registration session was fully established server-side landed back on the logged-out
   * "Welcome!" login dialog instead (confirmed via a failing test's own accessibility snapshot).
   * Same class of race as `RegisterLoginPage.openAccountPanel()`'s own documented bug fix.
   * Switched to in-app client-side navigation instead — clicking through the ALREADY-OPEN account
   * panel (see `ProfileEditModule.openProfile`, which opens it via the proven
   * `RegisterLoginPage.openAccountPanel()` first) never triggers a full page load, so there is no
   * session-cookie race to lose. Requires the account panel to already be open.
   */
  async openProfile(): Promise<void> {
    // BUG FIX (2026-08-25): a real test run caught the "Personal Information" sidebar link never
    // rendering after one click on "My Preferences" — the same class of account-panel-opening
    // flakiness already documented and bug-fixed elsewhere in this suite (see
    // `RegisterLoginPage.openAccountPanel`'s and `LocationHelper.clickThroughOverlays`'s notes).
    // A bounded retry of the whole two-click sequence, same shape as
    // `ProfileCompletionPage.pickCalendarDate`, absorbs it.
    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await this.accountPreferencesEntry().click({ timeout: 15_000 });
        await expect(this.personalInformationLink()).toBeVisible({ timeout: 8_000 });
        await this.personalInformationLink().click();
        await expect(this.heading()).toBeVisible({ timeout: 15_000 });
        // BUG FIX (2026-08-25): the heading renders client-side immediately, but the form's own
        // fields are populated a moment later by an async `get-customer-detail` fetch — a real
        // test run caught a fill() landing during that gap and then getting silently clobbered
        // once the fetch resolved and re-rendered the form with the server's (unfilled) values.
        // Waiting for First Name to actually show a non-empty value confirms that fetch has
        // settled before any caller starts filling fields.
        await expect(this.firstNameInput()).not.toHaveValue('', { timeout: 10_000 });
        return;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  }

  /**
   * BUG FIX (2026-08-25): inline field validation on this screen (e.g. "Please enter a valid
   * first name." / "Please enter a valid email...") only fires on blur, not on input — confirmed
   * live: `.fill()` alone never surfaced either error, `.fill()` + `.blur()` did, every time.
   * Blurring after every fill (harmless for callers that don't care about validation, e.g.
   * TC_ADM_173's plain value checks) makes this the one place that behavior is encoded, instead
   * of every caller needing to remember it.
   */
  async fillFirstName(value: string): Promise<void> {
    await this.firstNameInput().fill(value);
    await this.firstNameInput().blur();
  }

  async fillLastName(value: string): Promise<void> {
    await this.lastNameInput().fill(value);
    await this.lastNameInput().blur();
  }

  async fillEmail(value: string): Promise<void> {
    await this.emailInput().fill(value);
    await this.emailInput().blur();
  }

  async selectGender(value: 'Male' | 'Female' | 'Other'): Promise<void> {
    await this.genderOptionLabel(value.toLowerCase() as 'male' | 'female' | 'other').click();
  }

  async selectMaritalStatus(value: 'Single' | 'Married'): Promise<void> {
    await this.maritalOptionLabel(value.toLowerCase() as 'single' | 'married').click();
  }

  async pickDob(date: Date): Promise<void> {
    await this.pickCalendarDate(this.dobTrigger(), date);
  }

  async pickAnniversary(date: Date): Promise<void> {
    await this.pickCalendarDate(this.anniversaryTrigger(), date);
  }

  /**
   * Opens the Anniversary calendar and jumps its year to `year` — used to prove future dates are
   * rejected. Same bounded-retry shape as `pickCalendarDate` — see its grounding note.
   */
  async openAnniversaryCalendarAtYear(year: number): Promise<void> {
    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        if (attempt > 0) await this.page.keyboard.press('Escape').catch(() => undefined);
        await this.anniversaryTrigger().click({ timeout: 20_000 });
        await expect(this.calendarPopover()).toBeVisible({ timeout: 12_000 });
        await this.calendarYearCombobox().click();
        await this.page.getByRole('option', { name: String(year), exact: true }).click();
        await expect(this.calendarPopover()).toBeVisible({ timeout: 10_000 });
        await expect(this.calendarDayButtons().first()).toBeVisible({ timeout: 10_000 });
        return;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  }

  /**
   * Reused verbatim (2026-08-25) from `ProfileCompletionPage.pickCalendarDate` — same
   * react-day-picker component, same real-site timing races (month/year Select can close the
   * whole popover, the year listbox is virtualized/scrollable) already bug-fixed there. See that
   * file's header for the full history of why each defensive step exists.
   */
  private async pickCalendarDate(trigger: Locator, date: Date): Promise<void> {
    const monthName = date.toLocaleString('en-US', { month: 'long' });
    const year = String(date.getFullYear());
    const day = this.calendarDay(date);

    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        if (attempt > 0) await this.page.keyboard.press('Escape').catch(() => undefined);
        await trigger.click({ timeout: 20_000 });
        await expect(this.calendarPopover()).toBeVisible({ timeout: 12_000 });

        const currentMonth = (await this.calendarMonthCombobox().innerText()).trim();
        if (currentMonth !== monthName) {
          await this.calendarMonthCombobox().click();
          await this.page.getByRole('option', { name: monthName, exact: true }).click();
          await expect(this.calendarPopover()).toBeVisible({ timeout: 6_000 });
        }

        const currentYear = (await this.calendarYearCombobox().innerText()).trim();
        if (currentYear !== year) {
          await this.calendarYearCombobox().click();
          const yearOption = this.page.getByRole('option', { name: year, exact: true });
          await yearOption.scrollIntoViewIfNeeded({ timeout: 6_000 }).catch(() => undefined);
          await yearOption.click({ timeout: 8_000 });
          await expect(this.calendarPopover()).toBeVisible({ timeout: 6_000 });
          await expect(this.calendarYearCombobox()).toHaveText(year, { timeout: 6_000 });
        }

        await expect(day).toBeVisible({ timeout: 10_000 });
        await day.click({ timeout: 10_000 });
        return;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  }

  /**
   * BUG FIX (2026-08-25): a real test run caught Update going transiently disabled right after a
   * field blur (client-side re-validation settling) and staying that way long enough for a bare
   * `.click()`'s actionability retries to exhaust the whole test timeout. Waiting for enabled
   * first — same debounced-enable pattern already used throughout this codebase
   * (`RegisterLoginPage.submitRegistration`, `ProfileCompletionPage.clickSaveNext`) — instead of
   * assuming this screen's earlier-grounded "Update stays enabled even with an invalid field"
   * finding (true for a *permanently* invalid value, e.g. empty First Name) also covers this
   * *transient* post-blur window.
   */
  async clickUpdate(): Promise<void> {
    await expect(this.updateButton()).toBeEnabled({ timeout: 15_000 });
    await this.updateButton().click();
  }

  async clickVerifyEmail(): Promise<void> {
    await this.emailVerifyButton().click();
  }

  async enterEmailOtp(otp: string): Promise<void> {
    await this.emailOtpInput().fill(otp);
  }

  async resendEmailOtp(): Promise<void> {
    await this.resendOtpButton().click();
  }
}
