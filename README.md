# GreenCity Playwright Test Framework

## Опис

Проєкт для автоматизації тестування GreenCity Web Application з використанням Playwright + TypeScript.
Архітектура побудована на Page Object Model та Component-based підході.

## Встановлення

```bash
npm install
npx playwright install
npm install -D allure-playwright
```

## Налаштування .env

Створіть `.env` на основі `.env.example`:

```env
BASE_URL="https://www.greencity.cx.ua"
HEADLESS=false
RETRIES=0
TIMEOUT=30000
LOGIN_EMAIL=your_email
LOGIN_PASSWORD=your_password
```

## Запуск тестів

```bash
npm test
```

Запуск тільки TC-01:

```bash
npm run test:tc01
```

UI режим:

```bash
npm run test:ui
```

## Allure Report

Після запуску тестів згенерувати звіт:

```bash
npm run allure:generate
npm run allure:open
```

## Структура

```text
pages/          Page Object класи
components/     повторювані UI-компоненти: header, modal тощо
utils/          env helper, auth helper
tests/          spec-файли з тестами
```

## Основні класи

- `BasePage` — базові методи для сторінок.
- `HomePage` — головна сторінка GreenCity.
- `NewsPage` — сторінка новин `/news`.
- `CreateNewsPage` — форма створення новини.
- `HeaderComponent` — верхнє меню сайту.
- `SignInModal` — модальне вікно логіну.
- `auth.helper.ts` — helper для логіну через UI.
