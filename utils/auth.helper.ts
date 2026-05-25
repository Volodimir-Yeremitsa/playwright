import { Page, test } from '@playwright/test';
import { HomePage } from '@pages/home.page';
import { ENV } from '@utils/env';

export async function login(page: Page): Promise<HomePage> {
  return await test.step('Precondition: залогінити користувача', async () => {
    const homePage = new HomePage(page);

    await homePage.open();
    await homePage.header.openSignInModal();

    await homePage.signInModal.login({
      email: ENV.LOGIN_EMAIL,
      password: ENV.LOGIN_PASSWORD,
    });

    await homePage.header.waitForLoggedInState();

    return homePage;
  });
}
