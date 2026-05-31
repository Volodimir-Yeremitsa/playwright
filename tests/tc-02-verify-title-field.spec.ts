import { expect, test } from '@playwright/test';
import { NewsPage } from '@pages/news.page';
import { CreateNewsPage } from '@pages/create-news.page';
import { login } from '@utils/auth.helper';

test.describe('TC-02: Verify Title field', () => {
  test('Verify the validation of the Title field ', async ({ page }) => {
    //Preconditions
    await login(page);
    
    //Step1: Open the create news form
    const newsPage = new NewsPage(page);
    await newsPage.open();
    await newsPage.openCreateNewsForm();

    const createNewsPage = new CreateNewsPage(page);
    await createNewsPage.waitForOpened();
    
    //Step2-3: Verify that the Title field's border is highlighted in red
    await createNewsPage.expectRedTitleFieldBorder();
    
    //Step4.
    await expect(createNewsPage.publishButton).toBeDisabled();
    
    //Step5. Check that the character counter shows "0/170".
    await createNewsPage.expectCharacterCounterShowsZero();

    //Step6. Enter a 171-character-long string into the "Title" field (e.g., "A" * 171).
    //Step7. Verify that the text is truncated to 170 characters and that the counter is highlighted in red when exceeding the limit.
    //негативний тест, тому що текст не скорочується до 170
    await createNewsPage.enterLongTitleAndVerifyCounter();

    //Step8-9
    await createNewsPage.enterValidTitleAndVerifyCounter();

    //Step10.
    await expect(createNewsPage.publishButton).toBeDisabled();

    //Step11. 
    await createNewsPage.selectTag('News');

    //Step12. 
    await createNewsPage.enterMainText('This is a valid main text for testing.');

    //Step13.
    await expect(createNewsPage.publishButton).toBeEnabled();

  });
});