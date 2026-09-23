import type { Page } from '@playwright/test';

/**
 * Ticket: requirements/movie-alerts.md — reconciled 2026-09-02 from the `TC_Web_177–195` sheet.
 * Grounded via read-only + mocked headless Playwright against UAT (`inox-uat-web.pvrinox.com`,
 * Mumbai-All), 2026-09-02 — Playwright MCP's interactive browser tool does not launch in this
 * sandbox (see the `pvr-inox-grounding-technique` project memory). Scratchpad
 * `ground-alerts-*.js` scripts hold the raw diagnostics this comment summarizes.
 *
 * **Entry point, confirmed live**: the "Set Alert" CTA lives on a Coming Soon movie's DETAIL page
 * (`/coming-soon/{id}`, reached via `ComingSoonModule.openMovieDetail`), inside a "Get notified
 * when {movie} releases" section — never on the listing card, matching `coming-soon.md`'s own
 * finding. A guest click opens a real phone-number login drawer ("Welcome! Enter your phone
 * number to proceed"). For a brand-new phone number, OTP success is followed by a
 * registration-details form (First Name (required), Last Name, Email (required), WhatsApp/promo opt-in checkboxes —
 * both confirmed CHECKED by default), then a "Select Your Preferences" onboarding nudge
 * ("Complete Your Profile" step 1 of 4). Clicking its "I'll miss out" does NOT dismiss it
 * immediately — a real, previously-undocumented second confirmation ("Complete your profile for a
 * better experience... Skip Anyway / Complete Now") renders on top and must be confirmed via
 * "Skip Anyway" before the underlying page is usable again. Only AFTER all of this does clicking
 * "Set Alert" a second time open the real alert panel — the first click only ever surfaces login.
 *
 * **The Set Alert/Update Alert panel is a plain slide-in drawer, NOT `role="dialog"`** (confirmed
 * live: `page.getByRole('dialog')` matches 0 elements while the panel is open). It's scoped here
 * via an xpath ancestor walk from its own "Set Alert for"/"Update Alert for" `<h2>` up to the
 * drawer's class-identified container (`class` contains both `absolute` and `right-0` — the
 * drawer's own fixed-position styling, confirmed unique on the page while open), the same shape of
 * workaround `CitySelectionPage.ts`'s `subCityGrid` locator uses for a comparably non-standard
 * DOM nesting on this site. Real structure top-to-bottom: an unlabeled close (X) icon button
 * (first button in the drawer), the "Set Alert for"/movie-name headings, a release-date badge, a
 * city-name badge, an "Any Cinema in City" toggle (`role="switch"`, default unchecked) with
 * description "Get notified when the movie hits cinemas.", a "Select Cinema(s)" search input
 * (`placeholder="Search Cinemas"`) with a mic button that has a REAL clean accessible name
 * (`aria-label="Start voice search"` — no CSS/class workaround needed, unlike most mic buttons in
 * this suite), each real cinema as its own `<button>` (accessible name is the full
 * name+address+distance text — matched here by plain substring, no regex/escaping needed even for
 * names containing parentheses), an optional "Enable WhatsApp Notifications" toggle (see below),
 * and a submit CTA that is always the LAST button in the drawer's DOM regardless of how many
 * toggles/cinemas render above it (confirmed live across every panel state observed) — reading
 * "Set Alert" on create or "Update Alert" on edit.
 *
 * **"Any Cinema in City" toggle, confirmed live**: default `aria-checked="false"`; turning it ON
 * makes every individual cinema `<button>` `disabled` (confirmed via `isEnabled()` returning
 * `false`) and makes the submit CTA enabled with zero cinemas individually picked.
 *
 * **The "Enable WhatsApp Notifications" toggle only renders when the account has NOT already
 * globally opted into WhatsApp at registration** (confirmed live: a user who kept the
 * registration form's WhatsApp checkbox checked — the real default — never sees this toggle at
 * all; a user who unchecked it does). When shown, ITS OWN default is `aria-checked="true"`
 * (confirmed live) — i.e. even an account that opted OUT of WhatsApp globally still defaults to
 * WhatsApp-on for this specific alert unless the toggle is explicitly turned off.
 *
 * **Save (create), confirmed live**: `POST https://uat-api.pvrinox.com/movie/api/v1/coming-soon/
 * alert` with body `{movieCommonId, cityId, isAnyCinema, isWANotification, cinemaIds}` → `201`,
 * `messageType: ADD_COMING_SOON_ALERT_WA_OPT_IN` (WhatsApp path) or `_WA_OPT_OUT` (SMS path). The
 * UI shows a persistent (not an auto-dismissing toast) two-line success message — `Alert set for
 * "{movie}"` + either `You'll get a WhatsApp message when booking opens.` or `You'll get an SMS
 * when booking opens.` — and the movie detail page's alert section switches from a single "Set
 * Alert" button to `Alert set for N Cinema(s)` plus separate "Delete Alert"/"Edit Alert" buttons.
 *
 * **No 5-cinema max-selection limit exists on this build** (real finding, see `movie-alerts.md`'s
 * Test coverage note) — confirmed via `page.route()`-mocked 7-cinema list: all 7 selectable, save
 * succeeds with all 7 ("Alert set for 7 Cinemas"), no client- or server-side rejection anywhere.
 *
 * **Mandatory-selection validation, real mechanism**: the submit CTA is simply `disabled` (real
 * `disabled` attribute, confirmed) until ≥1 cinema or Any Cinema is chosen — there is no separate
 * error message, confirmed even via a forced `dispatchEvent('click')` bypassing Playwright's
 * normal actionability check (no toast/dialog fired).
 *
 * **Cinema search, confirmed live**: filters the button list by substring on name/address; a
 * genuinely unmatched keyword shows a real, exact `No cinemas found` message (plain text, not a
 * heading role).
 *
 * **Mic-denied fires a real native `alert()`**, confirmed live via `page.on('dialog')`:
 * "Microphone permission is blocked. Please enable it in your browser settings." — the IDENTICAL
 * wording `ComingSoonModule`'s own mic-denied alert uses (unlike Curated Shows', which differs
 * slightly), confirmed via a direct string comparison — this module's mic copy matches Coming
 * Soon's exactly.
 *
 * **Edit Alert**: re-opens the identical panel, retitled "Update Alert for {movie}", pre-populated
 * with the existing selection (each already-selected cinema's own `aria-pressed="true"`, confirmed
 * live), submit CTA reading "Update Alert". A successful update shows `Alert updated for
 * "{movie}"` plus the same channel-wording second line, and the detail page's count updates
 * accordingly.
 *
 * **Adding a cinema during Edit — a real, unresolved product race (`ALT-013`, `test.fixme`).**
 * Grounded 2026-09-02 across several live runs: selecting an additional cinema and clicking
 * "Update Alert" can silently submit WITHOUT the new cinema at all — confirmed via byte-identical
 * POST bodies (`cinemaIds:[200]`, unchanged from before the edit) even when the click on the new
 * cinema's own button was confirmed to flip its `aria-pressed` indicator to `true` first. This
 * ruled out both an ordinary test-timing gap AND a lost/misdirected click; the visual
 * `aria-pressed` state and whatever internal state the Update Alert submission actually reads are
 * decoupled by a delay with no discoverable DOM signal to poll on. A follow-up pass inserting a
 * real, un-conditioned 2-second wait between the click and Update reliably included the new
 * cinema in 2/2 runs — confirming a genuine backend/frontend debounce or delayed state-sync in the
 * product itself, not a test artifact, and not something a real DOM-condition wait (the only kind
 * this repo's `general-no-wait-for-timeout` rule permits) can reliably wait out.
 *
 * **Delete Alert, confirmed live — a real, previously-undocumented two-step flow**: clicking
 * "Delete Alert" opens its own confirmation drawer — heading "Delete Movie Alert", body text
 * "Deleting this alert means you won't be notified when the movie opens for booking in your
 * preferred theatres.", and two buttons: "I'll Miss Out" (confirms the delete — the SAME exact
 * text as the onboarding nudge's own skip button, a genuine cross-flow copy reuse in this app, not
 * a typo) and "No" (cancels). Confirming shows `Alert removed. / You'll no longer get updates for
 * this movie.` and the detail page's CTA reverts to a plain "Set Alert" button.
 *
 * **"My Movie Alerts", confirmed live — an entry point the old ticket had flagged as "not yet
 * grounded"**: header "User Icon" → account panel → a real "My Movie Alerts" link → navigates to
 * `/dashboard?tab=movie-alerts`, a real dashboard tab (heading "My Movie Alerts", subheading
 * "Manage your upcoming movie alerts") listing every alert with its live `Alert Set for N
 * Cinema(s)` count.
 *
 * **Session expiry, real finding — confirms the old ticket's "redirect to login" premise, once
 * properly re-grounded.** A first pass clearing cookies alone left the save call succeeding
 * (the auth token this endpoint checks lives in localStorage/sessionStorage, not only cookies);
 * clearing all three sometimes reproduced a real `403` with body `{statusCode:403,
 * error:"SESSION_EXPIRED", message:"SESSION_EXPIRED", type:"Forbidden"}` but NOT reliably across
 * repeated runs (confirmed live: back-to-back attempts with the identical clear sequence produced
 * a `201` success on one run and the real `403` on another) — too flaky for an automated
 * assertion. Deterministically reproducing that EXACT confirmed error shape via `page.route()`
 * mocking instead (consistent with this repo's established fault-injection pattern) shows the
 * real client behavior unambiguously: the whole page performs a real navigation to
 * `{baseUrl}/?sidebar=login` — the movie detail page and the alert panel are both gone, replaced
 * by the real homepage. The `?sidebar=login` marker does NOT reliably auto-open the phone-entry
 * login drawer on this client-side navigation path (confirmed live via a full accessibility
 * snapshot even after a generous 15s wait — the homepage's own header "User Icon" button is the
 * one reliably-true post-redirect signal asserted on). This is a real, deterministic REDIRECT, not
 * an inline toast — an earlier single manual observation of an inline "session expired" message
 * with no navigation could not be reproduced again and is not trusted; this mocked, repeatable
 * finding supersedes it.
 *
 * **Save failure (API-level fault injection), confirmed live and fully automatable**: mocking
 * `POST .../movie/api/v1/coming-soon/alert` to return a non-2xx response with a custom `message`
 * field surfaces THAT EXACT message verbatim as an on-screen toast (confirmed with a distinctive
 * mocked string, not a fixed generic client-side copy) — unlike `ProfileCompletionPage.ts`'s own
 * save-failure toast, which is always the same fixed client-side string regardless of the backend
 * response. This module surfaces the backend's real message directly.
 *
 * **Duplicate-click protection, confirmed live**: rapid double-clicking the submit CTA fires
 * exactly one `POST` to the alert-save endpoint (confirmed via a request-count listener) — the
 * button becomes disabled immediately on the first click, before the second click can register.
 */
export class MovieAlertsPage {
  constructor(private page: Page) {}

  // Movie detail page alert CTAs.
  readonly setAlertButton = () => this.page.getByRole('button', { name: 'Set Alert', exact: true });
  readonly deleteAlertButton = () => this.page.getByRole('button', { name: 'Delete Alert', exact: true });
  readonly editAlertButton = () => this.page.getByRole('button', { name: 'Edit Alert', exact: true });
  // Substring match handles both singular/plural ("Cinema"/"Cinemas") automatically.
  readonly alertCountText = (count: number) => this.page.getByText(`Alert set for ${count} Cinema`, { exact: false });

  // Set Alert / Update Alert panel — see class doc comment for why this isn't role="dialog".
  readonly panelHeading = () => this.page.getByRole('heading', { name: /^(Set|Update) Alert for$/ });
  readonly panelRoot = () => this.panelHeading().locator('xpath=ancestor::div[contains(@class,"absolute") and contains(@class,"right-0")][1]');
  readonly panelCloseButton = () => this.panelRoot().getByRole('button').first();
  readonly movieNameInPanel = (name: string) => this.panelRoot().getByRole('heading', { name, exact: true });
  readonly cityBadgeInPanel = (city: string) => this.panelRoot().getByText(city, { exact: true });

  readonly anyCinemaToggle = () =>
    this.page.getByText('Any Cinema in City', { exact: true }).locator('xpath=ancestor::div[contains(@class,"justify-between")][1]//button[@role="switch"]');
  readonly whatsappToggle = () =>
    this.page.getByText('Enable WhatsApp Notifications', { exact: true }).locator('xpath=ancestor::div[contains(@class,"justify-between")][1]//button[@role="switch"]');

  readonly cinemaSearchInput = () => this.page.getByPlaceholder('Search Cinemas');
  readonly cinemaMicButton = () => this.page.getByRole('button', { name: 'Start voice search', exact: true });
  readonly cinemaOption = (name: string) => this.panelRoot().getByRole('button', { name });
  readonly noCinemasFoundMessage = () => this.page.getByText('No cinemas found', { exact: true });

  readonly panelSubmitButton = () => this.panelRoot().getByRole('button').last();
  // Matches both "Alert set for "{movie}"" (create) and "Alert updated for "{movie}"" (update).
  readonly saveOrUpdateSuccessMessage = (movie: string) => this.page.getByText(`for "${movie}"`, { exact: false });
  // BUG FIX (2026-09-02, live test run): the real rendered copy uses a typographic/curly
  // apostrophe (U+2019 "'"), not a straight one (U+0027) — a straight-apostrophe locator matched
  // nothing live even while the text was genuinely on screen, confirmed via a dense polling
  // grounding pass and a direct toast-region dump.
  readonly whatsappSuccessSubtext = () => this.page.getByText("You’ll get a WhatsApp message when booking opens.", { exact: false });
  readonly smsSuccessSubtext = () => this.page.getByText("You’ll get an SMS when booking opens.", { exact: false });

  readonly genericErrorMessage = (text: string) => this.page.getByText(text, { exact: false });

  // Delete confirmation drawer.
  readonly deleteConfirmHeading = () => this.page.getByText('Delete Movie Alert', { exact: true });
  readonly deleteConfirmButton = () => this.page.getByRole('button', { name: /^i.ll miss out$/i });
  readonly deleteConfirmCancelButton = () => this.page.getByRole('button', { name: /^no$/i });
  // BUG FIX (2026-09-17, live run): confirmed live via screenshot — the real toast title is
  // "Alert Deleted." (past tense, capital D), a separate line from its own body text "You'll no
  // longer get updates for this movie." — "Alert removed." never matched either line, at any
  // exactness. The API response's own `message` field ("Alert removed. You'll no longer get
  // updates for this movie.") is NOT what's rendered — the frontend uses its own fixed toast
  // copy here, unlike the save-failure toast (see `genericErrorMessage`'s doc comment).
  readonly deleteSuccessMessage = () => this.page.getByText('Alert Deleted.', { exact: true });

  // Post-registration "Select Your Preferences" onboarding nudge and its own skip confirmation —
  // not covered by ProfileCompletionModule/Page (which this file intentionally does not modify).
  readonly onboardingNudgeHeading = () => this.page.getByRole('heading', { name: 'Complete Your Profile', level: 1 });
  readonly onboardingSkipAnywayButton = () => this.page.getByRole('button', { name: /^skip anyway$/i });

  // Account panel / My Movie Alerts.
  readonly myMovieAlertsLink = () => this.page.getByText('My Movie Alerts', { exact: true });
  readonly myMovieAlertsPageSubheading = () => this.page.getByText('Manage your upcoming movie alerts', { exact: true });
  readonly alertCardInMyMovieAlerts = (movieName: string) => this.page.getByText(movieName, { exact: true });

  async clickSetAlert(): Promise<void> {
    await this.setAlertButton().click();
  }

  async clickDeleteAlert(): Promise<void> {
    await this.deleteAlertButton().click();
  }

  async clickEditAlert(): Promise<void> {
    await this.editAlertButton().click();
  }

  async clickPanelClose(): Promise<void> {
    await this.panelCloseButton().click();
  }

  async toggleAnyCinema(): Promise<void> {
    await this.anyCinemaToggle().click();
  }

  async toggleWhatsapp(): Promise<void> {
    await this.whatsappToggle().click();
  }

  async searchCinema(keyword: string): Promise<void> {
    await this.cinemaSearchInput().fill(keyword);
  }

  async clickCinemaMic(): Promise<void> {
    await this.cinemaMicButton().click();
  }

  async selectCinema(name: string): Promise<void> {
    await this.cinemaOption(name).click();
  }

  async clickPanelSubmit(): Promise<void> {
    await this.panelSubmitButton().click();
  }

  async confirmDelete(): Promise<void> {
    await this.deleteConfirmButton().click();
  }

  async cancelDelete(): Promise<void> {
    await this.deleteConfirmCancelButton().click();
  }

  async clickSkipAnyway(): Promise<void> {
    await this.onboardingSkipAnywayButton().click();
  }

  async clickMyMovieAlertsLink(): Promise<void> {
    await this.myMovieAlertsLink().click();
  }
}
