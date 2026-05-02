import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const a11y = (page: Page) =>
  new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

for (const scheme of ['light', 'dark'] as const) {
  test.describe(`accessibility – ${scheme} mode`, () => {
    test.use({ colorScheme: scheme });

    test('main page – empty state', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const { violations } = await a11y(page);
      expect(violations).toEqual([]);
    });

    test('add-book modal open', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.getByRole('button', { name: 'Add book' }).click();
      await page.getByRole('dialog').waitFor();
      await page.waitForTimeout(300); // let the 200ms opacity transition finish
      const { violations } = await a11y(page);
      expect(violations).toEqual([]);
    });

    test('delete-confirmation modal open', async ({ page, request }) => {
      const res = await request.post('http://localhost:8001/books', {
        data: { title: 'A11y Seed', author: 'Test', score: 3, date_read: '2024-01-01' },
      });
      const { id } = await res.json();
      try {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.locator('div').filter({ has: page.getByText('A11y Seed', { exact: true }) }).getByRole('button', { name: 'Delete' }).first().click();
        await page.getByRole('dialog').waitFor();
        await page.waitForTimeout(300); // let the 200ms opacity transition finish
        const { violations } = await a11y(page);
        expect(violations).toEqual([]);
      } finally {
        await request.delete(`http://localhost:8001/books/${id}`);
      }
    });
  });
}
