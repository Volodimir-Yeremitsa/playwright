import { expect, Locator, Page, test } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { ENV } from '@utils/env';

export class NewsPage extends BasePage {
  readonly createNewsButton: Locator;
  readonly newsContainer: Locator;
  readonly firstNews: Locator;

  readonly searchButton: Locator;
  readonly searchInput: Locator;
  readonly newsLinks: Locator;

  constructor(page: Page) {
    super(page);

    // Прибрано тег main для уникнення таймаутів
    this.newsContainer = page.locator('app-news, app-eco-news').first();

    this.createNewsButton = page
      .getByRole('link', { name: /create news|створити новину/i })
      .first();
      
    this.newsLinks = page.locator('.container .list-wrapper a.link');
    this.firstNews = this.newsLinks.first();

    this.searchButton = page.locator('.container-img .search-img').first();
    this.searchInput = page.locator('.container-input input[placeholder="Search"]');
  }
  
  get url(): string {
    // Для hash-router правильний URL: BASE_URL + /#/greenCity/news.
    return `${ENV.BASE_URL}/#/greenCity/news`
  }

  async open(): Promise<void> {
    await test.step('Відкрити сторінку новин', async () => {
      await this.navigate();
      await this.waitForPageReady(this.newsContainer);
    });
  }

  async openCreateNewsForm(): Promise<void> {
    await test.step('Натиснути кнопку Create News', async () => {
      const confirmCancelButton = this.page
        .locator('button')
        .filter({ hasText: /Yes, cancel|Так, скасувати/i })
        .first();
      
      const isCancelModalVisible = await confirmCancelButton.isVisible().catch(() => false);
      
      if (isCancelModalVisible) {
        await confirmCancelButton.click();
        await this.page.waitForTimeout(500);
      }
      
      const backdrop = this.page.locator('.cdk-overlay-backdrop');
      await backdrop.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
      
      await this.createNewsButton.click();
    });
  }

  async openFirstNews(): Promise<void> {
    await test.step('Відкрити першу новину зі списку', async () => {
      await this.firstNews.click();
    });
  }

  async searchNewsByTitle(title: string): Promise<void> {
    await test.step(`Знайти новину за заголовком: ${title}`, async () => {
      await this.searchButton.click();
      await this.searchInput.fill(title);
      await expect(this.newsLinks.first()).toBeVisible();
    });
  }

  async openNewsByTitle(title: string): Promise<void> {
    await test.step(`Відкрити новину з заголовком: ${title}`, async () => {
      const news = this.newsLinks.filter({ hasText: title }).first();

      await expect(news).toBeVisible();
      await news.click();
    });
  }
}
