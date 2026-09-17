import { test, expect } from '@fixtures/index';
import { config } from '@config/index';

test.describe('Sample login flow @P0 @Smoke', () => {
  test('user can log in and see the welcome heading', async ({ sampleModule, page }) => {
    await test.step('log in with valid credentials', async () => {
      await sampleModule.login(config.credentials.username, config.credentials.password);
    });

    await test.step('welcome heading is visible', async () => {
      await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
    });
  });
});
