import type { Page } from '@playwright/test';

/**
 * Grounded live 2026-09-16 against UAT via headless Playwright from Bash/Node (interactive
 * Playwright MCP fails in this sandbox — see `pvr-inox-grounding-technique` project memory).
 * Real route: **`/bulk-gift-cards`** (plural — not `/bulk-gift-card` as the sheet's Module
 * Name column might suggest), directly `goto`-able and also confirmed reachable via a real
 * More-menu click on **"Bulk Gift Card"** (real accessible name of the header's "More" trigger
 * is **"More Arrow Down"**, per `about-us-nav-location`/`more-menu-real-labels` project
 * memory — plain `getByRole('button', {name:'More', exact:true})` matches nothing).
 *
 * Real headings, in DOM order: **"Bulk Gift Cards"**, **"Enter Details"**, **"Contact Us"** —
 * unlike Corporate Booking, this is a **single-step form**, no progress-bar wizard.
 *
 * Real fields, all plain `<input>` elements (confirmed via direct attribute dump, not guessed):
 * `name="name"` (text, placeholder "Enter your name"), `name="email"` (type=email, placeholder
 * "Enter your email"), `name="phone"` (text, placeholder "Enter phone number"),
 * `name="location"` (text, placeholder "Enter your location"), `name="company"` (text,
 * placeholder "Enter your company name"), `name="message"` (text, placeholder "Message"), and
 * exactly one checkbox (Copy to Self — no accessible name captured, located by role only since
 * there's just the one). A **"Get OTP"** button is the real, confirmed submit-trigger label
 * (matches the sheet).
 *
 * Grounded 2026-09-16 (2nd pass) — real `maxlength` attributes confirmed via direct attribute
 * dump: `name` 50, `email` 100, `phone` 10, `location` **100** (matches sheet), `company`
 * **100** (matches sheet), `message` **500** (matches sheet).
 *
 * **Get OTP opens a real `role="dialog"` drawer**, heading **"Verify Phone Number"** (the
 * drawer's own outer title is "OTP Verification" — two distinct headings exist, don't confuse
 * them), body text "Your 6 digits verification code is sent to {phone}" with an edit-pencil
 * icon next to the number, a 6-box visual OTP entry backed by **one real
 * `input[name="otp"]` with `maxlength="6"`** (same one-input-many-boxes pattern as
 * `CareersPage.ts`'s OTP field), and a **"Resend Code"** text control disabled behind a live
 * countdown (confirmed ~60s). **No separate Verify/Submit button was found anywhere in the
 * dialog** — likely auto-verifies once the 6th digit is entered (common pattern for this kind
 * of UI); not confirmed live because completing it risks a real backend submission (see below).
 *
 * **IMPORTANT — this is a Next.js Server Action, not a REST API call.** The Get-OTP click's
 * network request is a `POST` to the page's own URL (`/bulk-gift-cards`), not a distinct
 * `/api/...` path — confirmed via a real network capture. `CorporateFormsMock.ts`'s
 * gift-card regex patterns (matching an `/api/.../` -style path) **will not match this traffic at all** and need a
 * fundamentally different interception strategy (matching POST-to-same-page-URL, or reading
 * the `Next-Action` header) before any OTP/submit-adjacent scenario can be safely automated
 * without risking a real send. One real "Get OTP" was triggered live against a fake test
 * number (`9876543210`, not a real phone — harmless) to confirm this; verification/submission
 * was deliberately NOT attempted further.
 */
export class BulkGiftCardPage {
  constructor(private page: Page) {}

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/bulk-gift-cards`);
  }

  readonly moreMenuButton = () => this.page.getByRole('button', { name: 'More Arrow Down' });
  readonly bulkGiftCardMenuItem = () => this.page.getByText('Bulk Gift Card', { exact: true });

  readonly pageHeading = () => this.page.getByRole('heading', { name: 'Bulk Gift Cards', exact: true });
  readonly enterDetailsHeading = () => this.page.getByRole('heading', { name: 'Enter Details', exact: true });
  readonly bannerImage = () => this.page.getByRole('img').first();

  readonly nameInput = () => this.page.locator('input[name="name"]');
  readonly emailInput = () => this.page.locator('input[name="email"]');
  readonly phoneInput = () => this.page.locator('input[name="phone"]');
  readonly locationInput = () => this.page.locator('input[name="location"]');
  readonly companyInput = () => this.page.locator('input[name="company"]');
  readonly messageInput = () => this.page.locator('input[name="message"]');
  readonly copyToSelfCheckbox = () => this.page.getByRole('checkbox');

  readonly getOtpButton = () => this.page.getByRole('button', { name: 'Get OTP', exact: true });

  /** Real, grounded live 2026-09-16 — see class doc comment. */
  readonly otpDialog = () => this.page.getByRole('dialog').filter({ hasText: 'Verify Phone Number' });
  readonly otpHeading = () => this.page.getByRole('heading', { name: 'Verify Phone Number', exact: true });
  readonly otpInput = () => this.page.locator('input[name="otp"]');
  readonly resendCodeControl = () => this.page.getByText('Resend Code', { exact: true });
  readonly editPhoneNumberIcon = () => this.otpDialog().locator('button, [role="button"]').filter({ hasText: '' }).last();

  /** TODO(heal): no Verify/Submit button was found live (see class doc comment) — this may not
   * exist at all if the form auto-verifies on the 6th digit. Confirm before using. */
  readonly submitButton = () => this.page.getByRole('button', { name: /^submit$/i });
  readonly successPopupText = () => this.page.getByText(/gift card request submitted/i);
  readonly fieldError = (message: string | RegExp) => this.page.getByText(message);
}
