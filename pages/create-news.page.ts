import { expect, Locator, Page, test } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { ENV } from '@utils/env';
import { NewsPage } from './news.page';

export class CreateNewsPage extends BasePage {
  readonly form: Locator;
  readonly titleInput: Locator;
  readonly titleCounter: Locator;
  readonly tagBlock: Locator;
  readonly addImageButton: Locator;
  readonly mainTextInput: Locator;
  readonly mainTextCounter: Locator;
  readonly mainTextWarning: Locator;
  readonly dateInfo: Locator; 
  readonly authorField: Locator;
  readonly dateField: Locator;
  readonly sourceInput: Locator;
  readonly sourceWarning: Locator;
  readonly selectedTags: Locator;
  readonly tagButtons: Locator;
  readonly cancelButton: Locator;
  readonly previewButton: Locator;
  readonly publishButton: Locator;
  readonly EditButton: Locator;

  constructor(page: Page) {
    super(page);

    // Прибрано тег main для стабільності
    this.form = page.locator('app-create-news, app-create-eco-news, main').first();

    // 2. Playwright Best Practice: Шукаємо поле так, як його бачить користувач
    this.titleInput = this.form
      .getByPlaceholder(/Coffee takeaway|наприклад/i)
      .first();

    this.tagBlock = this.form.locator('div.tags-box');

    this.sourceInput = this.form
      .getByPlaceholder(/посилання на зовнішнє джерело|link to external source/i)
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

    this.cancelButton = this.form.locator('.submit-buttons .tertiary-global-button');
    this.previewButton = this.form.locator('.submit-buttons .secondary-global-button');
    this.publishButton = this.form.locator('.submit-buttons .primary-global-button');
    
    this.selectedTags = this.form.locator('div.selected-tags, .chips, [class*="tag"][class*="selected"]').first();
    this.tagButtons = this.form.locator('button[class*="tag"], div[class*="tag"] button, .tags-box button');

    // --- Локатори з гілки main (обов'язкові для тест-кейсів) ---
    this.titleCounter = this.form.locator('span.field-info').first();
    this.mainTextWarning = this.form.locator('.textarea-wrapper .field-info.warning');
    this.sourceWarning = this.form.locator('.source-block .field-info.warning');
    this.EditButton = this.form.locator('.submit-buttons .primary-global-button');
  }

  get url(): string {
    // Якщо форма відкривається як окрема сторінка, URL може бути таким.
    // Якщо відкривається модалкою — тест потрапляє сюди через NewsPage.openCreateNewsForm().
    return `${ENV.BASE_URL}/#/greenCity/news/create-news`;
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
      // Реалізація перевірки
    });
  }

  async expectAuthorAndDateAreReadonly(): Promise<void> {
    await test.step('Перевірити, що Author та Date не редагуються', async () => {
      await expect(this.authorField).not.toHaveAttribute('contenteditable', 'true');
      await expect(this.dateField).not.toHaveAttribute('contenteditable', 'true');
    });
  }

  // --- Перевірки для Title ---
  async expectRedTitleFieldBorder(): Promise<void> {
    await test.step('Перевірити чи колір рамки порожнього Title червоний', async () => {
      await this.titleInput.fill('');
      await this.sourceInput.click();      
      await expect(this.titleInput).toHaveCSS('border-color', 'rgb(255, 0, 0)');
    });
  }

  async expectCharacterCounterShowsZero(): Promise<void> {
    await test.step('Перевірити, що лічильник символів показує "0/170"', async () => {
      await expect(this.titleCounter).toHaveText('0/170');
    });
  }

  async enterLongTitleAndVerifyCounter(): Promise<void> {
    await test.step('Ввести 171 символ у поле Title та перевірити', async () => {
      const longTitle = 'A'.repeat(171);
      await this.titleInput.fill(longTitle);
      await expect.soft(this.titleInput).toHaveValue('A'.repeat(170));
      await expect.soft(this.titleCounter).toHaveText('170/170');
      await expect.soft(this.titleCounter).toHaveCSS('border-color', 'rgb(255, 0, 0)'); 
    });
  }

  async enterValidTitleAndVerifyCounter(): Promise<void> {
    await test.step('Ввести валідний Title та перевірити лічильник', async () => {
      const validTitle = 'Test News';
      await this.titleInput.fill(validTitle);
      await expect(this.titleCounter).toHaveText('9/170');
      await expect(this.titleInput).not.toHaveCSS('border-color', 'rgb(255, 0, 0)'); 
    });
  }

  // --- Взаємодія з формою ---
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
      let selectedCount = 0;
      for (let i = 0; i < count; i++) {
        const button = allTagButtons.nth(i);
        let ariaPressed = await button.getAttribute('aria-pressed');
        if (ariaPressed === 'true') { selectedCount++; continue; }
        const className = await button.getAttribute('class');
        if (className && (className.includes('active') || className.includes('selected'))) { selectedCount++; continue; }
        const ngSelected = await button.getAttribute('ng-reflect-selected');
        if (ngSelected === 'true') { selectedCount++; }
      }
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

  async enterMainText(mainText: string): Promise<void> {
    await test.step('Ввести текст у поле Main Text', async () => {
      await this.fillMainText(mainText);
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

  // --- Зображення ---
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
      return isVisible ? await errorMessage.textContent() : null;
    });
  }

  async isImageUploadFieldHighlightedRed(): Promise<boolean> {
    return await test.step('Перевірити, чи поле виділено червоним', async () => {
      const imageUploadContainer = this.form
        .locator('div')
        .filter({ hasText: /Browse|обрати|Drop your image/i })
        .first();
      const className = await imageUploadContainer.getAttribute('class');
      const style = await imageUploadContainer.getAttribute('style');
      return ((className && className.includes('error')) || (style && style.includes('red'))) ?? false;
    });
  }

  async isImageUploaded(): Promise<boolean> {
    return await test.step('Перевірити, чи зображення завантажено', async () => {
      const imagePreview = this.form.locator('img[src], [class*="preview"], [class*="image-container"]').first();
      try {
        return await imagePreview.isVisible({ timeout: 2000 });
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

  // --- Перевірки для Main Text ---
  async expectErrorOnShortMainText(): Promise<void> {
    return test.step('Перевірити помилку при введенні короткого тексту', async () => {
      await this.enterMainText('Short text');
      await this.titleInput.fill('Test');
      await expect(this.publishButton).toBeDisabled();
      await expect(this.mainTextWarning).toBeVisible();
      await expect(this.mainTextWarning).toHaveText(/Must be minimum 20 and maximum 63 206 symbols/i);
      await expect(this.mainTextWarning).toHaveCSS('color', 'rgb(235, 24, 13)');
    });
  }

  async expectNoErrorOnLongMainText(): Promise<void> {
    return test.step('Перевірити відсутність помилки при довгому тексті', async () => {
      const longMainText = 'A'.repeat(63207);
      await this.enterMainText(longMainText);
      const mainTextValue = await this.mainTextInput.innerText();
      await expect.soft(mainTextValue.length).toBe(63206);
      await expect.soft(this.mainTextWarning).not.toBeVisible();
    }); 
  }

  async expectNewsIsPublished(): Promise<void> {
    return test.step('Перевірити, що новина успішно публікується', async () => {
      await this.titleInput.fill('Test');
      await this.enterMainText('This is a valid test content');
      await this.selectTag('News');
      await expect(this.publishButton).toBeEnabled();
      await this.publishButton.click();
      await expect(this.page).toHaveURL(/\/news$/);
    });
  }

  // --- Перевірки для Source ---
  async expectNoErrorOnEmptySource(): Promise<void> {
    return test.step('Перевірити відсутність помилки при порожньому Source', async () => {
      await this.sourceInput.fill('');
      await this.titleInput.fill('tc-06-verify-source-field');
      await this.enterMainText('expectNoErrorOnEmptySource');
      await this.selectTag('News');
      await expect(this.publishButton).toBeEnabled();
    });
  }

  async expectErrorOnInvalidSource(): Promise<void> {
    return test.step('Перевірити помилку при некоректному URL', async () => {
      await this.sourceInput.fill('www.example.com');
      await this.titleInput.fill('tc-06-verify-source-field');
      await this.enterMainText('expectErrorOnInvalidSource');
      await this.selectTag('News');
      await expect(this.publishButton).toBeDisabled();
      await expect(this.sourceWarning).toBeVisible();
      await expect(this.sourceWarning).toHaveText('Please add the link of original article/news/post. Link must start with http(s)://');
      await expect(this.sourceWarning).toHaveCSS('color', 'rgb(235, 24, 13)'); 
    });
  }

  async expectNewsIsPublishedWithSource(sourceLink: string): Promise<void> {
    return test.step('Перевірити, що новина успішно публікується з валідним Source', async () => {
      await this.sourceInput.fill(sourceLink);   
      await this.titleInput.fill('tc-06-verify-source-field');
      await this.enterMainText('expectNewsIsPublishedWithSource');
      await this.selectTag('News'); 
      await expect(this.publishButton).toBeEnabled();
      await expect(this.sourceWarning).not.toBeVisible();
      await this.publishButton.click();
      await expect(this.page).toHaveURL(/\/news$/);
    });
  }  

  // --- Модалки та інше ---
  async expectConfirmationModal(): Promise<void> {
    return test.step('Перевірити, що при натисканні Cancel з\'являється модалка', async () => {
      await this.titleInput.fill('Test');
      await this.enterMainText('Test content with 20 characters');
      await this.selectTag('News');       
      
      await expect(this.cancelButton).toBeVisible();
      await expect(this.cancelButton).toBeEnabled();
      await this.cancelButton.click();

      const modal = this.page.locator('app-warning-pop-up');
      const YesButton = modal.locator('.m-btn.primary-global-button');
      await expect(modal).toBeVisible();
      await expect(modal.locator('.warning-title')).toHaveText(/All created content will be lost./i);
      await expect(modal.locator('.warning-subtitle')).toHaveText(/Do you still want to cancel news creating?/i);
      await expect(YesButton).toBeVisible();
      await YesButton.click();
      await expect(this.page).toHaveURL(/\/news$/);
    });
  }

  async expectContinueEditing(): Promise<void> {
    return test.step('Перевірити продовження редагування після відміни', async () => {
      await this.titleInput.fill('Test');
      await this.enterMainText('Test content with 20 characters');
      await this.selectTag('News');       
      
      await expect(this.cancelButton).toBeVisible();
      await expect(this.cancelButton).toBeEnabled();
      await this.cancelButton.click();

      const modal = this.page.locator('app-warning-pop-up');
      const NoButton =  modal.locator('.m-btn.secondary-global-button');
      await expect(modal).toBeVisible();
      await expect(modal.locator('.warning-title')).toHaveText(/All created content will be lost./i);
      await expect(modal.locator('.warning-subtitle')).toHaveText(/Do you still want to cancel news creating?/i);
      await expect(NoButton).toBeVisible();
      await NoButton.click();
      
      await expect(this.page).toHaveURL(/\/news\/create-news$/);
      await expect(this.titleInput).toHaveValue('Test');
      await expect(this.mainTextInput).toHaveText('Test content with 20 characters');
    });
  }

  async OpenPreviewMode(): Promise<void> {
    return test.step('Натиснути кнопку Preview', async () => {
      await this.titleInput.fill('Test Preview');
      await this.enterMainText('This is a test preview content');
      await this.selectTag('News'); 
      await this.previewButton.click();
    });
  }

  async editNews(title: string, content: string, tag: string): Promise<void> {
    await test.step('Відредагувати новину', async () => {
      await this.titleInput.fill(title);
      await this.mainTextInput.fill('');
      await this.enterMainText(content);
      await this.selectTag(tag);
      await expect(this.EditButton).toBeEnabled();
      await this.EditButton.click();
    });
  }
}
