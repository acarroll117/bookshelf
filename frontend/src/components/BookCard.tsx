import { useEffect, useRef, useState } from "react";
import type { Book } from "../types/book";

interface Props {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

export default function BookCard({ book, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const overflowRef = useRef<HTMLDivElement>(null);

  // Collapse and reset when review content changes
  useEffect(() => {
    setExpanded(false);
  }, [book.review]);

  // Re-measure overflow whenever we return to collapsed state
  useEffect(() => {
    if (expanded) return;
    const el = overflowRef.current;
    if (!el) return;
    setIsOverflowing(el.scrollHeight > el.clientHeight);
  }, [expanded, book.review]);

  return (
    <div className="flex gap-4 items-start bg-white rounded-xl shadow-md p-4">
      {/* Placeholder book cover */}
      <div
        className="w-40 h-56 bg-gray-200 flex-shrink-0"
        aria-hidden="true"
      />

      {/* Content column — fixed to image height when collapsed */}
      <div className={`flex-1 min-w-0 flex flex-col ${expanded ? "" : "h-56"}`}>

        {/* Overflow container — fills remaining space above bottom row, clips when needed */}
        <div
          ref={overflowRef}
          className={`relative ${expanded ? "" : "flex-1 overflow-hidden"}`}
        >
          <p className="font-semibold text-gray-900 leading-snug">{book.title}</p>
          {book.author && (
            <p className="text-sm text-gray-500 mt-0.5">{book.author}</p>
          )}
          {book.review && (
            <p className="text-sm text-gray-600 leading-relaxed mt-2">{book.review}</p>
          )}

          {/* Gradient fade — only when collapsed and content actually overflows */}
          {!expanded && isOverflowing && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>

        {/* Expand/collapse toggle — only when content overflows */}
        {isOverflowing && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-1 self-start flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
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

        {/* Bottom row: actions + score — always pinned to bottom */}
        <div className="mt-auto pt-3 flex-shrink-0 flex items-center justify-between">
          <div className="flex gap-3">
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
          {book.score != null && (
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
              {book.score}/10
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
