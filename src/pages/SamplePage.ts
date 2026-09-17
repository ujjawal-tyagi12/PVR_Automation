import { Page } from '@playwright/test';

export class SamplePage {
  constructor(private page: Page) {}

  private usernameInput = () => this.page.getByLabel('Username');
  private passwordInput = () => this.page.getByLabel('Password');
  private loginButton = () => this.page.getByRole('button', { name: 'Log in' });
  private welcomeHeading = () => this.page.getByRole('heading', { name: 'Welcome' });

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput().fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput().fill(password);
  }

  async submitLogin(): Promise<void> {
    await this.loginButton().click();
  }

  welcomeHeadingLocator() {
    return this.welcomeHeading();
  }
}
