import { type Page, type Locator, expect } from '@playwright/test';
import { ConfirmModal } from './ConfirmModal';

// BookListPage represents the main screen of the app.
// It is responsible for navigating to the page and interacting with
// top-level elements: the header, the book list, and the Add Book button.

export class BookListPage {
  readonly page: Page;
  private readonly addButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // The '+' icon button in the header has aria-label="Add book" (BookList.tsx).
    // `getByRole` with a `name` is the most robust Playwright selector —
    // it matches the accessible name, which includes aria-label.
    this.addButton = page.getByRole('button', { name: 'Add book' });
  }

  async open(): Promise<void> {
    // Navigate to the app root. `baseURL` is set in playwright.config.ts.
    await this.page.goto('/');
  }

  async clickAddBook(): Promise<void> {
    await this.addButton.click();
  }

  async assertBookVisible(title: string): Promise<void> {
    // Playwright's `expect(...).toBeVisible()` automatically retries until
    // the element appears or the timeout is reached (default 5s).
    // `.first()` avoids a strict-mode error if the title appears in multiple places.
    await expect(this.page.getByText(title).first()).toBeVisible();
  }

  async clickDeleteBook(title: string): Promise<void> {
    const card = this.page.locator('.rounded-xl').filter({ hasText: title });
    await card.getByLabel('Delete').click();
  }

  async deleteBook(title: string): Promise<void> {
    await this.clickDeleteBook(title);
    const confirm = new ConfirmModal(this.page);
    await confirm.confirm();
  }
}
