import { Locator, Page, expect } from '@playwright/test';

export class WaitHelper {
  static async forVisible(locator: Locator, timeout = 10000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  static async forHidden(locator: Locator, timeout = 10000): Promise<void> {
    await expect(locator).toBeHidden({ timeout });
  }

  static async forUrl(page: Page, pattern: string | RegExp, timeout = 15000): Promise<void> {
    await page.waitForURL(pattern, { timeout });
  }

  static async forNetworkIdle(page: Page, timeout = 15000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  static async forCondition(condition: () => Promise<boolean>, timeout = 10000, interval = 250): Promise<void> {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (await condition()) return;
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    throw new Error(`Condition not met within ${timeout}ms`);
  }

  // For a real, fixed-duration wait against live external timing (e.g. an OTP countdown) where
  // there is no DOM condition to poll. Plain setTimeout, not page.waitForTimeout — the latter is
  // banned repo-wide because it's usually a smell for a missing web-first assertion, but a real
  // countdown genuinely has no earlier signal to wait on.
  static async forDuration(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  // This app (Next.js App Router) intermittently takes longer than a bare navigation's 'load'
  // event to finish client-side hydration under live load — confirmed via repeated real
  // failures across several pages, each initially "fixed" by bumping one assertion's timeout to
  // 20000ms ad hoc. That pattern is centralized here instead: wait for the network to settle,
  // then for the header's account button — present on every page and only rendered post-
  // hydration — to become visible, which is the one DOM signal already relied on elsewhere in
  // this codebase (AdminLoginPage/AdminProfilePage/ChangePasswordPage/ForgotPasswordPage) as
  // proof the app has actually mounted, not just that navigation completed.
  //
  // This does NOT paper over a genuinely broken deployment: if a required JS chunk is serving
  // the wrong content (confirmed live, 2026-09-16 — see news-management.spec.ts and
  // investor-support.spec.ts grounding notes), hydration never completes no matter how long this
  // waits, and it correctly still times out and fails. It only absorbs the ordinary case where
  // hydration is merely slow, not broken.
  static async forHydration(page: Page, timeout = 20000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout }).catch(() => undefined);
    await expect(page.getByRole('button', { name: 'User Icon' })).toBeVisible({ timeout });
  }
}
