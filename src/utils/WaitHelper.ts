import type { Locator, Page } from '@playwright/test';

export const WaitHelper = {
  async forVisible(locator: Locator, timeout = 10_000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  },

  async forHidden(locator: Locator, timeout = 10_000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  },

  async forUrl(page: Page, urlPart: string | RegExp, timeout = 10_000): Promise<void> {
    await page.waitForURL(urlPart, { timeout });
  },

  async forNetworkIdle(page: Page, timeout = 10_000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  },
};
