import type { Page } from '@playwright/test';

export class SamplePage {
  constructor(private page: Page) {}

  readonly usernameInput = () => this.page.getByLabel('Username');
  readonly passwordInput = () => this.page.getByLabel('Password');
  readonly loginButton = () => this.page.getByRole('button', { name: 'Log in' });
  readonly welcomeHeading = () => this.page.getByRole('heading', { name: /welcome/i });

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async fillUsername(value: string): Promise<void> {
    await this.usernameInput().fill(value);
  }

  async fillPassword(value: string): Promise<void> {
    await this.passwordInput().fill(value);
  }

  async submitLogin(): Promise<void> {
    await this.loginButton().click();
  }
}
