import { useEffect, useState } from "react";
import type { Book, BookPayload } from "./types/book";
import { getBooks, createBook, updateBook, deleteBook } from "./api/books";
import BookList from "./components/BookList";
import BookForm from "./components/BookForm";

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getBooks().then(setBooks).catch(console.error);
  }, []);

  function openAdd() {
    setEditingBook(null);
    setShowForm(true);
  }

  function openEdit(book: Book) {
    setEditingBook(book);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingBook(null);
  }

  async function handleSave(payload: BookPayload) {
    if (editingBook) {
      const updated = await updateBook(editingBook.id, payload);
      setBooks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    } else {
      const created = await createBook(payload);
      setBooks((prev) => [created, ...prev]);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this book?")) return;
    await deleteBook(id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <>
      <BookList
        books={books}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
      {showForm && (
        <BookForm
          book={editingBook ?? undefined}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
    </>
  );
}
