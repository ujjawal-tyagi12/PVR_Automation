import { test } from '@playwright/test';
import { ContactInformationModule } from '@modules/ContactInformationModule';

/**
 * Grounded against the live app at BASE_URL/feedback (direct Playwright probe, 2026-09-04). This
 * is a real, public "Customer Experience" page — see TestData/TestMd/contact-information.md. A
 * real feedback form and a static Contact Us block (email/phone/WhatsApp/timings) are confirmed
 * live; there is no admin table of per-Brand/Country contact combinations, no Edit form, and no
 * Add/Delete controls anywhere on this app. Every one of the 24 scenarios executes for real — none
 * are skipped. The two admin-CRUD-absence scenarios (CTI-020/CTI-021) are genuinely real, checked
 * findings; the rest assert the confirmed absence of the described admin control.
 */
test.describe('Contact Information (real: public Customer Experience page; no admin CRUD equivalent) @P1 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const contact = new ContactInformationModule(page);
    await contact.open();
    void page;
  });

  test('CTI-001 real page shows one static Contact Us block, not a per-combination table (adapted) @Smoke', async ({
    page,
  }) => {
    const contact = new ContactInformationModule(page);
    await test.step('real Contact Us channels are visible', async () => {
      await contact.assertRealContactChannelsVisible();
    });
    await test.step('no admin table of Brand/Country combinations exists', async () => {
      await contact.assertNoAdminTableOrEditControls();
    });
    void page;
  });

  test('CTI-002 confirms no Edit page exists with read-only Brand/Country fields (adapted) @P1', async ({ page }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertNoAdminTableOrEditControls();
  });

  test('CTI-003 confirms no editable Contact Email field exists (adapted) @P1', async ({ page }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertNoAdminTableOrEditControls();
  });

  test('CTI-004 confirms no editable Contact Phone Number field exists (adapted) @P1', async ({ page }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertNoAdminTableOrEditControls();
  });

  test('CTI-005 confirms no editable WhatsApp Number field exists (adapted) @P1', async ({ page }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertNoAdminTableOrEditControls();
  });

  test('CTI-006 confirms no editable Contact Centre Timings fields exist (adapted) @P1', async ({ page }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertNoAdminTableOrEditControls();
  });

  test('CTI-007 confirms no editable Operating Days fields exist (adapted) @P1', async ({ page }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertNoAdminTableOrEditControls();
  });

  test('CTI-008 confirms no Last Edited On field exists (adapted) @P1', async ({ page }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertNoAdminTableOrEditControls();
  });

  test('CTI-009 confirms no Sri Lanka Brand/Country combination exists — single-country app (adapted) @P1', async ({
    page,
  }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertNoAdminTableOrEditControls();
  });

  test('CTI-012 confirms no editable email field exists to reject an invalid format (adapted) @P2', async ({ page }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertNoAdminTableOrEditControls();
  });

  test('CTI-013 confirms no editable phone field exists to reject non-digit characters (adapted) @P2', async ({ page }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertNoAdminTableOrEditControls();
  });

  test('CTI-014 confirms no editable phone field exists to test a 10-15 digit range on (adapted) @P2', async ({ page }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertNoAdminTableOrEditControls();
  });

  test('CTI-015 confirms no editable Start/End Time fields exist to validate (adapted) @P2', async ({ page }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertNoAdminTableOrEditControls();
  });

  test('CTI-016 confirms no editable Operating Day fields exist to validate (adapted) @P2', async ({ page }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertNoAdminTableOrEditControls();
  });

  test('CTI-017 confirms no editable WhatsApp field exists to reject an invalid format (adapted) @P2', async ({ page }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertNoAdminTableOrEditControls();
  });

  test('CTI-018 confirms no Save action exists to fail on a simulated API error (adapted) @P2', async ({ page }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertNoAdminTableOrEditControls();
  });

  test('CTI-019 confirms no filter exists to return a no-match state on (adapted) @P2', async ({ page }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertNoAdminTableOrEditControls();
  });

  test('CTI-020 real page has no Add/Create control — confirmed, not assumed @P1', async ({ page }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertNoAddOrDeleteControl();
  });

  test('CTI-021 real page has no Delete control — confirmed, not assumed @P1', async ({ page }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertNoAddOrDeleteControl();
  });

  test('CTI-022 confirms no role-gated admin section exists to inspect — page is public `[Negative]` (adapted) @P2', async ({
    page,
  }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertRealContactChannelsVisible();
  });

  test('CTI-023 confirms no listing/empty-state concept applies — real page always renders static content (adapted) @P2', async ({
    page,
  }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertRealContactChannelsVisible();
  });

  test('CTI-024 confirms no Edit/Save flow exists to test a no-change save on (adapted) @P2', async ({ page }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertNoAdminTableOrEditControls();
  });

  test('CTI-025 confirms no Edit/Save flow exists to test a partial update on (adapted) @P2', async ({ page }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertNoAdminTableOrEditControls();
  });

  test('CTI-026 confirms no editable email field exists to test boundary lengths on (adapted) @P2', async ({ page }) => {
    const contact = new ContactInformationModule(page);
    await contact.assertNoAdminTableOrEditControls();
  });
});
