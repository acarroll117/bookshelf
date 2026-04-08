import { useEffect, useRef, useState } from "react";
import type { Book, BookPayload } from "../types/book";

interface Props {
  book?: Book;
  onSave: (payload: BookPayload) => Promise<void>;
  onClose: () => void;
}

export default function BookForm({ book, onSave, onClose }: Props) {
  const [title, setTitle] = useState(book?.title ?? "");
  const [author, setAuthor] = useState(book?.author ?? "");
  const [score, setScore] = useState(book?.score?.toString() ?? "");
  const [review, setReview] = useState(book?.review ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    const scoreNum = score === "" ? undefined : Number(score);
    if (scoreNum !== undefined && (scoreNum < 1 || scoreNum > 10)) {
      setError("Score must be between 1 and 10.");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        author: author.trim() || undefined,
        review: review.trim() || undefined,
        score: scoreNum,
      });
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          {book ? "Edit Book" : "Add Book"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              placeholder="e.g. The Hobbit"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Author
            </label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              placeholder="e.g. J.R.R. Tolkien"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Score <span className="text-gray-400">(1–10)</span>
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-24 rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              placeholder="—"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Review
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              placeholder="Your thoughts on the book…"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
