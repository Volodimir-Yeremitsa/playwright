import { Locator, Page, test } from '@playwright/test';
import { BaseComponent } from '@components/base.component';

export class HeaderComponent extends BaseComponent {
  readonly signInButton: Locator;
  readonly userMenuButton: Locator;

  constructor(page: Page) {
    super(page, page.locator('header, app-header, body').first());

    // Кнопка входу може бути текстовою або іконкою з alt/title.
    this.signInButton = this.root
      .getByRole('link', { name: /sign in|Увійти/i })
      .or(page.getByRole('img', { name: /sing in button/i }))
      .first();

    // Після логіну з'являється меню користувача.
    this.userMenuButton = this.root
      .locator('#header_user-wrp')
      .first();
  }

  async openSignInModal(): Promise<void> {
    await test.step('Відкрити модальне вікно логіну', async () => {
      await this.signInButton.click();
    });
  }

  async waitForLoggedInState(): Promise<void> {
    await test.step('Перевірити, що користувач залогінений', async () => {
      await this.waitUntilVisible(this.userMenuButton);
    });
  }
}
