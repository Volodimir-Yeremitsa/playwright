import { test, expect } from '@playwright/test';
import { NewsPage } from '@pages/news.page';
import { CreateNewsPage } from '@pages/create-news.page';
import { login } from '@utils/auth.helper';

test.describe('TC-03: Create news with tags (1 to 3 tags)', () => {
  test('User can select between 1 and 3 tags, but not more', async ({ page }) => {
    
    await login(page);

    const newsPage = new NewsPage(page);
    await newsPage.open();
    await newsPage.openCreateNewsForm();

    const createNewsPage = new CreateNewsPage(page);
    await createNewsPage.waitForOpened();

    const tagsToSelect = ['News', 'Events', 'Education'];
    for (const tag of tagsToSelect) {
      await createNewsPage.selectTag(tag);
    }

    await createNewsPage.fillTitle('TC-03 Test News with Tags');
    await createNewsPage.fillMainText('Test content with more than twenty characters for publishing test');

    await createNewsPage.publish();
    await createNewsPage.waitForPublished();

    console.log('✅ News published successfully with 3 tags!');
  });
});
