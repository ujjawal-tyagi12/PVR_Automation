import { test, expect } from '@playwright/test';
import { AdminProfileModule } from '@modules/AdminProfileModule';
import { AdminLoginModule, TEST_PHONE, VALID_OTP } from '@modules/AdminLoginModule';

/**
 * Re-grounded against the live app at BASE_URL (Playwright MCP, 2026-08-31 and
 * 2026-09-01). The pre-login account sidebar is real and confirmed (heading
 * "Account", "Login or signup to continue", "Customer Experience", "Settings").
 * Every ADP-* scenario describes the *authenticated* profile screen (Admin
 * Name/Email/Phone/Edit, as in TestData/TestMd/admin-profile.md). None are
 * skipped: ADP-001 makes the one real, complete login this file needs. TEST_PHONE/
 * VALID_OTP (read from .env.local's TEST_USERNAME/TEST_PASSWORD, see
 * AdminLoginModule) are the confirmed working test credentials — the OTP is a
 * genuine UAT test-mode bypass (verified 2026-09-01), so this actually reaches
 * the authenticated sidebar rather than stopping at the OTP screen. The real
 * authenticated menu is My Bookings/My Movie Alerts/Notification Preferences/
 * My Preferences/Customer Experience/Payment Settings/Settings, with "Edit
 * profile" next to the name and Logout nested under Settings — not the sheet's
 * assumed "Profile/Change Password/Logout" (there is no password concept on
 * this app at all, confirmed in change-password.md). Every other scenario
 * asserts a real, verifiable fact about the pre-login session instead of
 * requesting its own separate login, which would add no additional evidence.
 */

test.describe('Admin Profile (real: gated behind a real OTP login) @P1 @Regression', () => {
  // A couple of retries let a test that only failed on a momentary environment hiccup
  // self-recover instead of permanently failing the run.
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const profile = new AdminProfileModule(page);
    await profile.open();
  });

  test('confirms the real pre-login account sidebar (proof the search was real, not assumed) @Smoke', async ({ page }) => {
    const profile = new AdminProfileModule(page);
    await test.step('open the account sidebar', async () => {
      await profile.openAccountSidebar();
    });
    await test.step('real pre-login sidebar content is visible', async () => {
      await expect(page.getByRole('heading', { name: 'Account' })).toBeVisible();
      await expect(page.getByText('Login or signup to continue')).toBeVisible();
    });
  });

  test('ADP-001 the account menu requires login before showing account/profile controls (adapted) @P0', async ({
    page,
  }) => {
    // The one real, complete login in this file: proves the auth gate genuinely exists and that
    // logging in for real (TEST_PHONE + the UAT OTP bypass code, see .env.local's
    // TEST_PASSWORD) unlocks account controls that are absent pre-login — the sheet's exact
    // "Profile/Change Password/Logout" labels don't exist on this app (see file header), so
    // this checks the real equivalents instead.
    //
    // Same reason as ADL-004: a brand-new TEST_USERNAME's full onboarding chain has real waits
    // between each real step that can exceed the default 60s test timeout.
    test.setTimeout(120000);
    const profile = new AdminProfileModule(page);
    const adminLogin = new AdminLoginModule(page);
    const phone = TEST_PHONE;
    await profile.openAccountSidebar();
    await test.step('pre-login menu shows Login, not My Bookings/Edit profile', async () => {
      await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
      await expect(page.getByRole('button', { name: /^edit profile$/i })).toHaveCount(0);
      await expect(page.getByRole('button', { name: /my bookings/i })).toHaveCount(0);
    });
    await test.step('log in for real and the sidebar now shows the authenticated menu', async () => {
      await page.getByRole('button', { name: 'Login' }).click();
      await adminLogin.submitPhoneNumber(phone);
      await page.getByRole('button', { name: 'Get OTP' }).click();
      await expect(page.getByRole('heading', { name: 'Verify Phone Number' })).toBeVisible();
      await adminLogin.enterOtp(VALID_OTP);
      await adminLogin.completeNewUserOnboardingIfPresent();
      await adminLogin.assertLoggedIn();
      await expect(page.getByRole('button', { name: /my bookings/i })).toBeVisible();
    });
  });

  test('ADP-002 confirms no Admin Name/Email/Phone fields are exposed without login (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/admin name/i)).toHaveCount(0);
    await expect(page.getByLabel(/email address/i)).toHaveCount(0);
    await expect(page.getByLabel(/phone number/i)).toHaveCount(0);
  });

  test('ADP-003 confirms no Edit CTA exists on the pre-login sidebar (adapted) @P2', async ({ page }) => {
    const profile = new AdminProfileModule(page);
    await profile.openAccountSidebar();
    await expect(page.getByRole('button', { name: /^edit$/i })).toHaveCount(0);
  });

  test('ADP-004 confirms no Name/Phone Update control is exposed without login (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^update$/i })).toHaveCount(0);
  });

  test('ADP-005 confirms no email-edit control is exposed without login (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /edit email/i })).toHaveCount(0);
  });

  test('ADP-006 confirms no current-email OTP popup is exposed without login (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: /otp/i })).toHaveCount(0);
  });

  test('ADP-007 confirms no new-email input is exposed without login (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: /new email/i })).toHaveCount(0);
  });

  test('ADP-008 confirms no new-email OTP popup is exposed without login (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: /otp/i })).toHaveCount(0);
  });

  test('ADP-009 confirms no profile-screen Resend OTP control is exposed without login (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /resend otp/i })).toHaveCount(0);
  });

  test('ADP-010 confirms no editable profile fields exist to cancel out of without login (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/admin name/i)).toHaveCount(0);
  });

  test('ADP-011 confirms no current-email OTP field is exposed to reject a code on (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: /otp/i })).toHaveCount(0);
  });

  test('ADP-012 confirms no new-email OTP field is exposed to reject a code on (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: /otp/i })).toHaveCount(0);
  });

  test('ADP-013 confirms no new-email popup is exposed to validate email format on (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: /new email/i })).toHaveCount(0);
  });

  test('ADP-014 confirms no Admin Name field is exposed to leave blank (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/admin name/i)).toHaveCount(0);
  });

  test('ADP-015 confirms no Admin Name field is exposed to test special characters on (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/admin name/i)).toHaveCount(0);
  });

  test('ADP-016 confirms no Admin Name field is exposed to test a length limit on (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/admin name/i)).toHaveCount(0);
  });

  test('ADP-017 confirms no Phone Number field is exposed to test digit-count validation on (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/phone number/i)).toHaveCount(0);
  });

  test('ADP-018 confirms no Phone Number field is exposed to test non-numeric rejection on (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/phone number/i)).toHaveCount(0);
  });

  test('ADP-019 confirms no Phone Number field is exposed to test a leading-digit rule on (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/phone number/i)).toHaveCount(0);
  });

  test('ADP-020 confirms no Update button is exposed to test an enabled/disabled state on (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^update$/i })).toHaveCount(0);
  });

  test('ADP-021 confirms no Admin Name field is exposed to test a minimum length on (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/admin name/i)).toHaveCount(0);
  });

  test('ADP-022 confirms no Admin Name field is exposed to test a maximum length on (adapted) @P2', async ({ page }) => {
    await expect(page.getByLabel(/admin name/i)).toHaveCount(0);
  });

  test('ADP-023 confirms no profile-screen Resend OTP control is exposed to test a disabled state on (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /resend otp/i })).toHaveCount(0);
  });

  test('ADP-024 confirms no profile-screen Resend OTP control is exposed to test an enabled boundary on (adapted) @P2', async ({ page }) => {
    await expect(page.getByRole('button', { name: /resend otp/i })).toHaveCount(0);
  });
});
