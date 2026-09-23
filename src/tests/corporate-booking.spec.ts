import { test } from '@fixtures/index';
import { DataGenerator } from '@utils/DataGenerator';

/**
 * Ticket: requirements/corporate-booking.md (TC_Web_290-327). Seeded 2026-09-16 from
 * `_PVR INOX __ Test Cases .xlsx` sheet `M8 | Website`. Real route, headings, and the full
 * step-1 -> step-2 -> Get-OTP flow are grounded live — see `CorporateBookingPage.ts`'s doc
 * comment. **Never fill a real OTP code in this file** — confirmed live (via a real, accidental
 * submission during grounding) that this form auto-verifies/auto-submits with no separate
 * Submit button; every OTP-adjacent scenario stops at confirming the OTP screen appears.
 */
test.describe('Corporate Booking @Regression @RUN8', () => {
  test('CB-001/002 — Corporate Booking option and navigation via More menu @P0 @Smoke', async ({ corporateBookingModule }) => {
    await test.step('Open homepage and the More menu', async () => {
      await corporateBookingModule.gotoViaMoreMenu();
    });
    await test.step('Click Corporate Booking and confirm navigation', async () => {
      await corporateBookingModule.clickCorporateBookingMenuItem();
    });
  });

  test('CB-003 — Page loads with real headings @P0 @Regression', async ({ corporateBookingModule }) => {
    await test.step('Open /corporate-booking directly', async () => {
      await corporateBookingModule.gotoCorporateBooking();
    });
    await test.step('Confirm the real page headings are displayed', async () => {
      await corporateBookingModule.expectPageLoaded();
    });
  });

  test('CB-003b — Banner image displayed @P1 @Regression', async ({ corporateBookingModule }) => {
    await test.step('Open Corporate Booking page', async () => {
      await corporateBookingModule.gotoCorporateBooking();
    });
    await test.step('Confirm a banner image is displayed', async () => {
      await corporateBookingModule.expectBannerVisible();
    });
  });

  test.fixme(
    'CB-004 — Default placeholder banner @P2 @Regression — BLOCKED: requires an Admin Panel data state (banner removed) this suite cannot toggle from the UI.',
    () => {},
  );

  test.fixme(
    'CB-005 — City field prefilled @P1 @Regression — NOT GROUNDED: the trigger\'s accessible name is a static "City*Select…" label+placeholder combo — whether a selected value renders distinctly (vs. the guest default) was not confirmed live.',
    () => {},
  );

  test('CB-006/008 — City field is editable via search and a real city is selectable @P1 @Regression', async ({ corporateBookingModule }) => {
    await test.step('Open Corporate Booking page and open the City dropdown', async () => {
      await corporateBookingModule.gotoCorporateBooking();
      await corporateBookingModule.openCityDropdown();
    });
    await test.step('Search and select a real city', async () => {
      await corporateBookingModule.searchCity('mum');
      await corporateBookingModule.selectCity('Mumbai-All');
    });
  });

  test.fixme(
    'CB-007 — City list sorting (alphabetical) @P1 @Regression — NOT GROUNDED: only a filtered (searched) result set was observed live, not the full unfiltered option list.',
    () => {},
  );

  test('CB-009 — Cinema dropdown shows real cinema options @P0 @Regression', async ({ corporateBookingModule }) => {
    await test.step('Open Corporate Booking page, select City on the form, then open the Cinema dropdown', async () => {
      await corporateBookingModule.gotoCorporateBooking();
      await corporateBookingModule.selectCityOnForm();
      await corporateBookingModule.openCinemaDropdown();
    });
    await test.step('Confirm real cinema options are listed and selectable', async () => {
      await corporateBookingModule.expectCinemaOptionsVisible();
      await corporateBookingModule.selectFirstCinema();
    });
  });

  test.fixme(
    'CB-010 — Cinema sorting (nearest-first) @P1 @Regression — NOT GROUNDED: requires real per-cinema distance data to independently verify against, not available from static grounding.',
    () => {},
  );
  // Grounded 2026-09-17 — a first pass wrongly inferred "no search box" from a codegen recording
  // that simply didn't use one; a live re-check (screenshot) confirmed a real "Search cinema…"
  // input does exist, filtering the option list the same way City's search does.
  test('CB-011 — Cinema search @P2 @Regression', async ({ corporateBookingModule }) => {
    await test.step('Open Corporate Booking page, select City on the form, then open the Cinema dropdown', async () => {
      await corporateBookingModule.gotoCorporateBooking();
      await corporateBookingModule.selectCityOnForm();
      await corporateBookingModule.openCinemaDropdown();
    });
    await test.step('Searching narrows the Cinema list to a matching real cinema', async () => {
      await corporateBookingModule.searchCinema('Inorbit');
      await corporateBookingModule.expectCinemaOptionsVisible();
    });
  });

  test('CB-012 — Date picker opens and a real day cell is selectable @P0 @Regression', async ({ corporateBookingModule }) => {
    await test.step('Open Corporate Booking page, select City on the form, then open the Date picker', async () => {
      await corporateBookingModule.gotoCorporateBooking();
      await corporateBookingModule.selectCityOnForm();
      await corporateBookingModule.openDatePicker();
    });
    await test.step('Select the first real, enabled day cell', async () => {
      await corporateBookingModule.selectFirstAvailableDate();
    });
  });
  test.fixme(
    'CB-012b — Date selection restricted to 7+ days out @P0 @Regression — NOT GROUNDED: the picker opens and a day cell is selectable (see the real test above), but which specific dates are disabled vs enabled was not independently verified.',
    () => {},
  );
  test.fixme(
    'CB-013 — Current/previous dates disabled @P1 @Regression — NOT GROUNDED: same calendar-internals gap as CB-012b.',
    () => {},
  );

  // Grounded 2026-09-17 via a live codegen recording: a real, distinct "Movie Type" dropdown
  // sits between Date and the movie-tile grid (real flow: City -> Cinema -> Date -> Movie Type ->
  // movie tile -> Show Time). The trigger's live accessible text is "Movie Type*Now Showing" —
  // pre-selected to "Now Showing" by default, not a blank placeholder. Only "Now Showing" was
  // confirmed selectable in the recording; "Others" (the sheet's other named option) was not
  // exercised, so it isn't asserted here — see CorporateBookingPage.ts's doc comment.
  test('CB-014 — Movie Type options (Now Showing / Others) @P2 @Regression', async ({ corporateBookingModule }) => {
    await test.step('Open Corporate Booking page, select City on the form, then open the Movie Type dropdown', async () => {
      await corporateBookingModule.gotoCorporateBooking();
      await corporateBookingModule.selectCityOnForm();
      await corporateBookingModule.openMovieTypeDropdown();
    });
    await test.step('Confirm the "Now Showing" option is visible and selectable', async () => {
      await corporateBookingModule.expectMovieTypeOptionVisible('Now Showing');
      await corporateBookingModule.selectMovieType('Now Showing');
    });
  });
  test.fixme(
    'CB-015 — Now Showing movie list, Admin-configured sequence @P1 @Regression — BLOCKED: sequence claim needs an Admin-side source of truth to compare against, not available.',
    () => {},
  );

  test('CB-016 — Selecting a movie tile @P2 @Regression', async ({ corporateBookingModule }) => {
    await test.step('Open Corporate Booking page and select City on the form', async () => {
      await corporateBookingModule.gotoCorporateBooking();
      await corporateBookingModule.selectCityOnForm();
    });
    await test.step('Select the first real movie tile', async () => {
      await corporateBookingModule.selectFirstMovieTile();
    });
  });

  test('CB-017 — Preferred Show Time options are listed and selectable @P1 @Regression', async ({ corporateBookingModule }) => {
    await test.step('Open Corporate Booking page and the Show Time dropdown', async () => {
      await corporateBookingModule.gotoCorporateBooking();
      await corporateBookingModule.openShowTimeDropdown();
    });
    await test.step('Select the first real time slot', async () => {
      await corporateBookingModule.selectFirstShowTime();
    });
  });

  test('CB-018/019/020 — Number of Seats field exists and accepts input @P2 @Regression', async ({ corporateBookingModule }) => {
    await test.step('Open Corporate Booking page', async () => {
      await corporateBookingModule.gotoCorporateBooking();
    });
    await test.step('Fill a value within the documented 50-999 range and confirm it is accepted', async () => {
      await corporateBookingModule.fillNumberOfSeats('100');
      await corporateBookingModule.expectNumberOfSeatsValue('100');
    });
  });
  test.fixme(
    'CB-018b — Seats minimum validation (49 rejected) @P0 @Regression — NOT GROUNDED: the field exists and accepts input (see the real test above), but the actual out-of-range validation message/behavior was not observed live.',
    () => {},
  );
  test.fixme(
    'CB-019 — Seats maximum validation (1000 rejected) @P0 @Regression — NOT GROUNDED: same validation-behavior gap as CB-018b.',
    () => {},
  );

  // Grounded 2026-09-17 (twice, with a freshly-registered account whose name/email/phone are
  // genuinely set): CB-021/022/023's premise doesn't hold — see
  // CorporateBookingModule.expectContactFieldsEmpty's doc comment for the full finding
  // (what looked like prefill during manual testing traced to the browser's own autofill, not a
  // real site behavior). Asserts the real, confirmed behavior instead of the sheet's assumption.
  test('CB-021/022/023 — Logged-in Name/Phone/Email are NOT prefilled @P1 @Regression', async ({ registerLoginModule, registrationModule, corporateBookingModule }) => {
    await test.step('Register a new user with a real name/email/phone on the account', async () => {
      await registerLoginModule.gotoLogin();
      await registrationModule.registerNewUser({
        phone: DataGenerator.randomIndianPhoneNumber(),
        firstName: 'PrefillCheck',
        lastName: 'User',
        email: DataGenerator.uniqueEmail('cb.prefillcheck'),
      });
    });
    await test.step('Reach Corporate Booking step 2 — Name/Email/Phone are empty, not prefilled', async () => {
      await corporateBookingModule.gotoCorporateBooking();
      await corporateBookingModule.openCinemaDropdown();
      await corporateBookingModule.selectFirstCinema();
      await corporateBookingModule.openDatePicker();
      await corporateBookingModule.selectFirstAvailableDate();
      await corporateBookingModule.selectFirstMovieTile();
      await corporateBookingModule.openShowTimeDropdown();
      await corporateBookingModule.selectFirstShowTime();
      await corporateBookingModule.fillNumberOfSeats('100');
      await corporateBookingModule.fillOtherRequirements('Prefill check');
      await corporateBookingModule.clickNext();
      await corporateBookingModule.expectContactFieldsEmpty();
    });
  });

  test('CB-024 — F&B Requirements Yes/No options are listed and selectable @P2 @Regression', async ({ corporateBookingModule }) => {
    await test.step('Open Corporate Booking page and the F&B Requirements dropdown', async () => {
      await corporateBookingModule.gotoCorporateBooking();
      await corporateBookingModule.openFbRequirementsDropdown();
    });
    await test.step('Select Yes', async () => {
      await corporateBookingModule.selectFbRequirement('Yes');
    });
  });

  test('CB-025 — Other Requirements field exists and accepts input @P1 @Regression', async ({ corporateBookingModule }) => {
    await test.step('Open Corporate Booking page', async () => {
      await corporateBookingModule.gotoCorporateBooking();
    });
    await test.step('Fill the field and confirm the value is accepted', async () => {
      await corporateBookingModule.fillOtherRequirements('Need extra seating and projector access for a 50-person workshop.');
      await corporateBookingModule.expectOtherRequirementsLength('Need extra seating and projector access for a 50-person workshop.'.length);
    });
  });
  test.fixme(
    'CB-025b — Other Requirements 500-char max enforced @P1 @Regression — NOT GROUNDED: the field exists (see the real test above), but whether input is actually truncated at 500 characters was not observed live.',
    () => {},
  );

  test('CB-026 — Copy to Self checkbox toggles @P2 @Regression', async ({ corporateBookingModule }) => {
    await test.step('Fill the full booking form up to step 2', async () => {
      await corporateBookingModule.gotoCorporateBooking();
      await corporateBookingModule.fillFullValidBookingForm();
    });
    await test.step('Check the checkbox and confirm it is checked', async () => {
      await corporateBookingModule.checkCopyToSelf();
      await corporateBookingModule.expectCopyToSelfChecked();
    });
  });

  test('CB-027 — Get OTP CTA opens the real Verify Phone Number screen @P0 @Regression', async ({ corporateBookingModule }) => {
    await test.step('Fill the full booking form (step 1 and step 2)', async () => {
      await corporateBookingModule.gotoCorporateBooking();
      await corporateBookingModule.fillFullValidBookingForm();
    });
    await test.step('Click Get OTP and confirm the real OTP screen opens — do NOT enter an OTP code', async () => {
      await corporateBookingModule.clickGetOtp();
      await corporateBookingModule.expectOtpScreenVisible();
    });
  });

  test.fixme(
    'CB-028 — Valid OTP @P0 @Regression — BLOCKED: confirmed live this form auto-verifies/auto-submits on OTP entry with no separate Submit button — filling a real code risks an actual backend booking submission with a real recipient email. See CorporateBookingPage.ts doc comment.',
    () => {},
  );
  test.fixme(
    'CB-029 — Invalid OTP + retry @P0 @Regression — BLOCKED: same auto-submit gap as CB-028.',
    () => {},
  );
  test.fixme(
    'CB-030 — Backend submission (assert payload) @P0 @Regression — BLOCKED: same gap as CB-028; also this is a Next.js Server Action (POST to the page\'s own URL), not a REST endpoint `CorporateFormsMock` can pattern-match yet.',
    () => {},
  );
  test.fixme(
    'CB-031 — HR email notification (adapted, assert mocked recipient mapping) @P1 @Regression — BLOCKED: same gap as CB-028.',
    () => {},
  );
  test.fixme(
    'CB-032 — Copy to Self email (adapted) @P1 @Regression — BLOCKED: same gap as CB-028.',
    () => {},
  );
  test.fixme(
    'CB-033 — Success popup @P0 @Regression — BLOCKED: same gap as CB-028.',
    () => {},
  );
  // Grounded 2026-09-17 via a live codegen recording + a follow-up live diagnostic to confirm
  // the exact copy: clicking "Get OTP" with all three step-2 fields blank shows all three real
  // messages at once — "Please enter a valid name.", "Please enter a valid email.", "Please enter
  // a valid phone number." — same `"Please enter a valid ..."` shape Bulk Gift Card already uses.
  test('CB-034 — Mandatory field validations @P0 @Regression', async ({ corporateBookingModule }) => {
    await test.step('Reach step 2 with a valid step-1 form, leaving Name/Email/Phone blank', async () => {
      await corporateBookingModule.gotoCorporateBooking();
      await corporateBookingModule.fillValidStep1AndReachStep2();
    });
    await test.step('Clicking Get OTP with blank fields shows the real validation messages', async () => {
      await corporateBookingModule.clickGetOtp();
      await corporateBookingModule.expectFieldError('Please enter a valid name.');
      await corporateBookingModule.expectFieldError('Please enter a valid email.');
      await corporateBookingModule.expectFieldError('Please enter a valid phone number.');
    });
  });

  // Grounded 2026-09-17: same recording — Name/Phone filled validly, Email set to a malformed
  // address ("abc@123", no real domain) — the real "Please enter a valid email." message shows.
  test('CB-035 — Invalid email format @P1 @Regression', async ({ corporateBookingModule }) => {
    await test.step('Reach step 2, fill a valid Name/Phone and an invalid Email', async () => {
      await corporateBookingModule.gotoCorporateBooking();
      await corporateBookingModule.fillValidStep1AndReachStep2();
      await corporateBookingModule.fillContactDetails('Sankalp', 'abc@123', '7676033177');
    });
    await test.step('Clicking Get OTP shows the real email validation message', async () => {
      await corporateBookingModule.clickGetOtp();
      await corporateBookingModule.expectFieldError('Please enter a valid email.');
    });
  });

  // Grounded 2026-09-17: same recording — Name/Email filled validly, Phone set to a malformed
  // value ("76760d", contains a letter) — the real "Please enter a valid phone number." message
  // shows.
  test('CB-036 — Invalid phone number @P1 @Regression', async ({ corporateBookingModule }) => {
    await test.step('Reach step 2, fill a valid Name/Email and an invalid Phone', async () => {
      await corporateBookingModule.gotoCorporateBooking();
      await corporateBookingModule.fillValidStep1AndReachStep2();
      await corporateBookingModule.fillContactDetails('Sankalp', 'abc273672@yopmail.com', '76760d');
    });
    await test.step('Clicking Get OTP shows the real phone validation message', async () => {
      await corporateBookingModule.clickGetOtp();
      await corporateBookingModule.expectFieldError('Please enter a valid phone number.');
    });
  });
  test.fixme(
    'CB-037 — Responsive UI, Web & M-site @P1 @Regression — NOT GROUNDED: CB-014\'s Movie Type field question is now resolved (re-confirmed live 2026-09-21: the real field is "Movie Type*Now Showing/Others", unrelated to the separate "Genre" filter that exists on the homepage/Cinemas Listing pages — no locator change needed), but a dedicated mobile/tablet viewport pass over this form has not been done yet.',
    () => {},
  );
  test.fixme(
    'CB-038 — Network failure during submission (route abort) @P1 @Regression — BLOCKED: same Server-Action-interception gap as CB-030.',
    () => {},
  );
});
