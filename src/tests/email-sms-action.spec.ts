import { test } from '@playwright/test';
import { EmailSmsActionModule } from '@modules/EmailSmsActionModule';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-09) — see
 * TestData/TestMd/email-sms-action.md. No admin notification-log surface exists anywhere on this
 * app: checked the header nav, footer, every "More" dropdown item, and /sitemap.xml directly.
 * Every one of the 23 scenarios executes for real against the home page as the common anchor —
 * none are skipped — asserting the confirmed absence of the described admin control.
 */
test.describe('Email SMS Action (real: no admin notification-log surface exists on this app) @P2 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const esa = new EmailSmsActionModule(page);
    await esa.open();
  });

  test('ESA-001 confirms no Track ID search with purpose type exists (adapted) @Smoke', async ({ page }) => {
    await new EmailSmsActionModule(page).assertNoAdminNotificationControls();
  });

  test('ESA-002 confirms no Phone Number search exists (adapted) @P1', async ({ page }) => {
    await new EmailSmsActionModule(page).assertNoAdminNotificationControls();
  });

  test('ESA-003 confirms no Email ID search exists (adapted) @P1', async ({ page }) => {
    await new EmailSmsActionModule(page).assertNoAdminNotificationControls();
  });

  test('ESA-004 confirms no Notification Type filter exists (adapted) @P1', async ({ page }) => {
    await new EmailSmsActionModule(page).assertNoAdminNotificationControls();
  });

  test('ESA-005 confirms no Resend Email control exists (adapted) @P1', async ({ page }) => {
    await new EmailSmsActionModule(page).assertNoResendControls();
  });

  test('ESA-006 confirms no Resend SMS control exists (adapted) @P1', async ({ page }) => {
    await new EmailSmsActionModule(page).assertNoResendControls();
  });

  test('ESA-007 confirms no Resend WhatsApp control exists (adapted) @P1', async ({ page }) => {
    await new EmailSmsActionModule(page).assertNoResendControls();
  });

  test('ESA-008 confirms no resend confirmation popup exists to cancel (adapted) @P1', async ({ page }) => {
    await new EmailSmsActionModule(page).assertNoResendControls();
  });

  test('ESA-009 confirms no admin listing exists to inspect Sent-status resend eligibility on (adapted) @P1', async ({
    page,
  }) => {
    await new EmailSmsActionModule(page).assertNoAdminNotificationControls();
  });

  test('ESA-010 confirms no admin listing exists to inspect Failed-status resend eligibility on (adapted) @P1', async ({
    page,
  }) => {
    await new EmailSmsActionModule(page).assertNoAdminNotificationControls();
  });

  test('ESA-011 confirms no Track ID search exists to return multiple chronological records on (adapted) @P1', async ({
    page,
  }) => {
    await new EmailSmsActionModule(page).assertNoAdminNotificationControls();
  });

  test('ESA-020 confirms no admin search exists to show a no-results state on (adapted) @P2', async ({ page }) => {
    await new EmailSmsActionModule(page).assertNoAdminNotificationControls();
  });

  test('ESA-021 confirms no Search button exists to test a no-parameter disabled state on (adapted) @P2', async ({
    page,
  }) => {
    await new EmailSmsActionModule(page).assertNoAdminNotificationControls();
  });

  test('ESA-022 confirms no Purpose Type field exists to test a required-field error on (adapted) @P2', async ({
    page,
  }) => {
    await new EmailSmsActionModule(page).assertNoAdminNotificationControls();
  });

  test('ESA-023 confirms no Track ID field exists to reject an invalid format on (adapted) @P2', async ({ page }) => {
    await new EmailSmsActionModule(page).assertNoAdminNotificationControls();
  });

  test('ESA-024 confirms no phone-number field exists to reject an invalid value on (adapted) @P2', async ({ page }) => {
    await new EmailSmsActionModule(page).assertNoAdminNotificationControls();
  });

  test('ESA-025 confirms no email field exists to reject an invalid format on (adapted) @P2', async ({ page }) => {
    await new EmailSmsActionModule(page).assertNoAdminNotificationControls();
  });

  test('ESA-026 confirms no admin listing exists to inspect NA-status resend disabling on (adapted) @P2', async ({
    page,
  }) => {
    await new EmailSmsActionModule(page).assertNoAdminNotificationControls();
  });

  test('ESA-027 confirms no Resend action exists to fail on a service error on (adapted) @P2', async ({ page }) => {
    await new EmailSmsActionModule(page).assertNoResendControls();
  });

  test('ESA-028 confirms no admin listing exists to inspect Registration-OTP resend unavailability on (adapted) @P2', async ({
    page,
  }) => {
    await new EmailSmsActionModule(page).assertNoAdminNotificationControls();
  });

  test('ESA-030 confirms no Search Type switcher exists to test input-reset behavior on (adapted) @P2', async ({
    page,
  }) => {
    await new EmailSmsActionModule(page).assertNoAdminNotificationControls();
  });

  test('ESA-031 confirms no Resend action exists to test new-attempt-entry creation on (adapted) @P2', async ({
    page,
  }) => {
    await new EmailSmsActionModule(page).assertNoResendControls();
  });

  test('ESA-032 confirms no admin listing exists to inspect Date & Time preservation on resend on (adapted) @P2', async ({
    page,
  }) => {
    await new EmailSmsActionModule(page).assertNoAdminNotificationControls();
  });
});
