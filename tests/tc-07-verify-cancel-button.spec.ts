import { expect, test } from '@playwright/test';
import { NewsPage } from '@pages/news.page';
import { CreateNewsPage } from '@pages/create-news.page';
import { login } from '@utils/auth.helper';

test.describe('TC-07: Cancel button', () => {
  test('Verify the functionality of the Cancel button', async ({ page }) => {
    //Preconditions
    await login(page);
    
    //Step1: Open the create news form
    const newsPage = new NewsPage(page);
    await newsPage.open();
    await newsPage.openCreateNewsForm();

    const createNewsPage = new CreateNewsPage(page);
    await createNewsPage.waitForOpened();
    
    //Step2
    await createNewsPage.expectConfirmationModal();

    //Step3 
    await newsPage.openCreateNewsForm();

    await createNewsPage.waitForOpened();
    await createNewsPage.expectContinueEditing();
    
  });
});