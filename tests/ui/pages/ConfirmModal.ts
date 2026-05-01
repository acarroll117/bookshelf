import { type Page } from '@playwright/test';

// ConfirmModal represents the delete confirmation dialog.
// It appears when the user clicks the trash icon on a book card.

export class ConfirmModal {
  constructor(private readonly page: Page) {}

  async confirm(): Promise<void> {
    // The confirm button has visible text "Delete" with no aria-label.
    // The trash icon buttons on book cards have aria-label="Delete" but
    // empty text content (just an SVG). Using `filter({ hasText })` matches
    // on text content only, so it correctly targets only this button.
    await this.page.locator('button').filter({ hasText: /^Delete$/ }).click();
    await this.page.locator('.fixed.inset-0.z-50').waitFor({ state: 'detached' });
  }

  async cancel(): Promise<void> {
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.locator('.fixed.inset-0.z-50').waitFor({ state: 'detached' });
  }
}
