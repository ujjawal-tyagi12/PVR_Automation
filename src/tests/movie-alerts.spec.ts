import { test, expect } from '@fixtures/index';
import { DataGenerator } from '@utils/index';
import type { NewAlertUserDetails } from '@modules/MovieAlertsModule';

const MOVIE = 'Varanasi (film)';
const CITY = 'Mumbai';
const CINEMA_1 = 'INOX Megaplex, Inorbit Mall';

/** Fresh, unique login details per test — avoids any cross-test account collisions even though each test already runs in its own isolated browser context. */
function freshUser(prefix: string, whatsappOptIn?: boolean): NewAlertUserDetails {
  return {
    phone: DataGenerator.randomIndianPhoneNumber(),
    firstName: `Alert${prefix}`,
    email: DataGenerator.uniqueEmail(`movie.alerts.${prefix.toLowerCase()}`),
    whatsappOptIn,
  };
}

/**
 * Ticket: requirements/movie-alerts.md — reconciled 2026-09-02 from the `TC_Web_177–195` sheet
 * (superseding the earlier `TC_App`/`M6-website.pdf`-sourced ticket — see the ticket's own
 * Reconciliation note for what was kept from the old ticket and why). Grounded 2026-09-02 against
 * UAT (`inox-uat-web.pvrinox.com`), Mumbai-All, via headless Playwright driven from Bash/Node —
 * Playwright MCP's interactive browser tool does not launch in this sandbox (no display server,
 * see the `pvr-inox-grounding-technique` project memory). Scratchpad `ground-alerts-*.js` scripts
 * hold the raw diagnostics this file and `MovieAlertsPage.ts`/`MovieAlertsModule.ts`'s doc
 * comments build on.
 *
 * **Headline findings**: the Set Alert entry point is the movie DETAIL page (`/coming-soon/{id}`),
 * reached via `ComingSoonModule`; the panel itself is a plain slide-in drawer, not `role="dialog"`;
 * a WhatsApp opt-in toggle only renders when the account hasn't already opted in globally, but
 * defaults ON regardless; there is NO enforced 5-cinema max-selection limit on this build (a real
 * finding, `test.fixme`); and "mandatory selection" is enforced purely via a disabled Save button,
 * with no separate error message. Delete is a real two-step confirmation flow, and a genuine "My
 * Movie Alerts" dashboard tab exists (`/dashboard?tab=movie-alerts`) — an entry point the old
 * ticket had flagged as "not yet grounded."
 *
 * **5 scenarios are `test.fixme`**, each with its own live-grounded reason (not a blanket "no
 * data" excuse): no enforced max-cinema limit exists at all (confirmed via a mocked 7-cinema
 * selection that saved successfully), voice-search recognition is unverifiable headless (only the
 * permission-denied path is real and asserted), sub-city mapping isn't distinguishable on this
 * dataset (Mumbai-All's only two sub-cities both resolve to the identical parent city record), the
 * booking-window-open auto-removal trigger has no confirmed backend/admin hook anywhere in this
 * repo or environment, and adding a cinema during Edit Alert hits a real, unresolved product race
 * (see `MovieAlertsPage.ts`'s class doc comment for the full evidence trail).
 */
test.describe('Movie Alerts @RUN5', () => {
  test('ALT-001 — Verify login required to set alert @P0 @Regression', async ({ movieAlertsModule }) => {
    await test.step('open a movie detail page as a guest and tap Set Alert', async () => {
      await movieAlertsModule.gotoMovieDetail(MOVIE);
      await movieAlertsModule.clickSetAlert();
    });

    await test.step('the shared login screen is shown', async () => {
      await movieAlertsModule.expectLoginPromptShown();
    });
  });

  test('ALT-002 — Verify Set Alert panel UI @P0 @Regression', async ({ movieAlertsModule }) => {
    await test.step('log in as a new user and open the Set Alert panel', async () => {
      await movieAlertsModule.openSetAlertPanelAsNewUser(MOVIE, freshUser('Panel'));
    });

    await test.step('the panel shows the movie, city, Any Cinema toggle, search, and a real cinema — Save stays disabled with nothing picked', async () => {
      await movieAlertsModule.expectPanelVisible(MOVIE);
      await movieAlertsModule.expectCityShownInPanel(CITY);
      await movieAlertsModule.expectAnyCinemaToggleVisible();
      await movieAlertsModule.expectCinemaSearchVisible();
      await movieAlertsModule.expectAtLeastOneCinemaOptionVisible(CINEMA_1);
      await movieAlertsModule.expectSaveDisabled();
    });
  });

  test('ALT-003 — Verify alert creation with selected cinema(s) @P0 @Regression', async ({ movieAlertsModule }) => {
    await test.step('log in, open the panel, select a cinema and save', async () => {
      await movieAlertsModule.openSetAlertPanelAsNewUser(MOVIE, freshUser('Create'));
      await movieAlertsModule.selectCinema(CINEMA_1);
      await movieAlertsModule.save();
    });

    await test.step('the alert is created for 1 cinema', async () => {
      await movieAlertsModule.expectAlertCount(1);
    });
  });

  test('ALT-004 — Verify "Any cinema in city" selection @P0 @Regression', async ({ movieAlertsModule }) => {
    await test.step('log in, open the panel and turn on Any Cinema in City', async () => {
      await movieAlertsModule.openSetAlertPanelAsNewUser(MOVIE, freshUser('AnyCinema'));
      await movieAlertsModule.toggleAnyCinema();
    });

    await test.step('the toggle is on and Save is enabled without individually picking any cinema', async () => {
      await movieAlertsModule.expectAnyCinemaChecked(true);
      await movieAlertsModule.expectSaveEnabled();
    });
  });

  test('ALT-005 — Verify cinema list disabled on "Any cinema" @P0 @Regression', async ({ movieAlertsModule }) => {
    await test.step('log in, open the panel and turn on Any Cinema in City', async () => {
      await movieAlertsModule.openSetAlertPanelAsNewUser(MOVIE, freshUser('Disabled'));
      await movieAlertsModule.toggleAnyCinema();
    });

    await test.step('individual cinema options become disabled', async () => {
      await movieAlertsModule.expectCinemaOptionDisabled(CINEMA_1);
    });
  });

  test.fixme(
    'ALT-006 — Verify max cinema limit @P1 @Regression — BLOCKED: grounded 2026-09-02 — this build enforces NO 5-cinema max-selection limit at all, neither client- nor server-side. This UAT city (Mumbai) only has 3 real cinemas per movie, too few to test the sheet\'s ">5" case organically, so a page.route() mock injected 7 synthetic cinemas into the cinema-list API response instead: all 7 were selectable with no block on the 6th/7th pick, and the save call succeeded with all 7 ("Alert set for 7 Cinemas"), no client-side rejection and no server-side error either. This is a real, live-grounded absence of the feature the sheet describes, not an environment limitation — see requirements/movie-alerts.md\'s Test coverage note.',
    () => {},
  );

  test('ALT-007 — Verify cinema search @P1 @Regression', async ({ movieAlertsModule }) => {
    await test.step('log in, open the panel and search for a real cinema by name', async () => {
      await movieAlertsModule.openSetAlertPanelAsNewUser(MOVIE, freshUser('Search'));
      await movieAlertsModule.searchCinema('INOX');
    });

    await test.step('the matching cinema is shown', async () => {
      await movieAlertsModule.expectCinemaVisible(CINEMA_1);
    });

    await test.step('a genuinely unmatched keyword shows the real "No cinemas found" message', async () => {
      await movieAlertsModule.searchCinema('zzzznotreal');
      await movieAlertsModule.expectNoCinemasFoundShown();
    });
  });

  // Grounded 2026-09-02: a real native alert() fires on mic click when permission is denied — the
  // wording is IDENTICAL to ComingSoonModule's own mic-denied alert (unlike Curated Shows', which
  // differs slightly), confirmed via a direct string comparison.
  test('ALT-009 — Verify mic permission error @P0 @Regression', async ({ movieAlertsModule }) => {
    await test.step('force microphone permission to denied, then log in and open the panel', async () => {
      await movieAlertsModule.forceMicrophonePermissionDenied();
      await movieAlertsModule.openSetAlertPanelAsNewUser(MOVIE, freshUser('MicDenied'));
    });

    await test.step('tapping the mic icon fires the real denied-permission alert', async () => {
      await movieAlertsModule.expectMicDeniedAlertShown();
    });
  });

  // Grounded 2026-09-02: only renders when the account hasn't already globally opted into
  // WhatsApp at registration — when shown, it defaults to ON regardless.
  test('ALT-010 — Verify WhatsApp opt-in toggle @P0 @Regression', async ({ movieAlertsModule }) => {
    await test.step('log in as a user who opted OUT of WhatsApp at registration, and open the panel', async () => {
      await movieAlertsModule.openSetAlertPanelAsNewUser(MOVIE, freshUser('WaToggle', false));
    });

    await test.step('the WhatsApp toggle is visible and defaults to enabled', async () => {
      await movieAlertsModule.expectWhatsappToggleVisible();
      await movieAlertsModule.expectWhatsappToggleChecked(true);
    });

    await test.step('saving with the default-on toggle produces the WhatsApp success message', async () => {
      await movieAlertsModule.selectCinema(CINEMA_1);
      await movieAlertsModule.save();
      await movieAlertsModule.expectWhatsappSuccessMessage(MOVIE);
    });
  });

  test('ALT-011 — Verify success message (WhatsApp) @P0 @Regression', async ({ movieAlertsModule }) => {
    await test.step('log in as the default (WhatsApp opted-in) user, open the panel, select a cinema and save', async () => {
      await movieAlertsModule.openSetAlertPanelAsNewUser(MOVIE, freshUser('WaMessage'));
      await movieAlertsModule.selectCinema(CINEMA_1);
      await movieAlertsModule.save();
    });

    await test.step('the WhatsApp success message is shown', async () => {
      await movieAlertsModule.expectWhatsappSuccessMessage(MOVIE);
    });
  });

  test('ALT-012 — Verify success message (SMS) @P0 @Regression', async ({ movieAlertsModule }) => {
    await test.step('log in as a WhatsApp opted-out user, open the panel and turn the toggle off', async () => {
      await movieAlertsModule.openSetAlertPanelAsNewUser(MOVIE, freshUser('SmsMessage', false));
      await movieAlertsModule.disableWhatsappToggle();
    });

    await test.step('saving produces the SMS success message', async () => {
      await movieAlertsModule.selectCinema(CINEMA_1);
      await movieAlertsModule.save();
      await movieAlertsModule.expectSmsSuccessMessage(MOVIE);
    });
  });

  test.fixme(
    'ALT-013 — Verify alert update @P0 @Regression — BLOCKED: grounded 2026-09-02 across several live runs — adding a cinema during Edit Alert and clicking "Update Alert" can silently submit WITHOUT the newly-added cinema, confirmed via byte-identical POST bodies (unchanged from before the edit) even when the new cinema\'s own aria-pressed indicator was confirmed true BEFORE clicking Update (ruling out both an ordinary timing gap and a lost click). A follow-up pass with a real, un-conditioned 2-second wait between the click and Update reliably included the new cinema (2/2 runs) — confirming a genuine backend/frontend debounce or delayed state-sync in the product itself, with no discoverable DOM condition to wait on instead. See MovieAlertsPage.ts\'s class doc comment ("Adding a cinema during Edit") for the full evidence trail.',
    () => {},
  );

  test('ALT-014 — Verify delete alert @P0 @Regression', async ({ movieAlertsModule }) => {
    await test.step('log in and create an alert', async () => {
      await movieAlertsModule.openSetAlertPanelAsNewUser(MOVIE, freshUser('Delete'));
      await movieAlertsModule.selectCinema(CINEMA_1);
      await movieAlertsModule.save();
      await movieAlertsModule.expectAlertCount(1);
    });

    await test.step('delete the alert via the real two-step confirmation', async () => {
      await movieAlertsModule.clickDeleteAlert();
      await movieAlertsModule.confirmDelete();
    });

    await test.step('the alert is removed and the plain Set Alert CTA reappears', async () => {
      await movieAlertsModule.expectDeleteSuccessMessage();
      await movieAlertsModule.expectSetAlertButtonVisible();
    });
  });

  test('ALT-015 — Verify alert count display @P1 @Regression', async ({ movieAlertsModule }) => {
    await test.step('log in, create an alert for 1 cinema', async () => {
      await movieAlertsModule.openSetAlertPanelAsNewUser(MOVIE, freshUser('Count'));
      await movieAlertsModule.selectCinema(CINEMA_1);
      await movieAlertsModule.save();
    });

    await test.step('the movie detail page shows the real cinema count', async () => {
      await movieAlertsModule.expectAlertCount(1);
    });
  });

  test('ALT-016 — Verify parent-city mapping @P0 @Regression', async ({ movieAlertsModule }) => {
    await test.step('log in and open the panel on Mumbai-All', async () => {
      await movieAlertsModule.openSetAlertPanelAsNewUser(MOVIE, freshUser('CityMap'));
    });

    await test.step('the panel shows the correct city name', async () => {
      await movieAlertsModule.expectCityShownInPanel(CITY);
    });
  });

  test.fixme(
    'ALT-017 — Verify sub-city mapping @P0 @Regression — BLOCKED: grounded 2026-09-02 — per city-selection.md\'s own finding, Mumbai-All\'s only real sub-cities are "Mumbai" and "All", and CitySelectionModule.selectSubCity\'s doc comment confirms selecting "All" saves the identical parent city name as selecting "Mumbai" does. The alert-save API always records the same cityId:1/cityName:"Mumbai" regardless of which of these two identical-mapping options is active, so there is no real, distinguishable sub-city-vs-parent behavior to assert beyond what ALT-016 (parent mapping) already covers on this environment.',
    () => {},
  );

  // Grounded 2026-09-02: real mechanism — Save is simply disabled with nothing selected; a forced
  // dispatchEvent('click') bypassing Playwright's actionability check produced no error message.
  test('ALT-018 — Verify mandatory cinema selection @P0 @Regression (reinterpreted — Save stays disabled, no separate error message)', async ({ movieAlertsModule }) => {
    await test.step('log in and open the panel without selecting anything', async () => {
      await movieAlertsModule.openSetAlertPanelAsNewUser(MOVIE, freshUser('Mandatory'));
    });

    await test.step('Save stays disabled', async () => {
      await movieAlertsModule.expectSaveDisabled();
    });
  });

  // ---- Additional scenarios retained from the prior (TC_App-sourced) ticket — see
  // requirements/movie-alerts.md's "Additional scenarios" section for the full reconciliation
  // reasoning. All four below were independently re-grounded live this pass and confirmed real
  // and automatable, so they're implemented for real rather than left as placeholders.

  test('ALT-020 — Verify alert visible in "My Movie Alerts" @P0 @Regression (retained from the prior ticket\'s ALT-022 — entry point confirmed live this pass)', async ({ movieAlertsModule }) => {
    await test.step('log in and create an alert', async () => {
      await movieAlertsModule.openSetAlertPanelAsNewUser(MOVIE, freshUser('MyAlerts'));
      await movieAlertsModule.selectCinema(CINEMA_1);
      await movieAlertsModule.save();
    });

    await test.step('open "My Movie Alerts" from the account panel', async () => {
      await movieAlertsModule.openMyMovieAlertsPage();
    });

    await test.step('the alert is visible there', async () => {
      await movieAlertsModule.expectAlertVisibleInMyMovieAlerts(MOVIE);
    });
  });

  test('ALT-021 — Verify error shown on save failure @P0 @Regression (retained from the prior ticket\'s ALT-029 — confirmed live and automatable via API-level fault injection)', async ({ movieAlertsModule }) => {
    const failureMessage = 'Simulated save failure — please try again.';

    await test.step('mock the alert-save endpoint to fail, then log in and open the panel', async () => {
      await movieAlertsModule.mockSaveAlertFailure(failureMessage);
      await movieAlertsModule.openSetAlertPanelAsNewUser(MOVIE, freshUser('SaveFail'));
      await movieAlertsModule.selectCinema(CINEMA_1);
    });

    await test.step('saving surfaces the backend\'s own error message verbatim', async () => {
      await movieAlertsModule.save();
      await movieAlertsModule.expectErrorMessageShown(failureMessage);
    });
  });

  test('ALT-022 — Verify duplicate-click handling on Save @P1 @Regression (retained from the prior ticket\'s ALT-032 — confirmed live and automatable)', async ({ movieAlertsModule }) => {
    await test.step('log in, open the panel and select a cinema', async () => {
      await movieAlertsModule.openSetAlertPanelAsNewUser(MOVIE, freshUser('DupClick'));
      await movieAlertsModule.selectCinema(CINEMA_1);
    });

    await test.step('rapidly double-clicking Save fires exactly one alert-save request', async () => {
      const postCount = await movieAlertsModule.saveTwiceRapidlyAndCountRequests(1);
      expect(postCount).toBe(1);
    });
  });

  // Grounded 2026-09-02 (two rounds): clearing cookies alone left the save succeeding; clearing
  // cookies+localStorage+sessionStorage together sometimes reproduced a real 403 SESSION_EXPIRED
  // response but not reliably across repeated runs. Mocking that exact confirmed error shape
  // deterministically reproduces the real client behavior instead — a genuine redirect to
  // `?sidebar=login`, not an inline message (an earlier single, non-reproducible manual
  // observation had suggested the latter — corrected here after re-grounding).
  test('ALT-023 — Verify session expiry during save @P0 @Regression (retained from the prior ticket\'s ALT-033, reinterpreted — a real redirect to login, deterministically reproduced via API mocking)', async ({ movieAlertsModule }) => {
    await test.step('log in, open the panel, select a cinema and mock a session-expired response', async () => {
      await movieAlertsModule.openSetAlertPanelAsNewUser(MOVIE, freshUser('SessionExpiry'));
      await movieAlertsModule.selectCinema(CINEMA_1);
      await movieAlertsModule.mockSessionExpired();
    });

    await test.step('attempting to save redirects back to the shared login screen', async () => {
      await movieAlertsModule.save();
      await movieAlertsModule.expectRedirectedToLogin();
    });
  });
});
