import type { Page } from '@playwright/test';

/**
 * PRD (requirements/register-login.md) documents OTP/registration behavior but no real
 * endpoint names, request/response schemas, or status codes — the "APIs" section of the
 * ticket flags this gap explicitly. These route patterns and payload shapes are a
 * best-effort guess grounded only in the PRD's described fields (phone, name, email,
 * emailVerified, error copy). No live browser/network grounding was available in this
 * environment (Playwright MCP could not launch a display here) and production must not
 * receive real OTP-send traffic during test generation.
 *
 * Before relying on this mock in CI: capture the real network calls (HAR / MCP
 * `browser_network_requests`) against a staging environment or with backend API docs, then
 * tighten SEND_OTP_PATTERN / VERIFY_OTP_PATTERN / REGISTER_PATTERN and the payload shapes
 * below to match reality.
 *
 * PARTIALLY grounded 2026-08-18 (see scratchpad inspect-otp-render*.js /
 * inspect-otp-envelope-test*.js): every other real `pvrinox.com/api/*` response observed
 * (get-city-list, quick-book-init, promotions, auth/onboarding-handoff, ...) uses the
 * envelope `{ ok: boolean, data: {...} }` — sometimes with `data.statusCode` /
 * `data.messageType` / `data.message` nested inside. The bodies below were rewritten from a
 * bare `{ success: true, ... }` shape (confirmed WRONG — it made the real app misfire a
 * client-side "Invalid Number" error after a genuine "Get OTP" click, i.e. real production
 * code path-tested this mock and rejected it) to this `{ ok, data }` envelope. However, even
 * with the corrected envelope, live diagnostics show the real app does NOT transition to the
 * OTP-entry screen after send-phone-otp responds — no error shown either, it just silently
 * stays on the phone screen. This means the exact field(s) the frontend's success handler
 * checks are still unknown (candidates not yet ruled out: a specific `messageType` string
 * literal, an OTP-session/request-id field, a Set-Cookie, or a response header) and cannot be
 * determined further without either real backend API docs or a HAR captured from one
 * authorized real login (which would need to actually receive an SMS — do not attempt this
 * inside the automated suite). Tests relying on reaching the post-OTP-entry state
 * (RegisterLoginModule.loginWithPhoneAndOtp and everything built on it, e.g.
 * complete-your-profile.spec.ts) should be expected to fail at the OTP step until this is
 * resolved with real grounding.
 */

export type OtpVerifyOutcome = 'success' | 'invalid' | 'expired' | 'locked' | 'rate-limited' | 'deactivated';
export type SendOtpOutcome = 'success' | 'rate-limited' | 'mobile-conflict' | 'mobile-exists' | 'network-error' | 'server-error';

export interface OtpMockOptions {
  phone?: string;
  verifyOutcome?: OtpVerifyOutcome;
  isNewUser?: boolean;
  registeredUser?: { firstName: string; lastName?: string; email: string; emailVerified?: boolean };
  captchaRequired?: boolean;
}

/**
 * CONFIRMED real endpoints (grounded 2026-08-18, see scratchpad inspect-verify-otp.js): the
 * guessed names below ("send-otp"/"verify-otp") never matched the real app, so every prior
 * test run's OTP calls silently fell through to the REAL production backend uninterrupted
 * (no SMS was sent by verify — only send would dispatch one, and it uses an app-side
 * encrypted phone payload we can't forge — but this was NOT a safe mock in practice). Fixed
 * to the real names; both are POST with an encrypted `phone` blob, not plaintext.
 */
export const SEND_OTP_PATTERN = /\/api\/send-phone-otp/i;
export const VERIFY_OTP_PATTERN = /\/api\/verify-phone-otp/i;
export const REGISTER_PATTERN = /\/api\/.*(register|profile\/complete)/i;

/**
 * CONFIRMED real endpoint (grounded 2026-08-18, see scratchpad inspect-otp-api2.js): clicking
 * "Get OTP" calls `POST /api/verify-captcha` with `{ token, version: "v3" }` (Google reCAPTCHA)
 * *before* any OTP is sent — this matches the PRD's "Captcha on Web: runs if suspicious
 * activity is detected" rule, and headless/automated traffic reliably triggers it. Unlike
 * SEND_OTP_PATTERN/VERIFY_OTP_PATTERN/REGISTER_PATTERN above, this pattern is not a guess.
 */
export const VERIFY_CAPTCHA_PATTERN = /\/api\/verify-captcha/i;

const VERIFY_FAILURE_RESPONSES: Record<Exclude<OtpVerifyOutcome, 'success'>, { status: number; body: Record<string, unknown> }> = {
  invalid: {
    status: 400,
    body: { ok: false, data: { statusCode: 400, errorCode: 'OTP_INVALID', message: 'You have entered invalid OTP.' } },
  },
  expired: {
    status: 400,
    body: { ok: false, data: { statusCode: 400, errorCode: 'OTP_EXPIRED', message: 'OTP expired' } },
  },
  locked: {
    status: 429,
    body: { ok: false, data: { statusCode: 429, errorCode: 'TOO_MANY_ATTEMPTS', message: 'Too many failed attempts. Try again after 10 minutes.' } },
  },
  'rate-limited': {
    status: 429,
    body: { ok: false, data: { statusCode: 429, errorCode: 'OTP_REQUESTS_EXCEEDED', message: "You've requested OTP too many times. Please wait 10 minutes before trying again." } },
  },
  deactivated: {
    status: 403,
    body: {
      ok: false,
      data: {
        statusCode: 403,
        errorCode: 'ACCOUNT_DEACTIVATED',
        message: 'Your account has been deactivated by the admin. Please contact our support team for assistance.',
        supportEmail: 'support@pvrinox.com',
        supportPhone: '+911234567890',
      },
    },
  },
};

const SEND_OTP_FAILURE_RESPONSES: Record<Exclude<SendOtpOutcome, 'success'>, { status: number; body: Record<string, unknown> } | 'abort'> = {
  'rate-limited': {
    status: 429,
    body: { ok: false, data: { statusCode: 429, errorCode: 'OTP_REQUESTS_EXCEEDED', message: "You've requested OTP too many times. Please wait 10 minutes before trying again." } },
  },
  'mobile-conflict': {
    status: 409,
    body: { ok: false, data: { statusCode: 409, errorCode: 'MOBILE_ALREADY_LINKED', message: 'This mobile number is already linked to another account. Please use a different mobile number.' } },
  },
  'mobile-exists': {
    status: 409,
    body: { ok: false, data: { statusCode: 409, errorCode: 'MOBILE_ALREADY_EXISTS', message: 'Mobile number already exists' } },
  },
  'server-error': {
    status: 500,
    body: { ok: false, data: { statusCode: 500, errorCode: 'SERVER_ERROR', message: 'Server not responding. Please try again.' } },
  },
  'network-error': 'abort',
};

/**
 * Mocks the send-OTP call to deterministically drive negative UI states (rate-limited, mobile
 * conflict, server error, ...). Real 'success' now passes straight through to the real network.
 *
 * BUG FIX (2026-09-09): `SEND_OTP_PATTERN`/`VERIFY_OTP_PATTERN` are path-only (no domain anchor)
 * — grounded 2026-08-18 against the OLD UAT domain, where the real send/verify calls genuinely
 * lived on a different domain+path and this mock never fired. UAT has since moved to
 * `uat-web.pvrinox.com`, whose real endpoints are exactly `/api/send-phone-otp` /
 * `/api/verify-phone-otp` — this mock now DOES match, and every caller (8 spec files, all via
 * `mockOtpApis(page)` with no options, i.e. implicit 'success') was silently getting this
 * function's stale fabricated response instead of the real one. The real response shape
 * (`{statusCode, messageType:"Success", data:{newUser}}`, confirmed live 2026-09-09) doesn't
 * match what this mock fabricates (`{ok, data:{messageType:"OTP_SENT", ...}}`), so the frontend
 * never recognized it as a real success and the OTP screen never rendered — breaking every test
 * in those 8 files outright. Fixed by only fabricating a response for an explicitly-requested
 * NON-success outcome (the only thing a caller can't get from the real backend on demand);
 * 'success' (the default every current call site uses) now calls `route.continue()` so the real,
 * now-working backend handles it — real send-phone-otp plus the confirmed real OTP bypass
 * (`config.otpBypassCode`, see `env-local-access-restricted`/`otp-flow-automation-solved` project
 * memory) together make a fabricated success response unnecessary.
 */
export async function mockSendOtp(
  page: Page,
  options: { rateLimited?: boolean; outcome?: SendOtpOutcome; captchaRequired?: boolean; delayMs?: number } = {},
): Promise<void> {
  const outcome: SendOtpOutcome = options.rateLimited ? 'rate-limited' : (options.outcome ?? 'success');

  await page.route(SEND_OTP_PATTERN, async (route) => {
    if (options.delayMs) {
      await new Promise((resolve) => setTimeout(resolve, options.delayMs));
    }
    if (outcome !== 'success') {
      const failure = SEND_OTP_FAILURE_RESPONSES[outcome];
      if (failure === 'abort') {
        await route.abort('connectionfailed');
        return;
      }
      await route.fulfill({ status: failure.status, contentType: 'application/json', body: JSON.stringify(failure.body) });
      return;
    }
    // Real success: no fabricated `captchaRequired` override is possible once passed through —
    // see login-validation.spec.ts's TC_ADM_024 (already test.fixme for an unrelated reason).
    await route.continue();
  });
}

/**
 * Mocks the verify-OTP call to deterministically drive negative UI states. Real 'success' now
 * passes straight through to the real network — see `mockSendOtp`'s doc comment for why (same
 * domain-migration bug, same fix shape).
 */
export async function mockVerifyOtp(page: Page, options: OtpMockOptions & { delayMs?: number } = {}): Promise<void> {
  const { verifyOutcome = 'success' } = options;

  await page.route(VERIFY_OTP_PATTERN, async (route) => {
    if (options.delayMs) {
      await new Promise((resolve) => setTimeout(resolve, options.delayMs));
    }
    if (verifyOutcome !== 'success') {
      const { status, body } = VERIFY_FAILURE_RESPONSES[verifyOutcome];
      await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
      return;
    }
    await route.continue();
  });
}

/** Mocks the reCAPTCHA verification the app fires on "Get OTP" so no real challenge blocks the flow. */
export async function mockVerifyCaptcha(page: Page): Promise<void> {
  await page.route(VERIFY_CAPTCHA_PATTERN, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, data: { statusCode: 200, messageType: 'CAPTCHA_VERIFIED', message: 'en.CAPTCHA_VERIFIED', data: { success: true, score: 0.9 } } }),
    });
  });
}

/** Mocks the registration-details submit call. */
export async function mockRegister(page: Page): Promise<void> {
  await page.route(REGISTER_PATTERN, async (route) => {
    if (route.request().method() !== 'POST') {
      await route.fallback();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, data: { statusCode: 200, messageType: 'PROFILE_UPDATED', message: 'en.PROFILE_UPDATED', data: { success: true } } }),
    });
  });
}

export async function mockOtpApis(page: Page, options: OtpMockOptions & { rateLimitSend?: boolean } = {}): Promise<void> {
  await mockVerifyCaptcha(page);
  await mockSendOtp(page, { rateLimited: options.rateLimitSend });
  await mockVerifyOtp(page, options);
  await mockRegister(page);
}
