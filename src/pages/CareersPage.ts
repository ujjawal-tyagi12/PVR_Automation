import type { Page } from '@playwright/test';

/**
 * Grounded live 2026-09-10 against UAT (`/career`) via a background research agent driving
 * headless Playwright (Playwright MCP fails in this sandbox — see `pvr-inox-grounding-technique`
 * project memory).
 *
 * **Navigation:** header "More" (real name "More Arrow Down") -> `menuitem` "Career" (singular —
 * confirmed live, see `more-menu-real-labels` project memory). Real route: **`/career`**,
 * directly `goto`-able.
 *
 * **No distinct "Company Information" section exists** — real headings in DOM order are "Why PVR
 * INOX?", "Explore Departments", "Connect With Us", "PVR INOX Ltd" (h3, address card), "Find us
 * on". The "Why PVR INOX?" body text is a real, confirmed CMS data bug: the same paragraph is
 * repeated 5 times verbatim, the last copy truncated mid-word ("...At PVR Ihghg") — asserted as
 * real content, not "fixed" in this Page object.
 *
 * **Social links** are real `<a target="_blank">` elements with NO accessible name (icon-only) —
 * located by `href` substring, not role+name. **Map**: a real `<iframe title="PVR INOX Office
 * Location">` — its embedded coordinates (28.6066, 77.359, Delhi/NCR) don't match the Andheri,
 * Mumbai address text next to it, a real data-quality bug worth documenting, not fixing.
 *
 * **Only ONE department exists on this environment: "Sales Marketing", with 0 active jobs** —
 * confirmed via the page's own Next.js RSC payload. This is a hard data ceiling: there is no live
 * example anywhere on UAT of a populated job listing or a real Job Detail page. Clicking the
 * department card does **not** navigate to a job-listing page (the sheet's assumption) — it opens
 * the "Apply for the role" `role="dialog"` directly, in place, with **no URL change at all**
 * (confirmed: `page.url()` stays `/career`). The job-listing route itself was still confirmed by
 * direct-URL probing: **`/career/jobs?departmentId={id}`**, heading literally "Department" (does
 * NOT interpolate the real department name — a real display bug), sub-heading "Open Positions",
 * empty-state text **"No open positions in this department."** No job-detail route could be
 * found (`/career/job/1` etc. all return real Next.js 404s) since there is no real job to click
 * through to.
 *
 * **Application form** (inside the dialog): Name/Phone/Email are real `getByRole('textbox')`
 * fields; **Department is genuinely `readonly` AND `disabled`** (`.fill()` on it times out —
 * confirmed non-editable). Phone has a real hard `maxlength="10"` (an 11th digit is physically
 * untypeable) and strips non-digit characters via a JS filter. The dialog's close (X) button has
 * NO accessible name (`data-slot="drawer-close"`, an `aria-hidden` icon) — located via that
 * attribute, not role+name. Resume is a real `<input type="file" accept=".pdf,.doc,.docx">`;
 * selecting a file writes its name into a separate readonly textbox ("Choose a PDF or DOC file")
 * — reading that textbox's `.inputValue()` confirms a real selection (its value never appears in
 * `dialog.innerText()`, since `innerText()` doesn't include `<input>` values).
 *
 * **Submit -> OTP -> success is a real, fully separate flow from login**: Submit first uploads
 * the resume (`POST /api/media/file-upload-guest`), then sends OTP via a **dedicated
 * `/api/career/send-otp`** (not the login flow's `/api/send-phone-otp`). The confirmed real login
 * OTP bypass code (`config.otpBypassCode`) **also works here** — `/api/career/verify-otp` returns
 * a real `200` for it — so the full OTP round trip and the final `/api/career/job-request` submit
 * are genuinely automatable end-to-end, not admin-state-blocked as the ticket originally
 * feared. The OTP screen has a single OTP textbox (not 6 boxes), a "Go back" button, and a
 * disabled "Resend Code" button during its countdown. The success dialog's real heading is
 * "Resume Submitted" (no exclamation mark) with an "Ok" button.
 *
 * **Resume-upload-failure has no visible error** (confirmed via a real `route.fulfill({status:
 * 500})` on `/api/media/file-upload-guest` at Submit time): the dialog just stays open silently —
 * no `role="alert"`/`role="status"` text, no visible message anywhere. Same silent-failure
 * pattern already found in Investor Section's broken-document handling.
 *
 * **Real mobile-only layout bug** (confirmed live, reproduced 3x): at a 375px viewport, the "PVR
 * INOX Ltd" address/map card collapses to an ~11px-wide sliver, effectively hiding the address
 * and map. Tablet (768px) has no such issue. Noted as a real finding; not strictly pixel-asserted
 * here (out of proportion for this suite's established testing depth).
 */
export class CareersPage {
  constructor(private page: Page) {}

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/career`);
  }

  /** Real route confirmed live via direct-URL probing — reachable even though the real UI never
   * links to it for the only (zero-job) department (see class doc comment). */
  async gotoJobListing(baseUrl: string, departmentId: string): Promise<void> {
    await this.page.goto(`${baseUrl}/career/jobs?departmentId=${departmentId}`);
  }

  readonly moreMenuButton = () => this.page.getByRole('button', { name: /^more/i });
  readonly careerMenuItem = () => this.page.getByRole('menuitem', { name: 'Career', exact: true });

  readonly heading = (name: string | RegExp) => this.page.getByRole('heading', { name });
  readonly whyPvrInoxBodyText = () => this.page.getByText(/at pvr inox, we want you to be part of our open and lively environment/i).first();
  readonly bannerImage = () => this.page.getByRole('img', { name: 'Career', exact: true });
  readonly socialLink = (hrefSubstring: string) => this.page.locator(`a[href*="${hrefSubstring}"]`);
  readonly addressText = (address: string) => this.page.getByText(address, { exact: false });
  readonly mapIframe = () => this.page.locator('iframe[title="PVR INOX Office Location"]');

  readonly departmentCard = (name: string) => this.page.getByText(name, { exact: false });
  readonly departmentImage = (name: string) => this.departmentCard(name).locator('xpath=ancestor::button[1]').locator('img').first();

  readonly dialog = () => this.page.locator('[role="dialog"]');
  readonly dialogCloseButton = () => this.dialog().locator('[data-slot="drawer-close"]');

  readonly nameInput = () => this.dialog().getByRole('textbox', { name: 'Full name' });
  readonly phoneInput = () => this.dialog().getByRole('textbox', { name: 'Phone number' });
  readonly emailInput = () => this.dialog().getByRole('textbox', { name: 'Email' });
  readonly departmentInput = () => this.dialog().getByRole('textbox', { name: 'Department' });
  readonly resumeFilenameInput = () => this.dialog().getByRole('textbox', { name: /choose a pdf or doc file/i });
  readonly uploadResumeButton = () => this.dialog().getByRole('button', { name: /upload resume/i });
  readonly submitButton = () => this.dialog().getByRole('button', { name: /^submit$/i });

  readonly fieldError = (message: string) => this.dialog().getByText(message, { exact: true });

  readonly jobListingHeading = () => this.page.getByRole('heading', { name: 'Open Positions' });
  readonly noOpenPositionsText = () => this.page.getByText('No open positions in this department.');

  readonly otpHeading = () => this.page.getByRole('heading', { name: 'Verify Phone Number' });
  readonly otpInput = () => this.dialog().getByRole('textbox').first();
  readonly otpGoBackButton = () => this.dialog().getByRole('button', { name: /go back/i });
  readonly otpResendButton = () => this.dialog().getByRole('button', { name: /resend code/i });

  readonly successHeading = () => this.page.getByRole('heading', { name: 'Resume Submitted', exact: true });
  readonly successOkButton = () => this.dialog().getByRole('button', { name: /^ok$/i });
}
