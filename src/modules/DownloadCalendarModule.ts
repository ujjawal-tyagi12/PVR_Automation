import type { Download, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { statSync } from 'node:fs';
import { DownloadCalendarPage } from '@pages/DownloadCalendarPage';
import { dismissPromoPopup, grantMumbaiGeolocation, UAT_BASE_URL } from '@utils/LocationHelper';
import { Logger } from '@utils/Logger';

const CALENDAR_HTML_ROUTE_PATTERN = '**/api/calendar-html';

interface CalendarDownloadResult {
  status: number;
  responseHtml: string | null;
  download: Download | null;
}

/**
 * Ticket: requirements/download-calendar.md — reconciled 2026-09-06 from the `TC_Web_196–210`
 * sheet. Grounded 2026-09-06 against UAT (`inox-uat-web.pvrinox.com`), Mumbai-All — see
 * `DownloadCalendarPage.ts`'s class doc comment for the full live-grounding trail (where the
 * control lives, the real date-picker constraints, the real `POST /api/calendar-html` contract,
 * why the downloaded PDF's content is verified via that real response instead of the PDF bytes,
 * and the real no-movie-match/API-failure findings).
 *
 * **Date selection is deliberately dynamic, not hardcoded to specific day numbers**, for every
 * scenario that doesn't need a specific real movie's release date. The sandbox's real clock keeps
 * advancing between grounding and an eventual test run, so a hardcoded "day 10" (valid "tomorrow"
 * at grounding time) could silently become a disabled past date by the time this suite actually
 * runs. `selectFirstAvailableFromDate`/`selectFirstAvailableToDate` read the picker's real
 * `disabled` attributes live and pick whatever the smallest currently-selectable day actually is —
 * only the December-anchored, real-movie-content scenarios (`TC_Web_196/202/205–207`, which need
 * the specific live "Varanasi (film)"/"King (2026 film)" release week) hardcode `25`/`31`,
 * matching the same accepted live-data-drift risk `ComingSoonModule.ts` already documents for its
 * own hardcoded movie names.
 */
export class DownloadCalendarModule {
  private readonly downloadCalendarPage: DownloadCalendarPage;

  constructor(private page: Page) {
    this.downloadCalendarPage = new DownloadCalendarPage(page);
  }

  // ---- Navigation ----

  /** Same direct-URL + geolocation + promo-dismissal pattern `ComingSoonModule.gotoComingSoon`
   * establishes — Download Calendar lives on the same `/coming-soon` page. */
  async gotoComingSoon(): Promise<void> {
    Logger.info('Opening /coming-soon on UAT with Mumbai geolocation granted');
    await grantMumbaiGeolocation(this.page);
    await this.downloadCalendarPage.goto(UAT_BASE_URL);
    await dismissPromoPopup(this.page);
    await expect(this.downloadCalendarPage.pageHeading()).toBeVisible({ timeout: 20_000 });
  }

  // ---- Coming Soon page filters (TC_Web_202 needs these BEFORE opening the dialog) ----

  async selectGenreChip(name: string): Promise<void> {
    await this.downloadCalendarPage.clickGenreChip(name);
  }

  async jumpToMonthOnMainPage(label: string): Promise<void> {
    await this.downloadCalendarPage.clickMainPageMonthTab(label);
  }

  // ---- Dialog open / layout ----

  async openDownloadDialog(): Promise<void> {
    await this.downloadCalendarPage.openDownloadDialog();
    await expect(this.downloadCalendarPage.dialog()).toBeVisible({ timeout: 10_000 });
  }

  /** DLC-002: the "From"/"To" fields are real Radix popover triggers — clicking either opens a
   * genuine calendar dialog (confirmed live via `aria-haspopup="dialog"` + a real day-grid). */
  async expectDatePickerOpensOnFromClick(): Promise<void> {
    await this.downloadCalendarPage.clickFromField();
    await expect(this.downloadCalendarPage.datePickerPopover()).toBeVisible({ timeout: 10_000 });
  }

  /**
   * DLC-014: cosmetic alignment check — same `boundingBox()`-comparison shape
   * `ComingSoonModule.expectGenreChipsAlphabetical` already uses for its own cosmetic assertion.
   *
   * BUG FIX (2026-09-06, first live run): an exact `toEqual` on the raw `y` coordinates failed on
   * a genuine sub-pixel rendering difference (`439.5` vs `439.48455810546875`) — real browser
   * layout isn't guaranteed to produce bit-identical floats for two independently-measured
   * elements even when they're visually on the same row. A small tolerance is the honest check
   * for "aligned", not pixel-perfect float equality.
   */
  async expectFromAndToFieldsAligned(): Promise<void> {
    const fromBox = await this.downloadCalendarPage.fromField().boundingBox();
    const toBox = await this.downloadCalendarPage.toField().boundingBox();
    expect(fromBox).not.toBeNull();
    expect(toBox).not.toBeNull();
    expect(Math.abs((fromBox?.y ?? 0) - (toBox?.y ?? 0))).toBeLessThan(1);
  }

  // ---- Date picker: popover navigation ----

  private async openFromDatePicker(): Promise<void> {
    await this.downloadCalendarPage.clickFromField();
    await expect(this.downloadCalendarPage.datePickerPopover()).toBeVisible({ timeout: 10_000 });
  }

  private async openToDatePicker(): Promise<void> {
    await this.downloadCalendarPage.clickToField();
    await expect(this.downloadCalendarPage.datePickerPopover()).toBeVisible({ timeout: 10_000 });
  }

  private async navigatePopoverToMonth(month: string): Promise<void> {
    await this.downloadCalendarPage.openPopoverMonthSelect();
    await this.downloadCalendarPage.selectPopoverMonthOption(month);
  }

  /** Hardcodes a specific day — only for the December-anchored real-movie scenarios (see class
   * doc comment). */
  async selectFromDate(day: number, month?: string): Promise<void> {
    await this.openFromDatePicker();
    if (month) await this.navigatePopoverToMonth(month);
    await this.downloadCalendarPage.clickPopoverDay(day);
  }

  async selectToDate(day: number, month?: string): Promise<void> {
    await this.openToDatePicker();
    if (month) await this.navigatePopoverToMonth(month);
    await this.downloadCalendarPage.clickPopoverDay(day);
  }

  /** Date-drift-safe: reads the real `disabled` attributes live and picks whatever the smallest
   * currently-selectable day actually is, rather than trusting a hardcoded date to still be valid
   * (see class doc comment). Returns the day it selected. */
  async selectFirstAvailableFromDate(): Promise<number> {
    await this.openFromDatePicker();
    const states = await this.downloadCalendarPage.getPopoverDayStates();
    const firstEnabled = states.find((cell) => !cell.disabled);
    if (!firstEnabled) throw new Error('No selectable day found in the "From" date picker.');
    await this.downloadCalendarPage.clickPopoverDay(firstEnabled.day);
    return firstEnabled.day;
  }

  /** DLC-005: real finding — the day matching the already-selected `From` date is itself
   * `disabled` in the `To` picker (`To` must be strictly after `From`), so the smallest enabled
   * day here is never the same as `From` — see `DownloadCalendarPage.ts` class doc comment. */
  async selectFirstAvailableToDate(): Promise<number> {
    await this.openToDatePicker();
    const states = await this.downloadCalendarPage.getPopoverDayStates();
    const firstEnabled = states.find((cell) => !cell.disabled);
    if (!firstEnabled) throw new Error('No selectable day found in the "To" date picker.');
    await this.downloadCalendarPage.clickPopoverDay(firstEnabled.day);
    return firstEnabled.day;
  }

  // ---- Past/future/1-year-max assertions (TC_Web_198/199) ----

  /** DLC-003: confirmed live — past days (and "today" itself) carry a real `disabled` attribute,
   * while later days in the same month don't. Asserted structurally (at least one of each, rather
   * than pinned to specific day numbers) so this stays true regardless of which real day the
   * picker opens on. */
  async expectPastDatesDisabledInFromPicker(): Promise<void> {
    await this.openFromDatePicker();
    const states = await this.downloadCalendarPage.getPopoverDayStates();
    const disabledCells = states.filter((cell) => cell.disabled);
    const enabledCells = states.filter((cell) => !cell.disabled);
    expect(disabledCells.length, 'expected at least one disabled (past/today) day cell').toBeGreaterThan(0);
    expect(enabledCells.length, 'expected at least one enabled (future) day cell').toBeGreaterThan(0);
  }

  /** DLC-004: confirmed live — the `To` picker's year select only ever offers the current real
   * year and the next one (never a third), regardless of which `From` date was chosen — the real
   * 1-year-max window is anchored to today's real date, not to `From` (see
   * `DownloadCalendarPage.ts` class doc comment). */
  async expectToPickerYearRangeCappedToOneYear(): Promise<void> {
    await this.selectFirstAvailableFromDate();
    await this.openToDatePicker();
    await this.downloadCalendarPage.openPopoverYearSelect();
    const years = await this.downloadCalendarPage.getYearListboxOptions();
    expect(years.length, `expected exactly 2 selectable years, got ${JSON.stringify(years)}`).toBe(2);
  }

  // ---- Download button state (TC_Web_201/203) ----

  async expectDownloadButtonDisabled(): Promise<void> {
    await expect(this.downloadCalendarPage.downloadButton()).toBeDisabled({ timeout: 10_000 });
  }

  async expectDownloadButtonEnabled(): Promise<void> {
    await expect(this.downloadCalendarPage.downloadButton()).toBeEnabled({ timeout: 10_000 });
  }

  // ---- Real download / real network capture ----

  /**
   * Races the real (unmocked, unless `mockCalendarApiFailure` was called first) `POST
   * /api/calendar-html` response alongside a real Playwright `download` event, then clicks
   * Download — matching this repo's established "race the event alongside the click" shape
   * (`ComingSoonModule.expectMicDeniedAlertShown`'s dialog race). A no-movie-match date range
   * (real 404) or a mocked failure both resolve the response but never fire a `download` event —
   * callers branch on `status`/`download` accordingly.
   *
   * BUG FIX (2026-09-11, live run): the real 200 response is double-wrapped —
   * `{ok, data: {statusCode, messageType, message, data: {html}}}` — one layer deeper than
   * `json?.data?.html` assumed, confirmed live via a direct response listener. Same site-wide
   * envelope convention `CitySelectionModule.ts`/`CuratedShowsModule.ts` already document for
   * their own endpoints. This made `responseHtml` always resolve to `null` on a real 200, the root
   * cause of DLC-007/010/011/012 failing on 2026-09-11.
   */
  private async performDownload(): Promise<CalendarDownloadResult> {
    const responsePromise = this.page.waitForResponse((response) => response.url().includes('/api/calendar-html'));
    const downloadPromise = this.page.waitForEvent('download', { timeout: 20_000 }).catch(() => null);
    await this.downloadCalendarPage.clickDownloadButton();
    const response = await responsePromise;
    let responseHtml: string | null = null;
    if (response.status() === 200) {
      const json = await response.json().catch(() => null);
      responseHtml = json?.data?.data?.html ?? null;
    }
    const download = await downloadPromise;
    return { status: response.status(), responseHtml, download };
  }

  /**
   * DLC-001: confirmed live — a genuine `%PDF-1.3` binary downloads (captured via a real
   * `download` event, not faked) once a valid date range is selected.
   *
   * BUG FIX (2026-09-06, first live run): originally used `selectFirstAvailable{From,To}Date`
   * (the nearest selectable near-term days) here — but that range currently has zero matching
   * movies live (the same real 404 `DLC-013` exercises deliberately), so no `download` event ever
   * fires and this always failed. The real Dec 25–31 release week (same range every other
   * real-movie-content scenario in this file uses) is needed to actually exercise "a valid range
   * produces a real download" — see class doc comment for the accepted live-data-drift risk.
   */
  async expectRealPdfDownloaded(): Promise<void> {
    await this.selectFromDate(25, 'December');
    await this.selectToDate(31);
    await this.expectDownloadButtonEnabled();
    const { download } = await this.performDownload();
    expect(download, 'expected a real Playwright download event').not.toBeNull();
    const filename = download!.suggestedFilename();
    expect(filename.endsWith('.pdf'), `expected a .pdf filename, got "${filename}"`).toBe(true);
    const path = await download!.path();
    expect(path, 'expected the download to save to a real temp path').not.toBeNull();
    const { size } = statSync(path!);
    expect(size, 'expected a non-trivial real PDF file size').toBeGreaterThan(1_000);
  }

  /**
   * DLC-005 (reinterpreted `TC_Web_200`): confirmed live — `From`/`To` cannot be the same date (the
   * `From` day is itself disabled in the `To` picker), so the Download button can never actually
   * reach an enabled "same date" state. This directly contradicts the source sheet's
   * `TC_Web_200` expectation ("select same date → Calendar downloaded successfully") — see
   * `download-calendar.md`'s Test coverage note.
   */
  async expectSameDateNotSelectableInToPicker(): Promise<void> {
    const fromDay = await this.selectFirstAvailableFromDate();
    await this.openToDatePicker();
    await expect(this.downloadCalendarPage.popoverDayCell(fromDay)).toBeDisabled({ timeout: 10_000 });
  }

  /** DLC-007 (`TC_Web_202`): applies a Coming Soon quick-genre-chip filter BEFORE opening the
   * dialog, then downloads the real Dec 25–31 release week — confirmed live the filter propagates
   * into the real request (`filter: { genre: [...] }`, a narrowed `movieIds`) and the response
   * HTML's own "Genres:" summary line and movie-card list. */
  async downloadDecemberRangeWithGenreFilterAndGetHtml(genre: string): Promise<string> {
    await this.selectGenreChip(genre);
    await this.openDownloadDialog();
    await this.selectFromDate(25, 'December');
    await this.selectToDate(31);
    const { responseHtml } = await this.performDownload();
    expect(responseHtml, 'expected a real calendar-html response body').toBeTruthy();
    return responseHtml as string;
  }

  /** DLC-010/011/012 (`TC_Web_205–207`): downloads the real, unfiltered Dec 25–31 release week and
   * returns the real `POST /api/calendar-html` response HTML — the exact content the PDF is
   * rendered from (see `DownloadCalendarPage.ts` class doc comment for why PDF-byte extraction
   * isn't viable here). */
  async downloadDecemberRangeAndGetHtml(): Promise<string> {
    await this.selectFromDate(25, 'December');
    await this.selectToDate(31);
    const { responseHtml } = await this.performDownload();
    expect(responseHtml, 'expected a real calendar-html response body').toBeTruthy();
    return responseHtml as string;
  }

  expectDownloadedContentHasHeading(html: string): void {
    expect(html).toContain('Coming Soon Movies');
  }

  expectDownloadedContentHasMovieDetails(html: string, movieName: string, genre: string, language: string): void {
    expect(html).toContain(movieName);
    expect(html).toContain(genre);
    expect(html).toContain(language);
  }

  expectDownloadedContentHasDateRange(html: string, expectedRangeText: string): void {
    expect(html).toContain(expectedRangeText);
  }

  expectDownloadedContentExcludes(html: string, text: string): void {
    expect(html).not.toContain(text);
  }

  // ---- Error / empty-state handling (TC_Web_204/208) ----

  /** DLC-009 (`TC_Web_204`): no real 5xx was reproducible live, so this mocks the real
   * `POST /api/calendar-html` endpoint via `page.route` — the same fault-injection shape
   * `MovieAlertsModule.mockSaveAlertFailure` already establishes in this repo. */
  async mockCalendarApiFailure(status = 500): Promise<void> {
    await this.page.route(CALENDAR_HTML_ROUTE_PATTERN, async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, statusCode: status, error: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' }),
        });
      } else {
        await route.continue();
      }
    });
  }

  /** DLC-009: triggers the Download click when a failure (mocked, here) is expected — doesn't
   * assert on the network result itself; the caller checks the resulting inline-error UI state. */
  async performDownloadExpectingFailure(): Promise<void> {
    await this.performDownload();
  }

  /** DLC-009: confirmed live (via the mock above) — a real inline message, "Unable to download
   * calendar. Please try again later.", renders inside the SAME dialog (which stays open), unlike
   * the real no-movie-match 404 case below. */
  async expectInlineErrorMessageShown(): Promise<void> {
    await expect(this.downloadCalendarPage.inlineErrorMessage()).toBeVisible({ timeout: 10_000 });
  }

  /** DLC-013 (`TC_Web_208`): a genuinely unmocked, real 404 from picking a near-term date range
   * with no matching movies (`NO_COMING_SOON_MOVIES_FOUND`) — the app closes the date-picker
   * dialog and opens a real, separate "No Movies Found" dialog instead. */
  async downloadNearTermRangeExpectingNoMovies(): Promise<void> {
    await this.selectFirstAvailableFromDate();
    await this.selectFirstAvailableToDate();
    const { status, download } = await this.performDownload();
    expect(status, 'expected the real no-movies-in-range 404').toBe(404);
    expect(download).toBeNull();
  }

  async expectNoMoviesFoundShown(): Promise<void> {
    await expect(this.downloadCalendarPage.noMoviesDialog()).toBeVisible({ timeout: 15_000 });
    await expect(this.downloadCalendarPage.selectAnotherDateButton()).toBeVisible();
  }

  async clickSelectAnotherDate(): Promise<void> {
    await this.downloadCalendarPage.clickSelectAnotherDate();
  }

  // ---- Repeated downloads (TC_Web_210) ----

  /**
   * DLC-015: confirmed live — the dialog auto-closes on a successful download, and reopening it
   * for a second download works cleanly (no crash, no stuck state).
   *
   * BUG WORKAROUND (2026-09-06, live-grounded): `performDownload`'s `download` event resolves as
   * soon as the browser starts the download, which can be BEFORE the app's own dialog-close
   * animation has actually finished — clicking the trigger again immediately after can silently
   * land on the still-closing dialog's overlay instead of the real trigger button (confirmed via
   * a standalone repro script: without a genuine "wait for hidden" checkpoint here, a second
   * `openDownloadDialog()` right after the first download intermittently never reopens the
   * dialog at all). `expect(...).toBeHidden()` is a real, auto-polling wait for the close
   * animation to genuinely finish — not a blind sleep — before the next attempt starts.
   */
  async expectMultipleDownloadsWorkWithoutCrash(): Promise<void> {
    for (let attempt = 1; attempt <= 2; attempt++) {
      Logger.info(`Download Calendar: attempt ${attempt}/2`);
      await this.openDownloadDialog();
      await this.selectFromDate(25, 'December');
      await this.selectToDate(31);
      const { download } = await this.performDownload();
      expect(download, `expected a real download on attempt ${attempt}`).not.toBeNull();
      await expect(this.downloadCalendarPage.dialog()).toBeHidden({ timeout: 10_000 });
    }
  }
}
