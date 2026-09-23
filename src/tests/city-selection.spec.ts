import { test } from '@fixtures/index';
import { DataGenerator } from '@utils/index';
import { registerLoginData } from '@testdata/registerLoginData';

/**
 * Ticket: requirements/city-selection.md — PRD UC 9 (City Selection), 26 scenarios. Grounded
 * 2026-09-01 against UAT (inox-uat-web.pvrinox.com) via headless-Playwright diagnostic passes —
 * Playwright MCP's interactive browser tool fails to launch in this sandbox (no display server,
 * see the `pvr-inox-grounding-technique` project memory); scratchpad `ground-city-*.js` scripts
 * hold the raw diagnostics. See `CitySelectionPage.ts`'s doc comment for the full structural
 * findings (locators, duplicate-name traps, sub-city DOM shape) this file's tests build on.
 *
 * The live `GET /api/get-city-list` was fetched directly during grounding and matches the
 * ticket's documented shape (`statusCode:200`, `message:"en.CITY_LISTED"`, real
 * popularCities/cities arrays) — confirmed real, not a guess.
 *
 * Three real, live-grounded findings worth flagging up front:
 *
 * 1. **CTY-008's alias premise doesn't hold on this environment.** The PRD's "Gurgaon" ->
 *    "Gurugram" example was checked against the live API payload directly (grepped the full
 *    61-entry `cities[]` array) — no "Gurugram" city exists anywhere in this dataset, and
 *    searching "Gurgaon" on the real UI returns only "Gurgaon" itself, no alias substitution.
 *    `test.fixme` documents this rather than asserting on behavior that isn't there.
 *
 * 2. **Voice search never produced a visible reaction on Web** (CTY-009, CTY-025). The mic
 *    button is real and clickable, but neither an un-granted permission
 *    (`navigator.permissions.query('microphone')` stayed `'prompt'` after the click) nor a
 *    forced `getUserMedia` rejection (simulating an explicit deny) changed the DOM at all — no
 *    Settings/Cancel popup, no recognition UI. Matches `GlobalSearchPage.ts`'s own earlier
 *    finding that voice search may be App/M-Site-only. Both `test.fixme`.
 *
 * 3. **Real product bug: list-load failure renders a blank dialog, not an error message**
 *    (CTY-026, CTY-043). Mocking `get-city-list` to a 500 makes the "Select Your City" panel
 *    open as a completely empty `role="dialog"` — no heading, no content, no error copy
 *    (confirmed via a full body-text dump and `page.on('pageerror')`, not just a missing
 *    locator). This directly contradicts the PRD's own acceptance criterion ("Network/server
 *    failure ... shows an error message instead of a blank screen"). Both scenarios are
 *    `test.fixme`, documenting a real gap rather than a locator problem.
 *
 * By contrast, CTY-027 (missing popular-city image) and CTY-044 (empty `cities[]`) ARE real,
 * working, automated behavior — confirmed live via the same style of API mocking; see
 * `CitySelectionModule.ts` doc comments for what each one found.
 */
test.describe('City Selection @RUN1', () => {
  test('CTY-001 — City Selection screen displays popular cities, full list, search bar, and Tap to share location CTA @P0 @Smoke', async ({ citySelectionModule }) => {
    await test.step('open City Selection screen', async () => {
      await citySelectionModule.gotoCitySelection();
    });

    await test.step('popular cities, full list, search bar, and share-location CTA all render', async () => {
      await citySelectionModule.expectScreenElementsVisible();
    });
  });

  test('CTY-002 — Selecting a city with no sub-cities saves it immediately @P0 @Smoke', async ({ citySelectionModule }) => {
    await test.step('open City Selection screen', async () => {
      await citySelectionModule.gotoCitySelection();
    });

    await test.step('select Bangalore (hasSubCities:false)', async () => {
      await citySelectionModule.selectPopularCityWithNoSubCities('Bangalore');
    });

    await test.step('Bangalore is saved and reflected in the header', async () => {
      await citySelectionModule.expectHeaderCity('Bangalore');
    });
  });

  test('CTY-003 — Selecting a city with sub-cities opens a sub-dropdown @P0 @Regression', async ({ citySelectionModule }) => {
    await test.step('open City Selection screen', async () => {
      await citySelectionModule.gotoCitySelection();
    });

    await test.step('selecting Mumbai-All opens its sub-city dropdown', async () => {
      await citySelectionModule.expectSubCityOptionsVisible('Mumbai-All');
    });
  });

  test('CTY-004 — Selecting a sub-city saves city + sub-city and updates content @P0 @Regression', async ({ citySelectionModule }) => {
    await test.step('open City Selection screen', async () => {
      await citySelectionModule.gotoCitySelection();
    });

    await test.step('select Delhi-NCR then its Gurgaon sub-city', async () => {
      await citySelectionModule.selectSubCity('Delhi-NCR', 'Gurgaon');
    });

    await test.step('Gurgaon is saved and reflected in the header', async () => {
      await citySelectionModule.expectHeaderCity('Gurgaon');
    });
  });

  // Grounded 2026-09-01: selecting "All" under Delhi-NCR's sub-city dropdown saves the *parent*
  // city name ("Delhi-NCR") to the header — same real mechanism CTY-004 exercises for a real
  // sub-city, just with the synthetic "All" option instead.
  test('CTY-005 — Selecting "All" under a sub-city dropdown selects the parent city @P1 @Regression', async ({ citySelectionModule }) => {
    await test.step('open City Selection screen', async () => {
      await citySelectionModule.gotoCitySelection();
    });

    await test.step('select Delhi-NCR then "All" under its sub-cities', async () => {
      await citySelectionModule.selectSubCity('Delhi-NCR', 'All');
    });

    await test.step('Delhi-NCR (the parent city) is saved', async () => {
      await citySelectionModule.expectHeaderCity('Delhi-NCR');
    });
  });

  test('CTY-006 — Search returns matching cities/sub-cities for a valid keyword @P0 @Regression', async ({ citySelectionModule }) => {
    await test.step('open City Selection screen', async () => {
      await citySelectionModule.gotoCitySelection();
    });

    await test.step('search "Delhi"', async () => {
      await citySelectionModule.searchCity('Delhi');
    });

    await test.step('results include Delhi and Delhi-NCR', async () => {
      await citySelectionModule.expectSearchResultsInclude(['Delhi', 'Delhi-NCR']);
    });
  });

  // Grounded 2026-09-01: "DEL"/"del"/"de" (a 2-char partial, mid-word match) all confirmed to
  // return identical result sets live — case-insensitive AND partial-match in one check.
  test('CTY-007 — Search is case-insensitive and supports partial matches @P1 @Regression', async ({ citySelectionModule }) => {
    await test.step('open City Selection screen', async () => {
      await citySelectionModule.gotoCitySelection();
    });

    await test.step('"del" and "DEL" return identical result sets', async () => {
      await citySelectionModule.expectSearchResultsIdentical('del', 'DEL');
    });
  });

  test.fixme(
    'CTY-008 — Search resolves alias names @P1 @Regression — BLOCKED: grounded 2026-09-01 — the live get-city-list payload (61-entry cities[] array, fetched and grepped directly) has no "Gurugram" entry anywhere, and cityNameAlias is empty for Gurgaon (only one unrelated city, "Bharuch", has that field set, to its own name). Searching "Gurgaon" on the real UI returns only "Gurgaon" itself, no alias substitution — the PRD\'s example does not hold on this environment\'s live data.',
    () => {},
  );

  test.fixme(
    "CTY-009 — Voice search returns matching results @P1 @Regression — BLOCKED: grounded 2026-09-01 — the mic button is real and clickable, but with default (un-granted) microphone permission, clicking it produced no visible DOM change at all (no recognition UI, no permission dialog, navigator.permissions.query('microphone') stayed 'prompt' after the click) across a headless pass. Matches GlobalSearchPage.ts's own earlier finding that voice search may be App/M-Site-only — nothing to drive speech-to-text against on this Web build.",
    () => {},
  );

  // Grounded 2026-09-01: granting geolocation permission WHILE the panel is open (not before
  // navigation) then clicking "Tap to share location" is a real, working flow — confirmed live
  // the dialog closes and the header updates to the geolocation-derived city ("Mumbai" for the
  // coordinates used, matching LocationHelper.MUMBAI_GEOLOCATION).
  test('CTY-010 — "Tap to share location" fetches location automatically @P1 @Regression', async ({ citySelectionModule }) => {
    await test.step('open City Selection screen', async () => {
      await citySelectionModule.gotoCitySelection();
    });

    await test.step('grant geolocation and tap "share location"', async () => {
      await citySelectionModule.grantGeolocationAndShareLocation();
    });

    await test.step('the geolocation-derived city is saved', async () => {
      await citySelectionModule.expectHeaderCity('Mumbai');
    });
  });

  test('CTY-011 — Popular cities render in Admin-configured sequence with name and image @P1 @Regression', async ({ citySelectionModule }) => {
    await test.step('open City Selection screen', async () => {
      await citySelectionModule.gotoCitySelection();
    });

    await test.step('popular cities are ordered by ascending sequenceNumber and each shows an image', async () => {
      await citySelectionModule.expectPopularCitiesInSequenceOrder();
      await citySelectionModule.expectPopularCitiesHaveImages();
    });
  });

  test('CTY-012 — Full city/sub-city list renders alphabetically A-Z @P2 @Regression', async ({ citySelectionModule }) => {
    await test.step('open City Selection screen', async () => {
      await citySelectionModule.gotoCitySelection();
    });

    await test.step('the "All cities" list is sorted alphabetically', async () => {
      await citySelectionModule.expectAllCitiesAlphabetical();
    });
  });

  // Grounded 2026-09-01: confirmed live via Escape/close-icon dismissal — closing the panel
  // without picking a new city leaves the header's previously-saved city untouched.
  test('CTY-020 — Closing without selecting retains the previously saved city @P1 @Regression', async ({ citySelectionModule }) => {
    await test.step('save a city (Bangalore)', async () => {
      await citySelectionModule.gotoCitySelection();
      await citySelectionModule.selectPopularCityWithNoSubCities('Bangalore');
      await citySelectionModule.expectHeaderCity('Bangalore');
    });

    await test.step('reopen City Selection and close without choosing', async () => {
      await citySelectionModule.reopenCitySelectionViaHeader();
      await citySelectionModule.closeWithoutSelecting();
    });

    await test.step('Bangalore remains the active city', async () => {
      await citySelectionModule.expectHeaderCity('Bangalore');
    });
  });

  // Grounded 2026-09-01: real copy captured live via role query — heading "City Not Found!" plus
  // "No matches found. Please try a different keyword.".
  test('CTY-021 — Searching a city not in the list shows "City not found" @P1 @Regression', async ({ citySelectionModule }) => {
    await test.step('open City Selection screen', async () => {
      await citySelectionModule.gotoCitySelection();
    });

    await test.step('search a nonexistent city name', async () => {
      await citySelectionModule.searchCity('zzzznotarealcity');
    });

    await test.step('"City Not Found!" message is shown', async () => {
      await citySelectionModule.expectCityNotFound();
    });
  });

  test('CTY-022 — Search does not trigger below the 2-character minimum @P1 @Regression', async ({ citySelectionModule }) => {
    await test.step('open City Selection screen', async () => {
      await citySelectionModule.gotoCitySelection();
    });

    await test.step('type 1 character', async () => {
      await citySelectionModule.searchCity('d');
    });

    await test.step('the full unfiltered list still shows — no search triggered', async () => {
      await citySelectionModule.expectFullListStillShown();
    });
  });

  // Grounded 2026-09-01: neither digits ("123") nor symbols ("@#$%^&*()") crash the panel or
  // filter to an empty state — both leave the full unfiltered list showing, same as
  // below-minimum input. No separate "rejected" UI exists to assert on beyond this.
  test('CTY-023 — Search rejects disallowed characters without crashing @P1 @Regression', async ({ citySelectionModule }) => {
    await test.step('open City Selection screen', async () => {
      await citySelectionModule.gotoCitySelection();
    });

    await test.step('type numbers and special symbols', async () => {
      await citySelectionModule.searchCity('@#$%^&*()123');
    });

    await test.step('no crash — the full unfiltered list still shows', async () => {
      await citySelectionModule.expectFullListStillShown();
    });
  });

  test('CTY-024 — Search input with leading/trailing spaces still matches correctly @P2 @Regression', async ({ citySelectionModule }) => {
    await test.step('open City Selection screen', async () => {
      await citySelectionModule.gotoCitySelection();
    });

    await test.step('" Delhi " and "Delhi" return identical result sets', async () => {
      await citySelectionModule.expectSearchResultsIdentical(' Delhi ', 'Delhi');
    });
  });

  test.fixme(
    "CTY-025 — Denied microphone permission shows Settings/Cancel prompt @P1 @Regression — BLOCKED: grounded 2026-09-01 — forced navigator.mediaDevices.getUserMedia to reject with a real NotAllowedError (simulating an explicit deny) before clicking the mic button; no Settings/Cancel popup or any other visible DOM change appeared (full body-text scan and dialog-count check both came back empty/unchanged). Same root cause as CTY-009 — this Web build doesn't appear to react to mic permission state at all.",
    () => {},
  );

  test.fixme(
    'CTY-026 — City list load failure shows an error message @P0 @Regression — BLOCKED: grounded 2026-09-01, REAL PRODUCT BUG — mocking get-city-list to a 500 makes the "Select Your City" panel open as a completely blank role="dialog" (no heading, no content, no error copy of any kind — confirmed via page.on(\'pageerror\') and a full body-text dump, not just a missing locator). This directly contradicts the PRD acceptance criterion this scenario is testing ("shows an error message instead of a blank screen") — documented as a real gap, not asserted as if the error message existed.',
    () => {},
  );

  test('CTY-027 — Missing popular-city image shows a generic placeholder @P2 @Regression', async ({ citySelectionModule }) => {
    let mockedCity = '';

    await test.step('mock a popular city with no configured image', async () => {
      mockedCity = await citySelectionModule.mockPopularCityMissingImage();
    });

    await test.step('open City Selection screen', async () => {
      await citySelectionModule.gotoCitySelection();
    });

    await test.step('a generic placeholder image renders for that city', async () => {
      await citySelectionModule.expectPopularCityShowsPlaceholderImage(mockedCity);
    });
  });

  test('CTY-040 — GET /api/get-city-list success renders Popular Cities and full list matching payload @P0 @Regression', async ({ citySelectionModule }) => {
    await test.step('open City Selection screen', async () => {
      await citySelectionModule.gotoCitySelection();
    });

    await test.step('UI Popular Cities and full list match the live API payload by name', async () => {
      await citySelectionModule.expectUiMatchesApiCityList();
    });
  });

  test('CTY-041 — Sub-city dropdown matches subCities[] for cities with hasSubCities:true @P0 @Regression', async ({ citySelectionModule }) => {
    await test.step('open City Selection screen', async () => {
      await citySelectionModule.gotoCitySelection();
    });

    await test.step("Mumbai-All's sub-city dropdown matches the live API's subCities[] (plus the UI-added \"All\")", async () => {
      await citySelectionModule.expectSubCityDropdownMatchesApi('Mumbai-All');
    });
  });

  test('CTY-042 — Popular cities render ordered by ascending sequenceNumber @P1 @Regression', async ({ citySelectionModule }) => {
    await test.step('open City Selection screen', async () => {
      await citySelectionModule.gotoCitySelection();
    });

    await test.step('rendered order matches ascending sequenceNumber from the live API', async () => {
      await citySelectionModule.expectPopularCitiesInSequenceOrder();
    });
  });

  test.fixme(
    'CTY-043 — Non-200/error response from get-city-list surfaces an error state @P1 @Regression — BLOCKED: same real product bug as CTY-026 (grounded 2026-09-01) — a mocked non-200 response on get-city-list produces a blank role="dialog", not an error state. Documented once in detail on CTY-026; this scenario is the same underlying gap from the API-parity angle.',
    () => {},
  );

  test('CTY-044 — Empty cities[] in API payload renders an empty state without crashing @P2 @Regression', async ({ citySelectionModule }) => {
    await test.step('mock an empty cities[] array (popularCities untouched)', async () => {
      await citySelectionModule.mockEmptyCitiesList();
    });

    await test.step('open City Selection screen', async () => {
      await citySelectionModule.gotoCitySelection();
    });

    await test.step('Popular Cities still renders; full list shows an empty state, no crash', async () => {
      await citySelectionModule.expectAllCitiesEmptyPopularIntact();
    });
  });

  // Grounded 2026-09-01: the module has no role gating — this repeats CTY-002's flow once as a
  // guest and once as a logged-in session (real UAT login via any-6-digit-OTP, per the
  // otp-flow-automation-solved project memory), confirming identical city-selection behavior for
  // both actor types per the PRD's "Customer — Logged-in or Guest" primary actor.
  test('CTY-050 — Both Guest and Logged-in users can fully use City Selection @P2 @Regression', async ({ citySelectionModule, registerLoginModule }) => {
    await test.step('as a guest: select a city with no sub-cities', async () => {
      await citySelectionModule.gotoCitySelection();
      await citySelectionModule.selectPopularCityWithNoSubCities('Bangalore');
      await citySelectionModule.expectHeaderCity('Bangalore');
    });

    await test.step('log in with a real UAT OTP round trip', async () => {
      await registerLoginModule.gotoLogin();
      await registerLoginModule.loginWithPhoneAndOtp(DataGenerator.randomIndianPhoneNumber(), registerLoginData.validOtp);
      await registerLoginModule.expectOnHome();
    });

    await test.step('as a logged-in user: repeat the same city selection', async () => {
      await citySelectionModule.reopenCitySelectionViaHeader();
      await citySelectionModule.selectPopularCityWithNoSubCities('Chennai');
      await citySelectionModule.expectHeaderCity('Chennai');
    });
  });
});
