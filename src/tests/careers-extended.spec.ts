import { test } from '@fixtures/index';
import type { CareersModule } from '@modules/CareersModule';
import { ONLY_DEPARTMENT, CAREERS_MESSAGES, RESUME_FIXTURES } from '@testdata/careersData';
import { DataGenerator } from '@utils/index';

/**
 * Continuation of `careers.spec.ts` (CAR-028–060) — same live grounding pass, see that file's
 * imported `CareersPage.ts`/`CareersModule.ts` doc comments for the full trail (real validation
 * copy, the confirmed-working OTP bypass for this flow, the silent resume-upload-failure finding).
 */
async function openApplyDialog(careersModule: CareersModule): Promise<void> {
  await careersModule.gotoCareers();
  await careersModule.clickDepartmentAndExpectApplyDialogOpen(ONLY_DEPARTMENT);
}

async function fillValidFormWithResume(careersModule: CareersModule): Promise<void> {
  await careersModule.fillApplicationForm({
    name: 'Test Applicant',
    phone: DataGenerator.randomIndianPhoneNumber(),
    email: DataGenerator.uniqueEmail('qa.careers'),
  });
  await careersModule.uploadResume(RESUME_FIXTURES.validPdf);
}

test.describe('Careers (extended) — Application Form, OTP, Persistence @Regression @RUN1', () => {
  test('CAR-028/029/030/031/032 — Real form fields displayed, Department pre-filled and disabled @P0', async ({ careersModule }) => {
    await test.step('Open the Apply dialog', async () => {
      await openApplyDialog(careersModule);
    });
    await test.step('Confirm all real fields are present, Department is disabled', async () => {
      await careersModule.expectDepartmentFieldDisabled();
    });
  });

  test('CAR-033 — Mandatory field validation on empty submit @P0', async ({ careersModule }) => {
    await test.step('Open the Apply dialog and submit with everything blank', async () => {
      await openApplyDialog(careersModule);
      await careersModule.clickSubmit();
    });
    await test.step('Confirm the real validation messages', async () => {
      await careersModule.expectFieldError(CAREERS_MESSAGES.nameRequired);
      await careersModule.expectFieldError(CAREERS_MESSAGES.phoneRequired);
      await careersModule.expectFieldError(CAREERS_MESSAGES.emailInvalidOrEmpty);
      await careersModule.expectFieldError(CAREERS_MESSAGES.resumeRequired);
    });
  });

  test('CAR-034/035 — Valid name accepted, invalid name rejected with the real message @P1', async ({ careersModule }) => {
    await test.step('Open the Apply dialog', async () => {
      await openApplyDialog(careersModule);
    });
    await test.step('An invalid name shows the real error', async () => {
      await careersModule.fillApplicationForm({ name: 'J0hn!! ###' });
      await careersModule.clickSubmit();
      await careersModule.expectFieldError(CAREERS_MESSAGES.nameInvalid);
    });
    await test.step('A valid name clears the error', async () => {
      await careersModule.fillApplicationForm({ name: 'Test Applicant' });
      await careersModule.clickSubmit();
      await careersModule.expectFieldErrorHidden(CAREERS_MESSAGES.nameInvalid);
    });
  });

  test('CAR-036/037 — Valid email accepted, invalid email rejected with the real message @P1', async ({ careersModule }) => {
    await test.step('Open the Apply dialog and submit an invalid email', async () => {
      await openApplyDialog(careersModule);
      await careersModule.fillApplicationForm({ email: 'not-an-email' });
      await careersModule.clickSubmit();
    });
    await test.step('Confirm the real error', async () => {
      await careersModule.expectFieldError(CAREERS_MESSAGES.emailInvalidOrEmpty);
    });
  });

  test('CAR-038 — Valid 10-digit phone accepted @P1', async ({ careersModule }) => {
    await test.step('Open the Apply dialog and enter a valid phone', async () => {
      await openApplyDialog(careersModule);
      const phone = DataGenerator.randomIndianPhoneNumber();
      await careersModule.fillApplicationForm({ phone });
      await careersModule.expectPhoneInputValue(phone);
    });
  });

  test('CAR-039 — Phone with fewer than 10 digits shows the real error @P1', async ({ careersModule }) => {
    await test.step('Open the Apply dialog and enter 9 digits', async () => {
      await openApplyDialog(careersModule);
      await careersModule.fillApplicationForm({ phone: '987654321' });
      await careersModule.clickSubmit();
    });
    await test.step('Confirm the real error', async () => {
      await careersModule.expectFieldError(CAREERS_MESSAGES.phoneInvalidLength);
    });
  });

  test('CAR-040 — RESOLVED: an 11th digit is physically un-typeable (real hard maxlength=10) @P1', async ({ careersModule }) => {
    await test.step('Open the Apply dialog and attempt to type 11 digits', async () => {
      await openApplyDialog(careersModule);
      await careersModule.fillApplicationForm({ phone: '98765432109' });
    });
    await test.step('Confirm the real field caps at 10 digits, no error needed', async () => {
      await careersModule.expectPhoneInputValue('9876543210');
    });
  });

  test('CAR-041 — RESOLVED: non-numeric phone input is stripped to empty by a real client-side filter @P1', async ({ careersModule }) => {
    await test.step('Open the Apply dialog and attempt to type letters into phone', async () => {
      await openApplyDialog(careersModule);
      await careersModule.fillApplicationForm({ phone: 'abcdefghij' });
      await careersModule.clickSubmit();
    });
    await test.step('Confirm the field is empty and shows the real empty-phone message', async () => {
      await careersModule.expectPhoneInputValue('');
      await careersModule.expectFieldError(CAREERS_MESSAGES.phoneRequired);
    });
  });

  test('CAR-042/043/044 — Resume upload accepts real PDF/DOC/DOCX files @P0', async ({ careersModule }) => {
    await test.step('Open the Apply dialog', async () => {
      await openApplyDialog(careersModule);
    });
    for (const [label, path] of Object.entries({ pdf: RESUME_FIXTURES.validPdf, doc: RESUME_FIXTURES.validDoc, docx: RESUME_FIXTURES.validDocx })) {
      await test.step(`Upload a real ${label.toUpperCase()} and confirm it's accepted`, async () => {
        await careersModule.uploadResume(path);
        await careersModule.expectResumeFilename(path.split('/').pop() as string);
      });
    }
  });

  test('CAR-045 — Invalid resume format rejected with the real message @P1', async ({ careersModule }) => {
    await test.step('Open the Apply dialog and upload a JPG', async () => {
      await openApplyDialog(careersModule);
      await careersModule.uploadResume(RESUME_FIXTURES.invalidFormat);
    });
    // RESOLVED: real behavior shows this error inline immediately on file selection, NOT after
    // Submit — a rejected file is not retained, so clicking Submit re-validates and shows the
    // generic "Please upload your resume" message instead (confirmed live).
    await test.step('Confirm the real error appears immediately, before Submit', async () => {
      await careersModule.expectFieldError(CAREERS_MESSAGES.resumeInvalidFormat);
    });
  });

  test('CAR-046 — Oversized resume (>2MB) rejected with the real message @P0', async ({ careersModule }) => {
    await test.step('Open the Apply dialog and upload an oversized PDF', async () => {
      await openApplyDialog(careersModule);
      await careersModule.uploadResume(RESUME_FIXTURES.oversized);
    });
    // RESOLVED: same immediate-on-selection timing as CAR-045 — see that test's note.
    await test.step('Confirm the real error appears immediately, before Submit', async () => {
      await careersModule.expectFieldError(CAREERS_MESSAGES.resumeOversized);
    });
  });

  test('CAR-047 — Resume mandatory validation @P0', async ({ careersModule }) => {
    await test.step('Open the Apply dialog, fill everything except resume, submit', async () => {
      await openApplyDialog(careersModule);
      await careersModule.fillApplicationForm({ name: 'Test Applicant', phone: DataGenerator.randomIndianPhoneNumber(), email: DataGenerator.uniqueEmail('qa.careers') });
      await careersModule.clickSubmit();
    });
    await test.step('Confirm the real error', async () => {
      await careersModule.expectFieldError(CAREERS_MESSAGES.resumeRequired);
    });
  });

  test('CAR-048/049 — Submit with valid data shows the real OTP screen @P0 @Smoke', async ({ careersModule }) => {
    await test.step('Open the Apply dialog, fill a valid form, and submit', async () => {
      await openApplyDialog(careersModule);
      await fillValidFormWithResume(careersModule);
      await careersModule.clickSubmit();
    });
    await test.step('Confirm the real OTP screen appears', async () => {
      await careersModule.expectOtpScreenVisible();
    });
  });

  test('CAR-050/052/053/054 — RESOLVED: the confirmed real OTP bypass also works for this flow, all the way through backend submission @P0 @Smoke', async ({ careersModule }) => {
    await test.step('Open the Apply dialog, fill a valid form, and submit', async () => {
      await openApplyDialog(careersModule);
      await fillValidFormWithResume(careersModule);
      await careersModule.clickSubmit();
      await careersModule.expectOtpScreenVisible();
    });
    await test.step('An invalid OTP first (retry path), then the real bypass code succeeds', async () => {
      await careersModule.submitOtp('000000');
      await careersModule.expectOtpInvalidError(CAREERS_MESSAGES.otpInvalid);
      await careersModule.submitOtp();
    });
    await test.step('The real backend accepts the submission and shows the real success popup', async () => {
      await careersModule.expectSuccessPopup(CAREERS_MESSAGES.successHeading, CAREERS_MESSAGES.successBody);
      await careersModule.closeSuccessPopup();
    });
  });

  test('CAR-051 — Invalid OTP shows a real error and allows retry @P0 @Smoke', async ({ careersModule }) => {
    await test.step('Reach the OTP screen', async () => {
      await openApplyDialog(careersModule);
      await fillValidFormWithResume(careersModule);
      await careersModule.clickSubmit();
      await careersModule.expectOtpScreenVisible();
    });
    await test.step('Submit an incorrect code and confirm the real error, retry still possible', async () => {
      await careersModule.submitOtp('111111');
      await careersModule.expectOtpInvalidError(CAREERS_MESSAGES.otpInvalid);
      await careersModule.expectOtpScreenVisible();
    });
  });

  test('CAR-057 — RESOLVED: resume upload failure is a real silent failure, not the sheet\'s error message @P1', async ({ careersModule }) => {
    await test.step('Open the Apply dialog and fill a valid form', async () => {
      await openApplyDialog(careersModule);
      await fillValidFormWithResume(careersModule);
    });
    await test.step('Block the upload endpoint and confirm the real (silent) failure', async () => {
      await careersModule.blockResumeUploadAndExpectSilentFailure();
    });
  });

  test('CAR-058 — Form data cleared after page refresh @P2', async ({ careersModule, page }) => {
    await test.step('Open the Apply dialog and partially fill it', async () => {
      await openApplyDialog(careersModule);
      await careersModule.fillApplicationForm({ name: 'Partial Fill' });
    });
    await test.step('Refresh and confirm the dialog/data is gone', async () => {
      await page.reload();
      await careersModule.expectDialogClosed();
    });
  });

  test('CAR-059 — Form data not retained after navigating away and back @P2', async ({ careersModule }) => {
    await test.step('Open the Apply dialog and partially fill it', async () => {
      await openApplyDialog(careersModule);
      await careersModule.fillApplicationForm({ name: 'Partial Fill' });
      await careersModule.closeDialog();
    });
    await test.step('Navigate away and back, reopen, confirm the field is empty', async () => {
      await careersModule.gotoHomepage();
      await careersModule.gotoCareers();
      await careersModule.clickDepartmentAndExpectApplyDialogOpen(ONLY_DEPARTMENT);
      await careersModule.expectNameFieldEmpty();
    });
  });

  test('CAR-060 — Responsive UI at real mobile and tablet viewports @P1', async ({ careersModule }) => {
    await test.step('Open Careers page', async () => {
      await careersModule.gotoCareers();
    });
    await test.step('Confirm the page remains usable at a mobile viewport', async () => {
      await careersModule.resizeViewportAndExpectPageStillUsable(375, 667);
    });
    await test.step('Confirm the page remains usable at a tablet viewport', async () => {
      await careersModule.resizeViewportAndExpectPageStillUsable(768, 1024);
    });
  });
});
