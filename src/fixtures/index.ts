import { test as base, expect, Page } from '@playwright/test';
import { SamplePage } from '@pages/SamplePage';
import { SampleModule } from '@modules/SampleModule';
import { ensureStorageState, STORAGE_STATE_PATH } from '@fixtures/auth.fixture';
import { config } from '@config/index';

type Fixtures = {
  samplePage: SamplePage;
  sampleModule: SampleModule;
  authenticatedPage: Page;
};

export const test = base.extend<Fixtures>({
  samplePage: async ({ page }, use) => {
    await use(new SamplePage(page));
  },
  sampleModule: async ({ page }, use) => {
    await use(new SampleModule(page));
  },
  authenticatedPage: async ({ browser }, use) => {
    await ensureStorageState();
    const context = await browser.newContext({ storageState: STORAGE_STATE_PATH, baseURL: config.baseUrl });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect };
