import { Page, expect } from '@playwright/test';
import { ProfileEditPage } from '@pages/ProfileEditPage';
import { AdminLoginModule, TEST_PHONE, VALID_OTP, randomPhoneNumber } from '@modules/AdminLoginModule';
import { Logger } from '@utils/Logger';

/**
 * Orchestrates the real registration form and the standalone "Edit Your Details" page for the
 * Complete Your Profile / Edit Profile sheet module. Composes AdminLoginModule read-only (no
 * changes to it) for the shared login/OTP mechanics already proven live there.
 *
 * @hritik
 */
export class ProfileEditModule {
  private profilePage: ProfileEditPage;
  private adminLogin: AdminLoginModule;

  constructor(private page: Page) {
    this.profilePage = new ProfileEditPage(page);
    this.adminLogin = new AdminLoginModule(page);
  }

  async open(): Promise<void> {
    Logger.info('Opening the home page');
    await this.adminLogin.open();
  }

  async registerNewUserToRegistrationScreen(): Promise<void> {
    await this.adminLogin.loginWithPhone(randomPhoneNumber(), VALID_OTP);
    await expect(this.profilePage.registrationHeading()).toBeVisible({ timeout: 20000 });
  }

  async assertSubmitDisabledWhenFieldsBlank(): Promise<void> {
    await expect(this.profilePage.regSubmitButton()).toBeDisabled();
  }

  async assertInvalidEmailRejectedOnRegistration(): Promise<void> {
    await this.profilePage.regFirstNameInput().pressSequentially('Test', { delay: 15 });
    await this.profilePage.regEmailInput().pressSequentially('not-an-email', { delay: 15 });
    await this.profilePage.regEmailInput().press('Tab');
    await expect(this.profilePage.invalidEmailText()).toBeVisible({ timeout: 8000 });
    await expect(this.profilePage.regSubmitButton()).toBeDisabled();
  }

  async completeRegistrationAndAssertProceeds(): Promise<void> {
    await this.profilePage.regFirstNameInput().pressSequentially('Test', { delay: 15 });
    await this.profilePage.regEmailInput().pressSequentially(`qa.${Date.now()}@example.com`, { delay: 15 });
    await this.profilePage.regEmailInput().press('Tab');
    await expect(this.profilePage.regSubmitButton()).toBeEnabled({ timeout: 10000 });
    await this.profilePage.regSubmitButton().click();
    await expect(this.profilePage.registrationHeading()).toHaveCount(0, { timeout: 15000 });
  }

  async openEditProfileForExistingUser(): Promise<void> {
    await this.adminLogin.openLoginDialog();
    await this.adminLogin.completeLogin(TEST_PHONE, VALID_OTP);
    // completeLogin() lands back on the plain homepage — the account sidebar (where "Edit
    // profile" lives) needs opening first, same as AdminLoginModule.assertLoggedIn() does.
    await this.profilePage.accountMenuButton().click();
    await this.profilePage.editProfileMenuItem().click();
    await expect(this.profilePage.editDetailsHeading()).toBeVisible({ timeout: 15000 });
  }

  async updateFirstNameAndAssertPersisted(): Promise<void> {
    // Grounded 2026-09-22: the First Name field silently strips non-letter characters (a
    // digit-suffixed name like "Tester123456" landed as just "Tester" every time — confirmed
    // via a real failed run's screenshot), so the value never actually changed and Update
    // stayed disabled. A letters-only random suffix is required for a genuinely new value.
    const newName = `Tester${randomLetters(6)}`;
    // Grounded 2026-09-22: a fast-follow fill('') + pressSequentially() can race the field's
    // own re-render, leaving a mixed-up value (e.g. "TesterTesterterterkowuvd") instead of
    // cleanly replacing it — the same class of race already documented for the OTP field
    // elsewhere in this codebase. Retrying the whole fill+type step, not just re-checking,
    // clears it.
    const input = this.profilePage.firstNameInput();
    await expect(async () => {
      await input.fill('');
      await input.pressSequentially(newName, { delay: 15 });
      await expect(input).toHaveValue(newName, { timeout: 2000 });
    }).toPass({ timeout: 15000 });
    await expect(this.profilePage.updateButton()).toBeEnabled({ timeout: 10000 });
    await this.profilePage.updateButton().click();
    await expect(this.profilePage.updateButton()).toBeDisabled({ timeout: 15000 });
    await this.page.reload();
    await expect(this.profilePage.editDetailsHeading()).toBeVisible({ timeout: 15000 });
    await expect(this.profilePage.firstNameInput()).toHaveValue(newName);
  }

  async assertEmailVerifyTriggersRealAction(): Promise<void> {
    await this.profilePage.emailVerifyButton().click();
    // Grounded 2026-09-22: this opens a real, dedicated "Verify Email" OTP dialog. Completing
    // it for real isn't automatable without access to that inbox — confirming the dialog itself
    // is the groundable equivalent.
    await expect(this.profilePage.verifyEmailDialogHeading()).toBeVisible({ timeout: 10000 });
  }

  async assertEmailChangeStillRequiresVerification(): Promise<void> {
    const newEmail = `qa.${Date.now()}@example.com`;
    await this.profilePage.emailInput().click();
    await this.profilePage.emailInput().press('Control+A');
    await this.profilePage.emailInput().pressSequentially(newEmail, { delay: 15 });
    await expect(this.profilePage.updateButton()).toBeEnabled({ timeout: 10000 });
    await this.profilePage.updateButton().click();
    await expect(this.profilePage.updateButton()).toBeDisabled({ timeout: 15000 });
    // The email field itself changing doesn't bypass the verification gate — the real "Verify"
    // control for the email is still present afterward, confirming it isn't silently trusted.
    await expect(this.profilePage.emailVerifyButton()).toBeVisible({ timeout: 10000 });
  }

  async updateAvatarAndAssertApplied(): Promise<void> {
    await this.profilePage.editAvatarButton().click();
    await expect(this.profilePage.selectAvatarHeading()).toBeVisible({ timeout: 10000 });
    const options = this.profilePage.avatarOptionButtons();
    const count = await options.count();
    for (let i = 0; i < count; i += 1) {
      const pressed = await options.nth(i).getAttribute('aria-pressed');
      if (pressed !== 'true') {
        await options.nth(i).click();
        break;
      }
    }
    await expect(this.profilePage.avatarUpdateButton()).toBeEnabled({ timeout: 10000 });
    await this.profilePage.avatarUpdateButton().click();
    await expect(this.profilePage.selectAvatarHeading()).toHaveCount(0, { timeout: 15000 });
  }
}

function randomLetters(length: number): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return result;
}
