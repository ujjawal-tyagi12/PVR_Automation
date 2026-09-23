import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BulkGiftCardPage } from '@pages/BulkGiftCardPage';
import { dismissPromoPopup, grantMumbaiGeolocation, UAT_BASE_URL } from '@utils/LocationHelper';
import { mockCorporateFormSubmission, type CapturedSubmission } from '@utils/CorporateFormsMock';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class BulkGiftCardModule {
  private readonly bulkGiftCardPage: BulkGiftCardPage;
  readonly capturedSubmissions: CapturedSubmission[] = [];

  constructor(private page: Page) {
    this.bulkGiftCardPage = new BulkGiftCardPage(page);
  }

  /** Direct-URL navigation — real route confirmed live (`/bulk-gift-cards`, plural). */
  async gotoBulkGiftCard(): Promise<void> {
    Logger.info('Opening /bulk-gift-cards on UAT with Mumbai geolocation granted');
    await grantMumbaiGeolocation(this.page);
    await mockCorporateFormSubmission(this.page, 'bulk-gift-card', this.capturedSubmissions);
    await this.bulkGiftCardPage.goto(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
    await expect(this.bulkGiftCardPage.pageHeading()).toBeVisible({ timeout: 20_000 });
  }

  /** Real navigation path for BGC-001/002 specifically — via the header "More" menu (real
   * accessible name "More Arrow Down"). */
  async gotoViaMoreMenu(): Promise<void> {
    await grantMumbaiGeolocation(this.page);
    await this.page.goto(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
    await this.bulkGiftCardPage.moreMenuButton().click();
    await expect(this.bulkGiftCardPage.bulkGiftCardMenuItem()).toBeVisible({ timeout: 10_000 });
  }

  async clickBulkGiftCardMenuItem(): Promise<void> {
    await this.bulkGiftCardPage.bulkGiftCardMenuItem().click();
    await expect(this.bulkGiftCardPage.pageHeading()).toBeVisible({ timeout: 20_000 });
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.bulkGiftCardPage.pageHeading()).toBeVisible();
    await expect(this.bulkGiftCardPage.enterDetailsHeading()).toBeVisible();
  }

  async expectBannerVisible(): Promise<void> {
    await expect(this.bulkGiftCardPage.bannerImage()).toBeVisible();
  }

  async expectNamePrefilled(expected: string): Promise<void> {
    await expect(this.bulkGiftCardPage.nameInput()).toHaveValue(expected);
  }

  /**
   * BGC-005/006/007: confirmed live (2026-09-17), twice, with a freshly-registered account
   * (name/email/phone all genuinely set on the account) — Name/Email/Phone all render EMPTY on
   * page load, not prefilled from the logged-in account. What looked like prefill during manual
   * testing was traced to the browser's OWN autofill (confirmed by the user: Company Name — a
   * field with no login-state relationship at all — started suggesting values the same way,
   * as-you-type, which is the classic browser-autocomplete signature, not a site behavior; a real
   * site prefill would populate on load without any typing). Asserts the real, confirmed behavior.
   */
  async expectContactFieldsEmpty(): Promise<void> {
    await expect(this.bulkGiftCardPage.nameInput()).toHaveValue('');
    await expect(this.bulkGiftCardPage.emailInput()).toHaveValue('');
    await expect(this.bulkGiftCardPage.phoneInput()).toHaveValue('');
  }

  async fillName(value: string): Promise<void> {
    await this.bulkGiftCardPage.nameInput().fill(value);
  }

  async fillAllMandatoryFields(): Promise<void> {
    await this.fillName('Vikrant Test');
    await this.fillEmail('vikrant.test@example.com');
    await this.fillPhone('9876543210');
    await this.fillLocation('Andheri West, Mumbai');
    await this.fillCompany('Appinventiv Technologies');
    await this.fillMessage('Test message for automation');
  }

  async fillLocation(value: string): Promise<void> {
    await this.bulkGiftCardPage.locationInput().fill(value);
  }

  async expectLocationLength(expectedLength: number): Promise<void> {
    const value = await this.bulkGiftCardPage.locationInput().inputValue();
    expect(value.length).toBe(expectedLength);
  }

  async expectLocationValue(expected: string): Promise<void> {
    await expect(this.bulkGiftCardPage.locationInput()).toHaveValue(expected);
  }

  /** Real, grounded: confirmed live `maxlength="100"` attribute. */
  async expectLocationMaxLength(expected: string): Promise<void> {
    await expect(this.bulkGiftCardPage.locationInput()).toHaveAttribute('maxlength', expected);
  }

  async fillCompany(value: string): Promise<void> {
    await this.bulkGiftCardPage.companyInput().fill(value);
  }

  async expectCompanyLength(expectedLength: number): Promise<void> {
    const value = await this.bulkGiftCardPage.companyInput().inputValue();
    expect(value.length).toBe(expectedLength);
  }

  async expectCompanyValue(expected: string): Promise<void> {
    await expect(this.bulkGiftCardPage.companyInput()).toHaveValue(expected);
  }

  /** Real, grounded: confirmed live `maxlength="100"` attribute. */
  async expectCompanyMaxLength(expected: string): Promise<void> {
    await expect(this.bulkGiftCardPage.companyInput()).toHaveAttribute('maxlength', expected);
  }

  async fillMessage(value: string): Promise<void> {
    await this.bulkGiftCardPage.messageInput().fill(value);
  }

  async expectMessageLength(expectedLength: number): Promise<void> {
    const value = await this.bulkGiftCardPage.messageInput().inputValue();
    expect(value.length).toBe(expectedLength);
  }

  async expectMessageValue(expected: string): Promise<void> {
    await expect(this.bulkGiftCardPage.messageInput()).toHaveValue(expected);
  }

  /** Real, grounded: confirmed live `maxlength="500"` attribute. */
  async expectMessageMaxLength(expected: string): Promise<void> {
    await expect(this.bulkGiftCardPage.messageInput()).toHaveAttribute('maxlength', expected);
  }

  async fillEmail(value: string): Promise<void> {
    await this.bulkGiftCardPage.emailInput().fill(value);
  }

  async fillPhone(value: string): Promise<void> {
    await this.bulkGiftCardPage.phoneInput().fill(value);
  }

  async checkCopyToSelf(): Promise<void> {
    await this.bulkGiftCardPage.copyToSelfCheckbox().check();
  }

  async expectCopyToSelfUnchecked(): Promise<void> {
    await expect(this.bulkGiftCardPage.copyToSelfCheckbox()).not.toBeChecked();
  }

  async clickGetOtp(): Promise<void> {
    await this.bulkGiftCardPage.getOtpButton().click();
  }

  /** Real, grounded: confirms the real "Verify Phone Number" OTP drawer opens. Deliberately
   * stops here — does NOT enter/verify an OTP, since this form's OTP send is a Next.js Server
   * Action (POST to the page's own URL, not a distinct `/api/...` path) that `CorporateFormsMock`
   * cannot yet intercept safely (see BulkGiftCardPage.ts doc comment). */
  async expectOtpDialogVisible(): Promise<void> {
    await expect(this.bulkGiftCardPage.otpHeading()).toBeVisible({ timeout: 15_000 });
    await expect(this.bulkGiftCardPage.otpInput()).toBeVisible();
    await expect(this.bulkGiftCardPage.resendCodeControl()).toBeVisible();
  }

  /** TODO(heal): everything past this point drives ungrounded OTP-entry locators — see
   * `BulkGiftCardPage.ts`'s doc comment. Expect real healing before these pass. */
  async submitOtp(otp = config.otpBypassCode): Promise<void> {
    await this.bulkGiftCardPage.otpInput().fill(otp);
    await this.bulkGiftCardPage.submitButton().click();
  }

  async expectSuccessPopup(): Promise<void> {
    await expect(this.bulkGiftCardPage.successPopupText()).toBeVisible({ timeout: 15_000 });
  }

  async expectFieldError(message: string | RegExp): Promise<void> {
    await expect(this.bulkGiftCardPage.fieldError(message)).toBeVisible();
  }

  /** Real, grounded live 2026-09-16: clicking Get OTP with mandatory fields blank/invalid shows
   * these exact inline messages ("Please enter a valid {field}.") — confirmed via screenshot. */
  async expectNameValidationError(): Promise<void> {
    await expect(this.bulkGiftCardPage.fieldError('Please enter a valid name.')).toBeVisible();
  }

  async expectEmailValidationError(): Promise<void> {
    await expect(this.bulkGiftCardPage.fieldError('Please enter a valid email.')).toBeVisible();
  }

  async expectPhoneValidationError(): Promise<void> {
    await expect(this.bulkGiftCardPage.fieldError('Please enter a valid phone number.')).toBeVisible();
  }

  async expectNoConfirmationEmailSent(): Promise<void> {
    const last = this.capturedSubmissions[this.capturedSubmissions.length - 1];
    expect(last?.postData?.copyToSelf ?? false).toBe(false);
  }
}
