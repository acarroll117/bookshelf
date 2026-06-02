import { test, expect } from '@playwright/test';
import { BookListPage } from './pages/BookListPage';
import { BookFormModal } from './pages/BookFormModal';

test('adding a book shows it in the book list', async ({ page }) => {
  const bookList = new BookListPage(page);
  const bookForm = new BookFormModal(page);

  await bookList.open();
  await bookList.clickAddBook();

  await bookForm.fillTitle('The Hobbit');
  await bookForm.fillAuthor('J.R.R. Tolkien');
  await bookForm.setRating(4);

  await bookForm.submit();

  await bookList.assertBookVisible('The Hobbit');

  await bookList.deleteBook('The Hobbit');
});

test('collapses a long review and expands on click', async ({ page }) => {
  const bookList = new BookListPage(page);
  const bookForm = new BookFormModal(page);

  await bookList.open();
  await bookList.clickAddBook();

  await bookForm.fillTitle('Long Review Book');
  await bookForm.setRating(3);
  await bookForm.fillReview(
    'Line one of a very long review.\n' +
    'Line two adds more detail about the plot.\n' +
    'Line three covers the characters in depth.\n' +
    'Line four reflects on the themes explored.\n' +
    'Line five discusses the author\'s writing style.\n' +
    'Line six compares it to similar books.\n' +
    'Line seven shares a personal anecdote.\n' +
    'Line eight wraps up with a final recommendation.'
  );

  await bookForm.submit();

  await expect(page.getByLabel('Expand review')).toBeVisible();

  await page.getByLabel('Expand review').click();
  await expect(page.getByLabel('Collapse review')).toBeVisible();

  await page.getByLabel('Collapse review').click();
  await expect(page.getByLabel('Expand review')).toBeVisible();

  await bookList.deleteBook('Long Review Book');
});
