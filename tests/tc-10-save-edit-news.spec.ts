import { expect, test } from '@playwright/test';
import { NewsPage } from '@pages/news.page';
import { CreateNewsPage } from '@pages/create-news.page';
import { PreviewPage } from '@pages/preview.page';
import { login } from '@utils/auth.helper';
import { NewsDetailPage } from '@pages/news-detail.page';

test('TC-10: Author can edit own news', async ({ page }) => {
  await login(page);

  const originalTitle = `TC-10 Original ${Date.now()}`;
  const originalContent = 'This is original content for TC-10 news';
  const updatedTitle = `TC-10 Updated ${Date.now()}`;
  const updatedContent = 'This is updated content for TC-10 news';
  const updatedTag = 'Education';

  const newsPage = new NewsPage(page);
  await newsPage.open();
  await newsPage.openCreateNewsForm();

  const createNewsPage = new CreateNewsPage(page);
  await createNewsPage.waitForOpened();

  await createNewsPage.titleInput.fill(originalTitle);
  await createNewsPage.enterMainText(originalContent);
  await createNewsPage.selectTag('News');
  await createNewsPage.publishButton.click();

  await expect(page).toHaveURL(/\/news$/);

  await newsPage.searchNewsByTitle(originalTitle);
  await newsPage.openNewsByTitle(originalTitle);

  const newsDetailPage = new NewsDetailPage(page);
  await newsDetailPage.waitForOpened();

  const createdDate = await newsDetailPage.getCreatedDate();

  await newsDetailPage.openEditNewsForm();

  await createNewsPage.waitForOpened();
  await createNewsPage.editNews(updatedTitle, updatedContent, updatedTag);

  //await newsPage.waitForOpened();
  await newsPage.searchNewsByTitle(updatedTitle);
  await newsPage.openNewsByTitle(updatedTitle);

  await newsDetailPage.waitForOpened();
  await newsDetailPage.expectNewsUpdated(
    updatedTitle,
    updatedContent,
    updatedTag,
    createdDate
  );
});