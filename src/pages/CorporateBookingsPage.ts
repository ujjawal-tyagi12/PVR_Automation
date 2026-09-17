import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/corporate-booking (direct Playwright probe,
 * 2026-09-04) — a real, public "Exclusive Corporate Screenings" booking-request form. No admin
 * report of submitted requests, no per-Brand/Country banner-management screen, and no
 * filter/sort/export/edit control exist anywhere on this app — checked directly, not assumed.
 */
export class CorporateBookingsPage {
  constructor(private page: Page) {}

  pageHeading = () => this.page.getByRole('heading', { name: 'Exclusive Corporate Screenings', level: 1 });
  bookingImage = () => this.page.getByRole('img', { name: 'Corporate Booking' });
  detailsHeading = () => this.page.getByRole('heading', { name: 'Enter Booking Details', level: 2 });
  // These are custom dropdowns without a programmatically-associated accessible name — their
  // "City* Select…" text is the rendered value, not the accessible name, so they are matched by
  // visible text instead of role name (confirmed live, 2026-09-04).
  cityCombobox = () => this.page.getByRole('combobox').filter({ hasText: /^city/i });
  cinemaCombobox = () => this.page.getByRole('combobox').filter({ hasText: /^cinema/i });
  dateButton = () => this.page.getByRole('button', { name: /^date/i });
  movieTypeCombobox = () => this.page.getByRole('combobox').filter({ hasText: /movie type/i });
  showTimeCombobox = () => this.page.getByRole('combobox').filter({ hasText: /preferred show time/i });
  seatsInput = () => this.page.getByPlaceholder('50-999');
  fnbCombobox = () => this.page.getByRole('combobox').filter({ hasText: /f&b requirements/i });
  otherRequirementsInput = () => this.page.getByPlaceholder('Other requirements');
  nextButton = () => this.page.getByRole('button', { name: 'Next' });

  // Admin-only controls asserted absent — none exist on this real, public request form.
  reportTable = () => this.page.getByRole('table');
  filterButton = () => this.page.getByRole('button', { name: /^filter$/i });
  exportCsvButton = () => this.page.getByRole('button', { name: /export csv/i });
  addButton = () => this.page.getByRole('button', { name: /^add$/i });
  deleteButton = () => this.page.getByRole('button', { name: /^delete$/i });
  fileUploadInput = () => this.page.locator('input[type="file"]');

  async goto(): Promise<void> {
    await this.page.goto('/corporate-booking');
  }
}
