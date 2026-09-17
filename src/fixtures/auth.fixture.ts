import { test as base, chromium, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { SampleModule } from '@modules/SampleModule';
import { config } from '@config/index';

export const STORAGE_STATE_PATH = path.join('.auth', 'session.json');

export async function ensureStorageState(): Promise<void> {
  if (fs.existsSync(STORAGE_STATE_PATH)) return;
  fs.mkdirSync(path.dirname(STORAGE_STATE_PATH), { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL: config.baseUrl });
  const page = await context.newPage();
  await new SampleModule(page).login(config.credentials.username, config.credentials.password);
  await context.storageState({ path: STORAGE_STATE_PATH });
  await browser.close();
}

type AuthFixtures = {
  authenticatedPage: Page;
};

export const authTest = base.extend<AuthFixtures>({
  authenticatedPage: async ({ browser }, use) => {
    await ensureStorageState();
    const context = await browser.newContext({ storageState: STORAGE_STATE_PATH, baseURL: config.baseUrl });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export const authenticatedTest = authTest;
