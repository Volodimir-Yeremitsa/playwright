import { test } from '@playwright/test';
import { NewsPage } from '@pages/news.page';
import { CreateNewsPage } from '@pages/create-news.page';
import { login } from '@utils/auth.helper';

test.describe('TC-01: Create News form', () => {
  test('Create News form displays all required fields in correct order', async ({ page }) => {
    //Preconditions
    await login(page);
    //Steps
    const newsPage = new NewsPage(page);
    await newsPage.open();
    await newsPage.openCreateNewsForm();

    const createNewsPage = new CreateNewsPage(page);
    await createNewsPage.waitForOpened();
    await createNewsPage.expectRequiredFieldsVisible();
    await createNewsPage.expectFieldsInCorrectOrder();
    await createNewsPage.expectAuthorAndDateAreReadonly();
  });
});
