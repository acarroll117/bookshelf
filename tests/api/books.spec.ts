import { test, expect } from '@playwright/test';

// The `request` fixture is Playwright's built-in HTTP client.
// It is not a browser — it sends raw HTTP requests, like curl or Python's httpx.
// `baseURL` is set to http://localhost:8001 in playwright.config.ts (api project),
// so paths like '/books' resolve to http://localhost:8001/books.

type Book = {
  id: string;
  title: string;
  author: string | null;
  review: string | null;
  score: number | null;
  cover_url: string | null;
  pages: number | null;
  created_at: string;
  updated_at: string;
};
  
// A well-formed UUID that will never exist in the database.
const UNKNOWN_ID = '00000000-0000-0000-0000-000000000000';
// A string that is not a valid UUID format.
const MALFORMED_ID = 'not-a-uuid';


test.describe('POST /books', () => {
  test('creates a book and returns 201 with all fields', async ({ request }) => {
    const payload = {
      title: 'Playwright Test Book',
      author: 'Test Author',
      review: 'An excellent read.',
      score: 4.0,
      cover_url: 'https://example.com/cover.jpg',
      pages: 320,
    };

    const response = await request.post('/books', { data: payload });
    expect(response.status()).toBe(201);

    const body = await response.json() as Book;
    expect(body.id).toBeTruthy();
    expect(body.title).toBe(payload.title);
    expect(body.author).toBe(payload.author);
    expect(body.review).toBe(payload.review);
    expect(body.score).toBe(payload.score);
    expect(body.cover_url).toBe(payload.cover_url);
    expect(body.pages).toBe(payload.pages);
    expect(typeof body.created_at).toBe('string');
    expect(typeof body.updated_at).toBe('string');

    // Clean up: delete the record we created so the test database stays empty
    const deleteResponse = await request.delete(`/books/${body.id}`);
    expect(deleteResponse.status()).toBe(204);
  });

  test('creates a book with title only and returns null for optional fields', async ({ request }) => {
    const response = await request.post('/books', { data: { title: 'Minimal Book' } });
    expect(response.status()).toBe(201);

    const body = await response.json() as Book;
    expect(body.author).toBeNull();
    expect(body.review).toBeNull();
    expect(body.score).toBeNull();
    expect(body.cover_url).toBeNull();
    expect(body.pages).toBeNull();

    await request.delete(`/books/${body.id}`);
  });

  test('score of 0.5 (minimum) returns 201', async ({ request }) => {
    const response = await request.post('/books', { data: { title: 'Min Score Book', score: 0.5 } });
    expect(response.status()).toBe(201);
    const body = await response.json() as Book;
    expect(body.score).toBe(0.5);
    await request.delete(`/books/${body.id}`);
  });

  test('score of 5.0 (maximum) returns 201', async ({ request }) => {
    const response = await request.post('/books', { data: { title: 'Max Score Book', score: 5.0 } });
    expect(response.status()).toBe(201);
    const body = await response.json() as Book;
    expect(body.score).toBe(5.0);
    await request.delete(`/books/${body.id}`);
  });

  test('missing title returns 422', async ({ request }) => {
    const response = await request.post('/books', { data: { author: 'No Title' } });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body.detail[0].msg).toBe('Field required');
  });

  test('blank title returns 422', async ({ request }) => {
    const response = await request.post('/books', { data: { title: '   ' } });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body.detail[0].msg).toBe('Value error, title cannot be blank');
  });

  test('score not on a half-star increment returns 422', async ({ request }) => {
    const response = await request.post('/books', { data: { title: 'Bad Score', score: 3.3 } });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body.detail[0].msg).toBe('Value error, score must be a half-star increment between 0.5 and 5.0');
  });

  test('score of 0 returns 422', async ({ request }) => {
    const response = await request.post('/books', { data: { title: 'Bad Score', score: 0 } });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body.detail[0].msg).toBe('Value error, score must be a half-star increment between 0.5 and 5.0');
  });

  test('score out of range returns 422', async ({ request }) => {
    const response = await request.post('/books', { data: { title: 'Bad Score', score: 6.0 } });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body.detail[0].msg).toBe('Value error, score must be a half-star increment between 0.5 and 5.0');
  });
});

test.describe('GET /books', () => {
  test('returns 200 with an array', async ({ request }) => {
    const response = await request.get('/books');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('includes a newly created book', async ({ request }) => {
    const created = await (await request.post('/books', { data: { title: 'Listed Book' } })).json() as Book;

    const books = await (await request.get('/books')).json() as Book[];
    expect(books.some(b => b.id === created.id)).toBe(true);

    await request.delete(`/books/${created.id}`);
  });

  test('orders newest first', async ({ request }) => {
    const first = await (await request.post('/books', { data: { title: 'Older Book' } })).json() as Book;
    const second = await (await request.post('/books', { data: { title: 'Newer Book' } })).json() as Book;

    const books = await (await request.get('/books')).json() as Book[];
    const firstIdx = books.findIndex(b => b.id === first.id);
    const secondIdx = books.findIndex(b => b.id === second.id);
    // The more recently created book should appear earlier in the list.
    expect(secondIdx).toBeLessThan(firstIdx);

    await request.delete(`/books/${first.id}`);
    await request.delete(`/books/${second.id}`);
  });
});

test.describe('GET /books/:id', () => {
  test('returns the book', async ({ request }) => {
    const payload = { title: 'Fetchable Book', author: 'Some Author' };
    const created = await (await request.post('/books', { data: payload })).json() as Book;

    const response = await request.get(`/books/${created.id}`);
    expect(response.status()).toBe(200);

    const body = await response.json() as Book;
    expect(body.id).toBe(created.id);
    expect(body.title).toBe(payload.title);
    expect(body.author).toBe(payload.author);

    await request.delete(`/books/${created.id}`);
  });

  test('returns 404 for an unknown id', async ({ request }) => {
    const response = await request.get(`/books/${UNKNOWN_ID}`);
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.detail).toBe('Book not found');
  });

  test('returns 422 for a malformed id', async ({ request }) => {
    const response = await request.get(`/books/${MALFORMED_ID}`);
    expect(response.status()).toBe(422);
  });
});

test.describe('PUT /books/:id', () => {
  test('updates fields and returns 200', async ({ request }) => {
    const initial = { title: 'Original Title', score: 3.0 };
    const update = { title: 'Updated Title', score: 4.5 };
    const created = await (await request.post('/books', { data: initial })).json() as Book;

    const response = await request.put(`/books/${created.id}`, { data: update });
    expect(response.status()).toBe(200);

    const body = await response.json() as Book;
    expect(body.title).toBe(update.title);
    expect(body.score).toBe(update.score);

    await request.delete(`/books/${created.id}`);
  });

  test('partial update preserves untouched fields', async ({ request }) => {
    const initial = { title: 'Partial Book', author: 'Keep This Author', score: 2.5 };
    const update = { title: 'New Title Only' };
    const created = await (await request.post('/books', { data: initial })).json() as Book;

    const response = await request.put(`/books/${created.id}`, { data: update });
    expect(response.status()).toBe(200);

    const body = await response.json() as Book;
    expect(body.title).toBe(update.title);
    expect(body.author).toBe(initial.author);
    expect(body.score).toBe(initial.score);

    await request.delete(`/books/${created.id}`);
  });

  test('empty body returns 200 with no changes', async ({ request }) => {
    const created = await (await request.post('/books', { data: { title: 'Unchanged Book', author: 'Same Author' } })).json() as Book;

    const response = await request.put(`/books/${created.id}`, { data: {} });
    expect(response.status()).toBe(200);

    const body = await response.json() as Book;
    expect(body.title).toBe('Unchanged Book');
    expect(body.author).toBe('Same Author');

    await request.delete(`/books/${created.id}`);
  });

  test('clears an optional field when set to null', async ({ request }) => {
    const created = await (await request.post('/books', { data: { title: 'Has Author', author: 'To Be Cleared' } })).json() as Book;

    const response = await request.put(`/books/${created.id}`, { data: { author: null } });
    expect(response.status()).toBe(200);

    const body = await response.json() as Book;
    expect(body.author).toBeNull();

    await request.delete(`/books/${created.id}`);
  });

  test('returns 404 for an unknown id', async ({ request }) => {
    const response = await request.put(`/books/${UNKNOWN_ID}`, { data: { title: 'Ghost Book' } });
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.detail).toBe('Book not found');
  });

  test('returns 422 for a malformed id', async ({ request }) => {
    const response = await request.put(`/books/${MALFORMED_ID}`, { data: { title: 'Ghost Book' } });
    expect(response.status()).toBe(422);
  });

  test('blank title returns 422', async ({ request }) => {
    const created = await (await request.post('/books', { data: { title: 'Valid Title' } })).json() as Book;

    const response = await request.put(`/books/${created.id}`, { data: { title: '   ' } });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body.detail[0].msg).toBe('Value error, title cannot be blank');

    await request.delete(`/books/${created.id}`);
  });

  test('score not on a half-star increment returns 422', async ({ request }) => {
    const created = await (await request.post('/books', { data: { title: 'Valid Title' } })).json() as Book;

    const response = await request.put(`/books/${created.id}`, { data: { score: 3.3 } });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body.detail[0].msg).toBe('Value error, score must be a half-star increment between 0.5 and 5.0');

    await request.delete(`/books/${created.id}`);
  });

  test('score out of range returns 422', async ({ request }) => {
    const created = await (await request.post('/books', { data: { title: 'Valid Title' } })).json() as Book;

    const response = await request.put(`/books/${created.id}`, { data: { score: 6.0 } });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body.detail[0].msg).toBe('Value error, score must be a half-star increment between 0.5 and 5.0');

    await request.delete(`/books/${created.id}`);
  });
});

test.describe('DELETE /books/:id', () => {
  test('deletes the book and returns 204', async ({ request }) => {
    const created = await (await request.post('/books', { data: { title: 'To Be Deleted' } })).json() as Book;

    const response = await request.delete(`/books/${created.id}`);
    expect(response.status()).toBe(204);

    const getResponse = await request.get(`/books/${created.id}`);
    expect(getResponse.status()).toBe(404);
  });

  test('returns 404 for an unknown id', async ({ request }) => {
    const response = await request.delete(`/books/${UNKNOWN_ID}`);
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.detail).toBe('Book not found');
  });

  test('returns 422 for a malformed id', async ({ request }) => {
    const response = await request.delete(`/books/${MALFORMED_ID}`);
    expect(response.status()).toBe(422);
  });
});
