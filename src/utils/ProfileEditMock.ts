import type { Page } from '@playwright/test';

/**
 * Endpoint patterns/payload shapes are a best-effort guess from the sheet's own copy — no live
 * network capture was done for this screen (same gap as ProfileMock.ts). TODO(heal): tighten
 * against real endpoints once the login precondition (see OtpMock.ts) is grounded.
 */

export type ProfileSaveOutcome = 'success' | 'validation-error' | 'server-error';
export type EmailOtpOutcome = 'success' | 'invalid' | 'expired';

export const PROFILE_EDIT_SAVE_PATTERN = /\/api\/.*profile\/edit/i;
export const EMAIL_OTP_SEND_PATTERN = /\/api\/.*email.*send-otp/i;
export const EMAIL_OTP_VERIFY_PATTERN = /\/api\/.*email.*verify-otp/i;

const SAVE_FAILURE_RESPONSES: Record<Exclude<ProfileSaveOutcome, 'success'>, { status: number; body: Record<string, unknown> }> = {
  'validation-error': {
    status: 400,
    body: { ok: false, data: { statusCode: 400, errorCode: 'VALIDATION_ERROR', message: 'Please correct the highlighted fields.' } },
  },
  'server-error': {
    status: 500,
    body: { ok: false, data: { statusCode: 500, errorCode: 'SERVER_ERROR', message: 'Unable to update profile. Please try again.' } },
  },
};

const EMAIL_OTP_VERIFY_FAILURE_RESPONSES: Record<Exclude<EmailOtpOutcome, 'success'>, { status: number; body: Record<string, unknown> }> = {
  invalid: {
    status: 400,
    body: { ok: false, data: { statusCode: 400, errorCode: 'OTP_INVALID', message: 'You have entered invalid OTP.' } },
  },
  expired: {
    status: 400,
    body: { ok: false, data: { statusCode: 400, errorCode: 'OTP_EXPIRED', message: 'OTP expired.' } },
  },
};

/** Mocks the profile-edit save call. */
export async function mockProfileEditSave(page: Page, options: { outcome?: ProfileSaveOutcome; delayMs?: number } = {}): Promise<void> {
  const outcome = options.outcome ?? 'success';
  await page.route(PROFILE_EDIT_SAVE_PATTERN, async (route) => {
    if (options.delayMs) {
      await new Promise((resolve) => setTimeout(resolve, options.delayMs));
    }
    if (outcome !== 'success') {
      const { status, body } = SAVE_FAILURE_RESPONSES[outcome];
      await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, data: { statusCode: 200, messageType: 'PROFILE_UPDATED', message: 'Profile updated successfully.' } }),
    });
  });
}

/** Mocks the OTP send-to-new-email call so no real email is ever dispatched. */
export async function mockEmailOtpSend(page: Page): Promise<void> {
  await page.route(EMAIL_OTP_SEND_PATTERN, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, data: { statusCode: 200, messageType: 'EMAIL_OTP_SENT', message: 'OTP sent to your new email.' } }),
    });
  });
}

/** Mocks the email-OTP verify call. */
export async function mockEmailOtpVerify(page: Page, options: { outcome?: EmailOtpOutcome } = {}): Promise<void> {
  const outcome = options.outcome ?? 'success';
  await page.route(EMAIL_OTP_VERIFY_PATTERN, async (route) => {
    if (outcome !== 'success') {
      const { status, body } = EMAIL_OTP_VERIFY_FAILURE_RESPONSES[outcome];
      await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, data: { statusCode: 200, messageType: 'EMAIL_VERIFIED', message: 'Email verified.' } }),
    });
  });
}

export async function mockProfileEditApis(
  page: Page,
  options: { saveOutcome?: ProfileSaveOutcome; emailOtpOutcome?: EmailOtpOutcome } = {},
): Promise<void> {
  await mockProfileEditSave(page, { outcome: options.saveOutcome });
  await mockEmailOtpSend(page);
  await mockEmailOtpVerify(page, { outcome: options.emailOtpOutcome });
}
