/** Data derived from validation rules documented in requirements/register-login.md. */
export const registerLoginData = {
  invalidPhoneWrongPrefix: '5123456789',
  invalidPhoneTooShort: '98765',
  validOtp: '739416',
  wrongOtp: '000000',

  firstNameWithDigits: 'John1',
  firstNameSqlInjection: "' OR 1=1--",
  firstNameMinLength: 'A',
  firstNameMaxLength: 'A'.repeat(30),

  invalidEmailFormat: 'not-an-email',
  invalidEmailMultipleAt: 'a@@b.com',
  // Grounded live 2026-08-24: the sheet's naive "5-character minimum" (`a@b.c`) is REJECTED by
  // real client-side validation on UAT (single-char domain label / single-char TLD both fail)
  // — confirmed `a@b.co` (6 chars) also still fails, `ab@cd.co` (8 chars) is the shortest
  // confirmed-accepted form. Real minimum is 8, not 5.
  emailMinLength: 'ab@cd.co',
  emailMaxLength: `${'a'.repeat(88)}@example.com`,
};
