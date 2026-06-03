import { expect, Locator, Page, Response } from '@playwright/test';
import { HeaderComponent } from '@components/header.component';
import { SignInModal } from '@components/sign-in.modal';

export abstract class BasePage {
  protected readonly page: Page;

  readonly header: HeaderComponent;
  readonly signInModal: SignInModal;

  constructor(page: Page) {
    this.page = page;

    this.header = new HeaderComponent(page);
    this.signInModal = new SignInModal(page);
  }

  abstract get url(): string;

  async navigate(): Promise<Response | null> {
    if (!this.url) {
      throw new Error(
        `Navigation failed: 'this.url' is undefined in ${this.constructor.name}. ` +
        `Перевірте, чи коректно реалізовано 'get url()' у дочірньому класі.`
      );
    }
    
    return await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
  }

  async waitForPageReady(element: Locator, timeout = 10000): Promise<void> {
    await expect(element).toBeVisible({ timeout });
  }

  async assertOnPage(urlPart: string = this.url): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(this.escapeRegExp(urlPart)));
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  getCurrentUrl(): string {
    return this.page.url();
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
