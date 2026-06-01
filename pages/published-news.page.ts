import { Locator, Page, test, expect } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { ENV } from '@utils/env';

export class PublishedNewsPage extends BasePage {
  readonly newsTitle: Locator;
  readonly newsTags: Locator;

  constructor(page: Page) {
    super(page);
    
    this.newsTitle = page.locator('h1, [class*="title"]').first();
    this.newsTags = page.locator('[class*="tag"], [class*="chip"], .tags');
  }

  get url(): string {
    return `${ENV.BASE_URL}/#/greenCity/news`;
  }

  async waitForNewsLoaded(): Promise<void> {
    await test.step('Дочекатися завантаження новини', async () => {
      await this.waitForPageReady(this.newsTitle);
    });
  }

  async getNewsTagsByTitle(newsTitle: string): Promise<string[]> {
    return await test.step(`Отримати теги новини "${newsTitle}"`, async () => {
      // Намагаємося знайти контейнер новини за заголовком
      const newsItem = this.page.locator(`text=${newsTitle}`).locator('..').first();
      const tagsInNews = newsItem.locator('[class*="tag"], [class*="chip"], .tag-item');
      
      const tagTexts: string[] = [];
      const count = await tagsInNews.count();
      
      for (let i = 0; i < count; i++) {
        const tagText = await tagsInNews.nth(i).textContent();
        if (tagText) {
          tagTexts.push(tagText.trim());
        }
      }
      
      return tagTexts;
    });
  }

  async verifyNewsHasTag(newsTitle: string, expectedTag: string): Promise<boolean> {
    return await test.step(`Перевірити, що новина "${newsTitle}" містить тег "${expectedTag}"`, async () => {
      const tags = await this.getNewsTagsByTitle(newsTitle);
      return tags.some(tag => tag.toLowerCase().includes(expectedTag.toLowerCase()));
    });
  }

  async verifyNewsHasTags(newsTitle: string, expectedTags: string[]): Promise<boolean> {
    return await test.step(`Перевірити, що новина "${newsTitle}" містить теги ${expectedTags.join(', ')}`, async () => {
      const tags = await this.getNewsTagsByTitle(newsTitle);
      return expectedTags.every(expectedTag =>
        tags.some(tag => tag.toLowerCase().includes(expectedTag.toLowerCase()))
      );
    });
  }
}
