# Skip Reasons — Every Skipped Test Case (test.fixme)

**Compiled:** 2026-08-21 · **Total skipped test cases: 381** · Source: `test.fixme()` grounding notes in `src/tests/*.spec.ts`. No tests re-run.

Grouped by spec file, in file order. Each row: **ID** — title (tags) — reason.

---

## Login (login.spec.ts) — 6 skipped

- **TC_ADM_003** — Invalid OTP entry (@P0 @Regression)  
  *Reason:* grounded 2026-08-20 — UAT's real OTP backend (unmocked, see file header note) accepts any 6-digit code, including '000000' — there is no invalid-OTP rejection to observe on this environment to assert against
- **TC_ADM_004** — OTP expired (@P0 @Regression)  
  *Reason:* same reason as TC_ADM_003 — UAT's real OTP backend accepts any 6-digit code, so there is no expiry/invalid rejection to observe on this environment
- **TC_ADM_013** — Continue as Guest (@P0 @Smoke)  
  *Reason:* grounded 2026-08-20 — a live check found no "Continue as Guest" control anywhere on this environment (not on the homepage, not in the account panel opened via User Icon) — the only match for "guest" on the whole page was unrelated movie-description copy. Not an overlay/timeout issue like earlier suspected; this feature does not exist on UAT to test against.
- **TC_ADM_014** — Device limit enforcement (3rd device) (@P0 @Regression)  
  *Reason:* the OTP flow itself now works (see file header note), but this needs the *same* real phone number logged in across 3+ separate real sessions/contexts in sequence to hit the limit — real-flow-testable in principle, just out of scope for this pass
- **TC_ADM_015** — Inactive/deactivated user login (@P0 @Regression)  
  *Reason:* needs a phone number for an account already deactivated on this environment — no such test account is available; not an OTP-rejection issue like TC_ADM_003/004
- **TC_ADM_016** — Max OTP attempts locks the screen (@P0 @Regression)  
  *Reason:* same reason as TC_ADM_003/004 — UAT's real OTP backend accepts any 6-digit code, so a "wrong attempts" lockout can't be triggered on this environment

## Login Validation (login-validation.spec.ts) — 1 skipped

- **TC_ADM_024** — Captcha trigger on suspicious activity (web) (@P2 @Regression)  
  *Reason:* same root cause as TC_ADM_003/004/016 (see login.spec.ts file header note) — `mockSendOtp`'s route targets `inox-uat-web.pvrinox.com/api/*`, but real OTP calls go to `uat-api.pvrinox.com`, so the mocked `captchaRequired` flag never reaches the real backend. The reCAPTCHA iframe is always present in the DOM (Google's invisible-badge widget), just never actually challenged/shown — confirmed there is no way to trigger the real captcha state without the send-otp mock actually intercepting.

## Guest Login (guest-login.spec.ts) — 1 skipped

- **TC_ADM_030** — Redirect back to original flow after login (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock

## OTP Screen (otp-screen.spec.ts) — 36 skipped

- **TC_ADM_047** — OTP screen UI loads correctly (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_048** — Edit mobile number navigates back, prefilled/editable (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_049** — OTP entry accepts only numeric input (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_050** — OTP field trims whitespace automatically (@P2 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_051** — OTP field clears after submission (@P2 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_053** — New OTP generated on return to OTP screen (@P2 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_054** — OTP reuse prevention (@P2 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_055** — Resend counter resets after successful validation (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_056** — Changing mobile mid-flow sends a new OTP to the updated number (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_057** — Dynamic resend countdown display (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_058** — Expired OTP used after timeout (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_061** — Auto-validation triggers after entering 6 digits (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_062** — Success flow with valid OTP (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_063** — Error on invalid OTP (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_064** — OTP expiry (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_065** — Resend disabled initially (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_066** — Resend enabled after timer expires (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_068** — Lockout after 3 wrong attempts (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_069** — Copy-paste OTP verifies correctly (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_070** — OTP validation API response time under 3s (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_071** — OTP resend latency under 5s (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_072** — OTP transmitted over a secure channel (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_073** — OTP value is never written to the browser console (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_076** — GA4 event fires on OTP success (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_077** — GA4 event fires on OTP resend (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_078** — Cross-browser behavior (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_079** — Web & mobile responsiveness (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_080** — Localization of OTP messages (Low)  
  *Reason:* sheet marks this conditional ("*Only if we have the localization requirement") and no locale switcher / translated copy is documented anywhere in the PRD
- **TC_ADM_081** — Login/OTP API integration payload and status codes (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_082** — Regression: core OTP flows still work end to end (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_083** — URL masking on M-site (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_085** — Error messages are plain-language and non-technical (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_087** — Wrong OTP entry (duplicate of TC_ADM_063, kept per sheet) (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_088** — OTP resend (duplicate of TC_ADM_066, kept per sheet) (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_090** — Multi-device login limit (duplicate of multi-device-login.md, kept per sheet) (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_091** — Email verification via OTP (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock

## Registration (registration.spec.ts) — 31 skipped

- **TC_ADM_107** — OTP screen appears for a new user (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_108** — Navigate to OTP screen for unregistered number, within 2s (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_109** — OTP auto-check navigates to Registration Details (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_110** — Registration Details screen elements (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_111** — Navigate to Registration Details after OTP verified (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_112** — Mandatory fields + optional email verification (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_113** — Email OTP validation updates status and reaches Home (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_114** — First Name field validation (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_115** — Last Name field validation (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_116** — Email field validation (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_117** — Email format validation (duplicate of TC_ADM_116, kept per sheet) (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_118** — Mandatory fields blank keeps Submit disabled (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_119** — Name fields reject numeric/special characters (duplicate of 114/115) (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_120** — Optional email OTP verification (duplicate of TC_ADM_112) (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_121** — Resend email OTP after 60 seconds (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_122** — Email OTP expiry behavior (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_123** — Successful account creation (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_124** — WhatsApp opt-in checkbox default-checked, togglable (@P2 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_125** — WhatsApp opt-in checkbox label copy (@P2 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_126** — Submit registration navigates to Home (duplicate of TC_ADM_123) (@P2 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_127** — URL masking / OTP security (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_128** — GA4 event fires on OTP verification (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_129** — Re-accessing registration with an already-registered mobile/email (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_130** — OTP validation API response time under 3s (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_131** — HTTPS security for OTP and registration APIs (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_132** — Accessibility labels for registration fields (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_133** — Multi-browser compatibility (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_134** — Mobile responsiveness (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_135** — URL masking for OTP endpoint, Web (duplicate of TC_ADM_127) (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_136** — Usability of registration form errors (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_137** — Login after registration is unaffected (regression) (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock

## Register/Login (register-login.spec.ts) — 34 skipped

- **REG-001** — Manual login: existing user with valid phone + OTP (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **REG-002** — Manual registration: new user with valid phone + OTP + mandatory details (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **REG-007** — Registration: optional email OTP verification completed shows Verified (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **REG-008** — Registration: email verification skipped, account still created as Unverified (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **REG-013** — Guest restricted action redirects to Login and resumes flow after login (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **REG-014** — Resend OTP after 60s cooldown sends a new OTP (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **REG-015** — Second device login succeeds while first session remains active (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **REG-019** — Wrong OTP entered keeps user on OTP screen with error (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **REG-021** — 3 failed OTP attempts locks the screen for 10 minutes (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **REG-023** — Empty First Name keeps Submit disabled (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **REG-024** — First Name with digits/special characters is rejected (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **REG-025** — Invalid email format is rejected (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **REG-027** — SQL injection payload in First Name is rejected (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **REG-029** — Login on an admin-deactivated account is blocked (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **REG-031** — OTP-verify success reflects account fields in UI (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **REG-032** — OTP-verify failure surfaces the exact corresponding error (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **REG-036** — Same email verified across multiple different accounts is permitted (@P2 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **REG-039** — First/Last Name at boundary lengths (1, 30 chars) are accepted (@P2 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **REG-040** — Email at boundary lengths (5, 100 chars) are accepted (@P2 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **REG-003** — App auto-detects/pre-fills phone from single SIM (Positive P2)  
  *Reason:* needs a real mobile device/emulator SIM, not simulate-able in a browser context
- **REG-004** — Multiple SIMs present prompts selection (Positive P2)  
  *Reason:* same SIM-hardware limitation as REG-003
- **REG-005** — OTP auto-read from SMS (Positive P1)  
  *Reason:* needs a real device/SIM receiving real SMS
- **REG-006** — OTP entered via paste (Positive P2)  
  *Reason:* low priority once REG-001 is grounded; add during Healer pass
- **REG-009** — Social login (Google), existing social ID (Positive P0)  
  *Reason:* needs live MCP/Chrome grounding of the OAuth popup + a real test Google account
- **REG-010** — Social login (Apple, iOS only) (Positive P1)  
  *Reason:* needs live grounding + a real test Apple account; iOS-only surface
- **REG-011** — Social login, new social ID, missing-details flow (Positive P0)  
  *Reason:* depends on REG-009/010 OAuth grounding
- **REG-018** — SIM mismatch (intl + Indian) (Negative P2)  
  *Reason:* SIM-hardware limitation, same as REG-003/004
- **REG-028** — Social login fails (OAuth/network error) (Negative P0)  
  *Reason:* depends on REG-009/010 OAuth grounding to know what to intercept
- **REG-030** — 3rd device login shows warning popup (Negative P1)  
  *Reason:* needs a 3-context session-limit scenario against a real/staging backend that enforces the limit; current mock has no session-count state
- **REG-033** — Social "ID exists"=true skips missing-details (API parity P1)  
  *Reason:* depends on REG-009/010 OAuth grounding
- **REG-034** — Social "ID exists"=false shows missing-details (API parity P2)  
  *Reason:* depends on REG-009/010 OAuth grounding
- **REG-035** — Admin deactivation terminates active session in real time (API parity P1)  
  *Reason:* needs a coordinated admin-panel action mid-session; no admin API access in this pass
- **REG-037** — Editing email linked to social account prompts unlink confirmation (Edge P1)  
  *Reason:* depends on REG-009/010 OAuth grounding (must be logged in via social first)
- **REG-038** — App killed mid multi-device warning popup treated as Cancel (Edge P2)  
  *Reason:* depends on REG-030 session-limit infra

## Multi-Device Login (multi-device-login.spec.ts) — 8 skipped

- **TC_ADM_035** — Single-device login succeeds (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_036** — Two devices logged in simultaneously (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_037** — 3rd device triggers device-limit warning popup (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_038** — Cancel on popup returns to Login, existing sessions unaffected (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_039** — Continue on popup logs out oldest session, proceeds on new device (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_040** — Killing the app mid-popup is treated as Cancel (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_041** — Login succeeds directly when a previous device was already logged out (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_046** — Popup UI layout and button labels (@P2 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock

## Complete Your Profile (complete-your-profile.spec.ts) — 34 skipped

- **TC_ADM_138** — Nudge displayed for incomplete profiles (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_139** — "Maybe Later" hides nudge and redirects Home (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_140** — Nudge reappears until profile completed (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_141** — All fields optional except anniversary when married (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_142** — Anniversary mandatory when Married (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_143** — DOB below age 13 restricted (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_144** — Gender field is optional (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_145** — Gender radio buttons (Male/Female/Other) visible (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_146** — Gender selection persists after saving (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_147** — Anniversary field visible only when Marital Status = Married (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_148** — Anniversary field hidden when Marital Status = Single (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_149** — Anniversary mandatory when Married (duplicate of TC_ADM_142) (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_150** — Error message on save failure (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_151** — API response is 200/success on save (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_152** — No sensitive data exposed on save failure (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_153** — Success/error messages follow color standards (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_154** — Future anniversary date rejected (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_155** — Success message after saving profile (duplicate of TC_ADM_151) (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_156** — Data reflects under Profile section (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_157** — Data syncs with Admin Panel (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_158** — Behavior on API failure (duplicate of TC_ADM_150) (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_159** — Nudge visual alignment/layout (baseline) (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_160** — Field input format: calendar & dropdown function (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_161** — No XSS/HTML injection possible (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_162** — HTTPS / secure API calls (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_163** — Session timeout triggers auto-logout (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_164** — Backend validation messages surfaced (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_165** — Cross-browser behavior (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_166** — Android/iOS responsive layout (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_167** — Tab navigation & screen-reader labels (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_168** — GA4 event fires on Submit and Skip (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_169** — Invalid DOB format entered manually (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_170** — "Maybe Later" button clarity/accessibility (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_171** — Data integration Profile ↔ Admin DB (duplicate of TC_ADM_157) (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock

## Profile Edit (profile-edit.spec.ts) — 44 skipped

- **TC_ADM_172** — Profile page loads with all fields visible (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_173** — Editable fields (Name/Email/Gender/DOB/Marital Status); Phone read-only (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_174** — Mandatory validation for First & Last Name (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_175** — Email format validation (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_176** — OTP sent on email change (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_177** — OTP verification success updates Email to Verified (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_178** — OTP verification failure (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_179** — OTP expiry (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_180** — Resend OTP functionality (60s interval) (@P2 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_181** — Email remains Unverified if OTP skipped (@P2 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_182** — DOB minimum-age (13) restriction (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_183** — Anniversary date cannot be future date (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_184** — Profile save success (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_185** — Cancel preserves previous values (@P2 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_186** — Updated details visible in Admin Panel (asserts browser-observable save contract only) (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_187** — Gender & Marital Status dropdown options (@P2 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_188** — DOB & Anniversary calendar pickers (@P2 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_189** — UI consistency (spacing/colors/font) (@P2 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_190** — Input sanitization / no XSS (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_191** — HTTPS-only network requests (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_192** — Session timeout triggers auto-logout (@P1 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_193** — Profile update API response 200/success (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_194** — OTP API response messages (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_195** — Profile save SLA under 2 seconds (@P2 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_196** — Cross-browser behavior (Chrome/Safari/Edge/Firefox/Opera) (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_197** — Mobile responsive layout (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_198** — Screen-reader label announcement (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_199** — GA4 tracking on profile update (@P2 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_200** — Invalid email & OTP combined validation (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_201** — Save/Cancel buttons accessible & functional (@P2 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_202** — Phone field non-editable (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_203** — DOB minimum-age restriction (duplicate of TC_ADM_182) (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_204** — Anniversary future-date rejected (duplicate of TC_ADM_183) (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_205** — Resend OTP CTA interval (duplicate of TC_ADM_180) (@P2 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_206** — Invalid email format (duplicate of TC_ADM_175) (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_207** — Invalid OTP (duplicate of TC_ADM_178) (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_208** — Expired OTP (duplicate of TC_ADM_179) (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_209** — First Name mandatory validation (duplicate of TC_ADM_174) (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_210** — First Name character constraints (no digits/special chars) (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_211** — Last Name mandatory validation (duplicate of TC_ADM_174) (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_212** — Last Name character constraints (no digits/special chars) (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_213** — Email allowed-characters validation (multiple @, consecutive dots) (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_214** — Email length constraints (5-100 chars) (@P0 @Regression)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock
- **TC_ADM_215** — Successful profile save (full valid-data flow) (@P0 @Smoke)  
  *Reason:* OTP-entry screen never renders after "Get OTP" — real production /api/send-phone-otp response contract is unconfirmed (see OtpMock.ts grounding note, 2026-08-18); needs real backend docs or an authorized manual-login HAR capture to unblock

## Home Screen (home-screen.spec.ts) — 33 skipped

- **HOME-004** — Admin-marked trending items appear first (@P0 @Regression)  
  *Reason:* verifying carousel order against admin-configured priority needs backend/test-data control not available here
- **HOME-005** — PAN-India trending configuration shows same content across cities (@P1 @Regression)  
  *Reason:* needs comparing carousel content across two city selections against a known PAN-India admin flag; no test-data control to confirm which content is PAN-India-configured
- **HOME-006** — Non-trending-marked movie excluded from Trending carousel (@P0 @Regression)  
  *Reason:* needs a movie confirmed admin-marked non-trending as negative test data; not available
- **HOME-007** — Zero-showtime trending movie excluded (@P0 @Regression)  
  *Reason:* needs a trending movie confirmed to have zero showtimes as test data; not available
- **HOME-008** — Personalization-based trending shown when user data available (@P1 @Regression)  
  *Reason:* needs a logged-in session with known booking/preference history to compare against; out of scope for this pass
- **HOME-009** — Base-logic trending sequencing (show count / Hollywood / Friday-release / New Release priority) (@P0 @Regression)  
  *Reason:* this is backend sort logic, not verifiable by inspecting carousel DOM order alone without known show-count data per title
- **HOME-010** — Combined trending logic merges without duplication (@P0 @Regression)  
  *Reason:* depends on HOME-004/008/009 admin/personalization/base-logic data, none of which is independently confirmable here
- **HOME-012** — In-the-Spotlight shows top-priority movie (@P1 @Regression)  
  *Reason:* needs known admin-priority test data to confirm which movie *should* be top
- **HOME-013** — Single trending movie shown in both Trending & Spotlight (@P1 @Regression)  
  *Reason:* needs a city/moment with exactly one trending movie configured as test data; current data always has multiple
- **HOME-020** — Experience chips display on homepage (@P1 @Regression)  
  *Reason:* source sheet itself marks this "Not getting IMAX data"; confirmed live — zero IMAX-related text found anywhere on the page during grounding
- **HOME-021** — Experience chip click navigates to Experience Detail (@P0 @Regression)  
  *Reason:* same as HOME-020 — the chips themselves were never confirmed present
- **HOME-022** — Experience list ordered by audi count / admin priority (@P0 @Regression)  
  *Reason:* backend/admin data, not verifiable via carousel DOM order alone
- **HOME-024** — Experience banner video autoplays after 3s (@P1 @Regression)  
  *Reason:* confirmed live (2026-08-21, full network+DOM check including after scrolling to the Experience section specifically) — no `<video>` element exists anywhere on this page at all; the only real video playback found is an on-demand YouTube embed in the Trailers section (see HOME-041), not an ambient autoplaying banner video. This ticket's premise does not match anything present on this build
- **HOME-025** — Experience banner falls back to poster when no video (@P2 @Regression)  
  *Reason:* needs a specific experience confirmed to have no video as test data
- **HOME-028** — Now Showing filters apply correctly (@P1 @Regression)  
  *Reason:* no filter control was confirmed present on the homepage Now Showing strip during grounding (filters were only found on the dedicated cinema/movie listing pages)
- **HOME-029** — Now Showing sequencing follows showtime-count/admin logic (@P0 @Regression)  
  *Reason:* backend sort logic, not verifiable via DOM order without known showtime-count data per title
- **HOME-030** — Zero-showtime movies excluded from Now Showing (@P0 @Regression)  
  *Reason:* needs a movie confirmed to have zero showtimes as negative test data
- **HOME-032** — No-trailer fallback shows only poster (Now Showing) (@P2 @Regression)  
  *Reason:* needs a Now Showing movie confirmed to have no trailer as test data
- **HOME-033** — Watch Trailer opens playback screen from Now Showing (@P1 @Regression)  
  *Reason:* confirmed live (2026-08-21) — a Now Showing movie card has zero button elements distinct from the card container itself; no separate "Watch Trailer" CTA exists there. The only confirmed trailer-playback entry point on this page is the dedicated Trailers section (see HOME-041), reached via its own nav chip, not from Now Showing cards
- **HOME-034** — Book Now CTA redirects to movie detail (@P0 @Smoke)  
  *Reason:* no "Book Now" button was confirmed present on homepage movie cards during grounding (0 matches) — clicking the card itself (HOME-018) is the confirmed navigation path instead
- **HOME-037** — Events "View All" CTA navigates to Event Listing (@P1 @Regression)  
  *Reason:* EventListingPage.ts's own grounding note confirms no "View All" CTA or dedicated Event Listing page/route exists on this environment
- **HOME-040** — Trailer auto-plays after 3s on homepage strip (@P1 @Regression)  
  *Reason:* confirmed live (2026-08-21) — no `<video>` element exists anywhere on this page; trailer playback only happens on-demand after clicking "Play video" (see HOME-041), not as an ambient autoplay, same finding as HOME-024
- **HOME-042** — Multiple trailers show a selectable list (@P1 @Regression)  
  *Reason:* confirmed live (2026-08-21) — only 1 "Play video" button/trailer exists in the Trailers section on this pass; insufficient data to verify a "selectable list" of multiple trailers appears
- **HOME-043** — Trending-data fetch failure shows placeholder banner (@P0 @Regression)  
  *Reason:* confirmed live (2026-08-21) via a full page-load network capture (all JSON/XHR/fetch responses, including after a full scroll) — no discoverable client-side API for trending/movie carousel data exists; that content is server-rendered (Next.js) as part of the initial HTML document, so a client-side fetch-failure can't be simulated via request interception for this data path
- **HOME-046** — Trending logic uses the selected city (@P0 @Regression)  
  *Reason:* needs comparing carousel content across two cities against known per-city trending data; not available
- **HOME-048** — Date Tag shown for advance-opened showtimes (@P0 @Regression)  
  *Reason:* needs a movie confirmed to have advance-opened showtimes as test data; not independently confirmed during grounding
- **HOME-050** — Bottom navigation visible (App/M-Site) (@P1 @Regression)  
  *Reason:* this project automates Web via a desktop browser; bottom navigation is an App/M-Site-only pattern not applicable here
- **HOME-052** — Quick Book section displayed (@P0 @Regression)  
  *Reason:* grounded 2026-08-21 — no "Quick Book" text was found anywhere on this page (0 matches, case-insensitive) — feature may not exist on this build, or use different copy not yet identified
- **HOME-053** — Cinema Near You on Map displayed (App/M-Site) (@P0 @Regression)  
  *Reason:* App/M-Site-only section per source sheet; out of scope for this desktop-browser Web spec
- **HOME-056** — ScreenIT section displayed (Web) (@P0 @Regression)  
  *Reason:* grounded 2026-08-21 — no "ScreenIT" text or nav chip was found anywhere on this page (chip visibility confirmed false, unlike Now Showing/Events/Coming Soon/Experiences/Trailers/Offers)
- **HOME-057** — Curated Shows section displayed (Web) (@P0 @Regression)  
  *Reason:* grounded 2026-08-21 — no "Curated Shows" text or nav chip was found anywhere on this page (chip visibility confirmed false), same finding as HOME-056
- **HOME-059** — Homepage renders correctly across browsers (@P1 @Regression)  
  *Reason:* this project's Playwright config runs the chromium project only; cross-browser (Firefox/Safari/Edge) coverage needs a separate project configuration not set up for this pass
- **HOME-060** — Unauthorized users cannot access restricted sections (@P0 @Regression)  
  *Reason:* re-grounded 2026-08-21 (2nd pass) — no favorite/wishlist icons found anywhere on the homepage (0 matches), and clicking the "Passport" nav link neither navigates nor shows a login prompt; still no concretely identified restricted homepage action to trigger against, so this remains unautomatable without one

## Cinemas Listing/Detail (cinemas-listing-detail.spec.ts) — 61 skipped

- **CIN-002** — Location/city gate before displaying cinemas (@P0 @Regression)  
  *Reason:* grounded 2026-08-21 — `/cinemas/Mumbai` loads full cinema content ("All Cinemas", "3 Cinemas", real cinema cards) even in a fresh context with no geolocation permission granted at all; no location/city gate blocks this specific route, contradicting the sheet's expected "prompted to enable location or select city" behavior
- **CIN-004** — Map view shows user location and cinema markers (@P0 @Regression)  
  *Reason:* Map View button visibility was inconsistent across grounding passes (sometimes not rendered at all); not reliably automatable until this is resolved
- **CIN-005** — Favorite cinemas sorted to top (logged-in) (@P1 @Regression)  
  *Reason:* needs a logged-in session with a pre-marked favorite as test data; not independently confirmed this pass
- **CIN-006** — Nearest-first sorting for logged-in and guest users (@P0 @Regression)  
  *Reason:* verifying distance-based sort order needs known per-cinema distance data to compare against; only 3 cinemas exist in this city's test data, insufficient for a reliable sort assertion
- **CIN-009** — Now Showing section expand/collapse on listing page (@P1 @Regression)  
  *Reason:* a cinema with real shows is now confirmed reachable (see file header note), but the specific expand/collapse control for this section was not independently grounded this pass
- **CIN-010** — Now Showing carousel truncates long names (@P0 @Regression)  
  *Reason:* no movie title long enough to observe truncation was confirmed as test data during grounding
- **CIN-011** — Map filter: distance (@P1 @Regression)  
  *Reason:* Map View instability (see CIN-004)
- **CIN-012** — Map filter: showtime (@P0 @Regression)  
  *Reason:* Map View instability (see CIN-004)
- **CIN-013** — Map filter: genre (@P0 @Regression)  
  *Reason:* Map View instability (see CIN-004)
- **CIN-014** — Map filter: language (@P0 @Regression)  
  *Reason:* Map View instability (see CIN-004)
- **CIN-015** — Map filter: format and experience (@P0 @Regression)  
  *Reason:* Map View instability (see CIN-004)
- **CIN-016** — Map filter: accessibility (@P0 @Regression)  
  *Reason:* Map View instability
- **CIN-017** — Map filter: price range (@P0 @Regression)  
  *Reason:* Map View instability (see CIN-004)
- **CIN-018** — No-cinemas-found message on distance filter (@P1 @Regression)  
  *Reason:* Map View instability (see CIN-004)
- **CIN-019** — Map recenter and zoom controls (@P1 @Regression)  
  *Reason:* Map View instability (see CIN-004)
- **CIN-022** — Search for a movie by text on Cinema Detail (@P0 @Regression)  
  *Reason:* grounded 2026-08-21, second pass — no search textbox exists on this cinema-first view even with real showtimes present; the "Search for Cinema(s)" box confirmed on Movie Details is a different, movie-first view (see CinemasListingDetailPage.ts doc comment)
- **CIN-023** — Voice search for a movie on Cinema Detail (@P0 @Regression)  
  *Reason:* same as CIN-022 — no search UI exists on this view to attach voice search to
- **CIN-024** — Filter movies by experience (@P0 @Regression)  
  *Reason:* grounded 2026-08-21, third pass — the "Experiences" filter button is present in a full button-text sweep but consistently failed `toBeVisible()`/`scrollIntoViewIfNeeded()` across three separate checks on the confirmed-good cinema; looks like a horizontally-scrollable/overflow filter strip whose reveal mechanism wasn't cracked this pass
- **CIN-025** — Filter movies by accessibility (@P0 @Regression)  
  *Reason:* grounded 2026-08-21, second pass — only "Filter", "Recliner only", "Show Time", "Price Range", "Sort By", "Experiences" were confirmed as distinct top-level filter buttons; no separate "Accessibility" filter was found (may be inside the generic "Filter" panel, not independently opened this pass)
- **CIN-026** — Filter movies by genre (@P1 @Regression)  
  *Reason:* same as CIN-025 — no separate "Genre" filter button was found; may be inside the generic "Filter" panel
- **CIN-027** — Filter movies by language (@P0 @Regression)  
  *Reason:* same as CIN-025 — no separate "Language" filter button was found; may be inside the generic "Filter" panel
- **CIN-028** — Filter movies by price range (@P1 @Regression)  
  *Reason:* grounded 2026-08-21, third pass — the "Price Range" filter button is present in a full button-text sweep but consistently failed `toBeVisible()` across three separate checks (see CIN-024's reason) — likely a horizontally-scrollable/overflow filter strip not cracked this pass
- **CIN-030** — No-movies-found message under filters (@P0 @Regression)  
  *Reason:* applying a restrictive filter combination to intentionally reach zero results was not independently grounded this pass
- **CIN-031** — Only one movie card expanded at a time (@P0 @Regression)  
  *Reason:* a cinema with real shows is now confirmed reachable (see file header note), but the movie-card expand/collapse interaction itself was not independently grounded this pass
- **CIN-033** — Seat-category price shown on hover/long-press (@P0 @Regression)  
  *Reason:* hover-tooltip interaction was not independently grounded this pass
- **CIN-036** — Collapse/expand Cinema Listing panel (merged view) (@P0 @Regression)  
  *Reason:* no collapse/expand control for the listing panel was confirmed during grounding
- **CIN-037** — Floating CTA appears when listing panel collapsed (@P0 @Regression)  
  *Reason:* depends on CIN-036 which is itself unconfirmed
- **CIN-038** — Map View access blocked without location permission (@P1 @Regression)  
  *Reason:* Map View instability (see CIN-004)
- **CIN-039** — Enabling location permission unlocks Map View (@P0 @Regression)  
  *Reason:* Map View instability (see CIN-004)
- **CIN-040** — City-change nudge appears on detected-vs-saved city mismatch (@P1 @Regression)  
  *Reason:* needs a real detected-city-differs-from-saved-city scenario, not reliably reproducible via geolocation mocking alone
- **CIN-041** — Selecting "Yes" in city-change nudge saves new city (@P0 @Regression)  
  *Reason:* depends on CIN-040
- **CIN-042** — Selecting "No" in city-change nudge retains previous city (@P0 @Regression)  
  *Reason:* depends on CIN-040
- **CIN-043** — Same-distance cinemas sorted randomly (@P1 @Regression)  
  *Reason:* needs multiple cinemas confirmed at the exact same distance as test data; only 3 cinemas exist, distances not confirmed equal
- **CIN-044** — Multiple favorite cinemas sorted by distance (@P0 @Regression)  
  *Reason:* needs 2+ favorited cinemas as test data and a login session; not set up this pass
- **CIN-045** — Same-showtime-count movies/events sorted randomly (@P0 @Regression)  
  *Reason:* needs 2+ movies confirmed at the exact same showtime count as test data; not independently confirmed this pass
- **CIN-046** — Cinemas with "Adfree Shows" labeled correctly (@P0 @Regression)  
  *Reason:* "(Adfree shows)" text was observed appended directly to a cinema's name in test data during one grounding pass, not confirmed as a distinct, independently-testable label component
- **CIN-048** — Long movie names truncated in listing (@P1 @Regression)  
  *Reason:* no movie title long enough to observe truncation was confirmed as test data during grounding
- **CIN-049** — Favorite status reflects immediately in sorting (@P0 @Regression)  
  *Reason:* grounded 2026-08-21 — a guest clicking the favorite icon triggers a "Login to add cinema to your favorites?" prompt instead of toggling (see CIN-008 and CinemasListingDetailPage.ts doc comment); this scenario genuinely needs a logged-in session, matching the sheet's own precondition
- **CIN-050** — Map shows nearest cinemas by default (@P0 @Regression)  
  *Reason:* Map View instability (see CIN-004)
- **CIN-051** — Filters refresh both map markers and list dynamically (@P0 @Regression)  
  *Reason:* Map View instability (see CIN-004)
- **CIN-054** — Experience filter displays above the movie listing (@P0 @Regression)  
  *Reason:* grounded 2026-08-21, third pass — the "Experiences" filter button is present in a full button-text sweep but consistently failed `toBeVisible()` across three separate checks (see CIN-024's reason) — a horizontally-scrollable/overflow filter strip whose reveal mechanism wasn't cracked this pass
- **CIN-055** — Only current/future showtimes shown (@P0 @Regression)  
  *Reason:* needs a confirmed past/lapsed showtime as negative test data to verify exclusion against; the grounded showtimes were all future/available
- **CIN-056** — Expandable movie cards reveal available slots (@P0 @Regression)  
  *Reason:* movie-card expand/collapse interaction was not independently grounded this pass
- **CIN-057** — Top movie card expanded by default (@P1 @Regression)  
  *Reason:* same as CIN-056
- **CIN-058** — Movies/events sorted by available showtime count (@P0 @Regression)  
  *Reason:* only 1 movie was confirmed listed on the cinema with real shows during grounding — insufficient movie count to verify relative sort order
- **CIN-059** — Showtime formats categorized correctly (@P0 @Regression)  
  *Reason:* showtime format grouping (e.g. 2D/3D/IMAX categories) was not independently verified against real config this pass — only language ("Hindi") was confirmed on showtime buttons
- **CIN-060** — Popups display in expanded view by default (@P0 @Regression)  
  *Reason:* clicking a showtime on this cinema-first view was not independently followed through to a popup/booking screen this pass
- **CIN-061** — Search matches by entity name (@P1 @Regression)  
  *Reason:* no search textbox was found during grounding (see CIN-022)
- **CIN-062** — Voice search blocked without mic permission (@P0 @Regression)  
  *Reason:* depends on CIN-061/022 search UI which was not reachable
- **CIN-063** — Search supports partial and case-insensitive matches (@P0 @Regression)  
  *Reason:* depends on CIN-061/022 search UI which was not reachable
- **CIN-065** — Filters and options listed alphabetically (@P0 @Regression)  
  *Reason:* the 6 filter buttons ("Filter", "Recliner only", "Show Time", "Price Range", "Sort By", "Experiences") are now confirmed reachable, but their exact visual/DOM order was not reliably captured this pass to verify alphabetical sorting
- **CIN-066** — Distance filter range is 0–25km (CMS-managed) (@P1 @Regression)  
  *Reason:* Map View instability (see CIN-004)
- **CIN-067** — Showtime filter range 12:00AM–11:59PM, 10-min interval (@P0 @Regression)  
  *Reason:* the "Show Time" filter button is now confirmed reachable, but its internal range-picker panel was not opened/inspected this pass
- **CIN-068** — Language filter options based on fetched movies (@P1 @Regression)  
  *Reason:* no separate "Language" filter button was found (see CIN-027) — may be inside the generic "Filter" panel, not opened this pass
- **CIN-069** — Genre filter options based on fetched movies (@P0 @Regression)  
  *Reason:* no separate "Genre" filter button was found (see CIN-026) — may be inside the generic "Filter" panel, not opened this pass
- **CIN-070** — Cinema experience filter options based on priority logic (@P0 @Regression)  
  *Reason:* the "Experiences" filter button is now confirmed reachable, but its option list/ordering was not opened/inspected this pass — verifying priority-logic ordering also needs admin data not available here
- **CIN-071** — Accessibility filter options based on fetched data (@P0 @Regression)  
  *Reason:* no separate "Accessibility" filter button was found (see CIN-025) — may be inside the generic "Filter" panel, not opened this pass
- **CIN-072** — Price filter range is dynamic and selectable (@P0 @Regression)  
  *Reason:* grounded 2026-08-21, third pass — the "Price Range" filter button is present in a full button-text sweep but consistently failed `toBeVisible()` across three separate checks (see CIN-024's reason) — a horizontally-scrollable/overflow filter strip whose reveal mechanism wasn't cracked this pass
- **CIN-073** — Message shown when map filters return zero results (@P1 @Regression)  
  *Reason:* Map View instability (see CIN-004)
- **CIN-074** — Accessibility icons show correct message on hover/tap (@P0 @Regression)  
  *Reason:* accessibility icon locators on cinema cards were not individually grounded this pass
- **CIN-075** — Message shown when movie search returns no match (@P1 @Regression)  
  *Reason:* depends on CIN-061/022 search UI which was not reachable

## Movie Details (movie-details.spec.ts) — 35 skipped

- **MOV-002** — Open Movie Detail from cinema listing (@P0 @Regression)  
  *Reason:* cinema listing chaining into a movie with real showtimes was not independently grounded this pass — most listed cinemas showed "0 Shows" (see CinemasListingDetailPage.ts)
- **MOV-003** — Open Movie Detail from experience page (@P0 @Regression)  
  *Reason:* experience-page-to-movie-detail chaining was not independently grounded this pass
- **MOV-005** — Trailer auto-plays after load (@P1 @Regression)  
  *Reason:* video-autoplay state verification is unreliable via DOM inspection alone; source sheet marks this Fail on manual QA too
- **MOV-007** — Trailer playback failure shows error (@P0 @Regression)  
  *Reason:* needs network mocking of the trailer/video API, and the real endpoint was not confirmed during grounding
- **MOV-011** — Cinema search by voice (@P0 @Regression)  
  *Reason:* mic icon/voice-search flow on the movie detail search box was not independently grounded this pass
- **MOV-012** — Mic permission denied handling (@P0 @Regression)  
  *Reason:* same as MOV-011
- **MOV-013** — Reset Filters clears all applied filters (@P1 @Regression)  
  *Reason:* no "Reset"/"Clear" button was found during grounding (0 matches), confirmed across two separate grounding passes
- **MOV-014** — Showtime color coding (@P0 @Regression)  
  *Reason:* color-coded status (Available/Filling Fast/Sold Out/Lapsed) was not independently verified against real CSS values this pass
- **MOV-015** — Sold Out showtime handling (@P0 @Regression)  
  *Reason:* needs a confirmed Sold Out showtime as test data; the one movie/cinema grounded had only Available slots
- **MOV-017** — Booking redirection failure handling (@P0 @Regression)  
  *Reason:* needs network mocking of the booking-initiation API, and the real endpoint was not confirmed during grounding
- **MOV-019** — Submit Preference success (@P0 @Regression)  
  *Reason:* the Pickup Your Time form fields were not independently grounded this pass
- **MOV-020** — Submit Preference failure (@P0 @Regression)  
  *Reason:* same as MOV-019, plus needs network mocking of the submit API
- **MOV-021** — Submit Preference as guest redirects to login (@P0 @Regression)  
  *Reason:* same as MOV-019
- **MOV-023** — No Cinemas Found message under restrictive filters (@P0 @Regression)  
  *Reason:* restrictive-filter interaction was not independently grounded this pass
- **MOV-025** — Poster shown when trailer unavailable (@P1 @Regression)  
  *Reason:* needs a movie confirmed to have no trailer as test data; the anchor movie has a trailer
- **MOV-026** — Selecting a trailer from the list plays it (@P1 @Regression)  
  *Reason:* the Watch Trailer CTA's click-through to a trailer list/player was not independently grounded this pass
- **MOV-027** — Promotional banner displays when configured (@P2 @Regression)  
  *Reason:* not independently grounded this pass
- **MOV-029** — Experience filter auto-applied on redirection from Experience page (@P1 @Regression)  
  *Reason:* depends on MOV-003 (open from Experience page) which is itself unconfirmed
- **MOV-030** — Distance filter shows "Enable Location" CTA without location (@P0 @Regression)  
  *Reason:* grounded 2026-08-21, second pass — no distance filter or "Enable Location" CTA was found on this movie's Book Movie tab at all (0 matches, confirmed)
- **MOV-031** — Applied filters list shown (@P1 @Regression)  
  *Reason:* no distinct "applied filters" summary area was found separate from the filter buttons themselves during grounding
- **MOV-033** — Cinema sorting — Favorite first (@P0 @Regression)  
  *Reason:* needs a logged-in session with a favorited cinema as test data; only 1 cinema has real showtimes for this movie, insufficient to verify sort order
- **MOV-034** — Cinema sorting — Recommended next (@P1 @Regression)  
  *Reason:* same as MOV-033
- **MOV-035** — Cinema sorting — Distance-based remainder (@P0 @Regression)  
  *Reason:* same as MOV-033 — insufficient cinema count with real showtimes to verify sort order
- **MOV-036** — Default cinema card expansion (@P1 @Regression)  
  *Reason:* cinema-card expand/collapse state was not independently grounded this pass
- **MOV-037** — Only one cinema card expanded at a time (@P1 @Regression)  
  *Reason:* same as MOV-036
- **MOV-039** — Lapsed showtime is not clickable (@P0 @Regression)  
  *Reason:* needs a confirmed lapsed (past) showtime as test data; the grounded showtimes were all future/available
- **MOV-040** — Seat price tooltip on hover/long-press (@P1 @Regression)  
  *Reason:* hover-tooltip interaction was not independently grounded this pass
- **MOV-041** — Popup list follows admin-defined sequence (@P0 @Regression)  
  *Reason:* no popups were triggered for the anchor movie/cinema combination during grounding
- **MOV-042** — Adult movie popup for A-rated content (@P0 @Regression)  
  *Reason:* the anchor movie ("Spider-Man: Brand New Day", rated A per homepage grounding data) did not trigger this popup when booking directly — needs independent re-grounding of the actual trigger condition
- **MOV-043** — Experience-mismatch popup (IMAX cinema + non-IMAX show) (@P1 @Regression)  
  *Reason:* the anchor movie's one cinema/showtime combination didn't trigger this popup; needs a confirmed IMAX-cinema + non-IMAX-show pairing as test data
- **MOV-044** — Distance auto-expansion when no cinema in range (@P1 @Regression)  
  *Reason:* not independently grounded this pass
- **MOV-045** — City-wide fallback prompt when max range exhausted (@P0 @Regression)  
  *Reason:* not independently grounded this pass
- **MOV-047** — Cast & Crew profile navigation (@P2 @Regression)  
  *Reason:* cast member tap-through was not independently grounded this pass
- **MOV-048** — Backdrop viewer opens with download option (@P2 @Regression)  
  *Reason:* backdrop gallery was not independently grounded this pass
- **MOV-049** — Fixed Book Now CTA persists on scroll (App/M-Site) (@P0 @Regression)  
  *Reason:* App/M-Site-only per source sheet; out of scope for this desktop-browser Web spec

## Experience (experience.spec.ts) — 15 skipped

- **EXP-001** — navigation to Experience section (App/M-Site) (@P0 @Regression)  
  *Reason:* source sheet marks this Not Applicable and this project automates Web/M-Site via a desktop browser, not a native App context
- **EXP-007** — experience carousel ordering by audi count (@P0 @Regression)  
  *Reason:* audi-count-based ordering is backend/admin data this project has no test-data control over; not verifiable via UI locators alone
- **EXP-008** — experience order override from Admin (@P0 @Regression)  
  *Reason:* requires Admin Panel access to configure a priority override, out of scope for this Web spec
- **EXP-011** — CTA behavior for multiple experience videos (@P1 @Regression)  
  *Reason:* real CTA is "Learn More About {EXPERIENCE}" (not "Treasure the Experience"), and its click destination/video-list behavior was not confirmed during grounding
- **EXP-012** — experience video playback failure handling (@P0 @Regression)  
  *Reason:* needs network mocking of the video API, and the real endpoint was not confirmed during grounding
- **EXP-015** — microphone permission denied shows a permission popup (@P0 @Regression)  
  *Reason:* grounded 2026-08-19 with permissions cleared — clicking the mic icon produces no in-page DOM change at all (no dialog, no text), meaning this site relies on the browser's native getUserMedia() permission prompt (OS-level Chrome UI) rather than a custom in-page popup; Playwright cannot assert on native browser chrome
- **EXP-016** — Now Showing movie ordering by show count (@P0 @Regression)  
  *Reason:* no separate "Now Showing" section was confirmed on this page during grounding (only a single "Movies Showing in {EXPERIENCE}" list)
- **EXP-019** — Watch Trailer for multiple trailers (@P1 @Regression)  
  *Reason:* no distinct "Watch Trailer" CTA was confirmed separately from the card itself during grounding
- **EXP-020** — hover trailer autoplay on Web (@P1 @Regression)  
  *Reason:* source sheet marks this Not Applicable; hover-triggered video was not confirmed during grounding
- **EXP-022** — Coming Soon movie sorting (@P0 @Regression)  
  *Reason:* no separate "Coming Soon" section was confirmed on this page during grounding
- **EXP-023** — Set Alert functionality (@P1 @Regression)  
  *Reason:* requires a logged-in session, and a distinct "Set Alert" CTA on the movie card was not confirmed during grounding
- **EXP-024** — Delete Alert functionality (@P1 @Regression)  
  *Reason:* depends on EXP-023 (Set Alert) which is itself unconfirmed/login-gated
- **EXP-026** — movie fetch failure handling (@P0 @Regression)  
  *Reason:* needs network mocking of the movie-list API, and the real endpoint was not confirmed during grounding
- **EXP-027** — repeated error redirects to homepage + alert email (@P0 @Regression)  
  *Reason:* depends on EXP-026 (movie fetch failure mock) which is itself unconfirmed
- **EXP-028** — image fallback for missing posters (@P2 @Regression)  
  *Reason:* a real "missing poster" data state could not be forced during grounding (all sampled movies had posters)

## Experience Visual (experience-visual.spec.ts) — 16 skipped

- **EXP-039** — experience sequence UI based on priority (@P1 @Regression)  
  *Reason:* verifying carousel DOM order against admin-configured priority needs backend/test-data control not available here
- **EXP-040** — experience description font size (@P0 @Regression)  
  *Reason:* no description element distinct from the banner heading was confirmed during grounding (see EXP-010)
- **EXP-041** — experience description line height (@P1 @Regression)  
  *Reason:* no description element distinct from the banner heading was confirmed during grounding (see EXP-010)
- **EXP-052** — censor rating badge color and size (@P0 @Regression)  
  *Reason:* no distinct rating-badge element separate from the full movie-card text was confirmed during grounding
- **EXP-053** — experience tag UI on movie card (@P0 @Regression)  
  *Reason:* no distinct experience-tag element separate from the full movie-card text was confirmed during grounding
- **EXP-054** — trailer CTA UI on App/M-Site (@P1 @Regression)  
  *Reason:* App/M-Site is out of scope for this desktop-browser Web spec
- **EXP-055** — hover trailer playback UI on Web (@P1 @Regression)  
  *Reason:* hover-triggered video was not confirmed during grounding (see EXP-020)
- **EXP-056** — Now Showing section header UI (@P0 @Regression)  
  *Reason:* no separate "Now Showing" section was confirmed on this page during grounding (see EXP-016)
- **EXP-057** — Coming Soon section header UI (@P0 @Regression)  
  *Reason:* no separate "Coming Soon" section was confirmed on this page during grounding (see EXP-022)
- **EXP-058** — release date text mapping for coming soon movies (@P1 @Regression)  
  *Reason:* no separate "Coming Soon" section was confirmed on this page during grounding (see EXP-022)
- **EXP-059** — Set Alert / Delete Alert CTA UI (@P1 @Regression)  
  *Reason:* depends on EXP-023 (Set Alert), which is login-gated and unconfirmed
- **EXP-060** — alert count text alignment (@P2 @Regression)  
  *Reason:* depends on EXP-023 (Set Alert), which is login-gated and unconfirmed
- **EXP-062** — video playback failure UI (@P0 @Regression)  
  *Reason:* needs network mocking of the video API, and the real endpoint was not confirmed during grounding (see EXP-012)
- **EXP-064** — microphone permission popup UI (@P0 @Regression)  
  *Reason:* same finding as EXP-015 — no in-page popup exists to have a "UI" to verify; the browser's native getUserMedia() prompt is not something Playwright can assert on
- **EXP-065** — image fallback UI for missing posters (@P0 @Regression)  
  *Reason:* a real "missing poster" data state could not be forced during grounding (see EXP-028)
- **EXP-067** — multi-language text UI handling (Hindi/Tamil) (@P0 @Regression)  
  *Reason:* no locale switch or non-English content was confirmed reachable during grounding

## Event Listing (event-listing.spec.ts) — 9 skipped

- **EL-002** — View All CTA navigation from homepage (Web) (@P0 @Regression)  
  *Reason:* no "View All" CTA was found near the Events section on either environment during grounding; see EL-000
- **EL-003** — Events navigation from top menu (App/M-Site) (@P0 @Regression)  
  *Reason:* source sheet marks this Not Applicable, and there is no "Events" link in the header nav on either environment
- **EL-004** — default filter state on Event Listing page (@P1 @Regression)  
  *Reason:* no dedicated Event Listing page exists to hold filters; see EL-000
- **EL-005** — Categories filter options (@P1 @Regression)  
  *Reason:* no dedicated Event Listing page exists to hold filters; see EL-000
- **EL-006** — filters alphabetical ordering (@P2 @Regression)  
  *Reason:* no dedicated Event Listing page exists to hold filters; see EL-000
- **EL-009** — Watch Promo for single promo (@P1 @Regression)  
  *Reason:* no distinct "Watch Promo" CTA was confirmed on the homepage event cards during grounding
- **EL-010** — Watch Promo for multiple promos (@P1 @Regression)  
  *Reason:* no distinct "Watch Promo" CTA was confirmed on the homepage event cards during grounding
- **EL-011** — promo fallback when no promo exists (@P2 @Regression)  
  *Reason:* no distinct promo affordance was confirmed on the homepage event cards during grounding
- **EL-012** — hover autoplay on web (@P1 @Regression)  
  *Reason:* source sheet marks this Not Applicable, and hover-triggered video was not confirmed during grounding

## Event Details (event-details.spec.ts) — 12 skipped

- **ED-002** — Watch Trailer CTA behavior (@P1 @Regression)  
  *Reason:* page still had a loading spinner when interactive elements were inspected during grounding; Watch Trailer CTA not confirmed
- **ED-003** — promotional banner display (@P2 @Regression)  
  *Reason:* not confirmed during grounding (page still loading)
- **ED-004** — Share Event functionality (@P1 @Regression)  
  *Reason:* not confirmed during grounding (page still loading)
- **ED-006** — Date filter default selection (@P0 @Regression)  
  *Reason:* not confirmed during grounding (page still loading)
- **ED-007** — cinema sorting logic (Favorite → Recommended → Nearest) (@P0 @Regression)  
  *Reason:* not verifiable without a logged-in fixture with known favorites/history, and not confirmed during grounding
- **ED-008** — cinema card expansion behavior (@P1 @Regression)  
  *Reason:* not confirmed during grounding (page still loading)
- **ED-009** — showtime color coding (@P0 @Regression)  
  *Reason:* not confirmed during grounding (page still loading)
- **ED-010** — Sold Out showtime handling (@P0 @Regression)  
  *Reason:* not confirmed during grounding, and the source sheet leaves the expected message blank
- **ED-011** — booking redirection to seat selection (@P0 @Regression)  
  *Reason:* not confirmed during grounding, and the source sheet leaves the expected message blank
- **ED-012** — No Cinemas Found error (@P0 @Regression)  
  *Reason:* needs a filter combination confirmed to return zero cinemas, not established during grounding
- **ED-013** — Promo Playback Failure handling (@P1 @Regression)  
  *Reason:* needs network mocking of an unconfirmed promo-video API endpoint
- **ED-014** — Booking Redirection Failure handling (@P0 @Regression)  
  *Reason:* needs network mocking of an unconfirmed booking API endpoint, and the source sheet leaves the expected message blank

## Global Search (global-search.spec.ts) — 5 skipped

- **GS-003** — mic icon visible only when search bar is active (@P1 @Regression)  
  *Reason:* no mic/voice affordance found inside the search dialog during grounding (2026-08-19); confirm on a real Web session or App/M-Site before automating
- **GS-006** — default category on movie listing page (@P0 @Regression)  
  *Reason:* no dedicated Movie listing route confirmed on production (`/movies`, `/movie`, `/now-showing` all resolve to a generic stub page, unlike `/cinemas` and `/experiences`); confirm the real route before automating
- **GS-023** — voice search converts speech to text and returns results (@P0 @Regression)  
  *Reason:* no mic/voice affordance found inside the search dialog during grounding (2026-08-19); confirm on a real Web session or App/M-Site before automating
- **GS-024** — microphone permission denied shows a permission popup (@P0 @Regression)  
  *Reason:* no mic/voice affordance found inside the search dialog during grounding (2026-08-19); confirm on a real Web session or App/M-Site before automating
- **GS-025** — voice recognition failure shows an error message (@P1 @Regression)  
  *Reason:* no mic/voice affordance found inside the search dialog during grounding (2026-08-19); confirm on a real Web session or App/M-Site before automating

---

*Total skipped test cases listed: 381*