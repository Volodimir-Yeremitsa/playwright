import { test, expect } from '@playwright/test';
import { NewsPage } from '@pages/news.page';
import { CreateNewsPage } from '@pages/create-news.page';
import { login } from '@utils/auth.helper';

test.describe('TC-04: Create news with image upload', () => {
  test('User can create news with 3 tags and upload image via URL', async ({ page }) => {
    
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

    const imageUrl = 'https://images.unsplash.com/photo-1617654112368-307921291f42?w=400&q=80';
    await createNewsPage.uploadImageFromUrl(imageUrl);
    console.log('✅ Image uploaded from URL successfully');

    await createNewsPage.fillTitle('TC-04 News with Image and Three Tags');
    await createNewsPage.fillMainText('Test content with image upload and three tags for validation and publishing test');

    await createNewsPage.publish();
    await createNewsPage.waitForPublished();

    console.log('✅ News with image and 3 tags published successfully!');
  });
});


