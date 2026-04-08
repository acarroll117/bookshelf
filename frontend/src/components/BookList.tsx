import type { Book } from "../types/book";
import BookCard from "./BookCard";

interface Props {
  books: Book[];
  onAdd: () => void;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

export default function BookList({ books, onAdd, onEdit, onDelete }: Props) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Books</h1>
        <button
          onClick={onAdd}
          className="rounded bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
        >
          + Add Book
        </button>
      </div>

      {books.length === 0 ? (
        <p className="py-16 text-center text-gray-400">
          No books yet. Add your first one!
        </p>
      ) : (
        <ul>
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
