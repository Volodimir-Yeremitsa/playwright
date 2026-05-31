import { expect, test } from '@playwright/test';
import { NewsPage } from '@pages/news.page';
import { CreateNewsPage } from '@pages/create-news.page';
import { NewsDetailPage } from '@pages/news-detail.page';
import { login } from '@utils/auth.helper';

test.describe('TC-06: Source field', () => {
  test('Verify the validation of the Source field ', async ({ page }) => {
    //Preconditions
    await login(page);
    
    //Step1: Open the create news form
    const newsPage = new NewsPage(page);
    await newsPage.open();
    await newsPage.openCreateNewsForm();

    const createNewsPage = new CreateNewsPage(page);
    await createNewsPage.waitForOpened();
    //Step2
    await createNewsPage.expectNoErrorOnEmptySource();
    //Step3 
    await createNewsPage.expectErrorOnInvalidSource();
    //Step4
    const sourceLink = 'https://example.com';
    await createNewsPage.expectNewsIsPublishedWithSource(sourceLink);  

    await newsPage.openFirstNews();

    const newsDetailPage = new NewsDetailPage(page);
    await newsDetailPage.waitForOpened();
    await newsDetailPage.expectSourceLinkVisible(sourceLink);
  
  });
});