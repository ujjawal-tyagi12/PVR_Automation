import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-21). The OTP
 * field auto-submits on fill (no separate Verify button) — confirmed live, matching
 * AdminLoginModule.enterOtp()'s existing behavior. A wrong OTP shows a real inline error; the
 * app never showed a distinct "OTP expired" message in any probe, only this same generic one.
 *
 * @hritik
 */
export class OtpVerificationPage {
  constructor(private page: Page) {}

  invalidOtpText = () => this.page.getByText('You have entered an invalid OTP.');
  expiredOtpText = () => this.page.getByText(/otp expired/i);
  otpAlreadySentText = () => this.page.getByText(/OTP already sent\. Try again after/i);
  otpInput = () => this.page.getByRole('dialog').getByRole('textbox');
  getOtpButton = () => this.page.getByRole('button', { name: 'Get OTP' });
  editPhoneNumberLink = () => this.page.getByText(/^\+91 \d{10}$/);

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
