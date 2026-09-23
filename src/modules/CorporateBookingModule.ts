import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { CorporateBookingPage } from '@pages/CorporateBookingPage';
import { dismissPromoPopup, grantMumbaiGeolocation, UAT_BASE_URL } from '@utils/LocationHelper';
import { mockCorporateFormSubmission, type CapturedSubmission } from '@utils/CorporateFormsMock';
import { Logger } from '@utils/Logger';

export class CorporateBookingModule {
  private readonly corporateBookingPage: CorporateBookingPage;
  readonly capturedSubmissions: CapturedSubmission[] = [];

  constructor(private page: Page) {
    this.corporateBookingPage = new CorporateBookingPage(page);
  }

  /** Direct-URL navigation — real route confirmed live, matches every other module's shortcut
   * over clicking through the More menu on every test. */
  async gotoCorporateBooking(): Promise<void> {
    Logger.info('Opening /corporate-booking on UAT with Mumbai geolocation granted');
    await grantMumbaiGeolocation(this.page);
    await mockCorporateFormSubmission(this.page, 'corporate-booking', this.capturedSubmissions);
    await this.corporateBookingPage.goto(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
    await expect(this.corporateBookingPage.pageHeading()).toBeVisible({ timeout: 20_000 });
  }

  /** Real navigation path for CB-001/002 specifically — via the header "More" menu (real
   * accessible name "More Arrow Down"). */
  async gotoViaMoreMenu(): Promise<void> {
    await grantMumbaiGeolocation(this.page);
    await this.page.goto(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
    await this.corporateBookingPage.moreMenuButton().click();
    await expect(this.corporateBookingPage.corporateBookingMenuItem()).toBeVisible({ timeout: 10_000 });
  }

  async clickCorporateBookingMenuItem(): Promise<void> {
    await this.corporateBookingPage.corporateBookingMenuItem().click();
    await expect(this.corporateBookingPage.pageHeading()).toBeVisible({ timeout: 20_000 });
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.corporateBookingPage.pageHeading()).toBeVisible();
    await expect(this.corporateBookingPage.stepHeading('Enter Booking Details')).toBeVisible();
  }

  async expectBannerVisible(): Promise<void> {
    await expect(this.corporateBookingPage.bannerImage()).toBeVisible();
  }

  // ---- City ----
  async openCityDropdown(): Promise<void> {
    await this.corporateBookingPage.cityFieldTrigger().click();
  }

  async searchCity(query: string): Promise<void> {
    await this.corporateBookingPage.citySearchInput().fill(query);
  }

  async selectCity(name: string): Promise<void> {
    await this.corporateBookingPage.cityOption(name).click();
  }

  async expectCityOptionVisible(name: string): Promise<void> {
    await expect(this.corporateBookingPage.cityOption(name)).toBeVisible();
  }

  /** The form's own City field starts unset regardless of the header/geolocation city — real,
   * confirmed live: Cinema (and likely Date/movie rendering) has nothing to show until this is
   * explicitly selected. Required before any Cinema/Date/movie-tile interaction. */
  async selectCityOnForm(city = 'Mumbai-All', query = 'mum'): Promise<void> {
    await this.openCityDropdown();
    await this.searchCity(query);
    await this.selectCity(city);
  }

  // ---- Cinema ----
  async openCinemaDropdown(): Promise<void> {
    await this.corporateBookingPage.cinemaFieldTrigger().click();
  }

  async selectFirstCinema(): Promise<void> {
    await this.corporateBookingPage.cinemaOption(/./).first().click();
  }

  async expectCinemaOptionsVisible(): Promise<void> {
    await expect(this.corporateBookingPage.cinemaOption(/./).first()).toBeVisible();
  }

  /** CB-011: corrected 2026-09-17 — the Cinema dropdown has its own real "Search cinema…" input
   * (confirmed live via screenshot), same shape as City's search — see
   * CorporateBookingPage.cinemaSearchInput's doc comment for the earlier wrong "confirmed absent"
   * inference this replaces. */
  async searchCinema(query: string): Promise<void> {
    await this.corporateBookingPage.cinemaSearchInput().fill(query);
  }

  // ---- Date ----
  async openDatePicker(): Promise<void> {
    await this.corporateBookingPage.dateFieldButton().click();
  }

  /** Picks the first selectable day cell whose accessible name is a real weekday/date string
   * (real cells look like "Thursday, October 1st,") — avoids hardcoding a specific date. */
  /** DOM order puts past/disabled dates before the real enabled ones — `.first()` alone hangs
   * waiting for a disabled cell to become actionable (confirmed live). Iterates to the first
   * genuinely enabled cell instead. */
  async selectFirstAvailableDate(): Promise<void> {
    const cells = this.corporateBookingPage.dateCell(/^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday),/);
    const count = await cells.count();
    for (let i = 0; i < count; i++) {
      const cell = cells.nth(i);
      if (await cell.isEnabled()) {
        await cell.click();
        return;
      }
    }
    throw new Error('No enabled date cell found in the calendar popover');
  }

  // ---- Movie Type / movie selection ----
  async openMovieTypeDropdown(): Promise<void> {
    await this.corporateBookingPage.movieTypeFieldTrigger().click();
  }

  async selectMovieType(value: 'Now Showing' | 'Others'): Promise<void> {
    await this.corporateBookingPage.movieTypeOption(value).click();
  }

  async expectMovieTypeOptionVisible(value: 'Now Showing' | 'Others'): Promise<void> {
    await expect(this.corporateBookingPage.movieTypeOption(value)).toBeVisible();
  }

  async selectFirstMovieTile(): Promise<void> {
    await this.corporateBookingPage.firstMovieTile().click();
  }

  // ---- Preferred Show Time ----
  async openShowTimeDropdown(): Promise<void> {
    await this.corporateBookingPage.showTimeFieldTrigger().click();
  }

  async selectFirstShowTime(): Promise<void> {
    await this.corporateBookingPage.showTimeOption(/./).first().click();
  }

  // ---- Seats / requirements ----
  async fillNumberOfSeats(value: string): Promise<void> {
    await this.corporateBookingPage.numberOfSeatsInput().fill(value);
  }

  async expectNumberOfSeatsValue(expected: string): Promise<void> {
    await expect(this.corporateBookingPage.numberOfSeatsInput()).toHaveValue(expected);
  }

  async fillOtherRequirements(value: string): Promise<void> {
    await this.corporateBookingPage.otherRequirementsInput().fill(value);
  }

  async expectOtherRequirementsLength(expectedLength: number): Promise<void> {
    const value = await this.corporateBookingPage.otherRequirementsInput().inputValue();
    expect(value.length).toBe(expectedLength);
  }

  // ---- F&B Requirements (step 1) ----
  async openFbRequirementsDropdown(): Promise<void> {
    await this.corporateBookingPage.fbRequirementsFieldTrigger().click();
  }

  async selectFbRequirement(value: 'Yes' | 'No'): Promise<void> {
    await this.corporateBookingPage.fbRequirementsOption(value).click();
  }

  // ---- Next / step 2 contact fields ----
  async clickNext(): Promise<void> {
    await this.corporateBookingPage.nextButton().click();
  }

  async fillContactDetails(name: string, email: string, phone: string): Promise<void> {
    await this.corporateBookingPage.nameInput().fill(name);
    await this.corporateBookingPage.emailInput().fill(email);
    await this.corporateBookingPage.phoneInput().fill(phone);
  }

  /**
   * CB-021/022/023: confirmed live (2026-09-17), twice, with a freshly-registered account
   * (name/email/phone all genuinely set on the account) — Name/Email/Phone all render EMPTY on
   * reaching step 2, not prefilled from the logged-in account. Same real finding as
   * `BulkGiftCardModule.expectContactFieldsEmpty` — see its doc comment for the full grounding
   * trail (what looked like prefill during manual testing traced to browser-native autofill, not
   * a site behavior).
   */
  async expectContactFieldsEmpty(): Promise<void> {
    await expect(this.corporateBookingPage.nameInput()).toHaveValue('');
    await expect(this.corporateBookingPage.emailInput()).toHaveValue('');
    await expect(this.corporateBookingPage.phoneInput()).toHaveValue('');
  }

  async checkCopyToSelf(): Promise<void> {
    await this.corporateBookingPage.copyToSelfCheckbox().check();
  }

  async expectCopyToSelfChecked(): Promise<void> {
    await expect(this.corporateBookingPage.copyToSelfCheckbox()).toBeChecked();
  }

  /** Fills a full, valid step-1 form and advances to step 2 (Enter Personal Details), leaving
   * Name/Email/Phone untouched — reusable precondition for CB-034/035/036's validation-message
   * scenarios, which each need to control those fields themselves. */
  async fillValidStep1AndReachStep2(): Promise<void> {
    await this.selectCityOnForm();
    await this.openCinemaDropdown();
    await this.selectFirstCinema();
    await this.openDatePicker();
    await this.selectFirstAvailableDate();
    await this.selectFirstMovieTile();
    await this.openShowTimeDropdown();
    await this.selectFirstShowTime();
    await this.fillNumberOfSeats('100');
    await this.fillOtherRequirements('Automated test booking request');
    await this.clickNext();
  }

  /** Fills a full, valid step-1 + step-2 form up to (but NOT including) Get OTP — reusable
   * precondition for the OTP-screen scenarios. */
  async fillFullValidBookingForm(): Promise<void> {
    await this.fillValidStep1AndReachStep2();
    await this.fillContactDetails('Automation Test', 'automation.test@example.com', '9876543210');
  }

  async clickGetOtp(): Promise<void> {
    await this.corporateBookingPage.getOtpButton().click();
  }

  /** Real, grounded: confirms the real OTP screen opens. Deliberately stops here — does NOT
   * fill a real OTP code. Confirmed live (via a real, accidental full submission during
   * grounding) that this form has NO separate Verify/Submit button — the OTP auto-verifies
   * AND appears to auto-submit the booking the moment a valid code is entered. Filling a real
   * code here would risk a real backend submission with a real recipient email — see
   * CorporateBookingPage.ts's class doc comment and project memory
   * `shared-environment-read-only`. */
  async expectOtpScreenVisible(): Promise<void> {
    await expect(this.corporateBookingPage.otpHeading()).toBeVisible({ timeout: 15_000 });
  }

  async expectSuccessPopup(): Promise<void> {
    await expect(this.corporateBookingPage.successPopupText()).toBeVisible({ timeout: 15_000 });
  }

  async expectFieldError(message: string | RegExp): Promise<void> {
    await expect(this.corporateBookingPage.fieldError(message)).toBeVisible();
  }

  async expectSubmissionRecipientMapping(): Promise<void> {
    expect(this.capturedSubmissions.length).toBeGreaterThan(0);
  }
}
