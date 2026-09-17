import { Page } from '@playwright/test';

/**
 * Grounded against the live app at BASE_URL/food?tab=book-with-ticket (direct Playwright probe,
 * 2026-09-10). This is the real, public "Book with Ticket" tab on the Food page — the in-cinema
 * ordering surface tied to an active ticket booking, distinct from the "Order Anytime" flow
 * grounded in food-category-management.spec.ts/food-items-management.spec.ts. Real banner
 * artwork and the "Book with Ticket"/"Order Anytime" toggle are confirmed live; without an
 * active booking it prompts "Login to view your ticket bookings" — confirmed live, not assumed.
 * No admin static-content edit form (Title/Sub-Title/Description/Image, with validation) exists
 * anywhere on this app.
 */
export class InCinemaFoodSectionPage {
  constructor(private page: Page) {}

  bookWithTicketTab = () => this.page.getByRole('button', { name: 'Book with Ticket' });
  orderAnytimeTab = () => this.page.getByRole('button', { name: 'Order Anytime' });
  loginPromptButton = () => this.page.getByRole('button', { name: /login to view your ticket bookings/i });
  bannerImage = () => this.page.getByRole('img', { name: /banner/i });

  // Admin-only controls asserted absent — no edit form exists on this public page.
  titleField = () => this.page.getByLabel(/^title$/i);
  subTitleField = () => this.page.getByLabel(/^sub-title$/i);
  descriptionField = () => this.page.getByLabel(/^description$/i);
  imageUploadInput = () => this.page.locator('input[type="file"]');
  saveButton = () => this.page.getByRole('button', { name: /^save$/i });

  async goto(): Promise<void> {
    await this.page.goto('/food?tab=book-with-ticket');
  }
}
