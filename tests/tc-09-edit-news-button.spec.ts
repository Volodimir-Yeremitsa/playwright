import { expect, test } from '@playwright/test';
import { NewsPage } from '@pages/news.page';
import { CreateNewsPage } from '@pages/create-news.page';
import { PreviewPage } from '@pages/preview.page';
import { login } from '@utils/auth.helper';
import { NewsDetailPage } from '@pages/news-detail.page';

test('TC-09: Author can see Edit news button', async ({ page }) => {
  await login(page);
  //створюєм унікальний заголовок для новини
  const title = `TC-09 Edit News ${Date.now()}`;
  const mainText = 'This is test content for checking Edit news button';

  const newsPage = new NewsPage(page);
  await newsPage.open();
  await newsPage.openCreateNewsForm();

  const createNewsPage = new CreateNewsPage(page);
  await createNewsPage.waitForOpened();

  await createNewsPage.titleInput.fill(title);
  await createNewsPage.enterMainText(mainText);
  await createNewsPage.selectTag('News');
  await createNewsPage.publishButton.click();

  await expect(page).toHaveURL(/\/news$/);

  await newsPage.searchNewsByTitle(title);
  await newsPage.openNewsByTitle(title);

  const newsDetailPage = new NewsDetailPage(page);
  await newsDetailPage.waitForOpened();
  await newsDetailPage.expectEditNewsButtonVisible();
});