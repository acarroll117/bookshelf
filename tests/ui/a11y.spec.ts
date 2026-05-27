import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { BookListPage } from './pages/BookListPage';
import { BookFormModal } from './pages/BookFormModal';

const a11y = (page: Page) =>
  new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

const a11yModal = (page: Page) =>
  new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .include('[role="dialog"]')
    .analyze();

const SEED = { title: 'A11y Seed', author: 'Test', score: 3, review: 'A short review for accessibility testing purposes.' };

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`accessibility – ${scheme} mode`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('theme', t), scheme);
    });

    test('main page – empty state', async ({ page }) => {
      const bookList = new BookListPage(page);
      await bookList.open();
      await page.waitForLoadState('networkidle');
      const { violations } = await a11y(page);
      expect(violations).toEqual([]);
    });

    test('main page – with a book', async ({ page, request }) => {
      const res = await request.post('http://localhost:8001/books', { data: SEED });
      const { id } = await res.json();
      try {
        const bookList = new BookListPage(page);
        await bookList.open();
        await page.waitForLoadState('networkidle');
        const { violations } = await a11y(page);
        expect(violations).toEqual([]);
      } finally {
        await request.delete(`http://localhost:8001/books/${id}`);
      }
    });

    test('add-book modal', async ({ page }) => {
      const bookList = new BookListPage(page);
      await bookList.open();
      await page.waitForLoadState('networkidle');
      await bookList.clickAddBook();
      await page.getByRole('dialog').waitFor();
      await page.waitForTimeout(300); // let the 200ms opacity transition finish
      const { violations } = await a11yModal(page);
      expect(violations).toEqual([]);
    });

    test('delete-confirmation modal', async ({ page, request }) => {
      const res = await request.post('http://localhost:8001/books', { data: SEED });
      const { id } = await res.json();
      try {
        const bookList = new BookListPage(page);
        await bookList.open();
        await page.waitForLoadState('networkidle');
        await bookList.clickDeleteBook('A11y Seed');
        await page.getByRole('dialog').waitFor();
        await page.waitForTimeout(300); // let the 200ms opacity transition finish
        const { violations } = await a11yModal(page);
        expect(violations).toEqual([]);
      } finally {
        await request.delete(`http://localhost:8001/books/${id}`);
      }
    });
  });
}
