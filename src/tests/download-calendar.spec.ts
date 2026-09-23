import { test } from '@fixtures/index';

/**
 * Ticket: requirements/download-calendar.md — created 2026-09-06 from the `TC_Web_196–210` sheet
 * (no prior ticket existed for this module — see the ticket's own Source section). Grounded
 * 2026-09-06 against UAT (`inox-uat-web.pvrinox.com`), Mumbai-All, via headless Playwright driven
 * from Bash/Node — Playwright MCP's interactive browser tool does not launch in this sandbox (see
 * the `pvr-inox-grounding-technique` project memory). Scratchpad `ground-download-calendar-*.js`
 * scripts hold the raw diagnostics this file's tests and `DownloadCalendarPage.ts`/
 * `DownloadCalendarModule.ts`'s doc comments build on.
 *
 * **Headline finding**: "Download Calendar" is a real control ON the Coming Soon page itself
 * (`/coming-soon`), confirming the sheet's own implicit hint (`TC_Web_205`'s expected result names
 * a "Coming Soon Movies" PDF heading) — not a separate route. It opens a real dialog with From/To
 * date fields and a Download button; the actual download is a genuine client-rendered PDF backed
 * by a real (unmocked) `POST /api/calendar-html` call.
 *
 * **The downloaded PDF has no extractable text layer** (confirmed via both `pdf-parse` and
 * poppler's `pdftotext` on a real captured download — both return empty text despite a well-formed
 * PDF). So `TC_Web_205–207`'s "open the PDF and check X" scenarios verify the real, unmocked
 * `POST /api/calendar-html` response body instead — that response contains the exact HTML the PDF
 * is rendered from. Only `TC_Web_196` verifies the actual binary PDF file/download event.
 *
 * **Two real, live-grounded findings contradict the sheet's own assumptions**:
 * - `TC_Web_200` ("select same date → Calendar downloaded successfully") does NOT hold live — the
 *   `From` date is itself `disabled` in the `To` picker, so `To` can never equal `From`.
 * - `TC_Web_201`/`TC_Web_203` ("validation message displayed") — there is no separate inline
 *   validation message; the real mechanism is a native `disabled` `<button>` until both dates are
 *   chosen.
 *
 * All 15 rows (`TC_Web_196–210`; `TC_Web_211` was a blank row in the source sheet, excluded) map
 * 1:1 to `DLC-001..015` — no merges, no exclusions.
 */
test.describe('Download Calendar @RUN2', () => {
  test('DLC-001 — Download with a valid date range produces a real PDF @P0 @Smoke', async ({ downloadCalendarModule }) => {
    await test.step('open Coming Soon and the Download Calendar dialog', async () => {
      await downloadCalendarModule.gotoComingSoon();
      await downloadCalendarModule.openDownloadDialog();
    });

    await test.step('selecting a valid From/To range downloads a real .pdf file', async () => {
      await downloadCalendarModule.expectRealPdfDownloaded();
    });
  });

  test('DLC-002 — Date picker UI opens on clicking From @P1 @Regression', async ({ downloadCalendarModule }) => {
    await test.step('open Coming Soon and the Download Calendar dialog', async () => {
      await downloadCalendarModule.gotoComingSoon();
      await downloadCalendarModule.openDownloadDialog();
    });

    await test.step('clicking "From" opens a real calendar popover', async () => {
      await downloadCalendarModule.expectDatePickerOpensOnFromClick();
    });
  });

  // Grounded 2026-09-06: past days (and "today" itself) carry a real `disabled` attribute; later
  // days in the same month don't. Asserted structurally (at least one of each) so this test stays
  // valid regardless of which real calendar day it runs on.
  test('DLC-003 — Past dates (and today) are disabled in the picker @P1 @Regression', async ({ downloadCalendarModule }) => {
    await test.step('open Coming Soon and the Download Calendar dialog', async () => {
      await downloadCalendarModule.gotoComingSoon();
      await downloadCalendarModule.openDownloadDialog();
    });

    await test.step('the "From" picker disables past/today cells and enables future ones', async () => {
      await downloadCalendarModule.expectPastDatesDisabledInFromPicker();
    });
  });

  // Grounded 2026-09-06: the "To" picker's year <select> only ever offers the current real year
  // and the next one — a real, ~1-year-max window anchored to today's real date, not to the
  // selected "From" date.
  test('DLC-004 — Selection is restricted to a ~1-year max window @P2 @Regression', async ({ downloadCalendarModule }) => {
    await test.step('open Coming Soon and the Download Calendar dialog', async () => {
      await downloadCalendarModule.gotoComingSoon();
      await downloadCalendarModule.openDownloadDialog();
    });

    await test.step('the "To" picker\'s year selector never offers more than 2 years', async () => {
      await downloadCalendarModule.expectToPickerYearRangeCappedToOneYear();
    });
  });

  // Grounded 2026-09-06: real finding, contradicts the sheet — the "From" date is itself disabled
  // in the "To" picker, so From/To can never be the same date.
  test('DLC-005 — Same From/To date is not selectable (documented real behavior) @P2 @Regression', async ({ downloadCalendarModule }) => {
    await test.step('open Coming Soon and the Download Calendar dialog', async () => {
      await downloadCalendarModule.gotoComingSoon();
      await downloadCalendarModule.openDownloadDialog();
    });

    await test.step('the "From" day is disabled when reopening the "To" picker', async () => {
      await downloadCalendarModule.expectSameDateNotSelectableInToPicker();
    });
  });

  // Grounded 2026-09-06: no separate validation message exists — the real mechanism is a native
  // `disabled` Download button until both dates are chosen.
  test('DLC-006 — Download stays disabled until both dates are chosen (real "validation") @P1 @Regression', async ({ downloadCalendarModule }) => {
    await test.step('open Coming Soon and the Download Calendar dialog', async () => {
      await downloadCalendarModule.gotoComingSoon();
      await downloadCalendarModule.openDownloadDialog();
    });

    await test.step('Download is disabled with no dates selected', async () => {
      await downloadCalendarModule.expectDownloadButtonDisabled();
    });
  });

  // Grounded 2026-09-06: selecting the "Musical" genre chip on the Coming Soon page BEFORE opening
  // the dialog narrows the real request (`filter: { genre: ["Musical"] }`) and the response HTML's
  // own movie list/"Genres:" summary line — confirmed via the real Dec 25-31 release week.
  test('DLC-007 — A Coming Soon genre filter narrows the downloaded content @P0 @Regression', async ({ downloadCalendarModule }) => {
    let html = '';

    await test.step('open Coming Soon, select "Musical", and download the Dec 25-31 range', async () => {
      await downloadCalendarModule.gotoComingSoon();
      html = await downloadCalendarModule.downloadDecemberRangeWithGenreFilterAndGetHtml('Musical');
    });

    await test.step('only the Musical-genre movie is included, and the summary reflects the filter', async () => {
      downloadCalendarModule.expectDownloadedContentHasMovieDetails(html, 'Varanasi (film)', 'Musical', 'Hindi');
      downloadCalendarModule.expectDownloadedContentExcludes(html, 'King (2026 film)');
    });
  });

  test('DLC-008 — Download button state (disabled then enabled) @P1 @Regression', async ({ downloadCalendarModule }) => {
    await test.step('open Coming Soon and the Download Calendar dialog', async () => {
      await downloadCalendarModule.gotoComingSoon();
      await downloadCalendarModule.openDownloadDialog();
    });

    await test.step('Download is disabled before any date is chosen', async () => {
      await downloadCalendarModule.expectDownloadButtonDisabled();
    });

    await test.step('Download becomes enabled once a valid From/To range is chosen', async () => {
      await downloadCalendarModule.selectFirstAvailableFromDate();
      await downloadCalendarModule.selectFirstAvailableToDate();
      await downloadCalendarModule.expectDownloadButtonEnabled();
    });
  });

  // Grounded 2026-09-06: no real 5xx was reproducible live, so this mocks the real
  // `POST /api/calendar-html` endpoint via `page.route` — same fault-injection shape
  // `MovieAlertsModule.mockSaveAlertFailure` already establishes in this repo. Confirmed the SAME
  // dialog stays open (unlike the real no-movie-match 404 in DLC-013) and shows a real inline
  // message.
  test('DLC-009 — API failure shows a real inline error message (mocked) @P1 @Regression', async ({ downloadCalendarModule }) => {
    await test.step('open Coming Soon, mock a calendar-html API failure, and open the dialog', async () => {
      await downloadCalendarModule.gotoComingSoon();
      await downloadCalendarModule.mockCalendarApiFailure(500);
      await downloadCalendarModule.openDownloadDialog();
    });

    await test.step('selecting a valid range and downloading surfaces the real inline error', async () => {
      await downloadCalendarModule.selectFromDate(25, 'December');
      await downloadCalendarModule.selectToDate(31);
      await downloadCalendarModule.performDownloadExpectingFailure();
      await downloadCalendarModule.expectInlineErrorMessageShown();
    });
  });

  test('DLC-010 — Downloaded content has the "Coming Soon Movies" heading @P0 @Regression', async ({ downloadCalendarModule }) => {
    let html = '';

    await test.step('open Coming Soon and download the Dec 25-31 range', async () => {
      await downloadCalendarModule.gotoComingSoon();
      await downloadCalendarModule.openDownloadDialog();
      html = await downloadCalendarModule.downloadDecemberRangeAndGetHtml();
    });

    await test.step('the real response content has the "Coming Soon Movies" heading', async () => {
      downloadCalendarModule.expectDownloadedContentHasHeading(html);
    });
  });

  test('DLC-011 — Downloaded content has movie name, genre, and language @P0 @Regression', async ({ downloadCalendarModule }) => {
    let html = '';

    await test.step('open Coming Soon and download the Dec 25-31 range', async () => {
      await downloadCalendarModule.gotoComingSoon();
      await downloadCalendarModule.openDownloadDialog();
      html = await downloadCalendarModule.downloadDecemberRangeAndGetHtml();
    });

    await test.step('the real response content shows a movie\'s name, genre, and language', async () => {
      // Grounded 2026-09-06: the PDF's own per-movie genre tags for "Varanasi (film)" are
      // "Crime, Action, Adventure" — a different (overlapping) set from the "Musical" genre chip
      // that matches it on the Coming Soon LISTING card (see `ComingSoonModule`'s own CMS-018).
      // Asserting against the PDF's own real, dumped tag text here, not the listing card's.
      downloadCalendarModule.expectDownloadedContentHasMovieDetails(html, 'Varanasi (film)', 'Crime', 'Hindi');
    });
  });

  test('DLC-012 — Downloaded content has the selected date range @P0 @Regression', async ({ downloadCalendarModule }) => {
    let html = '';

    await test.step('open Coming Soon and download the Dec 25-31 range', async () => {
      await downloadCalendarModule.gotoComingSoon();
      await downloadCalendarModule.openDownloadDialog();
      html = await downloadCalendarModule.downloadDecemberRangeAndGetHtml();
    });

    await test.step('the real response content shows the selected date range', async () => {
      downloadCalendarModule.expectDownloadedContentHasDateRange(html, '25 December 2026 - 31 December 2026');
    });
  });

  // Grounded 2026-09-06: a genuinely unmocked, real 404 (`NO_COMING_SOON_MOVIES_FOUND`) from
  // picking the nearest selectable near-term range (no movie currently releases that soon) closes
  // the date-picker dialog and opens a real, separate "No Movies Found" dialog.
  test('DLC-013 — No-movie-match date range shows the real "No Movies Found" state @P1 @Regression', async ({ downloadCalendarModule }) => {
    await test.step('open Coming Soon and the Download Calendar dialog', async () => {
      await downloadCalendarModule.gotoComingSoon();
      await downloadCalendarModule.openDownloadDialog();
    });

    await test.step('the nearest selectable range currently has no matching movies', async () => {
      await downloadCalendarModule.downloadNearTermRangeExpectingNoMovies();
      await downloadCalendarModule.expectNoMoviesFoundShown();
    });
  });

  // Grounded 2026-09-06: cosmetic alignment check, same boundingBox()-comparison shape
  // `ComingSoonModule.expectGenreChipsAlphabetical` already uses.
  test('DLC-014 — From/To fields are visually aligned in the dialog @P2 @Regression', async ({ downloadCalendarModule }) => {
    await test.step('open Coming Soon and the Download Calendar dialog', async () => {
      await downloadCalendarModule.gotoComingSoon();
      await downloadCalendarModule.openDownloadDialog();
    });

    await test.step('the From and To fields render on the same row', async () => {
      await downloadCalendarModule.expectFromAndToFieldsAligned();
    });
  });

  test('DLC-015 — Multiple downloads work without a crash @P1 @Regression', async ({ downloadCalendarModule }) => {
    await test.step('open Coming Soon', async () => {
      await downloadCalendarModule.gotoComingSoon();
    });

    await test.step('downloading the same real range twice in a row both succeed', async () => {
      await downloadCalendarModule.expectMultipleDownloadsWorkWithoutCrash();
    });
  });
});
