import { test, expect } from '@fixtures/index';
import { mockOtpApis, DataGenerator } from '@utils/index';
import { registerLoginData } from '@testdata/registerLoginData';
import { RegisterLoginModule } from '@modules/RegisterLoginModule';

/**
 * Ticket: requirements/register-login.md (PVR INOX PRD UC 3, pages 11-22).
 *
 * Every test mocks the OTP/registration network calls (src/utils/OtpMock.ts) instead of
 * hitting real backend APIs — config.baseUrl points at production (www.pvrinox.com) and no
 * OTP bypass / test phone / staging environment is configured, so no test here may trigger
 * a real SMS send. See the ticket's "APIs" note: the mocked contract is a best-effort model
 * of PRD-documented behavior, not a captured real contract.
 *
 * Locators in RegisterLoginPage are unverified against the live app (Playwright MCP could
 * not launch a browser display in this environment). Treat failures here first as a locator
 * grounding/healing task, not necessarily a product defect, until a Healer pass with live
 * MCP/Chrome evidence confirms otherwise.
 *
 * UPDATE (2026-08-24): the note above (and the stale 2026-08-18 "OTP-entry screen never
 * renders" reason on many fixmes below) predates a fix landed in login.spec.ts on 2026-08-20 —
 * `BASE_URL` points at UAT (`inox-uat-web.pvrinox.com`), not production, and UAT's real OTP
 * backend (`uat-api.pvrinox.com/customer/api/v1/auth/*`, confirmed via live network capture)
 * accepts any 6-digit code as valid (e.g. `'739416'`), unlike `OtpMock.ts`'s guessed
 * `inox-uat-web.pvrinox.com` route patterns, which never intercept real traffic here. 19
 * REG-* tests carrying that stale reason (REG-001/002/007/008/013/014/015/019/021/023/024/
 * 025/027/029/031/032/036/039/040) were re-grounded live this pass against the real UAT flow
 * (network capture + a running headless-Playwright session — see scratchpad ground*.js
 * scripts): 17 converted to real passing tests, 2 (REG-007, REG-013) stay `test.fixme()` for
 * fresh, independently re-verified reasons. Key live findings this pass:
 * - The real `verify-otp` endpoint (`uat-api.pvrinox.com/customer/api/v1/auth/verify-otp`) CAN
 *   be intercepted with `page.route()` and fulfilled with a custom error body — confirmed live:
 *   whatever `message` string the mocked response carries is rendered verbatim as the on-page
 *   error text, with no strict schema validation observed. This is what REG-019/021/029/032
 *   use to force invalid-OTP / lockout / deactivated-account states that UAT's real backend
 *   (which accepts any code) can't produce natively.
 * - The header "User Icon" opens an account panel whose content differs by auth state: a
 *   guest/logged-out session shows only "Login / Customer Experience / Settings"; an
 *   authenticated one shows the account's name, phone, email (with a "Verify" affordance next
 *   to an unverified email), "My Bookings", etc., and no "Login" button at all. See
 *   `RegisterLoginPage.openAccountPanel`'s note (added this pass).
 * - "Continue as Guest" does not exist anywhere in that account panel on this UAT build
 *   (independently re-confirmed live, matching login.spec.ts's 2026-08-20 TC_ADM_013 finding) —
 *   REG-013 stays `test.fixme()` for this reason, not the stale OTP one.
 * - There is no "Verify Email" control on the Registration Details form itself (matches
 *   registration.spec.ts's TC_ADM_113 finding) — REG-007 stays `test.fixme()`. A "Verify"
 *   affordance does exist in the post-login account panel, but confirming its actual behavior
 *   hit repeated real-site load flakiness in this pass's grounding budget; worth a dedicated
 *   follow-up.
 * - `PATCH /customer/api/v1/customer` (registration submit) echoes `firstName`/`lastName` back
 *   in plaintext (unlike `phone`/`email`, which are encrypted blobs over the wire) — REG-031
 *   uses this real response, plus the account panel, as its "reflects account fields" proxy.
 *
 * UPDATE (2026-08-26): REG-012 (outside the 19 re-grounded above) was left as a real test in
 * that pass despite depending on the same "Continue as Guest" control — confirmed live it
 * consistently fails, for the identical reason REG-013 already documents. Now `test.fixme()`
 * for the same reason rather than staying a real test against a feature that doesn't exist.
 */

/**
 * Real UAT verify-otp endpoint — used by REG-019/020/021/022/029/031/032 to force invalid-OTP /
 * expired / lockout / rate-limited / deactivated-account states that UAT's real backend (which
 * now genuinely validates OTPs against `config.otpBypassCode`, not "any 6-digit code") can't
 * produce natively.
 *
 * BUG FIX (2026-09-09): the previous pattern here, `uat-api.pvrinox.com/customer/api/v1/auth/
 * verify-otp` (confirmed live 2026-08-24 via network capture, at the time genuinely correct),
 * targeted the OLD UAT domain's cross-origin API gateway. UAT has since moved to
 * `uat-web.pvrinox.com`, whose backend calls a same-origin route instead — confirmed live via a
 * real `verify-phone-otp` request/response capture (see `otp-flow-automation-solved` project
 * memory) — so the old cross-origin pattern now never matches anything and these tests silently
 * fell through to the real (now genuinely OTP-validating) backend, which can produce a generic
 * "invalid OTP" rejection but not these tests' more specific fake states. Same real path
 * `OtpMock.ts`'s `VERIFY_OTP_PATTERN` already uses — duplicated here (not reused directly)
 * because this file needs its own `page.route()` per test.
 */
const REAL_VERIFY_OTP = /\/api\/verify-phone-otp/i;
// Same domain-migration fix as REAL_VERIFY_OTP above — was `uat-api.pvrinox.com/customer/api/v1/
// auth/send-otp`, now the confirmed real same-origin path.
const REAL_SEND_OTP = /\/api\/send-phone-otp/i;

test.describe('Register/Login Screens @RUN7', () => {
  test.beforeEach(async ({ page }) => {
    await mockOtpApis(page);
  });

  test.describe('Positive', () => {

    test('REG-001 — Manual login: existing user with valid phone + OTP @P0 @Smoke', async ({ registerLoginModule, registrationModule, page }) => {
      const phone = DataGenerator.randomIndianPhoneNumber();

      await test.step('register the account once so the phone number becomes an "existing user"', async () => {
        await registerLoginModule.gotoLogin();
        await registerLoginModule.submitPhoneNumber(phone);
        await registerLoginModule.submitOtp('739416');
        await registrationModule.fillRegistrationDetails('Existing', 'User', DataGenerator.uniqueEmail('qa.reg001'));
        await registrationModule.submitRegistrationForm();
        await registerLoginModule.expectOnHome();
      });

      await test.step('logging in again with the same phone from a fresh session auto-verifies on OTP entry and lands on Home directly, with no registration form re-shown', async () => {
        const browser = page.context().browser();
        if (!browser) throw new Error('no Browser handle available to open a second session');
        const freshContext = await browser.newContext();
        try {
          const freshPage = await freshContext.newPage();
          const freshModule = new RegisterLoginModule(freshPage);
          await freshModule.gotoLogin();
          await freshModule.submitPhoneNumber(phone);
          await freshModule.submitOtp('739416');
          await freshModule.expectOnHome();
        } finally {
          await freshContext.close();
        }
      });
    });


    test('REG-002 — Manual registration: new user with valid phone + OTP + mandatory details @P0 @Smoke', async ({ registerLoginModule, registrationModule }) => {
      const phone = DataGenerator.randomIndianPhoneNumber();

      await test.step('verify OTP for an unregistered number and reach Registration Details', async () => {
        await registerLoginModule.gotoLogin();
        await registerLoginModule.submitPhoneNumber(phone);
        await registerLoginModule.submitOtp('739416');
        await registrationModule.expectRegistrationFieldsAccessible();
      });

      await test.step('entering the mandatory First Name + Email and submitting creates the account and lands on Home', async () => {
        await registrationModule.fillRegistrationDetails('New', 'User', DataGenerator.uniqueEmail('qa.reg002'));
        await registrationModule.submitRegistrationForm();
        await registerLoginModule.expectOnHome();
      });
    });


    // REG-001 is now a real, grounded, passing test (see above) — implemented for real here too.
    // Grounded 2026-09-07: a genuine OS-level clipboard paste (grantPermissions(['clipboard-write'])
    // + navigator.clipboard.writeText + Ctrl+V) hangs indefinitely in this headless sandbox (same
    // finding otp-screen.spec.ts's TC_ADM_069 already documents) — RegisterLoginPage.pasteOtp
    // dispatches a real `paste` ClipboardEvent instead (observable by any real paste-handler on the
    // field) and applies the value via the input's native setter + a real `input` event, since a
    // synthetic event's default browser action (actually inserting clipboard text) doesn't fire on
    // its own. Confirmed live: the pasted OTP is accepted identically to a typed/filled one.
    test('REG-006 — OTP entered via paste @P2 @Regression', async ({ registerLoginModule }) => {
      await test.step('request OTP for a fresh phone number', async () => {
        await registerLoginModule.gotoLogin();
        await registerLoginModule.submitPhoneNumber(DataGenerator.randomIndianPhoneNumber());
        await registerLoginModule.expectOtpScreenLoaded();
      });

      await test.step('pasting a valid OTP (via a real paste event, not typed/filled entry) is accepted and logs in', async () => {
        await registerLoginModule.pasteOtp('739416');
        await registerLoginModule.expectOnHome();
      });
    });



    test('REG-008 — Registration: email verification skipped, account still created as Unverified @P1 @Regression', async ({ registerLoginModule, registrationModule }) => {
      await test.step('reach Registration Details and fill mandatory fields without attempting any email verification', async () => {
        await registerLoginModule.gotoLogin();
        await registerLoginModule.submitPhoneNumber(DataGenerator.randomIndianPhoneNumber());
        await registerLoginModule.submitOtp('739416');
        // Grounded live 2026-08-24 (matches registration.spec.ts TC_ADM_113): there is no
        // "Verify Email" control anywhere on the real Registration Details form itself, so
        // skipping isn't a user choice here — it's the only path. Proving registration still
        // succeeds without it, and that the account is left unverified, is what "skippable"
        // means when the in-form control is simply absent.
        await registrationModule.fillRegistrationDetails('Skip', 'Verify', DataGenerator.uniqueEmail('qa.skipverify'));
      });

      await test.step('registration succeeds, and the account panel shows a "Verify" affordance next to the email — the confirmed real signal the email is unverified (grounded live 2026-08-24)', async () => {
        await registrationModule.submitRegistrationForm();
        await registerLoginModule.expectOnHome();
        await registerLoginModule.openAccountPanel();
        await registerLoginModule.expectVerifyEmailAffordanceVisible();
      });
    });


    test('REG-014 — Resend OTP after 60s cooldown sends a new OTP @P1 @Regression', async ({ registerLoginModule, registerLoginPage }) => {
      // Grounded 2026-08-20/24 elsewhere in this suite (login.spec.ts TC_ADM_005, otp-screen
      // .spec.ts TC_ADM_066/088): the real cooldown runs well past the sheet's nominal 60s and
      // grows further under parallel-worker load — mirroring their extended budget here.
      test.setTimeout(240_000);

      await test.step('reach the OTP screen (resend starts disabled)', async () => {
        await registerLoginModule.gotoLogin();
        await registerLoginModule.submitPhoneNumber(DataGenerator.randomIndianPhoneNumber());
        await registerLoginModule.expectOtpScreenLoaded();
      });

      await test.step('resend becomes enabled once the cooldown lifts, and resending restarts it — the confirmed real signal a new OTP was issued (otp-screen.spec.ts TC_ADM_088 grounding: no "new OTP sent" text exists on this build to assert instead)', async () => {
        await registerLoginModule.expectResendOtpEnabled(220_000);
        await registerLoginModule.resendOtp();
        await expect(registerLoginPage.resendOtpButton()).toBeDisabled();
      });

      await test.step('the freshly issued OTP still verifies and completes login', async () => {
        await registerLoginModule.submitOtp('739416');
        await registerLoginModule.expectOnHome();
      });
    });


    test('REG-015 — Second device login succeeds while first session remains active @P1 @Regression', async ({ registerLoginModule, registrationModule, browser }) => {
      // Grounded 2026-08-24: two full real login/registration round trips (Device A + Device
      // B) plus two account-panel checks against real UAT latency don't fit the default 60s
      // test timeout — same reasoning as REG-014's extended budget above.
      test.setTimeout(240_000);
      const phone = DataGenerator.randomIndianPhoneNumber();

      await test.step('log in on the first session (Device A), registering the new account', async () => {
        await registerLoginModule.gotoLogin();
        await registerLoginModule.submitPhoneNumber(phone);
        await registerLoginModule.submitOtp('739416');
        await registrationModule.fillRegistrationDetails('DeviceA', 'User', DataGenerator.uniqueEmail('qa.devicea'));
        await registrationModule.submitRegistrationForm();
        await registerLoginModule.expectOnHome();
      });

      await test.step('Device A is confirmed logged in via the account panel (grounded live 2026-08-24: an authenticated panel has no "Login" button)', async () => {
        await registerLoginModule.expectLoggedInViaAccountPanel();
      });

      await test.step('log in with the SAME account on a second device (Device B) — within the default 2-device limit, no warning expected', async () => {
        const deviceBContext = await browser.newContext();
        try {
          const deviceBPage = await deviceBContext.newPage();
          const deviceBModule = new RegisterLoginModule(deviceBPage);
          await deviceBModule.gotoLogin();
          await deviceBModule.submitPhoneNumber(phone);
          await deviceBModule.submitOtp('739416');
          await deviceBModule.expectOnHome();
          await deviceBModule.expectLoggedInViaAccountPanel();
        } finally {
          await deviceBContext.close();
        }
      });

      await test.step('Device A remains logged in — the second device\'s login did not force it out', async () => {
        await registerLoginModule.expectLoggedInViaAccountPanel();
      });
    });
  });

  test.describe('Negative', () => {
    // Bug fix (2026-08-27): `submitPhoneNumber` also clicks "Get OTP" — but an invalid phone
    // number leaves that button disabled via real-time client-side validation (same finding
    // already documented for TC_ADM_085 in otp-screen.spec.ts), so the click half of
    // `submitPhoneNumber` timed out waiting for a button that never enables. `fillPhoneNumberOnly`
    // (fill, no click) reaches the reactive validation error directly, matching TC_ADM_085's
    // own working pattern.
    test('REG-016 — Phone not starting with 6/7/8/9 is rejected @P0 @Smoke', async ({ registerLoginModule }) => {
      await test.step('enter an invalid phone number', async () => {
        await registerLoginModule.gotoLogin();
        await registerLoginModule.fillPhoneNumberOnly(registerLoginData.invalidPhoneWrongPrefix);
      });

      await test.step('validation error is shown, OTP is not sent', async () => {
        await registerLoginModule.expectFieldError(/please enter a valid phone number/i);
      });
    });

    // Bug fix (2026-08-27): confirmed live this validation has its own, distinct copy —
    // "Phone number must contain exactly 10 digits." — separate from the wrong-prefix case's
    // "please enter a valid phone number" (REG-016). The sheet/prior assertion checked the
    // wrong-prefix regex for this scenario.
    test('REG-017 — Phone with wrong digit count is rejected @P1 @Regression', async ({ registerLoginModule }) => {
      await test.step('enter a too-short phone number', async () => {
        await registerLoginModule.gotoLogin();
        await registerLoginModule.fillPhoneNumberOnly(registerLoginData.invalidPhoneTooShort);
      });

      await test.step('validation error is shown', async () => {
        await registerLoginModule.expectFieldError(/phone number must contain exactly 10 digits/i);
      });
    });


    test('REG-019 — Wrong OTP entered keeps user on OTP screen with error @P0 @Smoke', async ({ registerLoginModule, page }) => {
      // Grounded live 2026-08-24: UAT's real verify-otp backend accepts any 6-digit code, so
      // there's no wrong-OTP rejection to observe natively — but page.route() on the REAL
      // backend domain+path (unlike OtpMock.ts's dead inox-uat-web.pvrinox.com patterns) DOES
      // intercept, and the app renders whatever `message` string a mocked error response
      // carries verbatim. Forcing that response is a stronger, live-network-confirmed
      // substitute for the PRD's invalid-OTP state.
      await page.route(REAL_VERIFY_OTP, async (route) => {
        await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ statusCode: 400, messageType: 'Error', message: 'You have entered invalid OTP.', data: null }) });
      });

      await test.step('request OTP and submit an incorrect code', async () => {
        await registerLoginModule.gotoLogin();
        await registerLoginModule.loginWithPhoneAndOtp(DataGenerator.randomIndianPhoneNumber(), registerLoginData.wrongOtp);
      });

      await test.step('user stays on the OTP screen with the invalid-OTP error shown', async () => {
        await registerLoginModule.expectOtpError(/invalid otp/i);
        await registerLoginModule.expectNotLoggedIn();
      });
    });

    // Grounded 2026-08-27: `OtpMock.ts`'s `mockVerifyOtp` targets a guessed, dead
    // inox-uat-web.pvrinox.com pattern (see login.spec.ts file header) — same real-domain
    // technique as REG-019/021 (which already work) fixes this for real instead of leaving it
    // fixme.
    test('REG-020 — Expired OTP shows "OTP expired" with resend option @P0 @Regression', async ({ registerLoginModule, page }) => {
      const phone = DataGenerator.randomIndianPhoneNumber();
      await page.route(REAL_VERIFY_OTP, async (route) => {
        await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ statusCode: 400, messageType: 'Error', message: 'OTP expired. Please request a new one.', data: null }) });
      });

      await test.step('submit an expired OTP', async () => {
        await registerLoginModule.gotoLogin();
        await registerLoginModule.loginWithPhoneAndOtp(phone, registerLoginData.validOtp);
      });

      await test.step('"OTP expired" message is shown', async () => {
        await registerLoginModule.expectOtpError(/otp expired/i);
      });
    });


    test('REG-021 — 3 failed OTP attempts locks the screen for 10 minutes @P0 @Regression', async ({ registerLoginModule, registerLoginPage, page }) => {
      // Same real-domain mocking technique as REG-019, with a call counter driving the 3rd
      // attempt to a lockout response instead of another invalid-OTP one — confirmed live
      // 2026-08-24 that clearing + re-filling the OTP field re-triggers a fresh verify-otp
      // request each time (a repeated identical `.fill()` alone was not independently tested).
      let attempts = 0;
      await page.route(REAL_VERIFY_OTP, async (route) => {
        attempts++;
        if (attempts < 3) {
          await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ statusCode: 400, messageType: 'Error', message: 'You have entered invalid OTP.', data: null }) });
        } else {
          await route.fulfill({ status: 429, contentType: 'application/json', body: JSON.stringify({ statusCode: 429, messageType: 'Error', message: 'Too many failed attempts. Try again after 10 minutes.', data: null }) });
        }
      });

      await test.step('enter an incorrect OTP 3 times in a row', async () => {
        await registerLoginModule.gotoLogin();
        await registerLoginModule.submitPhoneNumber(DataGenerator.randomIndianPhoneNumber());
        await registerLoginModule.expectOtpScreenLoaded();
        for (let i = 0; i < 3; i++) {
          await registerLoginPage.otpInput().fill('');
          await registerLoginModule.submitOtp(registerLoginData.wrongOtp);
        }
      });

      await test.step('screen locks with the "too many failed attempts" error', async () => {
        await registerLoginModule.expectOtpError(/too many failed attempts/i);
      });
    });

    // Grounded 2026-08-27: confirmed live the real send-otp response shares the same
    // `{statusCode, messageType, message, data}` shape as verify-otp (see REAL_VERIFY_OTP
    // usages above) — `OtpMock.ts`'s `mockSendOtp` targets a dead guessed pattern instead;
    // fixed for real via the same real-domain technique rather than left fixme.
    test('REG-022 — OTP requested beyond max allowed shows rate-limit message @P1 @Regression', async ({ registerLoginModule, page }) => {
      const phone = DataGenerator.randomIndianPhoneNumber();
      await page.route(REAL_SEND_OTP, async (route) => {
        await route.fulfill({ status: 429, contentType: 'application/json', body: JSON.stringify({ statusCode: 429, messageType: 'Error', message: 'You have requested OTP too many times. Please try again later.', data: null }) });
      });

      await test.step('request OTP beyond the configured max', async () => {
        await registerLoginModule.gotoLogin();
        await registerLoginModule.submitPhoneNumber(phone);
      });

      await test.step('rate-limit message is shown', async () => {
        await registerLoginModule.expectSendOtpRateLimited();
      });
    });


    test('REG-023 — Empty First Name keeps Submit disabled @P0 @Smoke', async ({ registerLoginModule, registrationModule }) => {
      await test.step('reach Registration Details', async () => {
        await registerLoginModule.gotoLogin();
        await registerLoginModule.submitPhoneNumber(DataGenerator.randomIndianPhoneNumber());
        await registerLoginModule.submitOtp('739416');
      });

      await test.step('Submit stays disabled while First Name is empty, even with Email filled', async () => {
        await registrationModule.expectSubmitDisabled();
        await registrationModule.fillRegistrationDetails('', '', DataGenerator.uniqueEmail('qa.emptyfirst'));
        await registrationModule.expectSubmitDisabled();
      });
    });


    test('REG-024 — First Name with digits/special characters is rejected @P1 @Regression', async ({ registerLoginModule, registerLoginPage }) => {
      await registerLoginModule.gotoLogin();
      await registerLoginModule.submitPhoneNumber(DataGenerator.randomIndianPhoneNumber());
      await registerLoginModule.submitOtp('739416');

      // Grounded live 2026-08-24 (matches registration.spec.ts TC_ADM_114/119): the real First
      // Name field has no submit-time validation error for digits/special characters — it
      // silently strips any non-letter keystroke in real time as it's typed, so "invalid"
      // characters never reach the field's value (and never reach a request) at all. This is
      // the real, observable form of "rejected" on this build.
      await test.step('digits are silently stripped as they are typed, not accepted then rejected on submit', async () => {
        await registerLoginPage.firstNameInput().pressSequentially(registerLoginData.firstNameWithDigits, { delay: 20 });
        const value = await registerLoginPage.firstNameInput().inputValue();
        expect(value).toMatch(/^[A-Za-z ]*$/);
        expect(value).not.toMatch(/\d/);
      });
    });


    test('REG-025 — Invalid email format is rejected @P0 @Smoke', async ({ registerLoginModule, registrationModule }) => {
      await registerLoginModule.gotoLogin();
      await registerLoginModule.submitPhoneNumber(DataGenerator.randomIndianPhoneNumber());
      await registerLoginModule.submitOtp('739416');

      await test.step('an invalid email format shows a real validation error', async () => {
        await registrationModule.fillRegistrationDetails('Test', 'User', registerLoginData.invalidEmailFormat);
        // Grounded live 2026-08-24 (matches login.spec.ts TC_ADM_010/registration.spec.ts
        // TC_ADM_116): real copy contains "valid email".
        await registerLoginModule.expectFieldError(/valid email/i);
      });
    });

    // Bug fix (2026-08-27): `registerNewUser` also clicks Submit at the end — but an invalid
    // email correctly leaves it disabled (confirmed live: the real error "Please enter a valid
    // email. Email should be in the format name@example.com." shows and Submit stays disabled),
    // so that click timed out waiting for a button that's never meant to enable here. Matches
    // REG-025's simpler pattern (fill only, no submit) instead. Also dropped `mockVerifyOtp` —
    // dead weight, the real backend accepts any 6-digit code without it.
    test('REG-026 — Email with multiple "@" symbols is rejected @P1 @Regression', async ({ registerLoginModule, registrationModule }) => {
      await test.step('enter an email with multiple @ symbols', async () => {
        await registerLoginModule.gotoLogin();
        await registerLoginModule.submitPhoneNumber(DataGenerator.randomIndianPhoneNumber());
        await registerLoginModule.submitOtp('739416');
        await registrationModule.fillRegistrationDetails('Asha', '', registerLoginData.invalidEmailMultipleAt);
      });

      await test.step('validation error is shown', async () => {
        await registerLoginModule.expectFieldError(/please enter a valid email/i);
      });
    });


    test('REG-027 — SQL injection payload in First Name is rejected @P1 @Regression', async ({ registerLoginModule, registerLoginPage }) => {
      await registerLoginModule.gotoLogin();
      await registerLoginModule.submitPhoneNumber(DataGenerator.randomIndianPhoneNumber());
      await registerLoginModule.submitOtp('739416');

      // Grounded live 2026-08-24 (matches registration.spec.ts TC_ADM_119): SQL metacharacters
      // are silently stripped as they're typed — only letters/spaces survive; no SQL error is
      // ever surfaced because the payload never reaches a request in the first place.
      await test.step('the SQL injection payload is stripped down to letters/spaces only', async () => {
        await registerLoginPage.firstNameInput().pressSequentially(registerLoginData.firstNameSqlInjection, { delay: 5 });
        const value = await registerLoginPage.firstNameInput().inputValue();
        expect(value).toMatch(/^[A-Za-z ]*$/);
      });
    });


    test('REG-029 — Login on an admin-deactivated account is blocked @P0 @Regression', async ({ registerLoginModule, page }) => {
      // No real deactivated test account is available on this environment (same gap
      // login.spec.ts TC_ADM_015 hit), so this forces the state via the same real-domain
      // page.route() technique proven in REG-019/021 — confirmed live 2026-08-24 that a mocked
      // 403 response on the real verify-otp endpoint renders its `message` text verbatim,
      // which the deactivation popup locator matches.
      await page.route(REAL_VERIFY_OTP, async (route) => {
        await route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({ statusCode: 403, messageType: 'Error', message: 'Your account has been deactivated by the admin. Please contact our support team for assistance.', data: null }),
        });
      });

      await test.step('attempt login on a (forced) deactivated account', async () => {
        await registerLoginModule.gotoLogin();
        await registerLoginModule.loginWithPhoneAndOtp(DataGenerator.randomIndianPhoneNumber(), registerLoginData.validOtp);
      });

      await test.step('the deactivation popup is shown and login is blocked', async () => {
        await registerLoginModule.expectDeactivatedAccountPopup();
        await registerLoginModule.expectNotLoggedIn();
      });
    });
  });

  test.describe('API parity', () => {

    test('REG-031 — OTP-verify success reflects account fields in UI @P1 @Regression', async ({ registerLoginModule, registrationModule, page }) => {
      const phone = DataGenerator.randomIndianPhoneNumber();
      const firstName = 'Reflects';
      const email = DataGenerator.uniqueEmail('qa.reflects');

      // Grounded live 2026-08-24, endpoint updated 2026-09-09: the real registration-submit
      // response echoes firstName/lastName back in plaintext (unlike phone/email, which are
      // encrypted blobs over the wire) — a real, capturable account-creation contract to assert
      // against, in the spirit of otp-screen.spec.ts TC_ADM_081's same "assert the real API, not
      // a guessed mock" proxy technique. Uses `page.waitForResponse` (armed before the triggering
      // click) rather than a `page.on('response', ...)` listener + captured variable — a first
      // attempt at the latter raced `expectOnHome()`'s own resolution and read the variable
      // before the async handler had run, so it always saw the initial `null`.
      //
      // BUG FIX (2026-09-09): was `PATCH /customer/api/v1/customer` (correct on the OLD UAT
      // domain) — confirmed live on the new `uat-web.pvrinox.com` domain the real call is
      // `PATCH /api/onboarding/customer` instead (same domain-migration bug class as
      // OtpMock.ts/REAL_VERIFY_OTP above).
      const customerResponsePromise = page.waitForResponse(
        (res) => res.request().method() === 'PATCH' && /\/api\/onboarding\/customer(\?|$)/i.test(res.url()),
      );

      await test.step('complete registration with known account details', async () => {
        await registerLoginModule.gotoLogin();
        await registerLoginModule.submitPhoneNumber(phone);
        await registerLoginModule.submitOtp('739416');
        await registrationModule.fillRegistrationDetails(firstName, '', email);
        await registrationModule.submitRegistrationForm();
        await registerLoginModule.expectOnHome();
      });

      await test.step('the real account-creation API response reflects the submitted name and a verified phone', async () => {
        const customerResponseBody = await (await customerResponsePromise).json();
        expect(customerResponseBody?.data?.firstName).toBe(firstName);
        expect(customerResponseBody?.data?.isPhoneVerified).toBe(true);
      });

      await test.step('the same name is reflected in the UI account panel (grounded live 2026-08-24)', async () => {
        await registerLoginModule.openAccountPanel();
        await registerLoginModule.expectProfileName(firstName);
      });
    });


    test('REG-032 — OTP-verify failure surfaces the exact corresponding error @P1 @Regression', async ({ registerLoginModule, page }) => {
      // Same real-domain page.route() technique as REG-019/021/029 — two independently mocked
      // outcomes on the real verify-otp endpoint, proving the UI shows the specific message a
      // response carries rather than one generic error for both.
      await test.step('an invalid-OTP response shows the invalid-OTP message', async () => {
        await page.route(REAL_VERIFY_OTP, async (route) => {
          await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ statusCode: 400, messageType: 'Error', message: 'You have entered invalid OTP.', data: null }) });
        });
        await registerLoginModule.gotoLogin();
        await registerLoginModule.loginWithPhoneAndOtp(DataGenerator.randomIndianPhoneNumber(), registerLoginData.wrongOtp);
        await registerLoginModule.expectOtpError(/invalid otp/i);
      });

      await test.step('separately, an expired-OTP response shows the expired message, not the invalid one', async () => {
        await page.unroute(REAL_VERIFY_OTP);
        await page.route(REAL_VERIFY_OTP, async (route) => {
          await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ statusCode: 400, messageType: 'Error', message: 'OTP expired', data: null }) });
        });
        await registerLoginModule.gotoLogin();
        await registerLoginModule.loginWithPhoneAndOtp(DataGenerator.randomIndianPhoneNumber(), registerLoginData.validOtp);
        await registerLoginModule.expectOtpError(/otp expired/i);
      });
    });
  });

  test.describe('Edge', () => {

    test('REG-036 — Same email verified across multiple different accounts is permitted @P2 @Regression', async ({ registerLoginModule, registrationModule }) => {
      const sharedEmail = DataGenerator.uniqueEmail('qa.shared');

      await test.step('register Account A with a shared email address', async () => {
        await registerLoginModule.gotoLogin();
        await registerLoginModule.submitPhoneNumber(DataGenerator.randomIndianPhoneNumber());
        await registerLoginModule.submitOtp('739416');
        await registrationModule.fillRegistrationDetails('AccountA', 'User', sharedEmail);
        await registrationModule.submitRegistrationForm();
        await registerLoginModule.expectOnHome();
      });

      await test.step('register Account B (different phone) with the exact same email — no 1:1 email-to-account constraint is enforced', async () => {
        await registerLoginModule.gotoLogin();
        await registerLoginModule.submitPhoneNumber(DataGenerator.randomIndianPhoneNumber());
        await registerLoginModule.submitOtp('739416');
        await registrationModule.fillRegistrationDetails('AccountB', 'User', sharedEmail);
        await registrationModule.submitRegistrationForm();
        await registerLoginModule.expectOnHome();
      });
    });


    test('REG-039 — First/Last Name at boundary lengths (1, 30 chars) are accepted @P2 @Regression', async ({ registerLoginModule, registrationModule }) => {
      await registerLoginModule.gotoLogin();
      await registerLoginModule.submitPhoneNumber(DataGenerator.randomIndianPhoneNumber());
      await registerLoginModule.submitOtp('739416');

      await test.step('a 1-character First/Last Name is accepted, no length error', async () => {
        await registrationModule.fillRegistrationDetails(registerLoginData.firstNameMinLength, registerLoginData.firstNameMinLength, DataGenerator.uniqueEmail('qa.minlen'));
        await registrationModule.expectFirstNameValue(registerLoginData.firstNameMinLength);
        await registrationModule.expectLastNameValue(registerLoginData.firstNameMinLength);
        await registrationModule.expectSubmitEnabled();
      });

      await test.step('a 30-character First/Last Name is accepted at the field\'s own cap, no length error (matches login.spec.ts TC_ADM_008/009 grounding)', async () => {
        await registrationModule.fillRegistrationDetails(registerLoginData.firstNameMaxLength, registerLoginData.firstNameMaxLength, DataGenerator.uniqueEmail('qa.maxlen'));
        await registrationModule.expectFirstNameValue(registerLoginData.firstNameMaxLength);
        await registrationModule.expectLastNameValue(registerLoginData.firstNameMaxLength);
        await registrationModule.expectSubmitEnabled();
      });
    });


    test('REG-040 — Email at boundary lengths (5, 100 chars) are accepted @P2 @Regression', async ({ registerLoginModule, registrationModule }) => {
      await registerLoginModule.gotoLogin();
      await registerLoginModule.submitPhoneNumber(DataGenerator.randomIndianPhoneNumber());
      await registerLoginModule.submitOtp('739416');

      await test.step('a 5-character email (well-formed minimum) is accepted, no length error', async () => {
        await registrationModule.fillRegistrationDetails('Test', 'User', registerLoginData.emailMinLength);
        await registrationModule.expectSubmitEnabled();
      });

      await test.step('a 100-character email (maximum) is accepted, no length error', async () => {
        await registrationModule.fillRegistrationDetails('Test', 'User', registerLoginData.emailMaxLength);
        await registrationModule.expectSubmitEnabled();
      });
    });
  });

  test.describe('Deferred — needs live grounding, real test accounts, or device/OAuth infra not available in this pass', () => {
    test.fixme('REG-003 — App auto-detects/pre-fills phone from single SIM `[Positive]` `[P2]` — needs a real mobile device/emulator SIM, not simulate-able in a browser context', () => {});
    test.fixme('REG-004 — Multiple SIMs present prompts selection `[Positive]` `[P2]` — same SIM-hardware limitation as REG-003', () => {});
    test.fixme('REG-005 — OTP auto-read from SMS `[Positive]` `[P1]` — needs a real device/SIM receiving real SMS', () => {});
    test.fixme('REG-009 — Social login (Google), existing social ID `[Positive]` `[P0]` — needs live MCP/Chrome grounding of the OAuth popup + a real test Google account', () => {});
    test.fixme('REG-010 — Social login (Apple, iOS only) `[Positive]` `[P1]` — needs live grounding + a real test Apple account; iOS-only surface', () => {});
    test.fixme('REG-011 — Social login, new social ID, missing-details flow `[Positive]` `[P0]` — depends on REG-009/010 OAuth grounding', () => {});
    test.fixme('REG-018 — SIM mismatch (intl + Indian) `[Negative]` `[P2]` — SIM-hardware limitation, same as REG-003/004', () => {});
    test.fixme('REG-028 — Social login fails (OAuth/network error) `[Negative]` `[P0]` — depends on REG-009/010 OAuth grounding to know what to intercept', () => {});
    test.fixme('REG-030 — 3rd device login shows warning popup `[Negative]` `[P1]` — needs a 3-context session-limit scenario against a real/staging backend that enforces the limit; current mock has no session-count state', () => {});
    test.fixme('REG-033 — Social "ID exists"=true skips missing-details `[API parity]` `[P1]` — depends on REG-009/010 OAuth grounding', () => {});
    test.fixme('REG-034 — Social "ID exists"=false shows missing-details `[API parity]` `[P2]` — depends on REG-009/010 OAuth grounding', () => {});
    test.fixme('REG-035 — Admin deactivation terminates active session in real time `[API parity]` `[P1]` — needs a coordinated admin-panel action mid-session; no admin API access in this pass', () => {});
    test.fixme('REG-037 — Editing email linked to social account prompts unlink confirmation `[Edge]` `[P1]` — depends on REG-009/010 OAuth grounding (must be logged in via social first)', () => {});
    test.fixme('REG-038 — App killed mid multi-device warning popup treated as Cancel `[Edge]` `[P2]` — depends on REG-030 session-limit infra', () => {});
  });
});
