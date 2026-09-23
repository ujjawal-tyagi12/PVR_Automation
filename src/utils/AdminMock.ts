import type { Page } from '@playwright/test';

/**
 * Mocks the Admin Panel login + Login-Settings-save calls (TC_ADM_042/043) so the suite
 * never attempts a real admin login against production. No real Admin Portal endpoint names
 * are known — see the TODO(heal) note on `config.adminBaseUrl`.
 */
const ADMIN_LOGIN_PATTERN = /\/api\/.*admin.*login/i;
const ADMIN_SETTINGS_SAVE_PATTERN = /\/api\/.*admin.*(login-settings|max-device)/i;

export async function mockAdminLoginSettings(page: Page): Promise<void> {
  await page.route(ADMIN_LOGIN_PATTERN, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, token: 'mock-admin-token' }) });
  });

  await page.route(ADMIN_SETTINGS_SAVE_PATTERN, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, message: 'Settings updated successfully' }) });
  });
}
