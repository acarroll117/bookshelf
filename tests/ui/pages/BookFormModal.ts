import { type Page, type Locator } from '@playwright/test';

// BookFormModal represents the Add Book / Edit Book modal dialog.
// It encapsulates all interactions with the form fields and submit button.

export class BookFormModal {
  private readonly form: Locator;

  constructor(private readonly page: Page) {
    // The modal contains a <form> element — we scope all interactions to it.
    this.form = page.locator('form');
  }

  async fillTitle(title: string): Promise<void> {
    // `getByPlaceholder` matches the placeholder attribute on the input.
    await this.form.getByPlaceholder('e.g. The Hobbit').fill(title);
  }

  async fillAuthor(author: string): Promise<void> {
    await this.form.getByPlaceholder('e.g. J.R.R. Tolkien').fill(author);
  }

  async setRating(stars: number): Promise<void> {
    // StarRating renders 5 star groups, each a <span> inside the container
    // marked with data-testid="star-rating". Each group has two invisible
    // clickable halves: left = n-0.5 stars, right = n stars.
    //
    // We get the bounding box (position and size on screen) of the target star
    // group, then click at 75% across its width to hit the right half —
    // which registers as a whole-number rating.
    const starGroups = this.form.locator('[data-testid="star-rating"] > span');
    const targetStar = starGroups.nth(stars - 1); // nth() is 0-indexed
    const box = await targetStar.boundingBox();
    if (!box) throw new Error(`Star group ${stars} not found in rating component`);
    await this.page.mouse.click(box.x + box.width * 0.75, box.y + box.height / 2);
  }

  async submit(): Promise<void> {
    await this.form.getByRole('button', { name: 'Save' }).click();
    // The modal has a 200ms CSS fade-out animation before it's removed from the DOM.
    // `waitFor({ state: 'detached' })` blocks until the overlay element is gone.
    await this.page.locator('.fixed.inset-0.z-50').waitFor({ state: 'detached' });
  }
}
