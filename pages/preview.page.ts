import { expect, Locator, Page, test } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { ENV } from '@utils/env';

export class PreviewPage extends BasePage {
  readonly previewContainer: Locator;
  readonly backButton: Locator;
  readonly publishButton: Locator;
  readonly titleInput: Locator;
  readonly tags: Locator;
  readonly mainTextInput: Locator;
  readonly newsDate: Locator;
  readonly newsAuthor: Locator;
  readonly userName: Locator;  

  constructor(page: Page) {
    super(page);

    // Ключовий елемент сторінки Preview.
    this.previewContainer = page.locator('app-news-preview-page').first();

    this.backButton = page.locator('.back-button a');
    this.publishButton = page.getByRole('button', { name: 'Publish' });
    this.titleInput = page.locator('.news-title');
    this.mainTextInput = page.locator('.news-text-content');
    this.tags =  page.locator('.tags-item');
    this.newsDate = page.locator('.news-info .news-info-date');
    this.newsAuthor = page.locator('.news-info .news-info-author');
    this.userName = page.locator('#header_user-wrp li.user-name');    
  }

  get url(): string {
    return `${ENV.BASE_URL}/#/greenCity/news/preview`;
  }

  async waitForOpened(): Promise<void> {
    await test.step('Дочекатися відкриття сторінки Preview News', async () => {
      await this.waitForPageReady(this.previewContainer);
    });
  }  

  async verifyPreviewPage(): Promise<void> {
    return test.step('Перевірити, що сторінка Preview відображається коректно', async () => {
      
      await this.backButton.isVisible();
      await this.backButton.isEnabled();
      await this.publishButton.isVisible();
      await this.titleInput.isVisible();
      await this.mainTextInput.isVisible();
      await this.tags.isVisible();

      await expect(this.titleInput).toHaveText('Test Preview');
      await expect(this.mainTextInput).toHaveText('This is a test preview content');

      //The preview displays the current date.
      const expectedDate = new Date().toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }
      );
      await expect(this.newsDate).toHaveText(expectedDate);

      //The preview displays the current user as the author.
      await expect(this.newsAuthor).toContainText(await this.userName.innerText()); 

      });
   }
}
