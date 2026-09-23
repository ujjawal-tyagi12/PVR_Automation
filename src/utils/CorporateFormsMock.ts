import type { Page, Request } from '@playwright/test';

/**
 * Mocks the OTP-send/verify/submit network calls for **Corporate Booking** and **Bulk Gift
 * Card** — the two forms whose real backend submission (per `requirements/corporate-
 * booking.md`/`requirements/bulk-gift-card.md`) notifies a real, mapped HR/recipient email.
 *
 * Deliberately different from `OtpMock.ts`'s philosophy: `OtpMock.mockSendOtp`/`mockVerifyOtp`
 * let a real 'success' pass through to the live backend (safe there — logging in has no
 * external side effect). These two forms are NOT safe to let through — a real submission
 * emails a real person, and per the user's explicit, standing instruction (see project memory
 * `shared-environment-read-only`), this suite must never create real data or trigger real side
 * effects against the shared UAT environment. Every outcome here, including 'success', is
 * fully fabricated; nothing calls `route.continue()`.
 *
 * NOT YET GROUNDED — the real endpoint paths for either form's send-OTP/verify-OTP/submit
 * calls are unknown (neither form's Get-OTP button was clicked live during ticket-seeding —
 * see each Page object's own doc comment). The patterns below are placeholder guesses derived
 * from each form's real route (`/corporate-booking`, `/bulk-gift-cards`) and this codebase's
 * existing `/api/...-otp` naming convention. Capture the real request URLs (a failed run's
 * trace, or a live grounding pass) and tighten these patterns before trusting this mock.
 */
export const CORPORATE_BOOKING_SEND_OTP_PATTERN = /\/api\/.*corporate.*(send|otp)/i;
export const CORPORATE_BOOKING_VERIFY_OTP_PATTERN = /\/api\/.*corporate.*verify/i;
export const CORPORATE_BOOKING_SUBMIT_PATTERN = /\/api\/.*corporate.*(booking|request|submit)/i;

export const BULK_GIFT_CARD_SEND_OTP_PATTERN = /\/api\/.*gift.*card.*(send|otp)/i;
export const BULK_GIFT_CARD_VERIFY_OTP_PATTERN = /\/api\/.*gift.*card.*verify/i;
export const BULK_GIFT_CARD_SUBMIT_PATTERN = /\/api\/.*gift.*card.*(request|submit)/i;

export interface CapturedSubmission {
  url: string;
  postData: Record<string, unknown> | null;
}

function parsePostData(request: Request): Record<string, unknown> | null {
  try {
    const data = request.postData();
    return data ? (JSON.parse(data) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/**
 * Mocks the full Get-OTP -> verify -> submit chain for one of these two forms. Records every
 * intercepted submit-call's payload into `capturedSubmissions` so a test can assert on the
 * real request shape (recipient mapping, Copy-to-Self flag, ...) without ever letting the
 * request reach the real backend — see CB-030/031/032 and BGC-015/016/017/025 in each ticket.
 */
export async function mockCorporateFormSubmission(
  page: Page,
  form: 'corporate-booking' | 'bulk-gift-card',
  capturedSubmissions: CapturedSubmission[],
  options: { otpOutcome?: 'success' | 'invalid'; submitOutcome?: 'success' | 'network-error' } = {},
): Promise<void> {
  const { otpOutcome = 'success', submitOutcome = 'success' } = options;
  const sendPattern = form === 'corporate-booking' ? CORPORATE_BOOKING_SEND_OTP_PATTERN : BULK_GIFT_CARD_SEND_OTP_PATTERN;
  const verifyPattern = form === 'corporate-booking' ? CORPORATE_BOOKING_VERIFY_OTP_PATTERN : BULK_GIFT_CARD_VERIFY_OTP_PATTERN;
  const submitPattern = form === 'corporate-booking' ? CORPORATE_BOOKING_SUBMIT_PATTERN : BULK_GIFT_CARD_SUBMIT_PATTERN;

  await page.route(sendPattern, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, data: { messageType: 'OTP_SENT' } }) });
  });

  await page.route(verifyPattern, async (route) => {
    if (otpOutcome === 'invalid') {
      await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ ok: false, data: { errorCode: 'INVALID_OTP', message: 'Incorrect OTP. Please try again.' } }) });
      return;
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, data: { messageType: 'OTP_VERIFIED' } }) });
  });

  await page.route(submitPattern, async (route, request) => {
    capturedSubmissions.push({ url: request.url(), postData: parsePostData(request) });
    if (submitOutcome === 'network-error') {
      await route.abort('connectionfailed');
      return;
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, data: { requestId: 'mocked-request-id' } }) });
  });
}
