import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

function escapeExactText(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Locators grounded LIVE against real UAT (`inox-uat-web.pvrinox.com`) on 2026-08-24 — replaces
 * the original best-effort guesses (PRD UC5, no live grounding). Confirmed via a real
 * registration → nudge round trip and direct DOM dumps (see scratchpad `pcp_ground*.js`
 * scripts). Key structural findings that drove every locator below:
 *
 * - The nudge is a real `role="dialog"` (`data-vaul-drawer`), but its own accessible name is
 *   useless: `aria-labelledby` points at a duplicate-id (`radix-_r_9_` appears twice in the real
 *   DOM — a markup bug) sr-only `<h2>` whose text is literally "Dialog". Every locator here
 *   targets the dialog's real, visible content instead of relying on the dialog's own name.
 * - "Complete Your Profile" is actually STEP 1 of a 4-step "Select Your Preferences" wizard
 *   (progress bar has 4 segments) — step 2 is "Language Preferences", step 3 is "Genres You
 *   Love" (min-3 multi-select). Steps 2-4 are a different, out-of-scope onboarding flow; the 34
 *   sheet rows (TC_ADM_138-171) are all about step 1's fields, which is all this file models.
 *   Clicking "Save & Next" on step 1 silently advances to step 2 on success — there is NO
 *   textual success message anywhere; the step transition IS the only success signal.
 * - Gender ("Male"/"Female"/"Other") and Marital Status ("Single"/"Married") are NOT real
 *   `role="radio"` controls despite visually looking like a radio group — each option is an
 *   `aria-hidden="true"` `<input type="radio">` paired with a `<label for="...">` that is the
 *   actual click target. `getByRole('radio', ...)` matches nothing here (confirmed: 0 results).
 *   Selecting is done via `label[for="male"|"female"|"other"|"single"|"married"]`; checked
 *   state is read via `input[value="..."]`'s `checked` property (also confirmed unreachable via
 *   role).
 * - Date of Birth / Anniversary Date are NOT text inputs — each is a `<button>` ("Select date")
 *   that opens a react-day-picker calendar in its own nested `role="dialog"` popover. There is
 *   NO manual text-entry path for either field anywhere in this UI (confirmed: zero `<input>`
 *   elements inside the calendar popover) — TC_ADM_169 ("invalid DOB format entered manually")
 *   has no control to exercise on this build.
 * - The DOB/Anniversary trigger buttons' own accessible name changes from "Select date" to the
 *   picked date string once a value is chosen, so `getByRole('button', {name: /select date/i})`
 *   stops matching after a pick. Both are instead targeted structurally, via the fixed field
 *   label text they sit next to (`xpath=.//label[contains(., "...")]/following-sibling::button[1]`)
 *   — stable across picks and across React's per-render `useId()` ids (which are NOT stable
 *   across renders and must never be hardcoded).
 * - The calendar's default in-DOM `<nav>` prev/next-month buttons are permanently
 *   `class="hidden"` (real CSS, not a transient state) — not a viable navigation path. The real,
 *   working navigation is the month/year `role="combobox"` pair in the calendar header (both
 *   confirmed live, year range 1911-2036 on both DOB and Anniversary calendars). Every day
 *   cell's real DOM identity is `button[data-day="DD/MM/YYYY"]` (confirmed via raw HTML dump).
 * - Real, confirmed business rules enforced by the app itself (not assumed from the PRD):
 *     - DOB: "You must be at least 13 years old to continue." — shown inline under the DOB
 *       field; the calendar itself does NOT disable under-13 days, the message appears after
 *       picking one and Save & Next stays disabled.
 *     - Anniversary, when Married: "Anniversary must be at least 18 years after date of birth."
 *       — a real, previously-undocumented cross-field rule discovered live (a DOB of 2013 +
 *       an Anniversary of 2026 was rejected with this exact copy).
 *     - Anniversary future dates: selecting a year beyond the current year snaps the calendar's
 *       shown month back to the current year with every day cell `disabled` — future selection
 *       is blocked at the calendar UI level, not via a post-hoc message like DOB's.
 * - The real save-failure signal (500/401/400 all produced the IDENTICAL copy in live mocked
 *   checks) is a Sonner toast OUTSIDE the dialog's own DOM subtree entirely (`<li data-type>`
 *   under a `<section>` at the end of `<body>`) — exact text "Sorry, we couldn't update your
 *   profile. Please try again." The backend response body's own message is never surfaced
 *   verbatim (confirmed: a custom 400 body with distinct text produced the same generic copy).
 * - Buttons are "I'll miss out" (skip) and "Save & Next" (submit) — NOT "Maybe Later"/"Submit"
 *   as the sheet's copy assumed.
 */
export class ProfileCompletionPage {
  constructor(private page: Page) {}

  readonly nudgeHeading = () => this.page.getByRole('heading', { name: 'Complete Your Profile', level: 1 });
  // The wizard dialog is always the first `role="dialog"` in the DOM while open — calendar
  // popovers (opened later, on top of it) are additional, later dialogs.
  readonly nudgeDialog = () => this.page.getByRole('dialog').first();

  readonly languagePreferencesHeading = () => this.page.getByRole('heading', { name: /language preferences/i });
  readonly maybeLaterButton = () => this.nudgeDialog().getByRole('button', { name: /i.ll miss out/i });
  readonly saveNextButton = () => this.nudgeDialog().getByRole('button', { name: /save & next/i });
  readonly previousButton = () => this.nudgeDialog().getByRole('button', { name: /^previous$/i });

  readonly genderOptionLabel = (value: 'male' | 'female' | 'other') => this.nudgeDialog().locator(`label[for="${value}"]`);
  readonly genderOptionInput = (value: 'male' | 'female' | 'other') => this.page.locator(`input[type="radio"][value="${value}"]`);

  readonly maritalOptionLabel = (value: 'single' | 'married') => this.nudgeDialog().locator(`label[for="${value}"]`);
  readonly maritalOptionInput = (value: 'single' | 'married') => this.page.locator(`input[type="radio"][value="${value}"]`);

  readonly dobTrigger = () => this.nudgeDialog().locator('xpath=.//label[contains(., "date of birth")]/following-sibling::button[1]');
  readonly anniversaryTrigger = () => this.nudgeDialog().locator('xpath=.//label[contains(., "anniversary")]/following-sibling::button[1]');
  readonly anniversaryFieldLabel = () => this.nudgeDialog().getByText(/select your\s*anniversary date/i);

  readonly underageDobError = () => this.nudgeDialog().getByText(/you must be at least 13 years old/i);
  readonly anniversaryGapError = () => this.nudgeDialog().getByText(/anniversary must be at least 18 years after date of birth/i);

  // The active calendar popover is always the LAST `role="dialog"` while open (rendered on top
  // of, and after, the wizard dialog itself).
  readonly calendarPopover = () => this.page.getByRole('dialog').last();
  readonly calendarMonthCombobox = () => this.calendarPopover().getByRole('combobox').nth(0);
  readonly calendarYearCombobox = () => this.calendarPopover().getByRole('combobox').nth(1);
  /**
   * BUG FIX (2026-08-25): the original `button[data-day="DD/MM/YYYY"]` CSS attribute selector
   * repeatedly failed to find a day cell that demonstrably existed — confirmed via a failing
   * test's own accessibility snapshot showing the exact target cell present and named
   * ("Monday, August 26th, 2013") while the attribute-selector locator reported "element(s) not
   * found" in the same DOM. Switching to an accessible-name-based locator, per this repo's own
   * stated preference (CLAUDE.md: "prefer accessibility-role locators over CSS/XPath") — also
   * sidesteps whatever made the raw attribute unreliable (virtualized list re-rendering,
   * `data-day` timing, etc.) since role/name queries auto-wait and re-resolve on every retry.
   * The real accessible name format (confirmed live) is "Weekday, Month Dayth, Year" — an
   * already-selected cell gets a additional ", selected" suffix, so this matches on a name
   * *prefix* rather than the exact full string.
   */
  readonly calendarDay = (date: Date) => {
    const ordinal = (n: number): string => {
      const suffixes = ['th', 'st', 'nd', 'rd'];
      const v = n % 100;
      return `${n}${suffixes[(v - 20) % 10] ?? suffixes[v] ?? suffixes[0]}`;
    };
    const weekday = date.toLocaleString('en-US', { weekday: 'long' });
    const month = date.toLocaleString('en-US', { month: 'long' });
    const label = `${weekday}, ${month} ${ordinal(date.getDate())}, ${date.getFullYear()}`;
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.calendarPopover().getByRole('button', { name: new RegExp(`^${escaped}`) });
  };
  readonly calendarDayButtons = () => this.calendarPopover().locator('button[data-day]');

  // Grounded 2026-08-24: lives outside the dialog entirely — a Sonner toast (`<li data-type>`)
  // portalled to the end of `<body>`. Identical copy confirmed across mocked 500/401/400
  // responses; the backend's own response body text is never surfaced.
  readonly saveFailureToast = () => this.page.getByText(/sorry, we couldn.t update your profile\. please try again\./i);

  /**
   * Grounded live 2026-09-16 (Avatar AVT-001/002/003 pass) — the real wizard is 4 steps, not
   * just the personal-details step this file originally modeled:
   *   1. Personal details (Gender/DOB/Marital — above) → PATCH `gender`/`maritalStatus`/`dob`.
   *   2. **Language Preferences** — real tile labels confirmed: Bengali, Bhojpuri, English,
   *      Hindi, Malayalam, Marathi, Punjabi, Sindhi, Telugu, Urdu. → PATCH `languages: string[]`.
   *   3. **Genres You Love** (min 3, enforced client-side) — real tile labels confirmed:
   *      Adventure, Comedy, Crime, Documentary, Fantasy, Fiction, Horror, Sports,
   *      "Suspence/ Action" (real copy, including the typo/space), Thriller. → PATCH
   *      `genres: string[]`.
   *   4. **Cinema Formats** — real tile labels (each tile is a real `role="img"`, confirmed via
   *      `alt`): DINE-IN, IMAX, INSIGNIA, Kiddles, LUXE, MX4D, ONYX DINER, PLAYHOUSE, ScreenX.
   *      This step's own final button reads **"Submit"**, not "Save & Next" — confirmed the
   *      literal last step, submitting closes the wizard entirely (confirmed via the dialog's
   *      own heading going hidden).
   * `saveNextButton()`/`clickSaveNext()` above are reused unchanged for steps 1-3 (same dialog,
   * same button, confirmed live) — step 4 needs its own `submitButton()`.
   *
   * Language and some genre tiles (Fiction, Fantasy, ...) share the SAME confirmed structural
   * pattern: the label text is duplicated in the DOM (once hidden, once as the real clickable
   * tile) — `.nth(1)` is the real one. Other genre tiles (Comedy, Crime, ...) are real
   * `role="heading"` elements instead — confirmed, not a locator guess; which category a given
   * genre name falls into was not exhaustively mapped, so `genreTile()` tries the heading form
   * first (a real `count()` check, not a race) and falls back to the div-nth(1) form.
   *
   * **Real, confirmed live (2026-09-16, via two independent fresh signups + network capture):**
   * the assigned starting avatar image is IDENTICAL regardless of the Gender persisted in step 1
   * (`https://uat-media.pvrinox.com/Avatars/4_Men_.webp` for both a Male and a Female account,
   * even though the PATCH genuinely sent `"gender":"female"` and got 200 back). This is expected,
   * not a bug: the avatar is a free user choice made via the gallery (`AVT-011/012` proves any
   * account can select any tile), not gender-derived — the sheet's "Default Female/Male avatar
   * assignment" framing doesn't match how this feature actually works. See `avatar.spec.ts`'s
   * AVT-001/002 doc comment.
   */
  readonly languageTile = (name: string) => this.nudgeDialog().locator('div').filter({ hasText: new RegExp(`^${escapeExactText(name)}$`) }).nth(1);
  private readonly genreHeadingTile = (name: string) => this.nudgeDialog().getByRole('heading', { name, exact: true });
  private readonly genreDivTile = (name: string) => this.nudgeDialog().locator('div').filter({ hasText: new RegExp(`^${escapeExactText(name)}$`) }).nth(1);
  readonly cinemaFormatTile = (name: string) => this.nudgeDialog().getByRole('img', { name, exact: true });
  readonly submitButton = () => this.nudgeDialog().getByRole('button', { name: 'Submit', exact: true });

  async selectLanguage(name: string): Promise<void> {
    await this.languageTile(name).click();
  }

  /** Tries the real `role="heading"` tile form first, falls back to the div-nth(1) form — see
   * this file's doc comment above for why both exist. */
  async selectGenre(name: string): Promise<void> {
    const heading = this.genreHeadingTile(name);
    if ((await heading.count()) > 0) {
      await heading.click();
      return;
    }
    await this.genreDivTile(name).click();
  }

  async selectCinemaFormat(name: string): Promise<void> {
    await this.cinemaFormatTile(name).click();
  }

  async clickSubmit(): Promise<void> {
    await expect(this.submitButton()).toBeEnabled({ timeout: 15_000 });
    await this.submitButton().click();
  }

  async selectGender(value: 'Male' | 'Female' | 'Other'): Promise<void> {
    await this.genderOptionLabel(value.toLowerCase() as 'male' | 'female' | 'other').click();
  }

  async selectMaritalStatus(value: 'Single' | 'Married'): Promise<void> {
    await this.maritalOptionLabel(value.toLowerCase() as 'single' | 'married').click();
  }

  /** Opens the DOB calendar and picks the given date via the month/year comboboxes + day cell. */
  async pickDob(date: Date): Promise<void> {
    await this.pickCalendarDate(this.dobTrigger(), date);
  }

  async pickAnniversary(date: Date): Promise<void> {
    await this.pickCalendarDate(this.anniversaryTrigger(), date);
  }

  /**
   * Opens the Anniversary calendar and jumps its year to `year` via the year combobox — used to
   * prove future dates are rejected. Grounded 2026-08-24: selecting a future year snaps the
   * calendar's shown month back into the current year, with every day cell disabled.
   */
  async openAnniversaryCalendarAtYear(year: number): Promise<void> {
    // Same bounded-retry shape as pickCalendarDate — selecting a year option can occasionally
    // close the whole popover under real site latency (see pickCalendarDate's grounding note).
    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        // BUG FIX (2026-08-25): only press Escape on a RETRY (attempt > 0), never on the first
        // attempt — pressing it before anything is open closes the wizard dialog itself (a
        // standard Radix Dialog behavior), which then made every subsequent locator in this
        // method time out looking for a trigger button that no longer existed. Confirmed live:
        // this was masking as a "trigger.click timeout" one call further down.
        if (attempt > 0) await this.page.keyboard.press('Escape').catch(() => undefined);
        await this.anniversaryTrigger().click({ timeout: 20_000 });
        await expect(this.calendarPopover()).toBeVisible({ timeout: 12_000 });
        await this.calendarYearCombobox().click();
        await this.page.getByRole('option', { name: String(year), exact: true }).click();
        await expect(this.calendarPopover()).toBeVisible({ timeout: 10_000 });
        await expect(this.calendarDayButtons().first()).toBeVisible({ timeout: 10_000 });
        return;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  }

  /**
   * BUG FIX (2026-08-24, found via three real serial test-suite runs):
   * 1. A bare 5s timeout on the final day-cell click was too tight — same too-tight-timeout
   *    pattern documented throughout this suite (e.g. RegisterLoginPage's click fixes).
   * 2. Unconditionally clicking the month combobox and re-selecting a value it ALREADY shows
   *    (every date this page's callers build shares today's month, so the calendar's own
   *    default-shown month already matches — see `ProfileCompletionModule`'s
   *    `pickDobYearsAgo`/`pickAnniversaryYearsAgo`) could close the whole popover instead of
   *    being a no-op. Now only touches the month combobox when the target month actually
   *    differs from what's shown.
   * 3. Biggest one, still reproducing after (1)+(2): selecting the YEAR option can ALSO close
   *    the whole popover under real site latency/render load — confirmed live via a failing
   *    test's own snapshot at the failure moment: only the wizard dialog remained, the trigger
   *    still read "Select date", no calendar dialog nested inside it. This reproduces in the
   *    full suite (with tracing/video overhead) but not in isolated grounding scripts, pointing
   *    at a real timing race in the app's own Select-close-on-select-then-reopen-popover
   *    sequence rather than a locator bug. Wrapping the whole open-select-pick sequence in a
   *    bounded retry (reopen the trigger fresh each attempt) absorbs this — same defensive
   *    retry shape as `LocationHelper.clickThroughOverlays` used pervasively elsewhere in this
   *    suite for comparable real-site flakiness.
   */
  private async pickCalendarDate(trigger: Locator, date: Date): Promise<void> {
    const monthName = date.toLocaleString('en-US', { month: 'long' });
    const year = String(date.getFullYear());
    const day = this.calendarDay(date);

    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        // BUG FIX (2026-08-25): only press Escape on a RETRY (attempt > 0) — see
        // openAnniversaryCalendarAtYear's identical fix note for why pressing it unconditionally
        // (including before anything was open) was actually closing the wizard dialog itself.
        if (attempt > 0) await this.page.keyboard.press('Escape').catch(() => undefined);
        await trigger.click({ timeout: 20_000 });
        await expect(this.calendarPopover()).toBeVisible({ timeout: 12_000 });

        const currentMonth = (await this.calendarMonthCombobox().innerText()).trim();
        if (currentMonth !== monthName) {
          await this.calendarMonthCombobox().click();
          await this.page.getByRole('option', { name: monthName, exact: true }).click();
          await expect(this.calendarPopover()).toBeVisible({ timeout: 6_000 });
        }

        const currentYear = (await this.calendarYearCombobox().innerText()).trim();
        if (currentYear !== year) {
          await this.calendarYearCombobox().click();
          // BUG FIX (2026-08-25, found via isolated live grounding after the suite kept
          // failing "day button not found" even though month/year selection appeared to
          // succeed): the year listbox has 126 options (a wide date-of-birth range), so it's
          // virtualized/scrollable — a target year far from the default-shown range (e.g.
          // 1986 vs. a ~2013 default) may not be reliably actionable via a plain `.click()`
          // alone under real site latency/trace-recording overhead, even though Playwright's
          // auto-scroll made it work in a lightweight standalone script. Explicitly scrolling
          // the option into view first, then re-confirming the combobox actually shows the
          // target year (not just trusting the click didn't throw), catches a silent
          // wrong-selection before it wastes the day-lookup step below.
          const yearOption = this.page.getByRole('option', { name: year, exact: true });
          await yearOption.scrollIntoViewIfNeeded({ timeout: 6_000 }).catch(() => undefined);
          await yearOption.click({ timeout: 8_000 });
          await expect(this.calendarPopover()).toBeVisible({ timeout: 6_000 });
          await expect(this.calendarYearCombobox()).toHaveText(year, { timeout: 6_000 });
        }

        await expect(day).toBeVisible({ timeout: 10_000 });
        await day.click({ timeout: 10_000 });
        return;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  }

  async clickSaveNext(): Promise<void> {
    // Grounded 2026-08-24: same debounced-validation pattern as RegisterLoginPage's
    // registration Submit — Save & Next only enables once the step's own client-side validation
    // settles (e.g. re-disables when switching to Married until Anniversary is filled).
    await expect(this.saveNextButton()).toBeEnabled({ timeout: 15_000 });
    await this.saveNextButton().click();
  }

  async clickMaybeLater(): Promise<void> {
    await this.maybeLaterButton().click();
  }

  async goBackToPreviousStep(): Promise<void> {
    await this.previousButton().click();
  }
}
