import { Locator, Page, test } from '@playwright/test';
import { BaseComponent } from '@components/base.component';

export type LoginCredentials = {
  email: string;
  password: string;
};

export class SignInModal extends BaseComponent {
  readonly modal: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    const modal = page.locator('mat-dialog-container, app-sign-in, [role="dialog"]').first();
    super(page, modal);

    this.modal = modal;

    // Локатори ініціалізовані в конструкторі.
    this.emailInput = this.root
      .getByRole('textbox', { name: /email|електронна пошта/i })
      .first();

    this.passwordInput = this.root      
      .getByRole('textbox', { name: /password|пароль/i })
      .first();

    this.submitButton = this.root  
      .getByRole('button', { name: /sign in|увійти/i })
      .first();
  }

  async waitForOpened(): Promise<void> {
    await test.step('Дочекатися відкриття модального вікна логіну', async () => {
      await this.waitUntilVisible(this.emailInput);
    });
  }

  async fillCredentials(credentials: LoginCredentials): Promise<void> {
    await test.step('Заповнити email та пароль', async () => {
      await this.emailInput.fill(credentials.email);
      await this.passwordInput.fill(credentials.password);
    });
  }

  async submit(): Promise<void> {
    await test.step('Натиснути кнопку входу', async () => {
      await this.submitButton.click();
    });
  }

  async login(credentials: LoginCredentials): Promise<void> {
    await this.waitForOpened();
    await this.fillCredentials(credentials);
    await this.submit();
  }
}
