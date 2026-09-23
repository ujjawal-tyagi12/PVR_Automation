import type { Page } from '@playwright/test';

/**
 * Verifies GA4 events by observing the outbound network beacon instead of the GA4
 * dashboard (which isn't reachable from an E2E test). GA4's Measurement Protocol sends
 * events as requests to `google-analytics.com/g/collect` (or `/mp/collect`) with the event
 * name in the `en` query parameter. This is the standard GA4 wire format, not specific to
 * this app, so it doesn't need PRD/endpoint grounding the way the OTP mocks do.
 *
 * Bug fix (2026-08-31): a URL-only `en` check missed events entirely once GA4 started
 * batching — confirmed live (registration.spec.ts TC_ADM_128 grounding) that when several
 * events fire close together, GA4 sends ONE beacon whose POST body carries one `en=...` line
 * per batched event, with no `en` in the request URL at all. Falls back to scanning
 * `request.postData()` for a matching `en=` line when the URL doesn't have it — this was the
 * actual, previously-undetectable case (TC_ADM_128/168/199 were all blocked by exactly this).
 */
export async function waitForGaEvent(page: Page, eventName: string, timeoutMs = 10_000): Promise<void> {
  await page.waitForRequest(
    (request) => {
      if (!/google-analytics\.com\/(g|mp)\/collect/i.test(request.url())) return false;
      const url = new URL(request.url());
      if (url.searchParams.get('en') === eventName) return true;

      const body = request.postData();
      if (!body) return false;
      return body
        .split('\n')
        .some((line) => new URLSearchParams(line).get('en') === eventName);
    },
    { timeout: timeoutMs },
  );
}
