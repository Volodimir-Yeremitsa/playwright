// pages/news-detail.page.ts

import { expect, Locator, Page, test } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class NewsDetailPage extends BasePage {
  readonly sourceLink: Locator;

  constructor(page: Page) {
    super(page);

    this.sourceLink = page.locator('.source-field .source-text').first();
  }
  //NewsDetailPage не відкривається через navigate(), а завжди через клік зі списку новин.
  get url(): string {
    return this.page.url();
  }

  async waitForOpened(): Promise<void> {
    await test.step('Дочекатися відкриття сторінки деталей новини', async () => {
      await expect(this.page).toHaveURL(/\/news\/\d+$/);
    });
  }

  async expectSourceLinkVisible(sourceUrl: string): Promise<void> {
    await test.step('Перевірити, що Source link відображається у деталях новини', async () => {
      const sourceLink = this.page.locator(`a[href="${sourceUrl}"]`).first();

      await expect.soft(sourceLink).toBeVisible();
      await expect.soft(sourceLink).toHaveText(sourceUrl);
    });
  }
}