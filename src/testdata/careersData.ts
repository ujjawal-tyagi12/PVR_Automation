/**
 * Grounded live 2026-09-10 against UAT (`/career`) via a background research agent driving
 * headless Playwright (Playwright MCP's browser fails in this sandbox — see
 * `pvr-inox-grounding-technique` project memory). Real strings only — see `CareersPage.ts` for
 * the full grounding narrative.
 */

export const ONLY_DEPARTMENT = 'Sales Marketing';
export const ONLY_DEPARTMENT_ID = '6a55fedfaedbed891bb22c62';

export const COMPANY_ADDRESS = '7th Floor, Lotus Grandeur Building, Veera Desai Road, Opp. Gundecha Symphony, Andheri(W), Mumbai-400053';

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/moviesatpvr/',
  instagram: 'https://www.instagram.com/pvrpictures/?hl=en',
  twitter: 'https://x.com/_PVRCinemas?lang=en',
  linkedin: 'https://in.linkedin.com/company/pvr-limited',
  youtube: 'https://www.youtube.com/channel/UCQAGGxDiY8mCBvorddZFymQ',
} as const;

/** Real validation/error copy, confirmed verbatim live — several differ from the sheet's
 * assumed wording (no trailing periods, different empty-vs-invalid phrasing). */
export const CAREERS_MESSAGES = {
  nameRequired: 'Please enter your full name',
  nameInvalid: 'Please enter a valid name',
  emailInvalidOrEmpty: 'Please enter a valid email',
  phoneRequired: 'Please enter your phone number',
  phoneInvalidLength: 'Please enter a valid phone number',
  resumeRequired: 'Please upload your resume',
  resumeInvalidFormat: 'Resume must be a .pdf, .doc or .docx file',
  resumeOversized: 'Resume must be under 2 MB',
  otpInvalid: 'You have entered an invalid OTP.',
  successHeading: 'Resume Submitted',
  successBody: 'Your resume has been submitted, HR will contact you back shortly.',
} as const;

export const RESUME_FIXTURES = {
  validPdf: 'src/testdata/files/resume-valid.pdf',
  validDoc: 'src/testdata/files/resume-valid.doc',
  validDocx: 'src/testdata/files/resume-valid.docx',
  invalidFormat: 'src/testdata/files/resume-invalid.jpg',
  oversized: 'src/testdata/files/resume-oversized.pdf',
} as const;
