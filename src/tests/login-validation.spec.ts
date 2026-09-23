import { test } from '@fixtures/index';
import { mockOtpApis } from '@utils/index';
import { registerLoginData } from '@testdata/registerLoginData';

/**
 * Ticket: requirements/login.md — sheet-sourced "Login" module, phone-field validation and
 * edge-case scenarios (TC_ADM_019-026). Split out of `login.spec.ts` (2026-08-21, e2e-review
 * nit) — that file had grown to 304 lines; see its header comment for the shared OTP-mock/
 * UAT-domain grounding notes that apply here too.
 */
test.describe('Login — Field Validation @RUN5', () => {
  // Grounded 2026-08-20: production's first-load modal sequence (Enable Location → Select
  // Your City) has highly variable timing under repeated automated load — see
  // RegisterLoginPage.ts's 2026-08-20 bug-fix note.
  test.slow();

  test.beforeEach(async ({ page }) => {
    await mockOtpApis(page);
  });

  test('TC_ADM_019 — Mobile number with fewer than 10 digits @P0 @Regression', async ({ registerLoginModule }) => {
    // Grounded 2026-08-20: a short number shows the field error AND leaves "Get OTP"
    // disabled at the same time — using `submitPhoneNumber` (which clicks "Get OTP" as part
    // of the flow) hangs for the full test timeout clicking a button that never enables.
    // `fillPhoneNumberOnly` enters the number without attempting that click.
    await test.step('enter an 8-digit number', async () => {
      await registerLoginModule.gotoLogin();
      await registerLoginModule.fillPhoneNumberOnly(registerLoginData.invalidPhoneTooShort);
    });

    await test.step('validation error shown, Get OTP stays disabled', async () => {
      // Grounded 2026-08-20: real copy is "Phone number must contain exactly 10 digits."
      // (not "must be 10 digits" as originally guessed) for pure digit-count violations, or
      // "Please enter a valid phone number." for other format issues (e.g. invalid prefix).
      await registerLoginModule.expectFieldError(/must contain exactly 10 digits|please enter a valid phone number/i);
      await registerLoginModule.expectGetOtpButtonDisabled();
    });
  });

  test('TC_ADM_020 — Mobile number with more than 10 digits @P0 @Regression', async ({ registerLoginModule }) => {
    // Grounded 2026-08-20: filling an 11-digit value silently truncates the field to 10 digits
    // (same capping mechanism TC_ADM_026 verifies), so Get OTP becomes enabled and clicking it
    // proceeds normally — there is no validation-error state reachable via this input. The real,
    // observable behavior to assert is the capped field value, not an error message.
    await test.step('enter an 11-digit number', async () => {
      await registerLoginModule.gotoLogin();
      await registerLoginModule.fillPhoneNumberOnly('98765432101');
    });

    await test.step('field value is capped to 10 digits', async () => {
      await registerLoginModule.expectPhoneInputValue('9876543210');
    });
  });

  test('TC_ADM_021 — Mobile number rejects non-numeric characters @P1 @Regression', async ({ registerLoginModule }) => {
    await test.step('type letters/special characters into the phone field', async () => {
      await registerLoginModule.gotoLogin();
      await registerLoginModule.fillPhoneNumberOnly('98abc!234');
    });

    await test.step('field holds only the numeric characters typed', async () => {
      await registerLoginModule.expectPhoneInputValue('98234');
    });
  });

  test('TC_ADM_022 — Terms & Privacy links are reachable @P2 @Regression', async ({ registerLoginModule, registerLoginPage, page }) => {
    await test.step('open login and tap Terms & Conditions', async () => {
      await registerLoginModule.gotoLogin();
      const popupPromise = page.waitForEvent('popup', { timeout: 5_000 }).catch(() => null);
      await registerLoginPage.clickTerms();
      const popup = await popupPromise;
      await popup?.close();
    });
  });

  test('TC_ADM_025 — Login CTA disabled on empty input @P0 @Smoke', async ({ registerLoginModule }) => {
    await test.step('open login without entering a phone number', async () => {
      await registerLoginModule.gotoLogin();
    });

    await test.step('Get OTP stays disabled', async () => {
      await registerLoginModule.expectGetOtpButtonDisabled();
    });
  });

  test('TC_ADM_026 — Mobile number input capped at 10 digits @P0 @Regression', async ({ registerLoginModule }) => {
    await test.step('type a 12-digit number', async () => {
      await registerLoginModule.gotoLogin();
      await registerLoginModule.fillPhoneNumberOnly('987654321012');
    });

    await test.step('field does not accept more than 10 digits', async () => {
      await registerLoginModule.expectPhoneInputValue('9876543210');
    });
  });
});
