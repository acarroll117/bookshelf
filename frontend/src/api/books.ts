import type { Book, BookPayload } from "../types/book";

const BASE = "/api/books";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export function getBooks(): Promise<Book[]> {
  return fetch(BASE).then((r) => handleResponse<Book[]>(r));
}

export function createBook(payload: BookPayload): Promise<Book> {
  return fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((r) => handleResponse<Book>(r));
}

export function updateBook(id: string, payload: BookPayload): Promise<Book> {
  return fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((r) => handleResponse<Book>(r));
}

export function deleteBook(id: string): Promise<void> {
  return fetch(`${BASE}/${id}`, { method: "DELETE" }).then((r) =>
    handleResponse<void>(r)
  );
}
