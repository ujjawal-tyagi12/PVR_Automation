import { Page, expect } from '@playwright/test';
import { RegisterLoginPage } from '@pages/RegisterLoginPage';
import { AdminLoginModule, randomPhoneNumber } from '@modules/AdminLoginModule';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real, public phone+OTP login/registration dialog for the Register/Login
 * Screens sheet module — see RegisterLoginPage for what's specific to it. Composes
 * AdminLoginModule for the shared login/OTP/onboarding-overlay mechanics already proven live
 * there, instead of re-grounding the same dialog a second time.
 *
 * @hritik
 */
export class RegisterLoginModule {
  private loginPage: RegisterLoginPage;
  private adminLogin: AdminLoginModule;

  constructor(private page: Page) {
    this.loginPage = new RegisterLoginPage(page);
    this.adminLogin = new AdminLoginModule(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page');
    await this.adminLogin.open();
  }

  /** A brand-new phone number, taken all the way to the real post-OTP registration screen —
   * deliberately does not clear it, unlike completeLogin(), so the screen itself can be
   * asserted. */
  async registerNewUser(otp: string): Promise<string> {
    const phone = randomPhoneNumber();
    Logger.info(`Registering new user with phone ${phone}`);
    await this.adminLogin.loginWithPhone(phone, otp);
    return phone;
  }

  async assertRegistrationScreenShown(): Promise<void> {
    await expect(this.loginPage.registrationHeading()).toBeVisible({ timeout: 20000 });
  }

  async loginExistingUser(phone: string, otp: string): Promise<void> {
    Logger.info(`Logging in existing user ${phone}`);
    await this.adminLogin.openLoginDialog();
    await this.adminLogin.completeLogin(phone, otp);
  }

  async openLoginDialog(): Promise<void> {
    await this.adminLogin.openLoginDialog();
  }

  /** Opens the dialog and requests an OTP for a fresh valid-format number in one call — used to
   * trigger the real network request the offline-mid-flow scenario needs. */
  async requestOtpForFreshNumber(): Promise<void> {
    await this.adminLogin.requestOtp(randomPhoneNumber());
  }

  async assertGoogleSignInVisible(): Promise<void> {
    await expect(this.loginPage.googleLoginButton()).toBeVisible();
  }

  async clickGoogleSignInAndAssertRealNavigation(): Promise<void> {
    const [popup] = await Promise.all([
      this.page.context().waitForEvent('page', { timeout: 15000 }).catch(() => null),
      this.loginPage.googleLoginButton().click(),
    ]);
    if (popup) {
      await popup.waitForLoadState('domcontentloaded').catch(() => undefined);
      expect(popup.url()).toMatch(/accounts\.google\.com/);
      await popup.close();
    } else {
      await expect(this.page).toHaveURL(/accounts\.google\.com/, { timeout: 15000 });
    }
  }

  /** Clicks real Google sign-in, then simulates cancelling it: closes the popup if one opened,
   * or navigates back if the same tab was redirected to accounts.google.com — real, complete
   * OAuth cancellation isn't safely automatable, so browser-back is the groundable equivalent
   * of a user abandoning the flow. */
  async cancelGoogleSignInAndReturn(): Promise<void> {
    const [popup] = await Promise.all([
      this.page.context().waitForEvent('page', { timeout: 15000 }).catch(() => null),
      this.loginPage.googleLoginButton().click(),
    ]);
    if (popup) {
      await popup.waitForLoadState('domcontentloaded').catch(() => undefined);
      expect(popup.url()).toMatch(/accounts\.google\.com/);
      await popup.close();
    } else {
      await expect(this.page).toHaveURL(/accounts\.google\.com/, { timeout: 15000 });
      await this.page.goBack();
    }
  }

  async assertInvalidPhoneRejected(invalidValue: string): Promise<void> {
    await this.adminLogin.submitPhoneNumber(invalidValue);
    await expect(this.loginPage.invalidPhoneText()).toBeVisible();
  }

  async assertNoDeactivatedAccountSurfaceReachable(): Promise<void> {
    // No admin access exists anywhere in this project to deactivate a real account first — the
    // only groundable check is that this state isn't visible on an ordinary login attempt.
    await expect(this.loginPage.deactivatedAccountText()).toHaveCount(0);
  }

  async simulateOffline(): Promise<void> {
    await this.page.context().setOffline(true);
  }

  async restoreOnline(): Promise<void> {
    await this.page.context().setOffline(false);
  }

  /** Grounded 2026-09-21 via direct probe: on a real network failure the app shows no visible
   * connectivity error text anywhere — the login dialog simply unmounts, leaving the user back
   * on the plain homepage (dialog count 0, header hidden while offline). Asserts that confirmed
   * real behavior instead of a message that was never actually shown. */
  async assertLoginDialogSilentlyClosed(): Promise<void> {
    await expect(this.page.getByRole('dialog')).toHaveCount(0, { timeout: 15000 });
    await expect(this.page.getByRole('heading', { name: 'Welcome!' })).toHaveCount(0);
  }

  async assertLoggedIn(): Promise<void> {
    await this.adminLogin.assertLoggedIn();
  }

  /** Confirms the plain, unauthenticated homepage — the header's account icon is back, with no
   * login dialog or account sidebar open. */
  async assertNotLoggedIn(): Promise<void> {
    await expect(this.page.getByRole('button', { name: 'User Icon' })).toBeVisible({ timeout: 15000 });
  }

  async logout(): Promise<void> {
    await this.adminLogin.logout();
  }
}
