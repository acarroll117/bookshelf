import { useEffect, useRef, useState } from "react";
import type { Book } from "../types/book";

interface Props {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

// Diagonal hatch pattern as a data URI SVG background
const hatchBg =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M0 8L8 0' stroke='%23d1d5db' stroke-width='1'/%3E%3C/svg%3E\")";

function CoverPlaceholder() {
  return (
    <div
      className="w-40 h-56 flex-shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700"
      style={{ backgroundImage: hatchBg }}
      aria-hidden="true"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#9ca3af"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    </div>
  );
}

export default function BookCard({ book, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const overflowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setExpanded(false);
  }, [book.review]);

  useEffect(() => {
    if (expanded) return;
    const el = overflowRef.current;
    if (!el) return;
    setIsOverflowing(el.scrollHeight > el.clientHeight);
  }, [expanded, book.review]);

  return (
    <div className="flex gap-4 items-start bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
      {/* Book cover */}
      {book.cover_url ? (
        <img
          src={book.cover_url}
          alt={`Cover of ${book.title}`}
          className="w-40 h-56 flex-shrink-0 object-contain"
        />
      ) : (
        <CoverPlaceholder />
      )}

      {/* Content column */}
      <div className={`relative flex-1 min-w-0 flex flex-col ${expanded ? "" : "h-56"}`}>

        {/* Icon buttons — upper right */}
        <div className="absolute top-0 right-0 flex gap-1 z-10">
          <button
            onClick={() => onEdit(book)}
            className="p-1.5 text-gray-300 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Edit"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(book.id)}
            className="p-1.5 text-gray-300 hover:text-red-600 dark:text-gray-600 dark:hover:text-red-500 transition-colors"
            aria-label="Delete"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </button>
        </div>

        {/* Overflow container */}
        <div
          ref={overflowRef}
          className={`relative ${expanded ? "" : "flex-1 overflow-hidden"}`}
        >
          <p className="font-semibold text-gray-900 dark:text-gray-100 leading-snug pr-14">{book.title}</p>
          {book.author && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{book.author}</p>
          )}
          {book.review && (
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-2 whitespace-pre-wrap">{book.review}</p>
          )}

          {!expanded && isOverflowing && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none" />
          )}
        </div>

        {/* Expand/collapse toggle */}
        {isOverflowing && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-1 self-start flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label={expanded ? "Collapse review" : "Expand review"}
          >
            <svg
              className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`}
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 4l4 4 4-4" />
            </svg>
          </button>
        )}

        {/* Score and pages — bottom right */}
        <div className="mt-auto pt-3 flex-shrink-0 flex items-center justify-end gap-3">
          {book.pages != null && (
            <span className="flex items-center gap-1 rounded bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
              </svg>
              {book.pages}
            </span>
          )}
          <span className="rounded bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
            {book.score != null ? `${book.score}/10` : "-/10"}
          </span>
        </div>
      </div>
    </div>
  );
}
