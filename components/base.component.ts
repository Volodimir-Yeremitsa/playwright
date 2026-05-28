import { expect, Locator, Page } from '@playwright/test';

export abstract class BaseComponent {
  protected readonly page: Page;
  protected readonly root: Locator;

  constructor(page: Page, root: Locator) {
    this.page = page;
    this.root = root;
  }

  // Очікування видимості елемента компонента.
  async waitUntilVisible(locator: Locator, timeout = 10000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  // Повертає текст елемента без зайвих пробілів.
  async getText(locator: Locator): Promise<string> {
    return (await locator.innerText()).trim();
  }
}
