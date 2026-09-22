import { test } from '@playwright/test';
import { ProfileEditModule } from '@modules/ProfileEditModule';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-21/22) — see
 * TestData/TestMd/complete-profile-edit-profile.md.
 *
 * @hritik
 */
test.describe('Complete Your Profile / Edit Profile (real: registration form + Edit Your Details) @P0 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const profile = new ProfileEditModule(page);
    await profile.open();
    void page;
  });

  test('APP-034 real mandatory-field registration completes and proceeds @Smoke', async ({ page }) => {
    const profile = new ProfileEditModule(page);
    await profile.registerNewUserToRegistrationScreen();
    await profile.completeRegistrationAndAssertProceeds();
    void page;
  });

  test('APP-035 real mandatory-field validation blocks Submit while blank @Smoke', async ({ page }) => {
    const profile = new ProfileEditModule(page);
    await profile.registerNewUserToRegistrationScreen();
    await profile.assertSubmitDisabledWhenFieldsBlank();
    void page;
  });

  test('APP-036 real email Verify button opens the real Verify Email OTP dialog @P1', async ({ page }) => {
    test.setTimeout(120000);
    const profile = new ProfileEditModule(page);
    await profile.openEditProfileForExistingUser();
    await profile.assertEmailVerifyTriggersRealAction();
    void page;
  });

  test('APP-037 real invalid-email-format validation on registration @Smoke', async ({ page }) => {
    const profile = new ProfileEditModule(page);
    await profile.registerNewUserToRegistrationScreen();
    await profile.assertInvalidEmailRejectedOnRegistration();
    void page;
  });

  test('APP-038 real Edit Profile update persists across reload @P0', async ({ page }) => {
    test.setTimeout(120000);
    const profile = new ProfileEditModule(page);
    await profile.openEditProfileForExistingUser();
    await profile.updateFirstNameAndAssertPersisted();
    void page;
  });

  test('APP-039 real email change still requires verification afterward @P1', async ({ page }) => {
    test.setTimeout(120000);
    const profile = new ProfileEditModule(page);
    await profile.openEditProfileForExistingUser();
    await profile.assertEmailChangeStillRequiresVerification();
    void page;
  });

  test('APP-041 real avatar picker applies a newly selected avatar @P2', async ({ page }) => {
    test.setTimeout(120000);
    const profile = new ProfileEditModule(page);
    await profile.openEditProfileForExistingUser();
    await profile.updateAvatarAndAssertApplied();
    void page;
  });
});
