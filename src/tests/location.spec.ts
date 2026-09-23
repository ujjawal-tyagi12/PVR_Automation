import { test, expect } from '@fixtures/index';

/**
 * Ticket: requirements/location.md — 72 scenarios (TC_WEB_030-101, Location module). Grounded
 * 2026-09-22 against UAT (inox-uat-web.pvrinox.com) via headless-Playwright diagnostic passes —
 * Playwright MCP's interactive browser tool fails in this sandbox (no display server, see the
 * `pvr-inox-grounding-technique` project memory); scratchpad `ground-location*.js` scripts hold
 * the raw diagnostics this file's tests and doc comments build on. See `LocationPage.ts` and
 * `LocationModule.ts` for the full grounding trail.
 *
 * Several real, live-grounded findings contradict the ticket's PRD-derived assumptions — flagged
 * up front, same convention as `city-selection.spec.ts`'s CTY-008/009/025/026/043:
 *
 * 1. **The real "Enable Location" modal has exactly two buttons — "Cancel" and "Enable" —** not
 *    the PRD's granular native-app options (Allow while using the app / Allow this time / Don't
 *    allow / Settings) or web-banner options (Allow while visiting the site / Allow this time /
 *    Never allow). Every scenario assuming those exact options is `test.fixme`.
 * 2. **Clicking "Enable" does not reliably complete detection** within a reasonable wait, even
 *    with geolocation permission granted immediately before the click — a different, less
 *    reliable code path than the in-panel "Tap to share location" button (proven working, see
 *    CTY-010). Scenarios relying on "Enable" completing detection are `test.fixme`.
 * 3. **Clicking "Enable" while permission is blocked shows no error message at all** — the modal
 *    just stays open silently. Contradicts TC_WEB_032/043's "displays an error message"
 *    expectation for detection-failure scenarios reached that way.
 * 4. **Manual city search is a plain client-side substring filter, not a validator.** It does not
 *    detect or reject SQL/XSS/HTML/JSON/XML/YAML/CSS/command-injection/path-traversal/buffer-
 *    overflow syntax — whether a payload shows real results or "City Not Found!" depends only on
 *    whether it happens to contain a matching city-name substring. See `LocationModule.ts`'s doc
 *    comment for the full measured table this file's data-driven matrix asserts.
 * 5. **Resetting browser geolocation permission (`clearPermissions` + reload) does not re-trigger
 *    the Enable Location modal** once a city is already saved — the app decides whether to show
 *    it based on the saved-city cookie, not live permission state. Contradicts TC_WEB_056/057.
 * 6. This is a **Web-only** framework — TC_WEB rows describing native-app-specific permission UI
 *    (Settings CTA to device settings, native OS popup variants) are out of scope regardless.
 * 7. **Automatic geolocation detection only ever resolves to "Mumbai" or "Delhi"** — confirmed via
 *    a 5-point coordinate comparison (Mumbai/Delhi/Bangalore/Gurgaon/mid-Pacific-Ocean real
 *    coordinates): real Bangalore coordinates resolved to "Mumbai", and literal open-ocean
 *    coordinates resolved to "Delhi", same as real Gurgaon coordinates. The app appears to pick
 *    the nearer of just two hub cities rather than doing genuine reverse-geocoding against the
 *    full city/sub-city database — see `LocationHelper.GURGAON_GEOLOCATION`/
 *    `NON_SERVICEABLE_GEOLOCATION` doc comments. Directly informs LOC-015/016 below.
 * 8. **A selected city does NOT sync to the logged-in account** — only the local `cityDetails`
 *    cookie (LOC-017/029) persists. An initial pass wrongly concluded it DID sync, because it
 *    tested with a value (Mumbai) that coincidentally equals the universal default every fresh
 *    account gets regardless of any prior session. A corrected 2-session comparison using a
 *    DIFFERENT, explicitly-selected city (Chennai) as the control disproved it: a brand-new
 *    session, same phone number, still showed "Mumbai" — the default, not Chennai. See LOC-018/030.
 * 9. **The Enable Location modal ignores the Escape key** (LOC-013), **a genuine geolocation API
 *    failure with permission otherwise granted produces no error and no city at all** (LOC-020,
 *    same real gap as LOC-014/034), and **the city-change nudge is a real one-time trigger** — it
 *    does not reappear on a reload of the same already-declined mismatch (LOC-031).
 *
 * A second grounding pass (still 2026-09-22) converted 5 of the original 9 "not independently
 * grounded" scenarios (LOC-013/015/016/026/031) into real, passing tests using the findings
 * above. The remaining 4 (LOC-018/020/030/034) are now confirmed real gaps rather than unknowns —
 * documented as `test.fixme`, not asserted as if the app behaved as the PRD assumed.
 */
test.describe('Location @RUN1', () => {
  // --- Auto-detection & permission grant/deny (LOC-001–011, 013, 014, 032–034) ---

  test('LOC-001 — App/website launches and attempts to detect location automatically @P0 @Smoke', async ({ locationModule }) => {
    await test.step('open a fresh session with no geolocation permission granted', async () => {
      await locationModule.gotoFresh();
    });

    await test.step('the real "Enable Location" modal appears — the observable proxy for "detection attempted"', async () => {
      await locationModule.expectEnableLocationModalVisible();
    });
  });

  test('LOC-002 — System successfully identifies a valid city automatically @P0 @Smoke', async ({ locationModule }) => {
    await test.step('grant Mumbai geolocation before navigation', async () => {
      await locationModule.detectLocationAutomatically();
    });

    await test.step('the detected city is shown in the header', async () => {
      await locationModule.expectHeaderCity('Mumbai');
    });
  });

  test('LOC-003 — System prompts for manual city selection if auto-detection fails @P1 @Regression', async ({ locationModule }) => {
    await test.step('open a fresh session with no geolocation permission granted', async () => {
      await locationModule.gotoFresh();
    });

    await test.step('clicking "Cancel" on the Enable Location modal opens manual city selection', async () => {
      await locationModule.clickCancelOpensManualSelection();
    });
  });

  test.fixme(
    'LOC-004 — Location permission options displayed on the app @P1 @Regression — OUT OF SCOPE: this is a Web-only Playwright framework (see CLAUDE.md); TC_WEB_033 describes a native-app "Enable Location" screen with Enable Location/Use current location + Select Location Manually options that has no meaningful web equivalent to automate.',
    () => {},
  );

  test.fixme(
    'LOC-005 — Location permission options displayed on the web/M-site @P1 @Regression — BLOCKED: grounded 2026-09-22 — the real web modal has exactly two buttons, "Cancel" and "Enable" (confirmed via full dialog text dump). No "Allow while visiting the site / Allow this time / Never allow" banner exists anywhere on this build. See LOC-001 for the real modal this ticket scenario actually maps to.',
    () => {},
  );

  test.fixme(
    'LOC-006 — User allows location access on the app @P0 @Smoke — OUT OF SCOPE: native-app-only ("Allow while using the app" from a native OS popup) — no web equivalent. The closest web mechanism ("Enable" button) does not reliably complete detection either — see LOC-007.',
    () => {},
  );

  test.fixme(
    'LOC-007 — User allows location access on web/M-site @P1 @Regression — BLOCKED: grounded 2026-09-22 — clicking the real "Enable" button, even with `context.grantPermissions([\'geolocation\'])` granted immediately beforehand, did not close the modal or update the header city within a 4s wait across repeated attempts. This is a different code path than the in-panel "Tap to share location" button (CitySelectionPage.shareLocationButton), which IS proven working (see city-selection.spec.ts CTY-010).',
    () => {},
  );

  test.fixme(
    'LOC-008 — User allows location access for the current session on the app @P1 @Regression — OUT OF SCOPE: native-app-only ("Allow this time" popup); also inherits the LOC-007 "Enable" button unreliability on Web.',
    () => {},
  );

  test.fixme(
    'LOC-009 — User allows location access for the current session on web/M-site @P1 @Regression — BLOCKED: same as LOC-005 — no "Allow this time" banner option exists; same "Enable" button unreliability as LOC-007.',
    () => {},
  );

  test.fixme(
    'LOC-010 — User denies location access on the app @P0 @Smoke — OUT OF SCOPE: native-app-only ("Don\'t allow" from a native OS popup). The functional web equivalent (denying by clicking "Cancel") is already covered, real and passing, as LOC-003.',
    () => {},
  );

  test.fixme(
    'LOC-011 — User denies location access on web/M-site @P1 @Regression — BLOCKED: same as LOC-005 — no "Never allow" banner option exists. The only real deny path on Web is "Cancel", already covered by LOC-003.',
    () => {},
  );

  // Grounded 2026-09-22 (re-grounded after an initial inconclusive pass): pressing Escape does
  // NOT dismiss the Enable Location modal and does NOT open manual city selection — the modal
  // and its buttons remain exactly as they were. Contradicts the PRD's "triggers manual city
  // selection" expectation for a dismissed prompt; the only real dismiss path is "Cancel" (LOC-003).
  test('LOC-013 — User dismisses the location permission prompt @P1 @Regression', async ({ locationModule }) => {
    await test.step('open a fresh session — the Enable Location modal appears', async () => {
      await locationModule.gotoFresh();
      await locationModule.expectEnableLocationModalVisible();
    });

    await test.step('press Escape', async () => {
      await locationModule.pressEscapeOnEnableLocationModal();
    });

    await test.step('REAL: the modal remains open — Escape has no dismiss effect on this build', async () => {
      await locationModule.expectEnableLocationModalVisible();
    });
  });

  test.fixme(
    'LOC-014 — Location detection failure due to network/API error @P1 @Regression — BLOCKED, REAL PRODUCT GAP: grounded 2026-09-22 — clicking "Enable" while geolocation permission is blocked leaves the Enable Location modal open silently; no error message of any kind is shown (confirmed via full dialog-text and heading-role scans). Directly contradicts the PRD\'s "displays an error message" expectation — documented as a real gap, not asserted as if the error message existed.',
    () => {},
  );

  test('LOC-032 — Location services inactive @P1 @Regression', async ({ locationModule }) => {
    await test.step('open a fresh session with location services effectively inactive (no permission granted)', async () => {
      await locationModule.gotoFresh();
    });

    await test.step('the system prompts to enable location services or select a city manually', async () => {
      await locationModule.expectEnableLocationModalVisible();
    });
  });

  test('LOC-033 — No network connectivity @P1 @Regression', async ({ locationModule }) => {
    await test.step('a fully offline context fails navigation outright — confirmed live there is no in-app error banner reachable before the app\'s JS ever loads', async () => {
      await locationModule.gotoOfflineAndExpectNavigationFails();
    });
  });

  test.fixme(
    'LOC-034 — Partial network connectivity @P1 @Regression — BLOCKED, REAL PRODUCT GAP: grounded 2026-09-22 — aborting only the location/city-related API calls (route interception matching /location|geo|city/i) while letting the rest of the page load leaves the app in a silent indeterminate state: no Enable Location modal, no header city, no cityDetails cookie, and no error message of any kind. Same real gap as LOC-014/LOC-020 — documented, not asserted as if the app recovered gracefully.',
    () => {},
  );

  // --- City-change nudge (LOC-012, 019, 022, 023, 031) ---

  test('LOC-012 — System detects a city change and prompts for confirmation @P1 @Regression', async ({ locationModule }) => {
    await test.step('establish Mumbai as the saved city', async () => {
      await locationModule.detectLocationAutomatically();
    });

    await test.step('switch geolocation to Delhi and reload — a genuine detected-vs-saved mismatch', async () => {
      await locationModule.triggerCityChangeNudge();
    });

    await test.step('the city-change nudge appears', async () => {
      await locationModule.expectCityChangeNudgeVisible();
    });
  });

  test('LOC-019 — Nudge displayed when detected city differs from saved city @P0 @Smoke', async ({ locationModule }) => {
    await test.step('establish Mumbai as the saved city', async () => {
      await locationModule.detectLocationAutomatically();
    });

    await test.step('switch geolocation to Delhi and reload', async () => {
      await locationModule.triggerCityChangeNudge();
    });

    await test.step('the nudge asks the user to confirm updating the saved city', async () => {
      await locationModule.expectCityChangeNudgeVisible();
    });
  });

  test('LOC-022 — User confirms a city change @P0 @Smoke', async ({ locationModule }) => {
    await test.step('trigger a genuine Mumbai-to-Delhi mismatch', async () => {
      await locationModule.detectLocationAutomatically();
      await locationModule.triggerCityChangeNudge();
      await locationModule.expectCityChangeNudgeVisible();
    });

    await test.step('accept the city change', async () => {
      await locationModule.acceptCityChange();
    });

    await test.step('the detected city (Delhi) becomes the new saved city', async () => {
      expect(await locationModule.getSavedCityName()).toBe('Delhi');
    });
  });

  test('LOC-023 — User declines a city change @P1 @Regression', async ({ locationModule }) => {
    await test.step('trigger a genuine Mumbai-to-Delhi mismatch', async () => {
      await locationModule.detectLocationAutomatically();
      await locationModule.triggerCityChangeNudge();
      await locationModule.expectCityChangeNudgeVisible();
    });

    await test.step('decline the city change', async () => {
      await locationModule.declineCityChange();
    });

    await test.step('the previously saved city (Mumbai) is retained', async () => {
      expect(await locationModule.getSavedCityName()).toBe('Mumbai');
    });
  });

  // Grounded 2026-09-22: after the nudge is shown once for a mismatch and declined, reloading
  // again with the SAME still-unresolved mismatch does NOT show it a second time — a real
  // one-time-trigger, matching the PRD's intent even though it wasn't grounded on first pass.
  test('LOC-031 — Frequency and logic of the city-change nudge @P1 @Regression', async ({ locationModule }) => {
    await test.step('trigger a Mumbai-to-Delhi mismatch and decline it', async () => {
      await locationModule.detectLocationAutomatically();
      await locationModule.triggerCityChangeNudge();
      await locationModule.expectCityChangeNudgeVisible();
      await locationModule.declineCityChange();
    });

    await test.step('reload again with the same unresolved mismatch', async () => {
      await locationModule.reload();
    });

    await test.step('REAL: the nudge does not reappear for the same already-declined mismatch', async () => {
      await locationModule.expectCityChangeNudgeNotVisible();
    });
  });

  // --- Manual selection, Settings/Cancel & storage persistence (LOC-015–018, 020, 021, 024–030) ---

  // Grounded 2026-09-22: literal open-ocean coordinates still resolve to a real saved city
  // ("Delhi") rather than hanging or showing a "non-serviceable" message — see
  // LocationHelper.NON_SERVICEABLE_GEOLOCATION's doc comment for the wider finding (detection
  // appears to only ever resolve to the nearer of two hub cities, Mumbai/Delhi, not genuine
  // reverse-geocoding — confirmed via a 5-point coordinate comparison including real Bangalore
  // coordinates, which also resolved to "Mumbai").
  test('LOC-015 — Detection of a non-serviceable city @P1 @Regression', async ({ locationModule }) => {
    await test.step('grant geolocation for coordinates far outside any serviceable area', async () => {
      await locationModule.detectNonServiceableLocation();
    });

    await test.step('REAL: the system still falls back to a real city rather than hanging or erroring (the nearer of its two hub cities, not necessarily a genuinely "nearby" one)', async () => {
      await locationModule.expectHeaderCity('Delhi');
    });
  });

  // Grounded 2026-09-22: real Gurgaon coordinates resolve to "Delhi", NOT "Delhi-NCR" as the PRD
  // assumes — sub-city-level precision is not observed via geolocation at all on this build.
  test('LOC-016 — Detection of sub-cities within Delhi NCR or Mumbai All @P1 @Regression', async ({ locationModule }) => {
    await test.step('grant geolocation for real Gurgaon coordinates (a Delhi-NCR sub-city)', async () => {
      await locationModule.detectGurgaonLocation();
    });

    await test.step('REAL: resolves to "Delhi" (a hub city), not "Delhi-NCR" as the PRD assumes', async () => {
      await locationModule.expectHeaderCity('Delhi');
    });
  });

  test('LOC-017 — Data storage behavior for guest users @P1 @Regression', async ({ locationModule }) => {
    await test.step('open a fresh session and select a city manually as a guest', async () => {
      await locationModule.gotoFresh();
      await locationModule.clickCancelOpensManualSelection();
      await locationModule.selectCityManually('Chennai');
    });

    await test.step('the city is stored in the cityDetails cookie for the session', async () => {
      expect(await locationModule.getSavedCityName()).toBe('Chennai');
    });
  });

  test.fixme(
    'LOC-018 — Data storage behavior for logged-in users @P1 @Regression — BLOCKED, REAL PRODUCT GAP: grounded 2026-09-22, CORRECTED after an initial false-positive — an early pass tested with a value (Mumbai) that coincidentally equals the universal default every fresh account gets, which wrongly looked like sync. A proper control using a DIFFERENT city (Chennai, session A manually selected it) disproved it: session B, logging in with the SAME phone number right after, still showed "Mumbai" — the default, not the previously selected city. City selection does NOT sync to the account across sessions; only the local `cityDetails` cookie (LOC-017/029) persists. Documented as a real gap, not asserted as if sync existed.',
    () => {},
  );

  test.fixme(
    'LOC-020 — Location service failure @P1 @Regression — BLOCKED, REAL PRODUCT GAP: grounded 2026-09-22 — forcing `navigator.geolocation.getCurrentPosition` to fail with a real `POSITION_UNAVAILABLE` error (distinct from permission being blocked, which is LOC-014) while permission is otherwise granted leaves the app in a silent indeterminate state: no Enable Location modal, no header city, no cityDetails cookie, and no error message of any kind. Same real gap as LOC-014/LOC-034 — documented, not asserted as if the app recovered gracefully.',
    () => {},
  );

  test('LOC-021 — Manual city selection process @P0 @Smoke', async ({ locationModule }) => {
    await test.step('open a fresh session and open manual city selection', async () => {
      await locationModule.gotoFresh();
      await locationModule.clickCancelOpensManualSelection();
    });

    await test.step('choose a city from the list', async () => {
      await locationModule.selectCityManually('Bangalore');
    });

    await test.step('the selected city is displayed', async () => {
      await locationModule.expectHeaderCity('Bangalore');
    });
  });

  test.fixme(
    'LOC-024 — User selects "Settings" to enable location services @P1 @Regression — OUT OF SCOPE: the real Enable Location modal has only "Cancel"/"Enable" (confirmed 2026-09-22) — there is no separate "Settings" option or nested popup to click; a device-settings redirect is a native-app-only concept regardless.',
    () => {},
  );

  test.fixme(
    'LOC-025 — User selects "Cancel" on the location services popup @P1 @Regression — OUT OF SCOPE: describes a secondary app-only "location services off" popup with its own Settings/Cancel pair, distinct from the main Enable Location screen — confirmed not present on Web (only one modal, two buttons total, exists).',
    () => {},
  );

  // Grounded 2026-09-22: the real cityDetails cookie carries a genuine ~30-day expiry. Force-
  // expiring it directly (rather than just clearing it) and reloading reliably brings back the
  // real Enable Location modal — a clean, real proxy for "guest session expired, re-prompted".
  test('LOC-026 — Guest user\'s session expires @P1 @Regression', async ({ locationModule }) => {
    await test.step('select a city as a guest via geolocation', async () => {
      await locationModule.detectLocationAutomatically();
    });

    await test.step('force-expire the saved-city cookie and reload', async () => {
      await locationModule.expireSavedCityAndReload();
    });

    await test.step('the local city data is cleared and city selection is prompted again', async () => {
      await locationModule.expectEnableLocationModalVisible();
    });
  });

  test.fixme(
    'LOC-027 — Location permission reset manually on web/M-site @P1 @Regression — BLOCKED, REAL FINDING: grounded 2026-09-22 — with a city already saved (Mumbai), calling `context.clearPermissions()` followed by a reload does NOT bring back the Enable Location modal or the permission banner; the header keeps showing the previously saved city. The app appears to gate the modal on the saved-city cookie, not live permission state. Contradicts the PRD\'s "permission banner appears again" expectation.',
    () => {},
  );

  test.fixme(
    'LOC-028 — Location permission reset manually on the app @P1 @Regression — OUT OF SCOPE: native-app-only (device settings reset); the web equivalent (LOC-027) was grounded and found not to re-trigger the modal either.',
    () => {},
  );

  test('LOC-029 — Selected city persists for the session (guest) @P1 @Regression', async ({ locationModule }) => {
    await test.step('select a city manually as a guest', async () => {
      await locationModule.gotoFresh();
      await locationModule.clickCancelOpensManualSelection();
      await locationModule.selectCityManually('Bangalore');
      await locationModule.expectHeaderCity('Bangalore');
    });

    await test.step('reload the page (navigate within the session)', async () => {
      await locationModule.reload();
    });

    await test.step('the selected city still drives the header/content', async () => {
      await locationModule.expectHeaderCity('Bangalore');
    });
  });

  test.fixme(
    'LOC-030 — Selected city persists in profile (logged-in) @P1 @Regression — BLOCKED, REAL PRODUCT GAP: same corrected finding as LOC-018 (grounded and re-confirmed 2026-09-22) — a real 2-session comparison using Chennai as an explicit control (session A manually selected it right after login; session B, same phone number, brand-new context) found session B still showed the universal default city ("Mumbai"), not Chennai. Session-level persistence (LOC-029) is real; account-level persistence is not. Documented as a real gap, not asserted as if it worked.',
    () => {},
  );

  // --- Manual city input validation & security (LOC-035–072) ---
  //
  // Grounded 2026-09-22 (see LocationModule.ts's doc comment for the full measured table): the
  // search box is a plain client-side substring filter, not a validator — payload outcomes below
  // are the REAL, measured behavior, which for several rows contradicts the ticket's PRD-derived
  // "error: city not recognized" assumption. Four categories:
  //   - cityNotFound: no substring of any real city name is present in the payload.
  //   - fullListShown: the payload strips to an effectively-empty/non-alphabetic string (numeric-
  //     only, symbol-only, non-Latin script, or a genuinely empty field) — same real mechanism
  //     already proven by CitySelectionModule's CTY-022/CTY-023.
  //   - matchesRealCities: the payload happens to contain a real city-name substring and returns
  //     genuine results — NOT rejected, regardless of what the payload otherwise contains.
  //   - identicalToBaseline: reuses CitySelectionModule's proven case-insensitivity/space-trim
  //     mechanism (CTY-007/CTY-024) with this ticket's own example strings.
  test.describe('manual entry search matrix', () => {
    const cityNotFoundCases: Array<{ locId: string; tcId: string; title: string; input: string; tag: string }> = [
      { locId: 'LOC-035', tcId: 'TC_WEB_064', title: 'invalid city name', input: 'zzzznotarealcity', tag: '@P1 @Regression' },
      { locId: 'LOC-046', tcId: 'TC_WEB_075', title: 'non-existent city name', input: 'Narnia', tag: '@P1 @Regression' },
      { locId: 'LOC-047', tcId: 'TC_WEB_076', title: 'city name with foreign characters — REAL: rejected, contradicts PRD\'s "accepted" expectation', input: 'Bogotá', tag: '@P1 @Regression' },
      { locId: 'LOC-051', tcId: 'TC_WEB_080', title: 'city name with HTML tags', input: '<b>Delhi</b>', tag: '@P1 @Regression' },
      { locId: 'LOC-053', tcId: 'TC_WEB_082', title: 'CSS code in city input', input: '.city{color:red}', tag: '@P1 @Regression' },
      { locId: 'LOC-054', tcId: 'TC_WEB_083', title: 'JSON code in city input', input: '{"city":"Delhi"}', tag: '@P1 @Regression' },
      { locId: 'LOC-055', tcId: 'TC_WEB_084', title: 'XML code in city input', input: '<city>Delhi</city>', tag: '@P1 @Regression' },
      { locId: 'LOC-056', tcId: 'TC_WEB_085', title: 'YAML code in city input', input: 'city: Delhi', tag: '@P1 @Regression' },
      { locId: 'LOC-057', tcId: 'TC_WEB_086', title: 'SQL query in city input', input: 'SELECT * FROM cities', tag: '@P1 @Regression' },
      { locId: 'LOC-058', tcId: 'TC_WEB_087', title: 'command injection attempt', input: '; rm -rf /', tag: '@P1 @Regression' },
      { locId: 'LOC-059', tcId: 'TC_WEB_088', title: 'path traversal attempt', input: '../../etc/passwd', tag: '@P1 @Regression' },
      { locId: 'LOC-060', tcId: 'TC_WEB_089', title: 'buffer overflow attempt (5000 chars) — no crash', input: 'A'.repeat(5000), tag: '@P1 @Regression' },
      { locId: 'LOC-062', tcId: 'TC_WEB_091', title: 'very long city name (300 chars)', input: 'a'.repeat(300), tag: '@P1 @Regression' },
      { locId: 'LOC-065', tcId: 'TC_WEB_094', title: 'city name with repeated characters — REAL: rejected, contradicts PRD\'s "normalized/accepted" expectation', input: 'Deelhiii', tag: '@P2 @Regression' },
      { locId: 'LOC-066', tcId: 'TC_WEB_095', title: 'hyphenated city name — REAL: rejected (hyphen breaks the match against the real "Greater Noida"), contradicts PRD\'s "accepted" expectation', input: 'Greater-Noida', tag: '@P2 @Regression' },
      { locId: 'LOC-067', tcId: 'TC_WEB_096', title: 'city name with an apostrophe', input: "O'Delhi", tag: '@P2 @Regression' },
      { locId: 'LOC-068', tcId: 'TC_WEB_097', title: 'city name with accented characters — REAL: rejected, contradicts PRD\'s "accepted" expectation (same mechanism as LOC-047)', input: 'Bogotá', tag: '@P2 @Regression' },
      { locId: 'LOC-070', tcId: 'TC_WEB_099', title: 'city name with tab characters — REAL: rejected, contradicts PRD\'s "normalized/accepted" expectation', input: 'Del\thi', tag: '@P2 @Regression' },
      { locId: 'LOC-071', tcId: 'TC_WEB_100', title: 'city name with newline characters — REAL: rejected, contradicts PRD\'s "normalized/accepted" expectation', input: 'Del\nhi', tag: '@P2 @Regression' },
    ];

    const fullListShownCases: Array<{ locId: string; tcId: string; title: string; input: string; tag: string }> = [
      { locId: 'LOC-036', tcId: 'TC_WEB_065', title: 'city name with special characters — REAL: full unfiltered list stays shown, contradicts PRD\'s "error" expectation', input: '@#$%^&*()123', tag: '@P1 @Regression' },
      { locId: 'LOC-037', tcId: 'TC_WEB_066', title: 'numeric city name — REAL: full unfiltered list stays shown, contradicts PRD\'s "error" expectation', input: '123456', tag: '@P1 @Regression' },
      { locId: 'LOC-038', tcId: 'TC_WEB_067', title: 'empty city input field — REAL: no distinct "cannot be empty" error exists; the default unfiltered view is simply what shows', input: '', tag: '@P1 @Regression' },
      { locId: 'LOC-045', tcId: 'TC_WEB_074', title: 'city name with invalid characters — REAL: full unfiltered list stays shown, contradicts PRD\'s "error" expectation (same mechanism as LOC-036)', input: '!!!???***', tag: '@P1 @Regression' },
      { locId: 'LOC-061', tcId: 'TC_WEB_090', title: 'city name with Unicode characters — REAL: non-Latin script is not matched, but shows the full list rather than a rejection, contradicting PRD\'s "accepted" expectation', input: 'दिल्ली', tag: '@P1 @Regression' },
    ];

    const matchesRealCitiesCases: Array<{ locId: string; tcId: string; title: string; input: string; expected: string[]; tag: string }> = [
      { locId: 'LOC-043', tcId: 'TC_WEB_072', title: 'duplicate city name (Bangalore appears in both Popular and All-cities lists)', input: 'Bangalore', expected: ['Bangalore'], tag: '@P1 @Regression' },
      { locId: 'LOC-044', tcId: 'TC_WEB_073', title: 'valid city name', input: 'Chennai', expected: ['Chennai'], tag: '@P1 @Regression' },
      { locId: 'LOC-048', tcId: 'TC_WEB_077', title: 'city name with emoji characters — REAL: matched (emoji effectively ignored), contradicts PRD\'s "rejected" expectation', input: 'Delhi😀', expected: ['Delhi', 'Delhi-NCR'], tag: '@P1 @Regression' },
      { locId: 'LOC-049', tcId: 'TC_WEB_078', title: 'SQL injection attempt — REAL: returns real results (coincidental "or" substring match), contradicts PRD\'s "rejected" expectation', input: "' OR '1'='1", expected: ['Bangalore', 'Gorakhpur', 'Indore', 'Jorhat', 'Mysore'], tag: '@P1 @Regression' },
      { locId: 'LOC-063', tcId: 'TC_WEB_092', title: 'very short city name (2-char fragment of a real city)', input: 'de', expected: ['Delhi'], tag: '@P1 @Regression' },
      { locId: 'LOC-064', tcId: 'TC_WEB_093', title: 'city name with mixed language characters', input: 'Delhi दिल्ली', expected: ['Delhi', 'Delhi-NCR'], tag: '@P2 @Regression' },
      { locId: 'LOC-072', tcId: 'TC_WEB_101', title: 'city name with mixed input types — REAL: matched on the intact "Delhi" prefix, contradicts PRD\'s "rejected" expectation', input: 'Delhi123!@#', expected: ['Delhi', 'Delhi-NCR'], tag: '@P1 @Regression' },
    ];

    for (const c of cityNotFoundCases) {
      test(`${c.locId} — ${c.title} (${c.tcId}) ${c.tag}`, async ({ locationModule }) => {
        await test.step('open manual city selection', async () => {
          await locationModule.openManualSelection();
        });

        await test.step(`search "${c.input.slice(0, 40)}" — expect "City Not Found!" with no crash`, async () => {
          await locationModule.searchCity(c.input);
          await locationModule.expectCityNotFound();
        });
      });
    }

    for (const c of fullListShownCases) {
      test(`${c.locId} — ${c.title} (${c.tcId}) ${c.tag}`, async ({ locationModule }) => {
        await test.step('open manual city selection', async () => {
          await locationModule.openManualSelection();
        });

        await test.step(`search "${c.input.slice(0, 40)}" — expect the full unfiltered list to stay shown`, async () => {
          if (c.input) await locationModule.searchCity(c.input);
          await locationModule.expectFullListStillShown();
        });
      });
    }

    const noScriptExecutionCases: Array<{ locId: string; tcId: string; title: string; input: string; tag: string }> = [
      { locId: 'LOC-050', tcId: 'TC_WEB_079', title: 'XSS injection attempt — no native dialog fires, proving no script execution', input: '<script>alert(1)</script>', tag: '@P1 @Regression' },
      { locId: 'LOC-052', tcId: 'TC_WEB_081', title: 'JavaScript code in city input — no native dialog fires, proving no script execution', input: '<script>alert(document.cookie)</script>', tag: '@P1 @Regression' },
    ];

    for (const c of noScriptExecutionCases) {
      test(`${c.locId} — ${c.title} (${c.tcId}) ${c.tag}`, async ({ locationModule }) => {
        await test.step('open manual city selection', async () => {
          await locationModule.openManualSelection();
        });

        await test.step(`search "${c.input}" — no script executes, panel survives`, async () => {
          await locationModule.expectNoScriptExecutionOnSearch(c.input);
        });
      });
    }

    for (const c of matchesRealCitiesCases) {
      test(`${c.locId} — ${c.title} (${c.tcId}) ${c.tag}`, async ({ locationModule }) => {
        await test.step('open manual city selection', async () => {
          await locationModule.openManualSelection();
        });

        await test.step(`search "${c.input}" — expect real matching results`, async () => {
          await locationModule.searchCity(c.input);
          await locationModule.expectSearchResultsInclude(c.expected);
        });
      });
    }

    test('LOC-041 — City name with mixed case letters (dElHi vs Delhi) @P2 @Regression (TC_WEB_070)', async ({ locationModule }) => {
      await test.step('open manual city selection', async () => {
        await locationModule.openManualSelection();
      });

      await test.step('"dElHi" and "Delhi" return identical result sets', async () => {
        await locationModule.expectSearchResultsIdentical('dElHi', 'Delhi');
      });
    });

    test('LOC-042 — City name with leading/trailing spaces ( Delhi  vs Delhi) @P2 @Regression (TC_WEB_071)', async ({ locationModule }) => {
      await test.step('open manual city selection', async () => {
        await locationModule.openManualSelection();
      });

      await test.step('" Delhi " and "Delhi" return identical result sets', async () => {
        await locationModule.expectSearchResultsIdentical(' Delhi ', 'Delhi');
      });
    });

    test.fixme(
      'LOC-039 — City name at the boundary of valid input length @P1 @Regression (TC_WEB_068) — NOT APPLICABLE: grounded 2026-09-22 — the search input carries no `maxlength` attribute; there is no distinct length-boundary code path to test beyond the general substring-match behavior already covered by the other rows in this matrix.',
      () => {},
    );

    test.fixme(
      'LOC-040 — City name exceeding the maximum input length @P1 @Regression (TC_WEB_069) — NOT APPLICABLE: same finding as LOC-039 — no `maxlength` is enforced. LOC-062 (a 300-char string) already demonstrates a very long input is handled without crashing, for the same real reason (no substring match), not because of a length limit.',
      () => {},
    );

    test('LOC-069 — City name with spaces between characters ("D e l h i") @P2 @Regression (TC_WEB_098)', async ({ locationModule }) => {
      // Grounded 2026-09-22: internal tab ("Del\thi") and newline ("Del\nhi") characters both
      // broke the substring match (see LOC-070/LOC-071 above, cityNotFoundCases) — a plain space
      // is the same whitespace class, so this generalizes that measured pattern rather than
      // asserting an unmeasured payload's outcome from scratch.
      await test.step('open manual city selection', async () => {
        await locationModule.openManualSelection();
      });

      await test.step('internal spaces break the substring match, same as tab/newline characters', async () => {
        await locationModule.searchCity('D e l h i');
        await locationModule.expectCityNotFound();
      });
    });
  });
});
