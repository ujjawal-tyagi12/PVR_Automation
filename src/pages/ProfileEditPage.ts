import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-21/22). Covers
 * two real, distinct surfaces: the post-OTP registration form (a dialog: First Name*, Last
 * Name, Email*, Submit), and the standalone "Edit Your Details" page reached via
 * account-sidebar → Edit profile (a real route, /dashboard?tab=profile — not a dialog). Both
 * forms only enable their submit button once a real keystroke (pressSequentially, not fill())
 * registers as a change — confirmed live via a real failure with fill() alone.
 *
 * @hritik
 */
export class ProfileEditPage {
  constructor(private page: Page) {}

  // Registration form (dialog)
  registrationHeading = () => this.page.getByRole('heading', { name: "Let's get to know you better!" });
  regFirstNameInput = () => this.page.getByRole('textbox', { name: /enter your first name/i });
  regEmailInput = () => this.page.getByRole('textbox', { name: /enter your email/i });
  regSubmitButton = () => this.page.getByRole('button', { name: 'Submit' });
  invalidEmailText = () => this.page.getByText(/please enter a valid email/i);

  // Edit Your Details page
  accountMenuButton = () => this.page.getByRole('button', { name: 'User Icon' });
  editProfileMenuItem = () => this.page.getByRole('button', { name: 'Edit profile' });
  editDetailsHeading = () => this.page.getByRole('heading', { name: 'Edit Your Details' });
  firstNameInput = () => this.page.getByRole('textbox', { name: /enter your first name/i });
  emailInput = () => this.page.getByRole('textbox', { name: /enter your email/i });
  // Grounded: 3 "Verify" buttons exist (Google Wallet promo, then the email field's) — the
  // email one is the 2nd (index 1); the phone field's own verify-state uses a distinct
  // "Verify Check" accessible name, not "Verify".
  emailVerifyButton = () => this.page.getByRole('button', { name: 'Verify', exact: true }).nth(1);
  updateButton = () => this.page.getByRole('button', { name: 'Update' });
  editAvatarButton = () => this.page.getByRole('button', { name: 'Edit Avatar' });
  // Grounded 2026-09-22: clicking the email Verify button opens a real, dedicated "Verify
  // Email" OTP dialog (its own 6-digit code flow, distinct from the phone OTP dialog).
  verifyEmailDialogHeading = () => this.page.getByRole('heading', { name: 'Verify Email', exact: true });

  // Avatar picker (dialog)
  selectAvatarHeading = () => this.page.getByRole('heading', { name: 'Select Your Avatar' });
  avatarOptionButtons = () => this.page.getByRole('dialog').getByRole('button', { name: 'Select avatar' });
  avatarUpdateButton = () => this.page.getByRole('dialog').getByRole('button', { name: 'Update' });

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
