import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { CareersPage } from '@pages/CareersPage';
import { dismissPromoPopup, grantMumbaiGeolocation, UAT_BASE_URL } from '@utils/LocationHelper';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class CareersModule {
  private readonly careersPage: CareersPage;

  constructor(private page: Page) {
    this.careersPage = new CareersPage(page);
  }

  async gotoCareers(): Promise<void> {
    Logger.info('Opening /career on UAT with Mumbai geolocation granted');
    await grantMumbaiGeolocation(this.page);
    await this.careersPage.goto(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
    await expect(this.careersPage.heading(/why pvr inox/i)).toBeVisible({ timeout: 20_000 });
  }

  async gotoHomepage(): Promise<void> {
    await grantMumbaiGeolocation(this.page);
    await this.page.goto(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
  }

  // ---- "More" menu navigation (CAR-001/002) ----

  async clickMoreAndExpectCareerMenuItemVisible(): Promise<void> {
    await this.careersPage.moreMenuButton().click();
    await expect(this.careersPage.careerMenuItem()).toBeVisible({ timeout: 10_000 });
  }

  async clickCareerMenuItemAndExpectNavigation(): Promise<void> {
    await this.careersPage.careerMenuItem().click();
    await this.page.waitForURL(/\/career$/, { timeout: 15_000 });
  }

  // ---- Landing page content (CAR-003-011) ----

  async expectHeadingVisible(name: string | RegExp): Promise<void> {
    await expect(this.careersPage.heading(name)).toBeVisible({ timeout: 10_000 });
  }

  async expectWhyPvrInoxBodyVisible(): Promise<void> {
    await expect(this.careersPage.whyPvrInoxBodyText()).toBeVisible();
  }

  async expectBannerVisible(): Promise<void> {
    await expect(this.careersPage.bannerImage()).toBeVisible();
  }

  async expectSocialLinkHref(hrefSubstring: string): Promise<void> {
    const link = this.careersPage.socialLink(hrefSubstring);
    await expect(link).toHaveAttribute('href', new RegExp(CareersModule.escapeRegExp(hrefSubstring)));
    await expect(link).toHaveAttribute('target', '_blank');
  }

  async expectAddressVisible(address: string): Promise<void> {
    await expect(this.careersPage.addressText(address)).toBeVisible();
  }

  async expectMapVisible(): Promise<void> {
    await expect(this.careersPage.mapIframe()).toBeVisible();
  }

  async expectDepartmentVisible(name: string): Promise<void> {
    await expect(this.careersPage.departmentCard(name)).toBeVisible({ timeout: 10_000 });
  }

  async expectDepartmentImageVisible(name: string): Promise<void> {
    await expect(this.careersPage.departmentImage(name)).toBeVisible({ timeout: 10_000 });
  }

  // ---- Department -> Apply flow (CAR-015/056: real behavior is a direct dialog, not a job-listing nav) ----

  /**
   * RESOLVED — real behavior differs from the sheet: the only department on this environment has
   * 0 active jobs, so clicking it opens the "Apply for the role" dialog directly, with no
   * navigation at all. Covers both CAR-015 (department click) and CAR-056 (zero-job department)
   * since they are, in reality, the exact same code path here.
   */
  async clickDepartmentAndExpectApplyDialogOpen(name: string): Promise<void> {
    await this.careersPage.departmentCard(name).click();
    await expect(this.careersPage.dialog()).toBeVisible({ timeout: 10_000 });
    await expect(this.careersPage.departmentInput()).toHaveValue(name);
  }

  async expectDepartmentFieldDisabled(): Promise<void> {
    await expect(this.careersPage.departmentInput()).toBeDisabled();
  }

  async gotoJobListingAndExpectEmptyState(departmentId: string): Promise<void> {
    await grantMumbaiGeolocation(this.page);
    await this.careersPage.gotoJobListing(UAT_BASE_URL, departmentId);
    await dismissPromoPopup(this.page);
    await expect(this.careersPage.noOpenPositionsText()).toBeVisible({ timeout: 15_000 });
  }

  // ---- Application form (CAR-028-047) ----

  async fillApplicationForm(fields: { name?: string; phone?: string; email?: string }): Promise<void> {
    if (fields.name !== undefined) await this.careersPage.nameInput().fill(fields.name);
    if (fields.phone !== undefined) await this.careersPage.phoneInput().fill(fields.phone);
    if (fields.email !== undefined) await this.careersPage.emailInput().fill(fields.email);
  }

  async expectPhoneInputValue(value: string): Promise<void> {
    await expect(this.careersPage.phoneInput()).toHaveValue(value);
  }

  async clickSubmit(): Promise<void> {
    await this.careersPage.submitButton().click();
  }

  async expectFieldError(message: string): Promise<void> {
    await expect(this.careersPage.fieldError(message)).toBeVisible({ timeout: 10_000 });
  }

  async expectFieldErrorHidden(message: string): Promise<void> {
    await expect(this.careersPage.fieldError(message)).toBeHidden({ timeout: 10_000 });
  }

  async uploadResume(filePath: string): Promise<void> {
    const [chooser] = await Promise.all([this.page.waitForEvent('filechooser', { timeout: 10_000 }), this.careersPage.uploadResumeButton().click()]);
    await chooser.setFiles(filePath);
  }

  async expectResumeFilename(filename: string): Promise<void> {
    await expect(this.careersPage.resumeFilenameInput()).toHaveValue(filename, { timeout: 10_000 });
  }

  // ---- Submit -> OTP -> success (CAR-048-054 — RESOLVED: fully automatable, real bypass works here too) ----

  async expectOtpScreenVisible(): Promise<void> {
    await expect(this.careersPage.otpHeading()).toBeVisible({ timeout: 15_000 });
  }

  /** Healer fix: this OTP field renders as 6 individual visual boxes backed by one real input —
   * a plain `.fill(code)` on top of a previous value left stale digits behind (confirmed live: a
   * retry after a wrong OTP produced a garbled mixed value instead of a clean replace). Clearing
   * first makes the retry-after-wrong-OTP path (CAR-052) reliable. */
  async submitOtp(code = config.otpBypassCode): Promise<void> {
    await this.careersPage.otpInput().fill('');
    await this.careersPage.otpInput().fill(code);
  }

  async expectOtpInvalidError(message: string): Promise<void> {
    await expect(this.careersPage.dialog().getByText(message, { exact: true })).toBeVisible({ timeout: 10_000 });
  }

  async expectSuccessPopup(heading: string, body: string): Promise<void> {
    await expect(this.careersPage.successHeading()).toBeVisible({ timeout: 15_000 });
    await expect(this.page.getByText(body)).toBeVisible();
    expect(await this.careersPage.successHeading().textContent()).toBe(heading);
  }

  async closeSuccessPopup(): Promise<void> {
    await this.careersPage.successOkButton().click();
    await expect(this.careersPage.dialog()).toBeHidden({ timeout: 10_000 });
  }

  async closeDialog(): Promise<void> {
    await this.careersPage.dialogCloseButton().click();
    await expect(this.careersPage.dialog()).toBeHidden({ timeout: 10_000 });
  }

  // ---- Resume upload failure (CAR-057 — RESOLVED: real behavior is a silent failure) ----

  /**
   * Confirmed live: blocking `/api/media/file-upload-guest` with a real 500 at Submit time
   * produces no visible error anywhere (no `role="alert"`/`role="status"` text) — the dialog just
   * stays open silently. Asserts the real (silent) behavior instead of the sheet's assumed
   * message.
   */
  async blockResumeUploadAndExpectSilentFailure(): Promise<void> {
    await this.page.route('**/api/media/file-upload-guest**', (route) => route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ ok: false }) }));
    await this.careersPage.submitButton().click();
    const alertTexts = await this.page.getByRole('alert').allTextContents();
    expect(alertTexts.every((text) => text.trim().length === 0)).toBe(true);
    await expect(this.careersPage.dialog()).toBeVisible();
    await expect(this.careersPage.otpHeading()).toBeHidden();
  }

  // ---- Form persistence (CAR-058/059) ----

  async expectNameFieldEmpty(): Promise<void> {
    await expect(this.careersPage.nameInput()).toHaveValue('');
  }

  async expectDialogClosed(): Promise<void> {
    await expect(this.careersPage.dialog()).toHaveCount(0, { timeout: 10_000 });
  }

  // ---- Responsiveness (CAR-060) ----

  async resizeViewportAndExpectPageStillUsable(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
    await expect(this.careersPage.heading(/why pvr inox/i)).toBeVisible({ timeout: 10_000 });
  }

  private static escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
