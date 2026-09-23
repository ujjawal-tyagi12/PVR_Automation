import { test } from '@fixtures/index';
import { ONLY_DEPARTMENT, ONLY_DEPARTMENT_ID, COMPANY_ADDRESS, SOCIAL_LINKS } from '@testdata/careersData';

test.describe('Careers — Navigation, Landing Page, Departments @Regression @RUN1', () => {
  test('CAR-001/002 — Career option and navigation @P0 @Smoke', async ({ careersModule }) => {
    await test.step('Open homepage and the More menu', async () => {
      await careersModule.gotoHomepage();
      await careersModule.clickMoreAndExpectCareerMenuItemVisible();
    });
    await test.step('Click Career and confirm navigation', async () => {
      await careersModule.clickCareerMenuItemAndExpectNavigation();
    });
  });

  test('CAR-003 — Careers page loads successfully @P0 @Regression', async ({ careersModule }) => {
    await test.step('Open /career directly', async () => {
      await careersModule.gotoCareers();
    });
  });

  test('CAR-004 — Banner image displayed @P1 @Regression', async ({ careersModule }) => {
    await test.step('Open Careers page', async () => {
      await careersModule.gotoCareers();
    });
    await test.step('Confirm the real banner image is displayed', async () => {
      await careersModule.expectBannerVisible();
    });
  });

  test('CAR-006/007 — RESOLVED: no distinct "Company Information" section exists — only real "Why PVR INOX?" content @P2 @Regression', async ({ careersModule }) => {
    await test.step('Open Careers page', async () => {
      await careersModule.gotoCareers();
    });
    await test.step('Confirm the real "Why PVR INOX?" content is displayed (the closest real match — no separate "Company Information" heading exists anywhere)', async () => {
      await careersModule.expectHeadingVisible(/why pvr inox/i);
      await careersModule.expectWhyPvrInoxBodyVisible();
    });
  });

  test('CAR-008 — Social media links open the correct real pages @P1 @Regression', async ({ careersModule }) => {
    await test.step('Open Careers page', async () => {
      await careersModule.gotoCareers();
    });
    await test.step('Confirm each real social link has the correct href and opens a new tab', async () => {
      for (const href of Object.values(SOCIAL_LINKS)) {
        await careersModule.expectSocialLinkHref(href);
      }
    });
  });

  test('CAR-009 — Company address displayed @P2 @Regression', async ({ careersModule }) => {
    await test.step('Open Careers page', async () => {
      await careersModule.gotoCareers();
    });
    await test.step('Confirm the real address is displayed', async () => {
      await careersModule.expectAddressVisible(COMPANY_ADDRESS);
    });
  });

  test('CAR-010 — Map view displayed @P1 @Regression', async ({ careersModule }) => {
    await test.step('Open Careers page', async () => {
      await careersModule.gotoCareers();
    });
    await test.step('Confirm the real embedded map is displayed', async () => {
      await careersModule.expectMapVisible();
    });
  });

  test('CAR-011 — Explore Departments section displayed @P1 @Regression', async ({ careersModule }) => {
    await test.step('Open Careers page', async () => {
      await careersModule.gotoCareers();
    });
    await test.step('Confirm the section and the real department are displayed', async () => {
      await careersModule.expectHeadingVisible(/explore departments/i);
      await careersModule.expectDepartmentVisible(ONLY_DEPARTMENT);
    });
  });

  test('CAR-013/014 — Department name and image displayed @P1 @Regression', async ({ careersModule }) => {
    await test.step('Open Careers page', async () => {
      await careersModule.gotoCareers();
    });
    await test.step('Confirm the real department name and a thumbnail image are displayed', async () => {
      await careersModule.expectDepartmentVisible(ONLY_DEPARTMENT);
      await careersModule.expectDepartmentImageVisible(ONLY_DEPARTMENT);
    });
  });

  test('CAR-015/056 — RESOLVED: department click opens the Apply dialog directly (real behavior — the only department has 0 open positions) @P0 @Regression', async ({ careersModule }) => {
    await test.step('Open Careers page', async () => {
      await careersModule.gotoCareers();
    });
    await test.step('Click the department and confirm the real Apply dialog opens with Department pre-filled', async () => {
      await careersModule.clickDepartmentAndExpectApplyDialogOpen(ONLY_DEPARTMENT);
      await careersModule.closeDialog();
    });
  });

  test('CAR-017 — Open Positions list: RESOLVED, real empty-state confirmed instead of a populated list @P1 @Regression', async ({ careersModule }) => {
    await test.step('Open the real job-listing route directly for the only department', async () => {
      await careersModule.gotoJobListingAndExpectEmptyState(ONLY_DEPARTMENT_ID);
    });
  });

  test.fixme(
    'CAR-023/024/025/026/027 — Job Detail page, experience range, vacancies, full description, Apply CTA on Job Detail @P0/@P1 @Regression — BLOCKED: same root cause as CAR-018-022 — with 0 real jobs anywhere on this environment, no Job Detail page could be reached. Direct-URL guesses (`/career/job/1`, `/career/department/{id}`) all returned real Next.js 404 pages, confirming no real job-detail route could be grounded, not just "not found by search."',
    () => {},
  );
});
