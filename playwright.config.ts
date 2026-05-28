import { defineConfig, devices } from '@playwright/test';
import { ENV } from '@utils/env';

export default defineConfig({
  testDir: './tests',
  timeout: ENV.TIMEOUT,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: ENV.RETRIES,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html'],
    ['allure-playwright'],
  ],

  use: {
    headless: ENV.HEADLESS,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        //viewport: null,
        launchOptions: {
          //args: ['--start-maximized'],
        },
      }
    },
 /*   {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    }, */
  ],
});
