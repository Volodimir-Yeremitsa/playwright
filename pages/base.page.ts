import { Page } from '@playwright/test';

/**
 * BasePage
 *
 * Abstract foundation for all Page Object classes.
 * All concrete page objects must extend this class.
 *
 * @stub — No page-specific selectors or actions are implemented here.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}