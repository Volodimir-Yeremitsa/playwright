import { expect, test } from '@playwright/test';
import { NewsPage } from '@pages/news.page';
import { CreateNewsPage } from '@pages/create-news.page';
import { login } from '@utils/auth.helper';

test.describe('TC-05: Main Text field', () => {
  test('Verify the validation of the Main Text field ', async ({ page }) => {
    //Preconditions
    await login(page);
    
    //Step1: Open the create news form
    const newsPage = new NewsPage(page);
    await newsPage.open();
    await newsPage.openCreateNewsForm();

    const createNewsPage = new CreateNewsPage(page);
    await createNewsPage.waitForOpened();
    //Step
    await createNewsPage.expectErrorOnShortMainText();
    //Step негативний тест, тому що текст не скорочується до 63,206 і з'являється помилка
    await createNewsPage.expectNoErrorOnLongMainText();
    //Step
    await createNewsPage.expectNewsIsPublished();

  });
});