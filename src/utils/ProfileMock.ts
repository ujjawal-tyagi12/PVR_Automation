import type { Page } from '@playwright/test';

/**
 * PRD UC5 "Complete Your Profile" documents the nudge/field behavior but no real endpoint
 * names or payload shapes — same gap as OtpMock.ts. These patterns/shapes are a best-effort
 * guess; no live network capture was done for this screen. TODO(heal): tighten against real
 * endpoints once grounded.
 */

export type ProfileSaveOutcome = 'success' | 'validation-error' | 'server-error' | 'session-expired';

export const PROFILE_STATUS_PATTERN = /\/api\/.*profile\/status/i;
export const PROFILE_SAVE_PATTERN = /\/api\/.*profile\/(update|complete)/i;
export const CUSTOMER_SYNC_PATTERN = /\/api\/.*admin.*customer/i;

const SAVE_FAILURE_RESPONSES: Record<Exclude<ProfileSaveOutcome, 'success'>, { status: number; body: Record<string, unknown> }> = {
  'validation-error': {
    status: 400,
    body: { success: false, errorCode: 'ANNIVERSARY_REQUIRED', message: 'Please select anniversary date.' },
  },
  'server-error': {
    status: 500,
    body: { success: false, errorCode: 'SERVER_ERROR', message: 'Unable to update profile. Please try again.' },
  },
  'session-expired': {
    status: 401,
    body: { success: false, errorCode: 'SESSION_EXPIRED', message: 'Your session has expired. Please log in again.' },
  },
};

/** Mocks the profile-completion-status check so the nudge shows for an "incomplete" profile. */
export async function mockProfileStatus(page: Page, options: { complete?: boolean } = {}): Promise<void> {
  await page.route(PROFILE_STATUS_PATTERN, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, profileComplete: Boolean(options.complete) }),
    });
  });
}

/** Mocks the profile save call. */
export async function mockProfileSave(page: Page, options: { outcome?: ProfileSaveOutcome } = {}): Promise<void> {
  const outcome = options.outcome ?? 'success';
  await page.route(PROFILE_SAVE_PATTERN, async (route) => {
    if (outcome !== 'success') {
      const { status, body } = SAVE_FAILURE_RESPONSES[outcome];
      await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
      return;
    }
    // Deliberately excludes phone/email/PII beyond what the user submitted, to model
    // TC_ADM_152's "no sensitive data in error/response payload" expectation.
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, status: 'success', message: 'Your profile has been updated successfully.' }),
    });
  });
}

export async function mockProfileApis(page: Page, options: { complete?: boolean; saveOutcome?: ProfileSaveOutcome } = {}): Promise<void> {
  await mockProfileStatus(page, { complete: options.complete });
  await mockProfileSave(page, { outcome: options.saveOutcome });
}
