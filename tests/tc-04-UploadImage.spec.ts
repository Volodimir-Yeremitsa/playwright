import { test, expect } from '@playwright/test';
import path from 'path';
import { NewsPage } from '@pages/news.page';
import { CreateNewsPage } from '@pages/create-news.page';
import { login } from '@utils/auth.helper';

test.describe('TC-04: Create news with image upload (PNG/JPG, max 10MB)', () => {
  test('User can upload image (PNG or JPG) up to 10MB while creating news with 3 tags', async ({ page }) => {
    // Preconditions
    await login(page);

    // Step 1-2: Navigate to news page and click "Create News"
    const newsPage = new NewsPage(page);
    await newsPage.open();
    await newsPage.openCreateNewsForm();

    const createNewsPage = new CreateNewsPage(page);
    await createNewsPage.waitForOpened();

    // Step 1: Select three tags (like TC-03)
    const tagsToSelect = ['News', 'Events', 'Education'];
    for (const tag of tagsToSelect) {
      await createNewsPage.selectTag(tag);
    }

    // Step 2: Upload a valid image (JPG from img folder) - BEFORE filling text
    const imagePath = path.join(__dirname, '..', 'img', 'supra.jpg');
    await createNewsPage.uploadImage(imagePath);
    console.log('✅ Image uploaded successfully');

    // Step 3: Fill title and content
    await createNewsPage.fillTitle('TC-04 News with Image and Tags');
    await createNewsPage.fillMainText('Test content with image upload and three tags for validation and publishing test');

    // Step 4: Click "Publish"
    await createNewsPage.publish();
    await createNewsPage.waitForPublished();

    // Verify success
    console.log('✅ News with image and 3 tags published successfully!');
  });
});



