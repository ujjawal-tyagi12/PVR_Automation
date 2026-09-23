import { test } from '@fixtures/index';
import { DataGenerator } from '@utils/DataGenerator';

/**
 * Ticket: requirements/bulk-gift-card.md (TC_Web_328-354). Seeded 2026-09-16 from
 * `_PVR INOX __ Test Cases .xlsx` sheet `M8 | Website`. Real route (`/bulk-gift-cards`), page
 * headings, and every step-1 field's existence (name/email/phone/location/company/message,
 * one checkbox, a "Get OTP" button) are grounded live — see `BulkGiftCardPage.ts`'s doc
 * comment. The OTP-entry step onward (input shape, verify, success popup, real submit
 * endpoint) was NOT reached during grounding — those scenarios are `test.fixme` until a
 * follow-up pass grounds them.
 */
test.describe('Bulk Gift Card @Regression @RUN8', () => {
  test('BGC-001/002 — Bulk Gift Card option and navigation via More menu @P0 @Smoke', async ({ bulkGiftCardModule }) => {
    await test.step('Open homepage and the More menu', async () => {
      await bulkGiftCardModule.gotoViaMoreMenu();
    });
    await test.step('Click Bulk Gift Card and confirm navigation', async () => {
      await bulkGiftCardModule.clickBulkGiftCardMenuItem();
    });
  });

  test('BGC-003 — Page loads with real headings @P0 @Regression', async ({ bulkGiftCardModule }) => {
    await test.step('Open /bulk-gift-cards directly', async () => {
      await bulkGiftCardModule.gotoBulkGiftCard();
    });
    await test.step('Confirm the real page headings are displayed', async () => {
      await bulkGiftCardModule.expectPageLoaded();
    });
  });

  test('BGC-003b — Banner image displayed @P1 @Regression', async ({ bulkGiftCardModule }) => {
    await test.step('Open Bulk Gift Card page', async () => {
      await bulkGiftCardModule.gotoBulkGiftCard();
    });
    await test.step('Confirm a banner image is displayed', async () => {
      await bulkGiftCardModule.expectBannerVisible();
    });
  });

  test.fixme(
    'BGC-004 — Placeholder banner when not configured @P2 @Regression — BLOCKED: requires an Admin Panel data state this suite cannot toggle from the UI; not yet confirmed an unconfigured-banner example exists on this environment.',
    () => {},
  );

  // Grounded 2026-09-17 (twice, with a freshly-registered account whose name/email/phone are
  // genuinely set): BGC-005/006/007's premise doesn't hold — see
  // BulkGiftCardModule.expectContactFieldsEmpty's doc comment for the full finding (what looked
  // like prefill during manual testing traced to the browser's own autofill, not a real site
  // behavior). Asserts the real, confirmed behavior instead of the sheet's assumption.
  test('BGC-005/006/007 — Logged-in Name/Phone/Email are NOT prefilled @P1 @Regression', async ({ registerLoginModule, registrationModule, bulkGiftCardModule }) => {
    await test.step('Register a new user with a real name/email/phone on the account', async () => {
      await registerLoginModule.gotoLogin();
      await registrationModule.registerNewUser({
        phone: DataGenerator.randomIndianPhoneNumber(),
        firstName: 'PrefillCheck',
        lastName: 'User',
        email: DataGenerator.uniqueEmail('bgc.prefillcheck'),
      });
    });
    await test.step('Open Bulk Gift Card — Name/Email/Phone are empty, not prefilled', async () => {
      await bulkGiftCardModule.gotoBulkGiftCard();
      await bulkGiftCardModule.expectContactFieldsEmpty();
    });
  });

  test('BGC-008 — Location field exists and accepts input @P1 @Regression', async ({ bulkGiftCardModule }) => {
    await test.step('Open Bulk Gift Card page', async () => {
      await bulkGiftCardModule.gotoBulkGiftCard();
    });
    await test.step('Fill the field and confirm the value is accepted', async () => {
      await bulkGiftCardModule.fillLocation('Andheri West, Mumbai');
      await bulkGiftCardModule.expectLocationLength('Andheri West, Mumbai'.length);
    });
  });
  test('BGC-008b — Location 100-char max enforced @P1 @Regression', async ({ bulkGiftCardModule }) => {
    await test.step('Open Bulk Gift Card page', async () => {
      await bulkGiftCardModule.gotoBulkGiftCard();
    });
    await test.step('Confirm the real maxlength="100" attribute', async () => {
      await bulkGiftCardModule.expectLocationMaxLength('100');
    });
  });

  test('BGC-009 — Company Name field exists and accepts input @P1 @Regression', async ({ bulkGiftCardModule }) => {
    await test.step('Open Bulk Gift Card page', async () => {
      await bulkGiftCardModule.gotoBulkGiftCard();
    });
    await test.step('Fill the field and confirm the value is accepted', async () => {
      await bulkGiftCardModule.fillCompany('Appinventiv Technologies');
      await bulkGiftCardModule.expectCompanyLength('Appinventiv Technologies'.length);
    });
  });
  test('BGC-009b — Company Name 100-char max enforced @P1 @Regression', async ({ bulkGiftCardModule }) => {
    await test.step('Open Bulk Gift Card page', async () => {
      await bulkGiftCardModule.gotoBulkGiftCard();
    });
    await test.step('Confirm the real maxlength="100" attribute', async () => {
      await bulkGiftCardModule.expectCompanyMaxLength('100');
    });
  });

  test('BGC-010 — Message field exists and accepts input @P1 @Regression', async ({ bulkGiftCardModule }) => {
    await test.step('Open Bulk Gift Card page', async () => {
      await bulkGiftCardModule.gotoBulkGiftCard();
    });
    await test.step('Fill the field and confirm the value is accepted', async () => {
      await bulkGiftCardModule.fillMessage('Requesting 200 bulk gift cards for our year-end employee rewards program.');
      await bulkGiftCardModule.expectMessageLength('Requesting 200 bulk gift cards for our year-end employee rewards program.'.length);
    });
  });
  test('BGC-010b — Message 500-char max enforced @P1 @Regression', async ({ bulkGiftCardModule }) => {
    await test.step('Open Bulk Gift Card page', async () => {
      await bulkGiftCardModule.gotoBulkGiftCard();
    });
    await test.step('Confirm the real maxlength="500" attribute', async () => {
      await bulkGiftCardModule.expectMessageMaxLength('500');
    });
  });

  test('BGC-011 — Copy to Self checkbox toggles @P2 @Regression', async ({ bulkGiftCardModule }) => {
    await test.step('Open Bulk Gift Card page', async () => {
      await bulkGiftCardModule.gotoBulkGiftCard();
    });
    await test.step('Check the checkbox and confirm it is checked', async () => {
      await bulkGiftCardModule.checkCopyToSelf();
    });
  });

  test('BGC-012 — Get OTP CTA opens the real Verify Phone Number drawer @P0 @Regression', async ({ bulkGiftCardModule }) => {
    await test.step('Open Bulk Gift Card page and fill all mandatory fields', async () => {
      await bulkGiftCardModule.gotoBulkGiftCard();
      await bulkGiftCardModule.fillAllMandatoryFields();
    });
    await test.step('Click Get OTP and confirm the real OTP drawer opens', async () => {
      await bulkGiftCardModule.clickGetOtp();
      await bulkGiftCardModule.expectOtpDialogVisible();
    });
  });
  test.fixme(
    'BGC-013 — Valid OTP @P0 @Regression — BLOCKED: OTP send is a Next.js Server Action (POST to the page\'s own URL), not a REST endpoint `CorporateFormsMock` can intercept yet — completing real verification risks an actual backend submission. See BulkGiftCardPage.ts doc comment.',
    () => {},
  );
  test.fixme(
    'BGC-014 — Invalid OTP + retry @P0 @Regression — BLOCKED: same Server-Action-interception gap as BGC-013.',
    () => {},
  );
  test.fixme(
    'BGC-015 — Backend submission (assert payload) @P0 @Regression — BLOCKED: same gap as BGC-013; also no separate Verify/Submit button was found live — the form may auto-verify on the 6th OTP digit, unconfirmed.',
    () => {},
  );
  test.fixme(
    'BGC-016 — Recipient email (adapted, assert mocked recipient mapping) @P1 @Regression — BLOCKED: same gap as BGC-013.',
    () => {},
  );
  test.fixme(
    'BGC-017 — Copy to Self email (adapted) @P1 @Regression — BLOCKED: same gap as BGC-013.',
    () => {},
  );
  test.fixme(
    'BGC-018 — Success popup exact copy @P0 @Regression — BLOCKED: same gap as BGC-013.',
    () => {},
  );
  test('BGC-019 — Mandatory field validation @P0 @Regression', async ({ bulkGiftCardModule }) => {
    await test.step('Open Bulk Gift Card page and click Get OTP with everything blank', async () => {
      await bulkGiftCardModule.gotoBulkGiftCard();
      await bulkGiftCardModule.clickGetOtp();
    });
    await test.step('Confirm the real inline validation messages appear', async () => {
      await bulkGiftCardModule.expectNameValidationError();
      await bulkGiftCardModule.expectEmailValidationError();
      await bulkGiftCardModule.expectPhoneValidationError();
    });
  });
  test('BGC-020 — Invalid email @P1 @Regression', async ({ bulkGiftCardModule }) => {
    await test.step('Open Bulk Gift Card page, enter an invalid email, click Get OTP', async () => {
      await bulkGiftCardModule.gotoBulkGiftCard();
      await bulkGiftCardModule.fillEmail('not-an-email');
      await bulkGiftCardModule.clickGetOtp();
    });
    await test.step('Confirm the real email validation message appears', async () => {
      await bulkGiftCardModule.expectEmailValidationError();
    });
  });
  test('BGC-021 — Invalid phone number @P1 @Regression', async ({ bulkGiftCardModule }) => {
    await test.step('Open Bulk Gift Card page, enter an invalid phone number, click Get OTP', async () => {
      await bulkGiftCardModule.gotoBulkGiftCard();
      await bulkGiftCardModule.fillPhone('123');
      await bulkGiftCardModule.clickGetOtp();
    });
    await test.step('Confirm the real phone validation message appears', async () => {
      await bulkGiftCardModule.expectPhoneValidationError();
    });
  });
  test('BGC-022 — Location accepts valid input @P2 @Regression', async ({ bulkGiftCardModule }) => {
    await test.step('Open Bulk Gift Card page', async () => {
      await bulkGiftCardModule.gotoBulkGiftCard();
    });
    await test.step('Enter a valid location and confirm it is accepted exactly', async () => {
      await bulkGiftCardModule.fillLocation('Lower Parel, Mumbai');
      await bulkGiftCardModule.expectLocationValue('Lower Parel, Mumbai');
    });
  });

  test('BGC-023 — Company Name accepts valid input @P2 @Regression', async ({ bulkGiftCardModule }) => {
    await test.step('Open Bulk Gift Card page', async () => {
      await bulkGiftCardModule.gotoBulkGiftCard();
    });
    await test.step('Enter a valid company name and confirm it is accepted exactly', async () => {
      await bulkGiftCardModule.fillCompany('Appinventiv Technologies Pvt. Ltd.');
      await bulkGiftCardModule.expectCompanyValue('Appinventiv Technologies Pvt. Ltd.');
    });
  });

  test('BGC-024 — Message accepts special characters within limit @P2 @Regression', async ({ bulkGiftCardModule }) => {
    await test.step('Open Bulk Gift Card page', async () => {
      await bulkGiftCardModule.gotoBulkGiftCard();
    });
    await test.step('Enter a message with special characters and confirm it is accepted exactly', async () => {
      await bulkGiftCardModule.fillMessage('200 cards @ ₹500 each — please confirm ASAP! (ref #INV-2026/09)');
      await bulkGiftCardModule.expectMessageValue('200 cards @ ₹500 each — please confirm ASAP! (ref #INV-2026/09)');
    });
  });

  test.fixme(
    'BGC-025 — Submit without Copy to Self, assert no confirmation email @P2 @Regression — BLOCKED: same Server-Action-interception gap as BGC-013.',
    () => {},
  );
  test.fixme(
    'BGC-026 — Responsive UI, Web & M-site @P1 @Regression — deferred until the OTP-verification step is grounded first; a viewport pass on unconfirmed locators would just double the healing work.',
    () => {},
  );
  test.fixme(
    'BGC-027 — Internet failure during submission (route abort) @P1 @Regression — BLOCKED: same Server-Action-interception gap as BGC-013.',
    () => {},
  );
});
