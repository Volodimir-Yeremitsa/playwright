import { Locator, Page, test, expect } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { ENV } from '@utils/env';

export class NewsPage extends BasePage {
  readonly createNewsButton: Locator;
  readonly newsContainer: Locator;

  constructor(page: Page) {
    super(page);

    this.newsContainer = page.locator('app-news, app-eco-news').first();

    this.createNewsButton = page.locator("//div[contains(@id, 'create-button')]").first();
      
  }
  
  get url(): string {
    return `${ENV.BASE_URL}/#/greenCity/news`
  }

  async open(): Promise<void> {
    await test.step('Відкрити сторінку новин', async () => {
      const ecoNewsLink = this.page
        .locator('a, [role="link"]')
        .filter({ hasText: /Eco news|Eco News|новини/i })
        .first();
      
      await ecoNewsLink.click();
      
      await this.waitForPageReady(this.newsContainer, 15000);
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
}
