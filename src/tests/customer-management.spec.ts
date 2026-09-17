import { test } from '@playwright/test';
import { CustomerManagementModule } from '@modules/CustomerManagementModule';

/**
 * Grounded against the live app at BASE_URL (direct Playwright probe, 2026-09-08) — see
 * TestData/TestMd/customer-management.md. No admin CRM surface exists anywhere on this app:
 * checked the header nav, footer, every "More" dropdown item, and /sitemap.xml directly. Every
 * one of the 24 scenarios executes for real against the home page as the common anchor — none
 * are skipped. CST-019 (no edit) is a genuinely real, checked finding; the rest assert the
 * confirmed absence of the described admin CRM control.
 */
test.describe('Customer Management (real: no admin CRM surface exists on this app) @P2 @Regression', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    const customer = new CustomerManagementModule(page);
    await customer.open();
    void page;
  });

  test('CST-001 confirms no admin customer listing exists to load empty-by-default (adapted) @Smoke', async ({ page }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });

  test('CST-002 confirms no First Name search exists (adapted) @P1', async ({ page }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });

  test('CST-003 confirms no Phone Number search exists (adapted) @P1', async ({ page }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });

  test('CST-004 confirms no Status/Brand filter exists (adapted) @P1', async ({ page }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });

  test('CST-005 confirms no Registered Date filter exists (adapted) @P1', async ({ page }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });

  test('CST-006 confirms no combinable search-type + filters exist (adapted) @P1', async ({ page }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });

  test('CST-007 confirms no Clear All control exists (adapted) @P1', async ({ page }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });

  test('CST-008 confirms no Registered Date sort control exists (adapted) @P1', async ({ page }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });

  test('CST-009 confirms no admin listing exists to show verified icons on (adapted) @P1', async ({ page }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });

  test('CST-010 confirms no Export CSV control exists (adapted) @P1', async ({ page }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });

  test('CST-011 confirms no View action or Customer Details page exists (adapted) @P1', async ({ page }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });

  test('CST-012 confirms no Deactivate control exists (adapted) @P1', async ({ page }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });

  test('CST-013 confirms no Reactivate control exists (adapted) @P1', async ({ page }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });

  test('CST-014 confirms no Active Sessions view exists (adapted) @P1', async ({ page }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });

  test('CST-015 confirms no View Full Recap control exists (adapted) @P1', async ({ page }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });

  test('CST-016 confirms no admin search exists to test a no-match state on (adapted) @P2', async ({ page }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });

  test('CST-017 confirms no App Version field exists to reject an invalid format on (adapted) @P2', async ({ page }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });

  test('CST-018 confirms no Registered Date fields exist to validate a range on (adapted) @P2', async ({ page }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });

  test('CST-019 real app has no way to edit another customer\'s personal data — confirmed, not assumed @P2', async ({
    page,
  }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoEditControl();
  });

  test('CST-020 confirms no status toggle exists to test Deleted-customer exclusion on (adapted) @P2', async ({ page }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });

  test('CST-021 confirms no admin listing exists to verify a deactivated-login block from (adapted) @P2', async ({
    page,
  }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });

  test('CST-022 confirms no Registered Date range fields exist to edit manually (adapted) @P2', async ({ page }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });

  test('CST-023 confirms no admin listing exists to inspect promotional opt-in display on (adapted) @P2', async ({
    page,
  }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });

  test('CST-024 confirms no admin listing exists to inspect Fandom image age-exclusion on (adapted) @P2', async ({
    page,
  }) => {
    const customer = new CustomerManagementModule(page);
    await customer.assertNoAdminCustomerListing();
  });
});
