import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { ENV } from '@utils/env';

export class HomePage extends BasePage {
  readonly pageLogo: Locator;

  constructor(page: Page) {
    super(page);

    this.pageLogo = page.locator('app-header').getByAltText(/green city/i)
  }

  get url(): string {
    return `${ENV.BASE_URL}/#/greenCity`;
  }

  async open(): Promise<void> {
    await test.step('Відкрити головну сторінку GreenCity', async () => {
      await this.navigate();
      await this.waitForPageReady(this.pageLogo);
    });
  }
}
