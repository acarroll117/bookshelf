import { test } from '@playwright/test';
import { BookListPage } from './pages/BookListPage';
import { BookFormModal } from './pages/BookFormModal';

// Happy-path test: a user opens the app, adds a book manually via the form,
// and confirms the book appears in the list. The test cleans up after itself
// so the test database is empty for the next run.

test('adding a book manually shows it in the book list', async ({ page }) => {
  const bookList = new BookListPage(page);
  const bookForm = new BookFormModal(page);

  // Navigate to the app and open the Add Book form.
  await bookList.open();
  await bookList.clickAddBook();

  // Fill in the form fields.
  await bookForm.fillTitle('The Hobbit');
  await bookForm.fillAuthor('J.R.R. Tolkien');
  await bookForm.setRating(4);

  // Submit the form and wait for the modal to close.
  await bookForm.submit();

  // Assert the book now appears in the list.
  await bookList.assertBookVisible('The Hobbit');

  // Clean up: delete the book so the test can run again cleanly.
  await bookList.deleteBook('The Hobbit');
});
