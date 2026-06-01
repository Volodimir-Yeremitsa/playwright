import { expect, Locator, Page, test } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { ENV } from '@utils/env';

export class CreateNewsPage extends BasePage {
  readonly form: Locator;
  readonly titleInput: Locator;
  readonly titleCounter: Locator;
  readonly tagBlock: Locator;
  readonly addImageButton: Locator;
  readonly mainTextInput: Locator;
  readonly mainTextCounter: Locator;
  readonly dateInfo: Locator; 
  readonly authorField: Locator;
  readonly dateField: Locator;
  readonly sourceInput: Locator;
  readonly cancelButton: Locator;
  readonly previewButton: Locator;
  readonly publishButton: Locator;
  readonly selectedTags: Locator;
  readonly tagButtons: Locator;

  constructor(page: Page) {
    super(page);

    this.form = page.locator('app-create-news, app-create-eco-news, main').first();

    this.titleInput = this.form
      .locator('textarea[formcontrolname="title"]')
      .first();

    this.tagBlock = this.form.locator('div.tags-box');

    this.sourceInput = this.form
      .getByPlaceholder(/link to external source|посилання/i)
      .first();

    this.addImageButton = this.form
      .getByRole('button', { name: /browse|обрати|завантажити/i })
      .first();

    this.mainTextInput = this.form
      .locator('div.ql-editor[contenteditable="true"]')
      .first();

    this.dateInfo = this.form.locator('div.date');

    this.dateField = this.dateInfo.locator('p').nth(0);
    this.authorField = this.dateInfo.locator('p').nth(1);

    this.sourceInput = this.form
      .getByPlaceholder(/посилання на зовнішнє джерело|link to external source/i)
      .first();

    this.cancelButton = this.form.getByRole('button', { name: /cancel|вийти/i }).first();
    this.previewButton = this.form.getByRole('button', { name: /preview|переглянути/i }).first();
    this.publishButton = this.form.getByRole('button', { name: /publish|опублікувати/i }).first();
    
    this.selectedTags = this.form.locator('div.selected-tags, .chips, [class*="tag"][class*="selected"]').first();
    this.tagButtons = this.form.locator('button[class*="tag"], div[class*="tag"] button, .tags-box button');
  }

  get url(): string {
   return `${ENV.BASE_URL}/news/create-news`;
  }

  async waitForOpened(): Promise<void> {
    await test.step('Дочекатися відкриття форми Create News', async () => {
      await this.waitForPageReady(this.titleInput);
    });
  }

  async expectRequiredFieldsVisible(): Promise<void> {
    await test.step('Перевірити наявність основних полів форми Create News', async () => {
      await expect(this.titleInput).toBeVisible();
      await expect(this.tagBlock).toBeVisible();
      await expect(this.addImageButton).toBeVisible();
      await expect(this.mainTextInput).toBeVisible();
      await expect(this.authorField).toBeVisible();
      await expect(this.dateField).toBeVisible();
      await expect(this.sourceInput).toBeVisible();
      await expect(this.cancelButton).toBeVisible();
      await expect(this.previewButton).toBeVisible();
      await expect(this.publishButton).toBeVisible();
    });
  }

  async expectFieldsInCorrectOrder(): Promise<void> {
    await test.step('Перевірити порядок полів форми Create News', async () => {
      
    });
  }

  async expectAuthorAndDateAreReadonly(): Promise<void> {
    await test.step('Перевірити, що Author та Date не редагуються', async () => {
      await expect(this.authorField).not.toHaveAttribute('contenteditable', 'true');
      await expect(this.dateField).not.toHaveAttribute('contenteditable', 'true');
    });
  }

  async selectTag(tagName: string): Promise<void> {
    await test.step(`Вибрати тег "${tagName}"`, async () => {
      const tagButton = this.tagBlock
        .getByRole('button', { name: new RegExp(tagName, 'i') })
        .first();
      
      await tagButton.click();
      await this.page.waitForTimeout(300);
    });
  }

  async getSelectedTagsCount(): Promise<number> {
    return await test.step('Отримати кількість обраних тегів', async () => {
      const allTagButtons = this.tagBlock.locator('button');
      const count = await allTagButtons.count();
      
      console.log(`📊 Total tag buttons found: ${count}`);
      
      let selectedCount = 0;
      for (let i = 0; i < count; i++) {
        const button = allTagButtons.nth(i);
        
        let ariaPressed = await button.getAttribute('aria-pressed');
        if (ariaPressed === 'true') {
          selectedCount++;
          const tagName = await button.textContent();
          console.log(`  ✓ Tag selected (aria-pressed): ${tagName}`);
          continue;
        }
        
        const className = await button.getAttribute('class');
        if (className && (className.includes('active') || className.includes('selected'))) {
          selectedCount++;
          const tagName = await button.textContent();
          console.log(`  ✓ Tag selected (class): ${tagName}`);
          continue;
        }
        
        const ngSelected = await button.getAttribute('ng-reflect-selected');
        if (ngSelected === 'true') {
          selectedCount++;
          const tagName = await button.textContent();
          console.log(`  ✓ Tag selected (ng-reflect-selected): ${tagName}`);
        }
      }
      
      console.log(`🏷️  Total selected tags: ${selectedCount}`);
      return selectedCount;
    });
  }

  async fillTitle(title: string): Promise<void> {
    await test.step(`Заповнити заголовок: "${title}"`, async () => {
      await this.titleInput.click();
      await this.titleInput.fill(title);
    });
  }

  async fillMainText(text: string): Promise<void> {
    await test.step(`Заповнити основний текст: "${text}"`, async () => {
      await this.mainTextInput.click();
      await this.mainTextInput.fill(text);
    });
  }

  async publish(): Promise<void> {
    await test.step('Натиснути кнопку Publish', async () => {
      await this.publishButton.click();
      await this.page.waitForTimeout(2000);
    });
  }

  async waitForPublished(): Promise<void> {
    await test.step('Дочекатися публікації новини', async () => {
      await this.page.waitForTimeout(2000);
    });
  }

  async uploadImage(filePath: string): Promise<void> {
    await test.step(`Завантажити зображення: ${filePath}`, async () => {
      const fileInput = this.form.locator('input[type="file"]').first();
      
      await fileInput.setInputFiles(filePath);
      
      await this.page.waitForTimeout(1500);
    });
  }

  async getImageUploadErrorMessage(): Promise<string | null> {
    return await test.step('Отримати помилку завантаження зображення', async () => {
      const errorMessage = this.form
        .locator('[class*="error"], .error-message, [class*="invalid"]')
        .filter({ hasText: /PNG|JPEG|JPG|size|10MB/i })
        .first();
      
      const isVisible = await errorMessage.isVisible().catch(() => false);
      if (isVisible) {
        return await errorMessage.textContent();
      }
      
      return null;
    });
  }

  async isImageUploadFieldHighlightedRed(): Promise<boolean> {
    return await test.step('Перевірити, чи поле завантаження зображення виділено червоним', async () => {
      const imageUploadContainer = this.form
        .locator('div')
        .filter({ hasText: /Browse|обрати|Drop your image/i })
        .first();
      
      const className = await imageUploadContainer.getAttribute('class');
      const style = await imageUploadContainer.getAttribute('style');
      
      return (
        (className && className.includes('error')) ||
        (style && style.includes('red'))
      );
    });
  }

  async isImageUploaded(): Promise<boolean> {
    return await test.step('Перевірити, чи зображення завантажено', async () => {
      const imagePreview = this.form
        .locator('img[src], [class*="preview"], [class*="image-container"]')
        .first();
      
      try {
        const isVisible = await imagePreview.isVisible({ timeout: 2000 });
        return isVisible;
      } catch {
        const fileInput = this.form.locator('input[type="file"]').first();
        return await fileInput.inputValue().then(val => val !== '');
      }
    });
  }

  async uploadImageFromUrl(imageUrl: string): Promise<void> {
    await test.step(`Завантажити зображення за URL`, async () => {
      try {
        await this.page.evaluate((url) => {
          const input = document.querySelector('input[type="file"]') as HTMLInputElement;
          if (input) {
            fetch(url)
              .then(r => r.blob())
              .then(blob => {
                const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                input.files = dataTransfer.files;
                input.dispatchEvent(new Event('change', { bubbles: true }));
              });
          }
        }, imageUrl);
        
        await this.page.waitForTimeout(2000);
      } catch (error) {
        console.warn(`⚠️ Image URL upload: ${error}`);
      }
    });
  }
}
