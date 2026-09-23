import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { WaitHelper } from './WaitHelper';

/**
 * Grounded 2026-08-19 against www.pvrinox.com and (2026-08-19, follow-up pass)
 * inox-uat-web.pvrinox.com: first load blocks on an "Enable Location" modal; Cancel opens
 * manual city selection; the chosen popular city's sub-city drawer needs one more pick
 * before the modal actually closes. Shared across every page object that needs a city
 * selected before interacting with content (Global Search, Event Listing, Event Details,
 * Experience) — see `RegisterLoginPage.dismissLocationAndSelectCity` for the original
 * single-page version this was extracted from once a second consumer needed it. No-op if the
 * modal/panel doesn't appear (e.g. a saved city from an earlier step).
 *
 * Which `city`/`subCity` to pass is environment- and data-dependent, not just a UI detail:
 * on UAT, Delhi (`'Delhi-NCR'`/`'Delhi'`) has no movies/events configured ("No movies
 * found"), while `'Mumbai-All'`/`'Mumbai'` has real data (Now Showing, Coming Soon, and a
 * live Events section) — see `UAT_CITY`/`UAT_SUB_CITY` below. Production's default
 * (`'Delhi-NCR'`/`'Noida'`) does have real movie data, but no Events feature at all — see
 * [[events-feature-not-live]] memory.
 */
// BUG FIX (2026-09-16): REVERSED again — the 2026-09-09 finding below had it backwards as of
// today. User-confirmed + independently re-verified live: `inox-uat-web.pvrinox.com` is the
// correct, working UAT host right now (real homepage renders in ~6s with a full nav — Home/
// Cinemas/Experiences/Food/Passport — and real movie tiles). `uat-web.pvrinox.com` (the old
// default below) currently renders a completely blank page — zero interactive elements found
// via `getByRole`, ~35s just for its own readiness check to (wrongly) report success — not a
// transient blip, reproduced directly. This is the second time these two hosts have swapped
// roles on this project (see `otp-flow-automation-solved` project memory) — don't assume
// either one is "the retired host" without re-checking live first.
export const UAT_BASE_URL = process.env.UAT_BASE_URL || 'https://inox-uat-web.pvrinox.com';
export const UAT_CITY = 'Mumbai-All';
export const UAT_SUB_CITY = 'Mumbai';
// Grounded 2026-08-20: approximate Mumbai coordinates, paired with `grantMumbaiGeolocation`.
export const MUMBAI_GEOLOCATION = { latitude: 19.0760, longitude: 72.8777 };

/**
 * Grounded 2026-09-07 (CinemasListingDetailModule CIN-040/041/042 investigation): real Delhi
 * coordinates, used to produce a genuine detected-city-differs-from-saved-city mismatch. The
 * prior "not reliably reproducible via geolocation mocking alone" finding turned out to be a
 * sequencing gap, not a technique failure: geolocation mocking works fine, but only produces a
 * real mismatch when a previously-saved city already exists in the `cityDetails` cookie to
 * compare against — a fresh context/navigation has no saved city yet, so the app just adopts
 * whatever it detects with nothing to conflict with. Confirmed live: navigating once with
 * `MUMBAI_GEOLOCATION` (persists a real `cityDetails` cookie, `cityName:"Mumbai"`), THEN
 * switching the context's geolocation to this constant and reloading the SAME session/context
 * (not a fresh one) reliably opens a real `role="dialog"` — "Change your city?" / "Your current
 * city seems to be Delhi. Shall we update?" / "Not Now" / "Switch To Current City" — no API
 * mocking needed. See `CinemasListingDetailModule.ts`'s `triggerCityChangeNudge()` doc comment.
 */
export const DELHI_GEOLOCATION = { latitude: 28.7041, longitude: 77.1025 };

/**
 * Grounded 2026-09-22 (LocationModule.ts / location.spec.ts LOC-016 grounding): real Gurgaon
 * coordinates. Confirmed live to resolve to `cityName:"Delhi"` (cityId 47) — the SAME city the
 * app resolves `DELHI_GEOLOCATION` above to, NOT `"Delhi-NCR"` as the PRD's "defaults the
 * detected city to Delhi NCR" claim assumes. See the wider finding below.
 *
 * **Wider finding, confirmed via a 5-point comparison (Mumbai/Delhi/Bangalore/Gurgaon/mid-
 * Pacific-Ocean real coordinates)**: automatic geolocation-based detection on this build never
 * resolves to anything other than `"Mumbai"` (cityId 1) or `"Delhi"` (cityId 47) — real Bangalore
 * coordinates (12.9716, 77.5946) resolved to `"Mumbai"`, and literal open-ocean coordinates (0,
 * -140) also resolved to `"Delhi"`. This strongly suggests the detection logic picks the nearer
 * of just these two hub cities rather than doing genuine reverse-geocoding against the full city/
 * sub-city database — sub-city-level precision (e.g. landing specifically on "Gurgaon") is not
 * observed at all via geolocation, only via manual selection.
 */
export const GURGAON_GEOLOCATION = { latitude: 28.4595, longitude: 77.0266 };

/**
 * Grounded 2026-09-22: literal mid-Pacific-Ocean coordinates, nowhere near any serviceable city.
 * Used to test the PRD's "non-serviceable city falls back to a nearby serviceable city" claim —
 * real finding: it resolves to `"Delhi"` (cityId 47), the same hub-city fallback described in
 * `GURGAON_GEOLOCATION`'s doc comment above, not a genuinely "nearby" city (there is no nearby
 * serviceable city to open ocean) and not an explicit non-serviceable message either.
 */
export const NON_SERVICEABLE_GEOLOCATION = { latitude: 0, longitude: -140 };

/**
 * Grounded 2026-08-20: pre-granting geolocation permission (with real coordinates) *before*
 * `page.goto()` skips the "Enable Location" modal — and with it, the entire fragile
 * popular-city → sub-city drawer click chain — entirely on both production and UAT. This is
 * now the primary way pages should reach a city-selected state; `dismissLocationAndSelectCity`
 * remains as a fallback for the (rare, so far unseen with this granted) case where the modal
 * still renders. Must be called on the page's context before navigation — permissions can't be
 * granted retroactively to an already-loaded page.
 */
export async function grantMumbaiGeolocation(page: Page): Promise<void> {
  await page.context().grantPermissions(['geolocation']);
  await page.context().setGeolocation(MUMBAI_GEOLOCATION);
}

/**
 * Grounded 2026-08-20: a promotional movie-trailer popup (not a `role="dialog"` — a plain
 * overlay, confirmed via TC_ADM_020's failure screenshot: a "Dhurandhar" trailer card with a
 * "Close" button and a "Don't miss out!" offer banner) can appear on top of the login panel
 * and block whatever's underneath it, independent of the location-modal chain above. It
 * doesn't appear on every load (probably time- or session-based), so this is a no-op most of
 * the time. Call defensively before any assertion that reads text on the page behind it.
 *
 * Widened 2026-08-24 (register-login.spec.ts REG-015 grounding): a second, distinct dialog —
 * "Complete Your Profile" (a post-registration nudge, real `role="dialog"`, confirmed live via
 * a DOM dump: "Select Your Preferences... Help us personalize your experience... I'll miss
 * out / Save & Next") — can also appear right after a successful registration submit and
 * `aria-hide`s the header, blocking the "User Icon" button `openAccountPanel()` needs. Its
 * close control's accessible name is "Close dialog", which the original exact `/^close$/i`
 * match never caught. Matching both keeps this one function as the single defensive
 * dismiss-anything-blocking call site (`clickThroughOverlays` already calls it on every retry).
 *
 * Widened 2026-08-28 (multi-device-login.spec.ts TC_ADM_039 grounding): a third, previously
 * undocumented popup — "Get Verified with Google Wallet! Unlock exclusive benefits" (a
 * "Verify with Google Wallet" button + an "I'll do it later" text link, confirmed live via a
 * real failure screenshot) — can also appear over the header, blocking `openAccountPanel()`'s
 * "User Icon" click the same way. Its own close icon has no accessible name this pattern
 * catches, so this dismisses it via the "I'll do it later" link instead.
 *
 * Widened 2026-09-09 (register-login.spec.ts REG-001 grounding on the new `uat-web.pvrinox.com`
 * host): a fourth, previously undocumented popup — a post-show "How Was The Movie?" rating
 * dialog (real `role="dialog"`, "Rate 1-5 stars" + "Cancel"/"Submit Review" buttons, confirmed
 * live via a real failure's page snapshot) — can appear on a fresh session's first homepage load
 * and block the header's "User Icon"/"Login" click the same way. Its close control has no
 * accessible name either (an `img` with `alt="Close Popup Icon"` inside an unnamed button), same
 * shape as the other icon-only closers this function already handles.
 */
export async function dismissPromoPopup(page: Page): Promise<void> {
  const closeBtn = page.getByRole('button', { name: /^close( dialog)?$/i });
  if (await closeBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await closeBtn.click().catch(() => undefined);
  }
  const laterLink = page.getByText(/i'll do it later/i);
  if (await laterLink.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await laterLink.click().catch(() => undefined);
  }
  const ratingPopupCloseBtn = page.getByRole('button').filter({ has: page.getByAltText('Close Popup Icon') });
  if (await ratingPopupCloseBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await ratingPopupCloseBtn.click().catch(() => undefined);
  }
}

/**
 * Grounded 2026-08-19: the "Enable Location" modal — and other ad/video overlays — can
 * intercept clicks/fills even after an earlier dismissal, because the site is slow enough
 * that these overlays sometimes render *late*, racing whatever action runs next (confirmed
 * live: `ExperiencePage.goto()`'s nav-link click and `ExperiencePage.searchMovie()`'s input
 * fill both hung for the full 60s timeout on an otherwise-successful run). Retries `action`,
 * re-dismissing the location modal and pressing Escape (a generic fallback for other
 * Radix-style dialogs) between attempts. `action` must set its own short `timeout` so a
 * retry loop doesn't re-wait the full test timeout on every attempt. Extracted from the
 * original single-page `RegisterLoginPage.clickThroughOverlays` once a second consumer
 * needed the same retry shape.
 */
export async function clickThroughOverlays(
  page: Page,
  action: () => Promise<void>,
  { city = 'Delhi-NCR', subCity = 'Noida', attempts = 3 }: { city?: string; subCity?: string; attempts?: number } = {},
): Promise<void> {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await action();
      return;
    } catch (error) {
      if (attempt === attempts) throw error;
      // BUG FIX (2026-08-19): earlier versions called `dismissLocationAndSelectCity(page)`
      // here with NO city/subCity, silently falling back to the production defaults
      // ('Delhi-NCR'/'Noida') even mid-UAT/Mumbai flow — a retry could then actively steer the
      // session onto the wrong city instead of recovering it. Always thread through the same
      // city/subCity the caller is actually targeting.
      await dismissLocationAndSelectCity(page, city, subCity).catch(() => undefined);
      // BUG FIX (2026-08-20): the promo trailer popup (see `dismissPromoPopup`) was observed
      // reappearing mid-test on TC_ADM_009/021 — well after `gotoLogin()`'s one-time dismissal —
      // and blocking a later click for the full test timeout because nothing here re-checked
      // for it. Dismiss it defensively on every retry too, not just the location modal.
      await dismissPromoPopup(page).catch(() => undefined);
      // BUG FIX (2026-09-10): confirmed live (intermittent, ~2/7 fresh-session attempts) — a
      // real "Session Expired — Your session has expired. Redirecting to login..." modal can
      // render on a brand-new, cookie-less session too (a genuine backend/auth hiccup, not a
      // client bug), blocking every click behind it with no dismiss control of its own. Escape
      // doesn't clear it; a reload does (confirmed — the next load is clean). Reload defensively
      // if seen, same shape as this loop's other recovery actions.
      const sessionExpiredModal = page.getByText(/session expired/i);
      if (await sessionExpiredModal.isVisible({ timeout: 1_000 }).catch(() => false)) {
        await page.reload().catch(() => undefined);
      }
      await page.keyboard.press('Escape').catch(() => undefined);
    }
  }
}

/**
 * Grounded 2026-08-19: the city-selection drawer is a `data-vaul-drawer` slide-out, not a
 * simple modal — a click fired mid-transition can silently no-op even though Playwright
 * reports the target as visible/enabled/stable (the drawer subtree still intercepts pointer
 * events during the animation). Closing the dialog does NOT mean homepage content (Now
 * Showing, Coming Soon, Events) has finished rendering either — a follow-up content assertion
 * right after this function returned once failed against a still-blank page — so this also
 * waits (best-effort, capped) for the network to go idle before returning.
 *
 * BUG FIX (2026-08-20): rewritten as an explicit, deliberate "manual" step sequence instead of
 * a fast blind click-and-catch loop — reproduced *consistently* against production (not an
 * occasional flake) that a fast loop clicks targets that are technically present but
 * mid-transition and silently no-ops. Each step confirms the next screen actually rendered
 * (`expect(...).toBeVisible()`, which polls/re-queries rather than checking once) before
 * acting on it, and the final click is itself retried a few times against the *same* already-
 * confirmed-visible target — the drawer-opening transition and the individual chip's own
 * settle time turned out to be two separate races, not one.
 */
export async function dismissLocationAndSelectCity(page: Page, city = 'Delhi-NCR', subCity = 'Noida'): Promise<void> {
  const cancel = page.getByRole('button', { name: /^cancel$/i });
  const enableLocationShown = await cancel.isVisible({ timeout: 12_000 }).catch(() => false);
  if (!enableLocationShown) return; // no location modal this load — nothing to dismiss

  // Step 1: dismiss "Enable Location" and confirm the "Select Your City" panel actually opened
  // (not just that the dialog element exists mid-animation).
  await cancel.click();
  const cityPanelHeading = page.getByRole('heading', { name: /select your city/i });
  const cityPanelOpened = await expect(cityPanelHeading)
    .toBeVisible({ timeout: 10_000 })
    .then(() => true)
    .catch(() => false);
  if (!cityPanelOpened) return; // different flow than expected this load — don't guess further

  // Step 2: click the popular-city tile and confirm its sub-city drawer actually opened.
  const cityCard = page.getByRole('button', { name: new RegExp(`click to select ${city} as your location`, 'i') });
  const cityCardShown = await expect(cityCard)
    .toBeVisible({ timeout: 8_000 })
    .then(() => true)
    .catch(() => false);
  if (!cityCardShown) return; // no matching popular city — nothing left to do

  const subCityCard = page.getByRole('button', { name: subCity, exact: true }).first();
  for (let attempt = 1; attempt <= 3; attempt++) {
    await cityCard.click();
    const subCityShown = await expect(subCityCard)
      .toBeVisible({ timeout: 6_000 })
      .then(() => true)
      .catch(() => false);
    if (subCityShown) break;
    if (attempt === 3) return; // sub-city drawer never opened after 3 tries — give up cleanly
  }

  // Step 3: click the sub-city chip and confirm the whole dialog is actually gone. `force:
  // true` on later attempts: Playwright's own actionability wait (stable + receives pointer
  // events) was observed never resolving here even though the element is genuinely visible
  // and tappable to a human — the drawer's ongoing internal re-renders apparently never let
  // Playwright's stability check settle, not that the element is truly unreachable.
  for (let attempt = 1; attempt <= 4; attempt++) {
    await subCityCard.click({ timeout: 8_000, force: attempt > 1 }).catch(() => undefined);
    const dialogClosed = await page
      .getByRole('dialog')
      .waitFor({ state: 'hidden', timeout: 5_000 })
      .then(() => true)
      .catch(() => false);
    if (dialogClosed) break;
  }

  await WaitHelper.forNetworkIdle(page, 8_000).catch(() => undefined);
}

/**
 * Grounded 2026-08-19: dismissing the location dialog once is not the end of the story on
 * this site — content renders as gray skeleton placeholders for several seconds afterward,
 * AND the "Enable Location" modal was observed re-appearing a second time on top of that
 * still-loading skeleton (not just the click-intercepting quirk `clickThroughOverlays`
 * handles). Use this instead of a bare `dismissLocationAndSelectCity` call whenever the next
 * step is asserting on real homepage content (Now Showing, Events, etc.), not just interacting
 * with chrome like the search icon. Re-dismisses up to 3 times and waits for a concrete
 * "real content loaded" signal (the "Now Showing" heading, present on both production and
 * UAT/Mumbai) rather than trusting network-idle alone.
 */
export async function waitForHomepageReady(page: Page, city: string, subCity: string): Promise<void> {
  const nowShowingHeading = page.getByRole('heading', { name: /now showing/i });
  for (let attempt = 1; attempt <= 3; attempt++) {
    await dismissLocationAndSelectCity(page, city, subCity);
    const ready = await nowShowingHeading
      .waitFor({ state: 'visible', timeout: 10_000 })
      .then(() => true)
      .catch(() => false);
    if (ready) return;
  }
}
