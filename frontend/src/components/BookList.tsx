import type { Book } from "../types/book";
import BookCard from "./BookCard";

interface Props {
  books: Book[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

function SkeletonCard() {
  return (
    <div className="flex gap-4 items-start bg-white rounded-xl shadow-md p-4 animate-pulse">
      <div className="w-40 h-56 flex-shrink-0 rounded-md bg-gray-200" />
      <div className="flex-1 flex flex-col gap-3 pt-1">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-full mt-2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-20 text-gray-300">
      <svg
        width="160"
        height="120"
        viewBox="0 0 160 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Bottom shelf board */}
        <line x1="10" y1="108" x2="150" y2="108" />
        <line x1="10" y1="108" x2="10" y2="114" />
        <line x1="150" y1="108" x2="150" y2="114" />

        {/* Middle shelf board */}
        <line x1="10" y1="60" x2="150" y2="60" />

        {/* Book 1 — tall, on bottom shelf */}
        <rect x="22" y="72" width="16" height="36" rx="1.5" />

        {/* Book 2 — short, on bottom shelf */}
        <rect x="44" y="84" width="14" height="24" rx="1.5" />

        {/* Book 3 — medium, on bottom shelf */}
        <rect x="64" y="78" width="18" height="30" rx="1.5" />

        {/* Book 4 — tall, on bottom shelf */}
        <rect x="88" y="70" width="14" height="38" rx="1.5" />

        {/* Book 5 — medium, on top shelf */}
        <rect x="30" y="24" width="16" height="36" rx="1.5" />

        {/* Book 6 — tall, on top shelf */}
        <rect x="52" y="16" width="14" height="44" rx="1.5" />

        {/* Book 7 — short, on top shelf */}
        <rect x="72" y="30" width="18" height="30" rx="1.5" />

        {/* Top shelf board */}
        <line x1="10" y1="12" x2="150" y2="12" />
      </svg>
      <p className="mt-4 text-sm text-gray-400">No books yet. Add your first one!</p>
    </div>
  );
}

export default function BookList({ books, loading, onAdd, onEdit, onDelete }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-2xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Bookshelf</h1>
          <button
            onClick={onAdd}
            aria-label="Add book"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-2xl px-4 py-8">
        {loading ? (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : books.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
