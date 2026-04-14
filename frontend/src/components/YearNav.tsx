import { useEffect, useRef, useState } from "react";
import type { Book } from "../types/book";

interface Props {
  groups: [number, Book[]][];
}

export default function YearNav({ groups }: Props) {
  const [active, setActive] = useState<number | null>(groups[0]?.[0] ?? null);
  const scrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    groups.forEach(([year]) => {
      const el = document.getElementById(`year-${year}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !scrollingRef.current) setActive(year);
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      observers.forEach((o) => o.disconnect());
      clearTimeout(scrollTimeoutRef.current);
    };
  }, [groups]);

  function scrollTo(year: number) {
    setActive(year);
    scrollingRef.current = true;
    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      scrollingRef.current = false;
    }, 1000);

    if (year === groups[0]?.[0]) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(`year-${year}`)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <nav className="hidden md:flex flex-col sticky top-8 self-start w-16 shrink-0 gap-0.5">
      {groups.map(([yr, bks]) => (
        <button
          key={yr}
          onClick={() => scrollTo(yr)}
          className={`text-left px-2 py-1.5 rounded-md transition-colors ${
            active === yr
              ? "text-gray-900 dark:text-gray-100 font-semibold"
              : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          <div className="text-lg leading-tight">{yr}</div>
          <div className="text-base leading-tight opacity-70 text-center">{bks.length} 📚</div>
        </button>
      ))}
    </nav>
  );
}
