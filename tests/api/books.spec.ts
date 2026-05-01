import { test, expect } from '@playwright/test';

// The `request` fixture is Playwright's built-in HTTP client.
// It is not a browser — it sends raw HTTP requests, like curl or Python's httpx.
// `baseURL` is set to http://localhost:8001 in playwright.config.ts (api project),
// so paths like '/books' resolve to http://localhost:8001/books.

test('POST /books creates a book and returns 201', async ({ request }) => {
  const payload = {
    title: 'Playwright Test Book',
    author: 'Test Author',
    score: 4.0,
  };

  const response = await request.post('/books', { data: payload });

  // Assert the HTTP status code first. 201 means "Created".
  expect(response.status()).toBe(201);

  // Parse the JSON response body and assert the fields we care about.
  // TypeScript needs us to declare the shape of the response — this is the
  // `strict: true` compiler option at work, preventing implicit `any` types.
  const body = await response.json() as {
    id: string;
    title: string;
    author: string;
    score: number;
  };

  expect(body.title).toBe(payload.title);
  expect(body.author).toBe(payload.author);
  expect(body.score).toBe(payload.score);
  // The backend generates a UUID for the id — we just verify one was returned.
  expect(body.id).toBeTruthy();

  // Clean up: delete the record we created so the test database stays empty
  // between runs. A 204 (No Content) response confirms the delete succeeded.
  const deleteResponse = await request.delete(`/books/${body.id}`);
  expect(deleteResponse.status()).toBe(204);
});
