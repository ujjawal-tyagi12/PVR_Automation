import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/feedback (direct Playwright probe, 2026-09-04) — a
 * real, public "Customer Experience" page: a feedback form plus a static Contact Us block
 * (email/phone/WhatsApp/timings). No admin table of per-Brand/Country contact combinations
 * (Serial No./Email/Phone/WhatsApp/Timings/Operating Hours/Brand/Country/Last Edited On per
 * TestData/TestMd/contact-information.md), no Edit form, and no Add/Delete controls exist
 * anywhere on this app — checked directly, not assumed.
 */
export class ContactInformationPage {
  constructor(private page: Page) {}

  pageHeading = () => this.page.getByRole('heading', { name: 'Customer Experience', level: 1 });
  nameInput = () => this.page.getByRole('textbox', { name: /enter your name/i });
  phoneInput = () => this.page.getByRole('textbox', { name: /enter phone number/i });
  emailInput = () => this.page.getByRole('textbox', { name: /enter your email/i });
  feedbackTypeCombobox = () => this.page.getByRole('combobox', { name: /feedback type/i });
  getOtpButton = () => this.page.getByRole('button', { name: 'Get OTP' });

  contactUsHeading = () => this.page.getByRole('heading', { name: 'Contact Us', level: 2 });
  emailLink = () => this.page.getByRole('link', { name: /feedback@pvrinox\.com/i });
  phoneLink = () => this.page.getByRole('link', { name: /\+91-8800900009/i });
  whatsappLink = () => this.page.getByRole('link', { name: /whatsapp/i });
  timingsText = () => this.page.getByText(/contact centre timings/i);

  // Admin-only controls asserted absent — none exist on this real, public, single static block.
  addButton = () => this.page.getByRole('button', { name: /^add$/i });
  deleteButton = () => this.page.getByRole('button', { name: /^delete$/i });
  editButton = () => this.page.getByRole('button', { name: /^edit$/i });
  brandCountryTable = () => this.page.getByRole('table');
  lastEditedOnText = () => this.page.getByText(/last edited on/i);

  async goto(): Promise<void> {
    await this.page.goto('/feedback');
  }
}
