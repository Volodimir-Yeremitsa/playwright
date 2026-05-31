import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { ENV } from '@utils/env';

export class NewsPage extends BasePage {
  readonly createNewsButton: Locator;
  readonly newsContainer: Locator;
  readonly firstNews: Locator;

  constructor(page: Page) {
    super(page);

    this.newsContainer = page.locator('app-news, app-eco-news, main').first();

    this.createNewsButton = page
      .getByRole('link', { name: /create news|створити новину/i })
      .first();
      
    this.firstNews = page.locator('.container .list-wrapper a.link').first();  
  }
  
  get url(): string {
    // Для hash-router правильний URL: BASE_URL + /news.
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
      await this.createNewsButton.click();
    });
  }

  async openFirstNews(): Promise<void> {
    await test.step('Відкрити першу новину зі списку', async () => {
      await this.firstNews.click();
    });
  }

}