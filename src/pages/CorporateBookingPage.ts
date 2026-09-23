import type { Page } from '@playwright/test';

/**
 * Grounded live 2026-09-16 against UAT — route, headings, and step-1 field existence via
 * headless Playwright; the full step-1 → step-2 → Get-OTP flow via a real user-recorded
 * `playwright codegen` session (interactive Playwright MCP fails in this sandbox — see
 * `pvr-inox-grounding-technique` project memory). Real route: **`/corporate-booking`**.
 * Real headings: **"Exclusive Corporate Screenings"** / **"Enter Booking Details"** (step 1 of
 * a 2-step wizard).
 *
 * **Step 1 fields, all real `role="combobox"`-style comboboxes with a single-node
 * label+placeholder accessible name** (confirmed via a real recorded session, not a guess):
 * City (`getByText('City*Select…')`, opens a search box `getByPlaceholder('Search city…')`
 * plus `role="option"` results), Cinema (`getByText('Cinema*Select…')`, options are real
 * cinema names, e.g. "INOX Megaplex, Inorbit Mall"), Date (a real button whose accessible name
 * concatenates the label AND its calendar icon: `'Date * Select date Calendar'` — opens a
 * popover with day cells as `role="button"`, name e.g. `'Thursday, October 1st,'`), Preferred
 * Show Time (`getByText('Preferred Show Time*Select…')`, options like `':00 PM – 09:00 PM'`),
 * and real movie-title tiles as buttons (confirmed real title seen: "Dhurandhar(Hindi)" — live
 * data, do not hardcode a specific title as a fixture; select the first tile generically).
 * `numberOfSeats` input's real accessible name is its placeholder, **"50-999"**. `Other
 * Requirements` is a real `getByRole('textbox', {name:'Other requirements'})`.
 *
 * **Step 2** (after Next): Name/Email/Phone are real `getByRole('textbox', {name:'Enter your
 * name'|'Enter your email'|'Enter phone number'})`. F&B Requirements is the same combobox
 * pattern (`getByText('F&B RequirementsSelect…')`, options Yes/No). Copy to Self is
 * `getByRole('checkbox', {name:'Copy to Self'})`. Get OTP is `getByRole('button', {name:'Get
 * OTP'})`.
 *
 * **CRITICAL — confirmed via a real (accidental) live submission during grounding: this form
 * has NO separate Verify/Submit button after Get OTP.** The OTP input auto-verifies (and
 * appears to auto-submit the whole booking) the moment a valid code is filled in — there is no
 * intermediate confirmation step to intercept. **Automated tests must stop at confirming the
 * OTP screen/input is visible and NEVER fill a real OTP code**, exactly like
 * `BulkGiftCardPage.ts`'s same finding — doing so risks a real backend submission with a real
 * HR/region-recipient email, which this suite must never do (see project memory
 * `shared-environment-read-only`). The OTP input's real DOM `id` seen live
 * (`_r_64_-form-item`) is a React-generated per-session ID, NOT stable — do not use it; prefer
 * `input[name="otp"]` (same pattern as `BulkGiftCardPage.ts`) until independently confirmed,
 * flagged TODO(heal) below.
 */
export class CorporateBookingPage {
  constructor(private page: Page) {}

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/corporate-booking`);
  }

  readonly moreMenuButton = () => this.page.getByRole('button', { name: 'More Arrow Down' });
  readonly corporateBookingMenuItem = () => this.page.getByText('Corporate Booking', { exact: true });

  readonly pageHeading = () => this.page.getByRole('heading', { name: 'Exclusive Corporate Screenings', exact: true });
  readonly stepHeading = (name: string | RegExp) => this.page.getByRole('heading', { name });
  readonly bannerImage = () => this.page.getByRole('img').first();

  // BUG FIX (2026-09-17, live run): the City field is NOT reliably blank on load — confirmed
  // live, twice, reproducibly: it sometimes shows a real geolocation-detected city (e.g.
  // "City*Mumbai") instead of the "City*Select…" placeholder, independent of login state (seen
  // both logged-out and logged-in). An exact match on the blank placeholder text intermittently
  // timed out waiting for a trigger that never renders that exact text. Matches the "City*"
  // prefix instead, same shape as `movieTypeFieldTrigger`'s own fix for the identical class of
  // issue.
  readonly cityFieldTrigger = () => this.page.getByText(/^City\*/);
  readonly citySearchInput = () => this.page.getByPlaceholder('Search city…');
  readonly cityOption = (name: string) => this.page.getByRole('option', { name });

  readonly cinemaFieldTrigger = () => this.page.getByText('Cinema*Select…', { exact: true });
  readonly cinemaOption = (name: string | RegExp) => this.page.getByRole('option', { name });
  // BUG FIX (2026-09-17, live run): CB-011 was implemented as "confirmed absent" purely because a
  // codegen recording didn't happen to interact with a Cinema search box — that was a real
  // inference error, not a grounded finding (absence of an *action* in one recording isn't
  // confirmation the *control* doesn't exist). A live re-check (screenshot) shows the Cinema
  // dropdown genuinely HAS its own "Search cinema..." input, filtering the option list exactly
  // like City's. Corrected to the real, positive finding.
  readonly cinemaSearchInput = () => this.page.getByPlaceholder('Search cinema…');

  readonly dateFieldButton = () => this.page.getByRole('button', { name: 'Date * Select date Calendar' });
  readonly dateCell = (name: string | RegExp) => this.page.getByRole('button', { name });

  readonly showTimeFieldTrigger = () => this.page.getByText('Preferred Show Time*Select…', { exact: true });
  readonly showTimeOption = (name: string | RegExp) => this.page.getByRole('option', { name });

  // BUG FIX (2026-09-17, live codegen recording): CB-014 was `test.fixme`'d as "not grounded —
  // no distinct Movie Type control was interacted with." A fresh recording confirms it's a real,
  // distinct dropdown between Date and the movie-tile grid — the trigger's live accessible text is
  // "Movie Type*Now Showing" (pre-selected to "Now Showing" by default, not a blank "Select…"
  // placeholder like City/Cinema/ShowTime), so the trigger locator matches the "Movie Type*" prefix
  // rather than one exact full string. Only "Now Showing" was confirmed selectable in the
  // recording — "Others" (the sheet's other named option) was not exercised, so only the
  // confirmed option is asserted/selected in the test.
  readonly movieTypeFieldTrigger = () => this.page.getByText(/^Movie Type\*/);
  readonly movieTypeOption = (name: 'Now Showing' | 'Others') => this.page.getByRole('option', { name, exact: true });

  readonly movieTile = (title: string | RegExp) => this.page.getByRole('button', { name: title });
  readonly firstMovieTile = () => this.page.getByRole('button').filter({ hasText: /\(Hindi\)|\(English\)/ }).first();

  readonly numberOfSeatsInput = () => this.page.getByRole('textbox', { name: '50-999' });
  readonly otherRequirementsInput = () => this.page.getByRole('textbox', { name: 'Other requirements' });

  readonly fbRequirementsFieldTrigger = () => this.page.getByText('F&B RequirementsSelect…', { exact: true });
  readonly fbRequirementsOption = (name: 'Yes' | 'No') => this.page.getByRole('option', { name, exact: true });

  readonly copyToSelfCheckbox = () => this.page.getByRole('checkbox', { name: 'Copy to Self' });

  readonly nextButton = () => this.page.getByRole('button', { name: 'Next', exact: true });

  readonly nameInput = () => this.page.getByRole('textbox', { name: 'Enter your name' });
  readonly emailInput = () => this.page.getByRole('textbox', { name: 'Enter your email' });
  readonly phoneInput = () => this.page.getByRole('textbox', { name: 'Enter phone number' });

  readonly getOtpButton = () => this.page.getByRole('button', { name: 'Get OTP', exact: true });

  /** TODO(heal): the real OTP input's DOM id is a per-session React-generated string, not
   * stable — this is an educated guess (matches BulkGiftCardPage.ts's confirmed pattern), not
   * independently confirmed for this form. NEVER fill a real OTP code into it — see class doc
   * comment. */
  readonly otpInput = () => this.page.locator('input[name="otp"]');
  readonly otpHeading = () => this.page.getByRole('heading', { name: 'Verify Phone Number', exact: true });
  readonly submitButton = () => this.page.getByRole('button', { name: /^submit$/i });
  readonly successPopupText = () => this.page.getByText(/submitted successfully/i);
  readonly fieldError = (message: string | RegExp) => this.page.getByText(message);
}
