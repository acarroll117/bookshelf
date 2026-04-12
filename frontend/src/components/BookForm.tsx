import { useEffect, useRef, useState } from "react";
import type { Book, BookPayload } from "../types/book";
import Modal, { useModalClose } from "./Modal";

interface Props {
  book?: Book;
  onSave: (payload: BookPayload) => Promise<void>;
  onClose: () => void;
}

interface BookSuggestion {
  title: string;
  subtitle: string;
  author: string;
  coverUrl: string;
  pages: number | null;
}

const hatchBg =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M0 8L8 0' stroke='%23d1d5db' stroke-width='1'/%3E%3C/svg%3E\")";

async function searchBooks(query: string): Promise<BookSuggestion[]> {
  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=5&fields=title,subtitle,author_name,cover_i,number_of_pages_median`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  if (!data.docs) return [];
  return (data.docs as unknown[])
    .map((doc) => {
      const d = doc as { title?: string; subtitle?: string; author_name?: string[]; cover_i?: number; number_of_pages_median?: number };
      return {
        title: d.title ?? "",
        subtitle: d.subtitle ?? "",
        author: d.author_name?.[0] ?? "",
        coverUrl: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : "",
        pages: d.number_of_pages_median ?? null,
      };
    })
    .filter((s) => s.title);
}

function BookFormContent({ book, onSave }: Omit<Props, "onClose">) {
  const close = useModalClose();
  const [title, setTitle] = useState(book?.title ?? "");
  const [author, setAuthor] = useState(book?.author ?? "");
  const [coverUrl, setCoverUrl] = useState(book?.cover_url ?? "");
  const [score, setScore] = useState(book?.score?.toString() ?? "");
  const [review, setReview] = useState(book?.review ?? "");
  const [pages, setPages] = useState<number | null>(book?.pages ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [titleTouched, setTitleTouched] = useState(false);
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const trimmed = title.trim();
    const minLength = /^the(\s|$)/i.test(title) ? 5 : 3;
    if (!titleTouched || trimmed.length < minLength) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchBooks(title.trim());
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch {
        // silently ignore search errors
      } finally {
        setSearching(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [title, titleTouched]);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    setTitleTouched(true);
  }

  function handleTitleBlur() {
    setTimeout(() => setShowSuggestions(false), 150);
  }

  function selectSuggestion(s: BookSuggestion) {
    setTitleTouched(false);
    setTitle(s.subtitle ? `${s.title}: ${s.subtitle}` : s.title);
    setAuthor(s.author);
    setCoverUrl(s.coverUrl);
    setPages(s.pages);
    setSuggestions([]);
    setShowSuggestions(false);
    setSearching(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
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
        review: review.replace(/^\n+|\n+$/g, "") || undefined,
        score: scoreNum,
        cover_url: coverUrl || undefined,
        pages: pages ?? undefined,
      });
      close();
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
      <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">
        {book ? "Edit Book" : "Add Book"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              ref={titleRef}
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-gray-500 dark:focus:border-gray-400 focus:outline-none"
              placeholder="e.g. The Hobbit"
              autoComplete="off"
            />
            {searching && (
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                <svg className="h-4 w-4 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-60" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              </div>
            )}
            {showSuggestions && (
              <ul className="absolute z-10 mt-1 w-full overflow-auto rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg" style={{ maxHeight: "16rem", overscrollBehavior: "contain" }}>
                {suggestions.map((s, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectSuggestion(s)}
                    >
                      {s.coverUrl ? (
                        <img src={s.coverUrl} alt="" className="h-20 w-14 flex-shrink-0 object-cover" />
                      ) : (
                        <div
                          className="h-20 w-14 flex-shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700"
                          style={{ backgroundImage: hatchBg }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="truncate font-medium text-gray-800 dark:text-gray-100">{s.title}</div>
                        {s.author && <div className="truncate text-xs text-gray-500 dark:text-gray-400">{s.author}</div>}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Author
          </label>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-gray-500 dark:focus:border-gray-400 focus:outline-none"
            placeholder="e.g. J.R.R. Tolkien"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Score <span className="text-gray-400">(1–10)</span>
          </label>
          <input
            type="number"
            min={1}
            max={10}
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-24 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-gray-500 dark:focus:border-gray-400 focus:outline-none"
            placeholder="—"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Review
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                const el = e.currentTarget;
                const start = el.selectionStart;
                const end = el.selectionEnd;
                const next = review.substring(0, start) + "\t" + review.substring(end);
                setReview(next);
                requestAnimationFrame(() => {
                  el.selectionStart = el.selectionEnd = start + 1;
                });
              }
            }}
            rows={4}
            className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-gray-500 dark:focus:border-gray-400 focus:outline-none"
            placeholder="Your thoughts on the book…"
          />
        </div>

        <p className="min-h-[1.25rem] text-sm text-red-600">{error}</p>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={close}
            className="rounded px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-gray-800 dark:bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700 dark:hover:bg-gray-500 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function BookForm({ book, onSave, onClose }: Props) {
  return (
    <Modal onClose={onClose}>
      <BookFormContent book={book} onSave={onSave} />
    </Modal>
  );
}
