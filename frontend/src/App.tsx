import { useEffect, useState } from "react";
import type { Book, BookPayload } from "./types/book";
import { getBooks, createBook, updateBook, deleteBook } from "./api/books";
import BookList from "./components/BookList";
import BookForm from "./components/BookForm";
import ConfirmModal from "./components/ConfirmModal";

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    getBooks()
      .then(setBooks)
      .catch(console.error)
      .finally(() => setLoading(false));
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

  function handleDelete(id: string) {
    setConfirmDeleteId(id);
  }

  async function confirmDelete() {
    if (!confirmDeleteId) return;
    await deleteBook(confirmDeleteId);
    setBooks((prev) => prev.filter((b) => b.id !== confirmDeleteId));
  }

  return (
    <>
      <BookList
        books={books}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        dark={dark}
        onToggleDark={() => setDark((d) => !d)}
      />
      {showForm && (
        <BookForm
          book={editingBook ?? undefined}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
      {confirmDeleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this book?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </>
  );
}
