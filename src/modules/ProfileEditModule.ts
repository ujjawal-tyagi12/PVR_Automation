import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { ProfileEditPage } from '@pages/ProfileEditPage';
import { RegisterLoginPage } from '@pages/RegisterLoginPage';
import { Logger } from '@utils/Logger';

/**
 * BUG FIX (2026-08-25): the original pattern here (`uat-api.pvrinox.com/customer/api/v1/
 * customer`, cross-origin) was a real endpoint, but the WRONG one — it fires automatically once
 * as part of post-login session establishment (auto-syncing the freshly-registered name), not
 * from clicking "Update". A real test run of TC_ADM_193 (`page.waitForResponse` on that pattern)
 * timed out three times in a row despite the save visibly succeeding in the UI every time —
 * adding temporary request/response console logging around a real Update click revealed the
 * actual call: `PATCH https://inox-uat-web.pvrinox.com/api/update-customer-detail`, same-origin.
 * This is the EXACT SAME endpoint `ProfileCompletionModule.UPDATE_CUSTOMER_DETAIL_PATTERN` uses
 * for the "Complete Your Profile" wizard's Save & Next — both screens save through one shared
 * backend route. Mockable directly with `page.route()` for save-failure/session-timeout/
 * backend-validation scenarios. Deliberately NOT anchored to `PATCH` only — callers that need to
 * distinguish method should check `route.request().method()` themselves.
 */
// Domain updated 2026-09-09: UAT moved from `inox-uat-web.pvrinox.com` to `uat-web.pvrinox.com`
// (confirmed live — same-origin API, same route shape, only the host changed).
export const PROFILE_UPDATE_PATTERN = /uat-web\.pvrinox\.com\/api\/update-customer-detail/i;

/** Real, same-origin email-change OTP endpoints — grounded live 2026-08-25. */
export const EMAIL_OTP_SEND_PATTERN = /uat-web\.pvrinox\.com\/api\/send-email-otp/i;
export const EMAIL_OTP_VERIFY_PATTERN = /uat-web\.pvrinox\.com\/api\/verify-email-otp/i;

export class ProfileEditModule {
  private readonly profileEditPage: ProfileEditPage;
  private readonly registerLoginPage: RegisterLoginPage;

  constructor(private page: Page) {
    this.profileEditPage = new ProfileEditPage(page);
    this.registerLoginPage = new RegisterLoginPage(page);
  }

  /**
   * Orchestrates two pages (allowed at the Module layer per this repo's layering rules): opens
   * the account panel via the already-grounded, retry-safe `RegisterLoginPage.openAccountPanel()`
   * — which specifically handles the post-registration drawer-still-mounted/header-hidden race —
   * then drives `ProfileEditPage`'s own in-app sidebar navigation to "Personal Information". See
   * `ProfileEditPage.openProfile()`'s bug-fix note for why a raw `page.goto()` was replaced with
   * this two-step, client-side-only navigation.
   */
  async openProfile(): Promise<void> {
    Logger.info('Navigating to Account -> Personal Information (Profile Edit)');
    await this.registerLoginPage.openAccountPanel();
    await this.profileEditPage.openProfile();
  }

  async expectHeadingVisible(): Promise<void> {
    await expect(this.profileEditPage.heading()).toBeVisible();
  }

  async expectProfileFieldsVisible(): Promise<void> {
    await expect(this.profileEditPage.firstNameInput()).toBeVisible();
    await expect(this.profileEditPage.lastNameInput()).toBeVisible();
    await expect(this.profileEditPage.phoneNumberField()).toBeVisible();
    await expect(this.profileEditPage.emailInput()).toBeVisible();
    await expect(this.profileEditPage.genderOptionLabel('male')).toBeVisible();
    await expect(this.profileEditPage.maritalOptionLabel('single')).toBeVisible();
  }

  async expectPhoneReadOnly(): Promise<void> {
    await expect(this.profileEditPage.phoneNumberField()).toBeDisabled();
  }

  async fillFirstName(value: string): Promise<void> {
    await this.profileEditPage.fillFirstName(value);
  }

  async fillLastName(value: string): Promise<void> {
    await this.profileEditPage.fillLastName(value);
  }

  async fillEmail(value: string): Promise<void> {
    await this.profileEditPage.fillEmail(value);
  }

  async getFirstNameValue(): Promise<string> {
    return this.profileEditPage.firstNameInput().inputValue();
  }

  async expectFieldValue(field: 'firstName' | 'lastName' | 'email', value: string): Promise<void> {
    const locator =
      field === 'firstName'
        ? this.profileEditPage.firstNameInput()
        : field === 'lastName'
          ? this.profileEditPage.lastNameInput()
          : this.profileEditPage.emailInput();
    await expect(locator).toHaveValue(value);
  }

  async selectGender(value: 'Male' | 'Female' | 'Other'): Promise<void> {
    Logger.info(`Selecting gender: ${value}`);
    await this.profileEditPage.selectGender(value);
  }

  async expectGenderSelected(value: 'Male' | 'Female' | 'Other'): Promise<void> {
    await expect(this.profileEditPage.genderOptionInput(value.toLowerCase() as 'male' | 'female' | 'other')).toBeChecked();
  }

  async expectGenderOptionsVisible(): Promise<void> {
    await expect(this.profileEditPage.genderOptionLabel('male')).toBeVisible();
    await expect(this.profileEditPage.genderOptionLabel('female')).toBeVisible();
    await expect(this.profileEditPage.genderOptionLabel('other')).toBeVisible();
  }

  async selectMaritalStatus(value: 'Single' | 'Married'): Promise<void> {
    Logger.info(`Selecting marital status: ${value}`);
    await this.profileEditPage.selectMaritalStatus(value);
  }

  async expectMaritalStatusSelected(value: 'Single' | 'Married'): Promise<void> {
    await expect(this.profileEditPage.maritalOptionInput(value.toLowerCase() as 'single' | 'married')).toBeChecked();
  }

  async expectMaritalStatusOptionsVisible(): Promise<void> {
    await expect(this.profileEditPage.maritalOptionLabel('single')).toBeVisible();
    await expect(this.profileEditPage.maritalOptionLabel('married')).toBeVisible();
  }

  /** Picks a DOB exactly `years` years before today (same month/day) — always >= 13. */
  async pickDobYearsAgo(years: number): Promise<void> {
    const today = new Date();
    const target = new Date(today.getFullYear() - years, today.getMonth(), today.getDate());
    Logger.info(`Picking DOB ~${years} years ago`);
    await this.profileEditPage.pickDob(target);
  }

  /**
   * Picks the DOB exactly one day short of the real 13-year cutoff — same boundary technique as
   * `ProfileCompletionModule.pickDobJustUnder13` (identical real business rule on this build).
   */
  async pickDobJustUnder13(): Promise<void> {
    const today = new Date();
    const boundary = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    const target = new Date(boundary.getTime() + 24 * 60 * 60 * 1000);
    Logger.info('Picking a DOB one day short of the real 13-year-minimum cutoff');
    await this.profileEditPage.pickDob(target);
  }

  async expectUnderageDobError(): Promise<void> {
    await expect(this.profileEditPage.underageDobError()).toBeVisible();
  }

  /** Picks an Anniversary date `years` years before today. */
  async pickAnniversaryYearsAgo(years: number): Promise<void> {
    const today = new Date();
    const target = new Date(today.getFullYear() - years, today.getMonth(), today.getDate());
    Logger.info(`Picking Anniversary ~${years} years ago`);
    await this.profileEditPage.pickAnniversary(target);
  }

  async expectAnniversaryFieldVisible(): Promise<void> {
    await expect(this.profileEditPage.anniversaryFieldLabel()).toBeVisible();
  }

  async expectAnniversaryFieldHidden(): Promise<void> {
    await expect(this.profileEditPage.anniversaryFieldLabel()).toBeHidden();
  }

  /**
   * Grounded 2026-08-25: same mechanism as `ProfileCompletionModule.expectFutureAnniversaryRejected`
   * — selecting a year beyond the current one snaps the calendar's shown month back into the
   * current year with every day cell disabled.
   */
  async expectFutureAnniversaryRejected(futureYear: number): Promise<void> {
    await this.profileEditPage.openAnniversaryCalendarAtYear(futureYear);
    const days = this.profileEditPage.calendarDayButtons();
    const count = await days.count();
    expect(count).toBeGreaterThan(0);
    await expect(days.first()).toBeDisabled();
    await expect(days.last()).toBeDisabled();
  }

  async clickUpdate(): Promise<void> {
    Logger.info('Saving profile edits (Update)');
    await this.profileEditPage.clickUpdate();
  }

  async expectSaveSuccess(): Promise<void> {
    await expect(this.profileEditPage.saveSuccessMessage()).toBeVisible({ timeout: 10_000 });
  }

  async expectSaveBlocked(): Promise<void> {
    await expect(this.profileEditPage.saveSuccessMessage()).toBeHidden();
  }

  async expectFieldError(text: string | RegExp): Promise<void> {
    await expect(this.profileEditPage.fieldError(text)).toBeVisible();
  }

  async expectFirstNameRequiredError(): Promise<void> {
    await expect(this.profileEditPage.firstNameRequiredError()).toBeVisible({ timeout: 10_000 });
  }

  async expectEmailFormatError(): Promise<void> {
    await expect(this.profileEditPage.emailFormatError()).toBeVisible({ timeout: 10_000 });
  }

  async expectEmailFormatErrorHidden(): Promise<void> {
    await expect(this.profileEditPage.emailFormatError()).toBeHidden();
  }

  async clickVerifyEmail(): Promise<void> {
    Logger.info('Requesting email-change OTP');
    await this.profileEditPage.clickVerifyEmail();
  }

  async enterEmailOtp(otp: string): Promise<void> {
    Logger.info('Submitting email-change OTP');
    await this.profileEditPage.enterEmailOtp(otp);
  }

  async resendEmailOtp(): Promise<void> {
    Logger.info('Resending email-change OTP');
    await this.profileEditPage.resendEmailOtp();
  }

  async expectOtpInvalidError(): Promise<void> {
    await expect(this.profileEditPage.otpInvalidError()).toBeVisible({ timeout: 10_000 });
  }

  // BUG FIX (2026-09-10): confirmed live via TC_ADM_205 — the disabled/cooldown state only
  // renders once the real email-OTP-send request (triggered by clickVerifyEmail) resolves; the
  // default 5s `expect` timeout could race that round trip. Same "ordinary latency mistaken for
  // a block" class already fixed elsewhere in this codebase for analogous first-render waits.
  async expectResendOtpDisabled(): Promise<void> {
    await expect(this.profileEditPage.resendOtpButton()).toBeDisabled({ timeout: 15_000 });
  }

  /**
   * Polls (not a fixed sleep) up to `timeoutMs` for the resend cooldown to lift — same technique
   * as `RegisterLoginModule.expectResendOtpEnabled`. Grounded 2026-08-25: this screen's cooldown
   * displays as "Please wait 00:5X before you can..." (~55-60s observed), noticeably shorter
   * than the login flow's real cooldown (~128s+) — still given generous headroom here since real
   * site latency varies.
   */
  async expectResendOtpEnabled(timeoutMs = 90_000): Promise<void> {
    await expect(this.profileEditPage.resendOtpButton()).toBeEnabled({ timeout: timeoutMs });
  }

  async getUpdateButtonColor(): Promise<string> {
    return this.profileEditPage
      .updateButton()
      .evaluate((el) => (globalThis as unknown as { getComputedStyle: (e: unknown) => { backgroundColor: string } }).getComputedStyle(el).backgroundColor);
  }

  async pressTabFromUpdateButton(): Promise<void> {
    await this.page.keyboard.press('Tab');
  }

  async expectUpdateButtonAccessible(): Promise<void> {
    await expect(this.profileEditPage.updateButton()).toBeVisible();
    await expect(this.profileEditPage.updateButton()).toBeEnabled();
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }
}
