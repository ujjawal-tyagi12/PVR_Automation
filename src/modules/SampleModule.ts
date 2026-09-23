import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { SamplePage } from '@pages/SamplePage';
import { Logger } from '@utils/Logger';

export class SampleModule {
  private readonly samplePage: SamplePage;

  constructor(private page: Page) {
    this.samplePage = new SamplePage(page);
  }

  async loginAs(username: string, password: string): Promise<void> {
    Logger.info(`Logging in as "${username}"`);
    await this.samplePage.goto();
    await this.samplePage.fillUsername(username);
    await this.samplePage.fillPassword(password);
    await this.samplePage.submitLogin();
  }

  async expectLoggedIn(): Promise<void> {
    await expect(this.samplePage.welcomeHeading()).toBeVisible();
  }
}
