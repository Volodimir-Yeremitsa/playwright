# Playwright TypeScript Test Framework

## Опис
Це базова структура проєкту для автоматизованого тестування веб-застосунку з використанням Playwright та TypeScript.
Проєкт підготовлений як фундамент для подальшої розробки автотестів із використанням Page Object Model та Component-based архітектури.

## Встановлення залежностей
```bash
npm install
```

## Встановлення браузерів Playwright
npx playwright install

## Запуск тестів
npx playwright test

## Запуск тестів у UI режимі
npx playwright test --ui

## Конфігурація через .env
Для локального запуску потрібно створити файл .env на основі .env.example.
Приклад:

BASE_URL=https://example.com
HEADLESS=true
RETRIES=0
TIMEOUT=30000

## Структура проєкту
tests/          - директорія для тестів
pages/          - Page Object класи
components/     - компоненти сторінок
fixtures/       - кастомні fixtures
utils/          - допоміжні утиліти

## Основні файли
playwright.config.ts — конфігурація Playwright
utils/env.ts — helper для роботи зі змінними середовища
pages/base.page.ts — базовий клас сторінки
components/base.component.ts — базовий клас компонента
.env.example — приклад змінних середовища