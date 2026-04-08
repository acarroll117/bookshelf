import type { Book } from "../types/book";

interface Props {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

export default function BookCard({ book, onEdit, onDelete }: Props) {
  return (
    <li className="flex items-center gap-3 border-b border-gray-100 py-3 last:border-0">
      <div className="min-w-0 flex-1">
        <span className="font-medium text-gray-900">{book.title}</span>
        {book.author && (
          <span className="text-gray-500"> · {book.author}</span>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {book.score != null && (
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
            {book.score}/10
          </span>
        )}
        <button
          onClick={() => onEdit(book)}
          className="text-sm text-gray-400 hover:text-gray-700"
          aria-label="Edit"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(book.id)}
          className="text-sm text-gray-400 hover:text-red-600"
          aria-label="Delete"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
