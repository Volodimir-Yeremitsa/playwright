import { expect, test } from '@playwright/test';
import { NewsPage } from '@pages/news.page';
import { CreateNewsPage } from '@pages/create-news.page';
import { PreviewPage } from '@pages/preview.page';
import { login } from '@utils/auth.helper';

test.describe('TC-08: Preview button', () => {
  test('Verify the functionality of the Preview button', async ({ page }) => {
    //Preconditions
    await login(page);
    
    //Step1: Open the create news form
    const newsPage = new NewsPage(page);
    await newsPage.open();
    await newsPage.openCreateNewsForm();

    const createNewsPage = new CreateNewsPage(page);
    await createNewsPage.waitForOpened();
    
    //Step2
    await createNewsPage.OpenPreviewMode();

    const previewPage = new PreviewPage(page);
    await previewPage.waitForOpened();

    //Step3 
    await previewPage.verifyPreviewPage();
    
  });
});