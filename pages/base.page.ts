import { expect, Locator, Page, Response } from '@playwright/test';
import { HeaderComponent } from '@components/header.component';
import { SignInModal } from '@components/sign-in.modal';

export abstract class BasePage {
  protected readonly page: Page;

  readonly header: HeaderComponent;
  readonly signInModal: SignInModal;

  constructor(page: Page) {
    this.page = page;

    // Спільні компоненти, які є на багатьох сторінках.
    this.header = new HeaderComponent(page);
    this.signInModal = new SignInModal(page);
  }

  // Кожна конкретна сторінка сама задає свій URL.
  abstract get url(): string;

  // Перехід на сторінку.
  async navigate(): Promise<Response | null> {
    return await this.page.goto(this.url);
  }

  // Чекаємо не networkidle, а конкретний ключовий елемент сторінки.
  async waitForPageReady(element: Locator, timeout = 10000): Promise<void> {
    await expect(element).toBeVisible({ timeout });
  }

  // Перевірка поточного URL.
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
