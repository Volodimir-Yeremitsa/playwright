// pages/news-detail.page.ts

import { expect, Locator, Page, test } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class NewsDetailPage extends BasePage {
  readonly sourceLink: Locator;
  readonly editNewsButton: Locator;
  readonly newsTitle: Locator;
  readonly newsContent: Locator;
  readonly newsDate: Locator;
  readonly tags: Locator;

  constructor(page: Page) {
    super(page);

    this.sourceLink = page.locator('.source-field .source-text').first();

    this.editNewsButton = page.locator('a', { hasText: 'Edit news' }).first();
    this.newsTitle = page.locator('.news-title').first();
    this.newsContent = page.locator('.news-text-content').first();
    this.newsDate = page.locator('.news-info-date').first();
    this.tags = page.locator('.tags-item');
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

  async expectEditNewsButtonVisible(): Promise<void> {
    await test.step('Перевірити, що кнопка Edit news видима для автора', async () => {
      await expect(this.editNewsButton).toBeVisible();
    });
  }

async getCreatedDate(): Promise<string> {
  return (await this.newsDate.innerText()).trim();
}

async openEditNewsForm(): Promise<void> {
  await test.step('Натиснути кнопку Edit news', async () => {
    await expect(this.editNewsButton).toBeVisible();
    await this.editNewsButton.click();
  });
}

async expectNewsUpdated(
  title: string,
  content: string,
  tag: string,
  createdDate: string
): Promise<void> {
  await test.step('Перевірити, що новина оновлена', async () => {
    await expect(this.newsTitle).toHaveText(title);
    await expect(this.newsContent).toContainText(content);
    await expect(this.tags.filter({ hasText: tag })).toBeVisible();
    await expect(this.newsDate).toHaveText(createdDate);
  });
}  
}