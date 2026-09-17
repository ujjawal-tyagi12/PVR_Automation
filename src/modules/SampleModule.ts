import { Page, expect } from '@playwright/test';
import { SamplePage } from '@pages/SamplePage';
import { Logger } from '@utils/Logger';

export class SampleModule {
  private samplePage: SamplePage;

  constructor(private page: Page) {
    this.samplePage = new SamplePage(page);
  }

  async login(username: string, password: string): Promise<void> {
    Logger.info(`Logging in as ${username}`);
    await this.samplePage.goto();
    await this.samplePage.fillUsername(username);
    await this.samplePage.fillPassword(password);
    await this.samplePage.submitLogin();
    await expect(this.samplePage.welcomeHeadingLocator()).toBeVisible();
  }
}
