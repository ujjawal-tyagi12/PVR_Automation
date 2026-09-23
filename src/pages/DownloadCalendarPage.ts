import type { Page } from '@playwright/test';

/**
 * Grounded 2026-09-06 against UAT (`inox-uat-web.pvrinox.com`), Mumbai-All, via headless
 * Playwright driven from Bash/Node (Playwright MCP's interactive browser tool does not launch in
 * this sandbox — see the `pvr-inox-grounding-technique` project memory; scratchpad
 * `ground-download-calendar-*.js` scripts hold the raw diagnostics this comment summarizes).
 *
 * **"Download Calendar" is a real control ON the Coming Soon page itself** (`/coming-soon`), not a
 * separate route — confirmed live: a "Download Calendar" button sits beside the search bar, above
 * the Year/Month/Week filter bar. This is a single logical component (one dialog-driven workflow),
 * so it gets its own Page object per this repo's "one Page per logical screen/component" rule
 * rather than being bolted onto `ComingSoonPage.ts` — but it is entirely self-contained (its own
 * `goto`, since every locator/action it needs lives in this one dialog's DOM), so
 * `DownloadCalendarModule` does not need to compose `ComingSoonPage`/`ComingSoonModule` at all.
 *
 * **The trigger button has the same "icon alt + label" accessible-name quirk** `ComingSoonPage.ts`
 * documents for its own "Filter" trigger — the img's `alt="Download Icon"` merges with the
 * `<span>Download Calendar</span>` text into a combined accessible name, so
 * `getByRole('button', { name: 'Download Calendar' })` matches nothing (confirmed live via a raw
 * `outerHTML` dump). Targeted instead via `locator('button').filter({ hasText: 'Download Calendar' })`.
 *
 * **Clicking the trigger opens a real Radix dialog** ("Download Calendar" heading, "Select dates to
 * download your calendar" description, From/To date fields, a "Download" button — confirmed via a
 * full dialog `outerHTML` dump). Both `From` and `To` are themselves Radix popover triggers
 * (`aria-haspopup="dialog"`), so clicking one opens a SECOND `role="dialog"` element (a real
 * month/year-select + day-grid calendar) stacked on top of the first — both dialogs coexist in the
 * DOM at once, disambiguated here via `hasText`/`hasNotText` on the fixed "Select dates to download
 * your calendar" description text (the same disambiguation shape `ComingSoonPage.filterDialog`
 * already uses for its own modal).
 *
 * **Real, live-grounded date-picker behavior**:
 * - **Past dates (and "today" itself) are disabled** (`disabled` attribute, confirmed via a DOM
 *   dump of every day cell) — with the real UAT server date at grounding time, the first
 *   *selectable* day was tomorrow, not today.
 * - **The 1-year max is anchored to TODAY, not to the selected `From` date** — confirmed live: with
 *   `From` set to a date well within the current year, the `To` picker's year `<select>` only ever
 *   offers the current year and the next one, and the cutoff day disabled inside that next year is
 *   exactly 365 days after today's real date (not 365 days after the chosen `From` date).
 * - **`To` cannot equal `From`** — a real, live-grounded finding that CONTRADICTS the source
 *   sheet's `TC_Web_200` ("select same date → Calendar downloaded successfully"): in the `To`
 *   picker, the day matching the already-selected `From` date is itself `disabled` (confirmed via
 *   `element.disabled` on that exact cell) — the real constraint is `To` strictly after `From`, not
 *   `To >= From`. `DownloadCalendarModule`/the ticket reinterpret this scenario around the real
 *   behavior rather than the sheet's unverified assumption.
 * - **The "Download" button is a native `disabled` `<button>`** until both dates are chosen — this
 *   IS the real "validation" mechanism (`TC_Web_201`/`TC_Web_203`); there is no separate inline
 *   validation message for the no-dates-selected case.
 *
 * **The real download is a genuine client-rendered PDF, not a server-hosted file** — confirmed via
 * a captured `download` event (`pvr-calendar-{date}.pdf`, a real `%PDF-1.3` binary, 2 pages). The
 * page first calls `POST /api/calendar-html` with `{ lat, long, fromDate, toDate, theme, movieIds,
 * cityId, filter? }` (a genuine, unmocked network call, confirmed via full request/response
 * capture), which returns `{ data: { html: "<!DOCTYPE html>..." } }` — a complete, styled HTML
 * document (heading "Coming Soon Movies", a `Time Period:` line with the selected range, one
 * `.movie-card` per matching movie with name/genre/language) that the client then renders
 * client-side into the downloaded PDF (almost certainly via an `html2canvas`+`jsPDF`-style
 * pipeline, given the resulting PDF embeds `/Font`+`/Image` but NO extractable text layer — see
 * below).
 *
 * **The downloaded PDF has NO extractable text layer** — confirmed by feeding a real captured
 * download through both `pdf-parse` and poppler's industry-standard `pdftotext`: both return
 * completely empty text despite the file being a genuine, well-formed 2-page PDF with real
 * `/Font`/`BT`/`Tj` operators (a known limitation of client-rendered PDFs that embed subset-font
 * glyphs without a `ToUnicode` CMap). So `DownloadCalendarModule`'s PDF-*content* assertions
 * (heading/movie-details/date-range — `TC_Web_205–207`) verify the real, unmocked
 * `POST /api/calendar-html` response body instead of the PDF bytes — that response IS the exact
 * HTML the PDF is rendered from, captured live, not mocked; only the binary-PDF-download itself
 * (`TC_Web_196`) is verified via the real `download` event/file.
 *
 * **A genre chip filter selected on the Coming Soon page BEFORE opening the dialog propagates into
 * the download** — confirmed live: selecting the "Musical" quick-genre chip narrows the request to
 * `movieIds: ["31781"]` and adds `"filter":{"genre":["Musical"]}`, and the response HTML's own
 * "Genres:" summary line changes from "All" to "Musical" with only the matching movie's card
 * included (`TC_Web_202`).
 *
 * **A date range with no matching movies returns a real `404`** — confirmed live:
 * `{"success":false,"statusCode":404,"error":"NO_COMING_SOON_MOVIES_FOUND","message":"No coming
 * soon movies found."}` — and the app closes the date-picker dialog and opens a SEPARATE, real
 * "No Movies Found" dialog ("Select another date to continue browsing movies" + a "Select Another
 * Date" button), confirmed via a full-page screenshot (`TC_Web_208`).
 *
 * **A genuine backend failure (mocked via `page.route`, since no real 5xx was reproducible live)
 * shows a distinct inline error** — `page.route('**\/api/calendar-html', ...)` fulfilling a `500`
 * keeps the SAME date-picker dialog open (unlike the real 404/no-movies case above) and renders a
 * real inline message, "Unable to download calendar. Please try again later.", just above the
 * Download button (`TC_Web_204`) — confirmed via a full dialog `innerText` dump after the mocked
 * click.
 */
export class DownloadCalendarPage {
  constructor(private page: Page) {}

  // Entry point (this control lives on the Coming Soon page itself).
  readonly pageHeading = () => this.page.getByRole('heading', { name: 'Coming Soon', exact: true });
  readonly downloadCalendarTrigger = () => this.page.locator('button').filter({ hasText: 'Download Calendar' }).first();

  // Reused from the Coming Soon page's own real controls (see class doc comment — this Page is
  // intentionally self-contained rather than composing `ComingSoonPage`).
  readonly genreChip = (name: string) => this.page.getByRole('button', { name, exact: true });
  readonly mainPageMonthTab = (label: string) => this.page.getByRole('button', { name: label, exact: true });

  // Main "Download Calendar" dialog (disambiguated from the date-picker popover dialog below via
  // its fixed description text).
  readonly dialog = () => this.page.getByRole('dialog').filter({ hasText: 'Select dates to download your calendar' });
  readonly fromField = () => this.dialog().getByText('From', { exact: true });
  readonly toField = () => this.dialog().getByText('To', { exact: true });
  readonly downloadButton = () => this.dialog().getByRole('button', { name: 'Download', exact: true });
  readonly inlineErrorMessage = () => this.dialog().getByText('Unable to download calendar. Please try again later.', { exact: true });

  // Date-picker popover (a second, separate `role="dialog"` opened by clicking From/To — see class
  // doc comment for why `hasNotText` is the reliable disambiguator here). BUG WORKAROUND
  // (2026-09-06, live-grounded): Radix keeps the just-closed popover (e.g. the "From" one) in the
  // DOM with `data-state="closed"` for its fade-out animation while the next popover (e.g. "To")
  // is already open with `data-state="open"` — briefly leaving TWO elements matching
  // `hasNotText`, a strict-mode violation. `[data-state="open"]` narrows to the one actually
  // showing.
  readonly datePickerPopover = () =>
    this.page.locator('[role="dialog"][data-state="open"]').filter({ hasNotText: 'Select dates to download your calendar' });
  readonly popoverMonthSelect = () =>
    this.datePickerPopover()
      .locator('button')
      .filter({ hasText: /^(January|February|March|April|May|June|July|August|September|October|November|December)$/ });
  readonly popoverYearSelect = () => this.datePickerPopover().locator('button').filter({ hasText: /^\d{4}$/ });
  readonly popoverDayCell = (day: number) =>
    this.datePickerPopover()
      .locator('button')
      .filter({ hasText: new RegExp(`^${day}$`) })
      .first();
  readonly listboxOption = (name: string) => this.page.getByRole('listbox').getByRole('option', { name, exact: true });

  // Real no-match empty state (a separate dialog, TC_Web_208 — see class doc comment).
  readonly noMoviesDialog = () => this.page.getByRole('dialog').filter({ hasText: 'No Movies Found' });
  readonly selectAnotherDateButton = () => this.noMoviesDialog().getByRole('button', { name: 'Select Another Date', exact: true });

  async goto(baseUrl: string): Promise<void> {
    await this.page.goto(`${baseUrl}/coming-soon`);
  }

  async clickMainPageMonthTab(label: string): Promise<void> {
    await this.mainPageMonthTab(label).click({ force: true });
  }

  async clickGenreChip(name: string): Promise<void> {
    await this.genreChip(name).click({ force: true });
  }

  async openDownloadDialog(): Promise<void> {
    await this.downloadCalendarTrigger().scrollIntoViewIfNeeded();
    await this.downloadCalendarTrigger().click({ force: true });
  }

  async clickFromField(): Promise<void> {
    await this.fromField().click({ force: true });
  }

  async clickToField(): Promise<void> {
    await this.toField().click({ force: true });
  }

  async openPopoverMonthSelect(): Promise<void> {
    await this.popoverMonthSelect().click({ force: true });
  }

  async selectPopoverMonthOption(month: string): Promise<void> {
    await this.listboxOption(month).click({ force: true });
  }

  async openPopoverYearSelect(): Promise<void> {
    await this.popoverYearSelect().click({ force: true });
  }

  async selectPopoverYearOption(year: string): Promise<void> {
    await this.listboxOption(year).click({ force: true });
  }

  /** Reads the year `<select>`'s real listbox options (e.g. `['2026', '2027']`) — used to verify
   * the real 1-year-max window without hardcoding a specific year (see class doc comment). */
  async getYearListboxOptions(): Promise<string[]> {
    return this.page.getByRole('listbox').getByRole('option').allInnerTexts();
  }

  async clickPopoverDay(day: number): Promise<void> {
    await this.popoverDayCell(day).click({ force: true, timeout: 8_000 });
  }

  /**
   * Reads every day-number cell's real `disabled` state directly from the DOM (not accessible-name
   * based — see class doc comment on why `getByRole` alone is unreliable for date-range
   * relationships here). Used to assert the real past/future split and to dynamically pick a
   * "first selectable day" without hardcoding a specific date that could drift out of validity as
   * real time passes (see `DownloadCalendarModule`'s own doc comment for why that matters).
   */
  async getPopoverDayStates(): Promise<Array<{ day: number; disabled: boolean }>> {
    /* eslint-disable @typescript-eslint/no-explicit-any -- runs in the browser (no DOM lib
     * configured for this Node project), matching `ComingSoonModule`'s own `any`-cast shape for
     * `navigator`/`window` access. */
    return this.datePickerPopover().evaluate((el: any) =>
      Array.from(el.querySelectorAll('button'))
        .map((button: any) => ({ day: Number(button.textContent?.trim()), disabled: Boolean(button.disabled) }))
        .filter((cell: { day: number; disabled: boolean }) => Number.isInteger(cell.day) && cell.day > 0 && cell.day <= 31),
    );
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }

  async clickDownloadButton(): Promise<void> {
    await this.downloadButton().click({ force: true });
  }

  async clickSelectAnotherDate(): Promise<void> {
    await this.selectAnotherDateButton().click({ force: true });
  }
}
