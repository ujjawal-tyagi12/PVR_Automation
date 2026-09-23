import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { RegisterLoginPage } from '@pages/RegisterLoginPage';
import { RegisterLoginModule } from '@modules/RegisterLoginModule';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

/**
 * Extracted from `RegisterLoginModule.ts` (2026-08-21, e2e-review nit) — that module had grown
 * to 330 lines mixing login/OTP mechanics with registration-form/email-verification/WhatsApp-
 * opt-in concerns. This module owns the registration-form-specific surface; login/OTP/guest/
 * multi-device flows stay in `RegisterLoginModule`. `registerNewUser` composes an internal
 * `RegisterLoginModule` for the phone+OTP steps that precede the registration form rather than
 * duplicating that logic.
 */
export class RegistrationModule {
  private readonly registerLoginPage: RegisterLoginPage;
  private readonly registerLoginModule: RegisterLoginModule;

  constructor(private page: Page) {
    this.registerLoginPage = new RegisterLoginPage(page);
    this.registerLoginModule = new RegisterLoginModule(page);
  }

  async registerNewUser(details: { phone: string; firstName: string; lastName?: string; email: string; otp?: string }): Promise<void> {
    Logger.info(`Registering new user with email ${details.email}`);
    await this.registerLoginModule.submitPhoneNumber(details.phone);
    await this.registerLoginModule.submitOtp(details.otp ?? config.otpBypassCode);
    await this.registerLoginPage.fillRegistrationDetails(details.firstName, details.lastName ?? '', details.email);
    await this.registerLoginPage.submitRegistration();
  }

  async fillRegistrationDetails(firstName: string, lastName: string, email: string): Promise<void> {
    await this.registerLoginPage.fillRegistrationDetails(firstName, lastName, email);
  }

  async submitRegistrationForm(): Promise<void> {
    await this.registerLoginPage.submitRegistration();
  }

  async expectSubmitDisabled(): Promise<void> {
    await expect(this.registerLoginPage.registrationSubmitButton()).toBeDisabled({ timeout: 15_000 });
  }

  /**
   * 15s timeout (2026-08-24), same reasoning as RegisterLoginModule.expectOtpScreenLoaded:
   * Playwright's default 5s expect timeout doesn't leave enough headroom for the real
   * client-side field-validation to settle under real UAT site latency after filling the
   * registration form — confirmed via register-login.spec.ts's REG-008/015/031/040 failing
   * consistently on the bare 5s default even serially (not just under parallel load).
   */
  async expectSubmitEnabled(): Promise<void> {
    await expect(this.registerLoginPage.registrationSubmitButton()).toBeEnabled({ timeout: 15_000 });
  }

  async expectRegistrationFieldsAccessible(): Promise<void> {
    await expect(this.registerLoginPage.firstNameInput()).toBeVisible();
    await expect(this.registerLoginPage.lastNameInput()).toBeVisible();
    await expect(this.registerLoginPage.emailInput()).toBeVisible();
    await expect(this.registerLoginPage.registrationSubmitButton()).toBeVisible();
  }

  async expectFirstNameValue(expected: string): Promise<void> {
    await expect(this.registerLoginPage.firstNameInput()).toHaveValue(expected);
  }

  async expectLastNameValue(expected: string): Promise<void> {
    await expect(this.registerLoginPage.lastNameInput()).toHaveValue(expected);
  }

  async expectWhatsappOptInCheckedByDefault(): Promise<void> {
    await expect(this.registerLoginPage.whatsappOptInCheckbox()).toBeChecked();
  }

  async uncheckWhatsappOptIn(): Promise<void> {
    await this.registerLoginPage.whatsappOptInCheckbox().uncheck();
  }

  async expectWhatsappOptInLabelText(): Promise<void> {
    await expect(this.registerLoginPage.whatsappOptInLabelText()).toBeVisible();
  }

  async requestEmailVerification(): Promise<void> {
    await this.registerLoginPage.requestEmailVerification();
  }

  async verifyEmailWithOtp(otp: string): Promise<void> {
    Logger.info('Verifying email via OTP');
    await this.registerLoginPage.requestEmailVerification();
    await this.registerLoginPage.enterOtp(otp);
  }

  async expectEmailVerified(): Promise<void> {
    await expect(this.registerLoginPage.emailVerifiedStatus()).toBeVisible();
  }

  async expectEmailUnverified(): Promise<void> {
    await expect(this.registerLoginPage.emailUnverifiedStatus()).toBeVisible();
  }

  async expectMobileConflictError(): Promise<void> {
    await expect(this.registerLoginPage.mobileConflictError()).toBeVisible();
  }

  async expectMobileExistsError(): Promise<void> {
    await expect(this.registerLoginPage.mobileExistsError()).toBeVisible();
  }

  /**
   * Added 2026-08-25 (profile-edit.spec.ts grounding): confirms the registration form's submit
   * actually succeeded — the form/drawer closing (its own Submit button going hidden) — rather
   * than assuming a click that could silently fail under real backend flakiness went through.
   * `submitRegistrationForm()` itself only waits for the button to be enabled and clicks it; it
   * doesn't confirm the outcome. A real test run caught exactly this: a later step opened the
   * account panel and found "Login" still showing (never actually authenticated), several steps
   * downstream of the real point of failure with a much less obvious error. Callers whose next
   * step depends on being genuinely logged in should await this right after
   * `submitRegistrationForm()`.
   */
  async expectRegistrationSubmitted(): Promise<void> {
    await expect(this.registerLoginPage.registrationSubmitButton()).toBeHidden({ timeout: 20_000 });
  }
}
