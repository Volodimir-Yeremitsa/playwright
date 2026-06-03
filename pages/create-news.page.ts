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
  //readonly mainTextCounter: Locator;
  readonly mainTextWarning: Locator;
  readonly dateInfo: Locator; 
  readonly authorField: Locator;
  readonly dateField: Locator;
  readonly sourceInput: Locator;
  readonly sourceWarning: Locator;
  readonly cancelButton: Locator;
  readonly previewButton: Locator;
  readonly publishButton: Locator;
  readonly EditButton: Locator;

  constructor(page: Page) {
    super(page);

    this.form = page.locator('app-create-news, app-create-eco-news, main').first();

    this.titleInput = this.form
      .locator('textarea[formcontrolname="title"]')
      .first();

    this.tagBlock = this.form.locator('div.tags-box');

    this.sourceInput = this.form
      .locator('.source-block input[formcontrolname="source"]')

    this.addImageButton = this.form
      .locator('.dropzone input[id="upload"]');

    this.mainTextInput = this.form
      .locator('div.ql-editor[contenteditable="true"]')
      .first();

    this.dateInfo = this.form.locator('div.date');

    this.dateField = this.dateInfo.locator('p').nth(0);
    this.authorField = this.dateInfo.locator('p').nth(1);

    this.cancelButton = this.form.locator('.submit-buttons .tertiary-global-button');
    this.previewButton = this.form.locator('.submit-buttons .secondary-global-button');
    this.publishButton = this.form.locator('.submit-buttons .primary-global-button');

    //tc-02-verify-title-field
    this.titleCounter = this.form.locator('span.field-info').first();
    //tc-05-verify-main-text-field
    this.mainTextWarning = this.form.locator('.textarea-wrapper .field-info.warning');
    //tc-06-verify-source-field
    this.sourceWarning = this.form.locator('.source-block .field-info.warning');
    
    this.EditButton = this.form.locator('.submit-buttons .primary-global-button');
  }

  get url(): string {
    // Якщо форма відкривається як окрема сторінка, URL може бути таким.
    // Якщо відкривається модалкою — тест потрапляє сюди через NewsPage.openCreateNewsForm().
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
      //The form displays all fields in the specified order (Title, Tags, Add Image, Main Text, Author, Date, Source, Cancel/Preview/Publish).
      //DOM структура може бути складною, тому перевіряємо порядок за допомогою позицій елементів на сторінці?

    });
  }

  async expectAuthorAndDateAreReadonly(): Promise<void> {
    await test.step('Перевірити, що Author та Date не редагуються', async () => {
      await expect(this.authorField).not.toHaveAttribute('contenteditable', 'true');
      await expect(this.dateField).not.toHaveAttribute('contenteditable', 'true');
    });
  }

  //tc-02-verify-title-field ----------------------------------------------------------

  async expectRedTitleFieldBorder(): Promise<void> {
    await test.step('Перевірити чи колір рамки порожнього Title червоний', async () => {
      //очистити поле Title + натиснути sourceInput
      await this.titleInput.fill('');
      await this.sourceInput.click();      

      await expect(this.titleInput).toHaveCSS(
        'border-color',
        'rgb(255, 0, 0)'
      );
    });
  }

  async expectCharacterCounterShowsZero(): Promise<void> {
    await test.step('Перевірити, що лічильник символів показує "0/170"', async () => {
      await expect(this.titleCounter).toHaveText('0/170');
    });
  }

  async enterLongTitleAndVerifyCounter(): Promise<void> {
    await test.step('Ввести 171 символ у поле Title та перевірити чи текст скорочено до 170 ', async () => {
      const longTitle = 'A'.repeat(171);
      await this.titleInput.fill(longTitle);
      await expect.soft(this.titleInput).toHaveValue('A'.repeat(170));
      await expect.soft(this.titleCounter).toHaveText('170/170');
      await expect.soft(this.titleCounter).toHaveCSS('border-color', 'rgb(255, 0, 0)'); 
    });
  }

  async enterValidTitleAndVerifyCounter(): Promise<void> {
    await test.step('Ввести валідний Title та перевірити лічильник та колір рамки', async () => {
      const validTitle = 'Test News';
      await this.titleInput.fill(validTitle);
      await expect(this.titleCounter).toHaveText('9/170');
      await expect(this.titleInput).not.toHaveCSS('border-color', 'rgb(255, 0, 0)'); 
    });
  }

  async selectTag(tag: string): Promise<void> {
    await test.step('Вибрати тег', async () => {
      await this.tagBlock.getByRole('button', { name: tag }).click();
    });
  }

  async enterMainText(mainText: string): Promise<void> {
    await test.step('Ввести текст у поле Main Text', async () => {
      await this.mainTextInput.fill(mainText);
    });
  }
  

  //tc-05-verify-title-field ----------------------------------------------------------
  async expectErrorOnShortMainText(): Promise<void> {
    return test.step('Перевірити помилку при введенні короткого тексту у Main Text', async () => {
      await this.enterMainText('Short text');
      await this.titleInput.fill('Test');
      await expect(this.publishButton).toBeDisabled();
      
      await expect(this.mainTextWarning).toBeVisible();
      await expect(this.mainTextWarning).toHaveText(/Must be minimum 20 and maximum 63 206 symbols/i);
      await expect(this.mainTextWarning).toHaveCSS('color', 'rgb(235, 24, 13)');
      
    });
  }

  async expectNoErrorOnLongMainText(): Promise<void> {
    return test.step('Перевірити відсутність помилки при введенні надто довгого тексту у Main Text', async () => {
      const longMainText = 'A'.repeat(63207);
      await this.enterMainText(longMainText);

      //Перевіряємо довжину тексту в полі Main Text
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
      //Після введення валідного тексту, кнопка Publish має стати активною
      await expect(this.publishButton).toBeEnabled();
      await this.publishButton.click();
      // Перевіряємо, що після публікації ми перенаправляємося на сторінку списку новин(URL повинен закінчуватися на /news)
      await expect(this.page).toHaveURL(/\/news$/);
    });
  }

  //tc-06-verify-source-field ----------------------------------------------------------

  async expectNoErrorOnEmptySource(): Promise<void> {
    return test.step('Перевірити відсутність помилки при залишенні поля Source порожнім', async () => {
      await this.sourceInput.fill('');
      await this.titleInput.fill('tc-06-verify-source-field');
      await this.enterMainText('expectNoErrorOnEmptySource');
      await this.selectTag('News');
      //Кнопка Publish має бути активною, навіть якщо поле Source порожнє
      await expect(this.publishButton).toBeEnabled();
    });
  }

  async expectErrorOnInvalidSource(): Promise<void> {
    return test.step('Перевірити помилку при введенні некоректного URL у поле Source', async () => {
      await this.sourceInput.fill('www.example.com');
      await this.titleInput.fill('tc-06-verify-source-field');
      await this.enterMainText('expectErrorOnInvalidSource');
      await this.selectTag('News');
      //Кнопка Publish має бути неактивною, якщо поле Source містить некоректний URL
      await expect(this.publishButton).toBeDisabled();
      //An error message appears in red:
      await expect(this.sourceWarning).toBeVisible();
      await expect(this.sourceWarning).toHaveText('Please add the link of original article/news/post. Link must start with http(s)://');
      await expect(this.sourceWarning).toHaveCSS('color', 'rgb(235, 24, 13)'); 
    });
  }

  async expectNewsIsPublishedWithSource(sourceLink: string): Promise<void> {
    return test.step('Перевірити, що новина успішно публікується з валідним URL у полі Source', async () => {
      await this.sourceInput.fill(sourceLink);   
      await this.titleInput.fill('tc-06-verify-source-field');
      await this.enterMainText('expectNewsIsPublishedWithSource');
      await this.selectTag('News'); 
      //Після введення валідного URL, кнопка Publish має стати активною
      await expect(this.publishButton).toBeEnabled();
      await expect(this.sourceWarning).not.toBeVisible();
      await this.publishButton.click();
      // Перевіряємо, що після публікації ми перенаправляємося на сторінку списку новин(URL повинен закінчуватися на /news)
      await expect(this.page).toHaveURL(/\/news$/);
      // потрібно перевірити, що новина з правильним Source відображається у списку новин, але це вже виходить за рамки перевірки форми Create News.

    });

  }  

  //tc-07-verify-cancel-button ----------------------------------------------------------
  async expectConfirmationModal(): Promise<void> {
    return test.step('Перевірити, що при натисканні кнопки Cancel з\'являється модальне вікно з підтвердженням', async () => {
      
      await this.titleInput.fill('Test');
      await this.enterMainText('Test content with 20 characters');
      await this.selectTag('News');       
      
      await expect(this.cancelButton).toBeVisible();
      await expect(this.cancelButton).toBeEnabled();
      await this.cancelButton.click();

      const modal = this.page.locator('app-warning-pop-up');
      const YesButton = modal.locator('.m-btn.primary-global-button');
      const NoButton =  modal.locator('.m-btn.secondary-global-button');
      await expect(modal).toBeVisible();
      await expect(modal.locator('.warning-title')).toHaveText(/All created content will be lost./i);
      await expect(modal.locator('.warning-subtitle')).toHaveText(/Do you still want to cancel news creating?/i);
      await expect(YesButton).toBeVisible();
      YesButton.click();
      //Після підтвердження скасування, перевіряємо, що ми повертаємося на сторінку списку новин
      await expect(this.page).toHaveURL(/\/news$/);
      
    });
  }

  async expectContinueEditing(): Promise<void> {
    return test.step('Перевірити, що при виборі залишитись у формі, користувач може продовжити редагування', async () => {
     await this.titleInput.fill('Test');
      await this.enterMainText('Test content with 20 characters');
      await this.selectTag('News');       
      
      await expect(this.cancelButton).toBeVisible();
      await expect(this.cancelButton).toBeEnabled();
      await this.cancelButton.click();

      const modal = this.page.locator('app-warning-pop-up');
      const YesButton = modal.locator('.m-btn.primary-global-button');
      const NoButton =  modal.locator('.m-btn.secondary-global-button');
      await expect(modal).toBeVisible();
      await expect(modal.locator('.warning-title')).toHaveText(/All created content will be lost./i);
      await expect(modal.locator('.warning-subtitle')).toHaveText(/Do you still want to cancel news creating?/i);
      await expect(NoButton).toBeVisible();

      NoButton.click();
      //Після вибору залишитись, перевіряємо, що ми залишаємося на формі Create News і введені дані не втрачаються
      await expect(this.page).toHaveURL(/\/news\/create-news$/);
      await expect(this.titleInput).toHaveValue('Test');
      await expect(this.mainTextInput).toHaveText('Test content with 20 characters');
    });
  }

  async OpenPreviewMode(): Promise<void> {
    return test.step('Натиснути кнопку Preview ', async () => {
      await this.titleInput.fill('Test Preview');
      await this.enterMainText('This is a test preview content');
      await this.selectTag('News'); 

      await this.previewButton.click();
    });
  }

  async editNews(
    title: string,
    content: string,
    tag: string
  ): Promise<void> {
    await test.step('Відредагувати новину: createNewsPage.editNews', async () => {
      await this.titleInput.fill(title);

      await this.mainTextInput.fill('');
      await this.enterMainText(content);

      await this.selectTag(tag);

      await expect(this.EditButton).toBeEnabled();
      await this.EditButton.click();

  });
}
}
