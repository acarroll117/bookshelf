import { useState } from "react";

interface StarRatingProps {
  value: number | null;
  onChange?: (v: number) => void;
  size?: "sm" | "md";
  error?: boolean;
}

const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

const STARS = [1, 2, 3, 4, 5];

function StarIcon({
  fill,
  sizePx,
  error,
}: {
  fill: "empty" | "half" | "full";
  sizePx: number;
  error: boolean;
}) {
  const outlineColor = error ? "#ef4444" : "currentColor";
  return (
    <span className="relative inline-block" style={{ width: sizePx, height: sizePx }}>
      <svg
        width={sizePx}
        height={sizePx}
        viewBox="0 0 24 24"
        className="absolute inset-0 text-gray-300 dark:text-gray-600"
        aria-hidden="true"
      >
        <path
          d={STAR_PATH}
          fill="none"
          stroke={outlineColor}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      {fill !== "empty" && (
        <svg
          width={sizePx}
          height={sizePx}
          viewBox="0 0 24 24"
          className="absolute inset-0"
          style={fill === "half" ? { clipPath: "inset(0 50% 0 0)" } : undefined}
          aria-hidden="true"
        >
          <path
            d={STAR_PATH}
            fill="#f59e0b"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}

export default function StarRating({
  value,
  onChange,
  size = "md",
  error = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const isInteractive = !!onChange;
  const displayValue = hoverValue ?? value ?? 0;
  const sizePx = size === "sm" ? 24 : 30;

  return (
    <div
      className="flex items-center gap-0.5"
      onMouseLeave={() => isInteractive && setHoverValue(null)}
    >
      {STARS.map((n) => {
        const fill =
          displayValue >= n ? "full" : displayValue >= n - 0.5 ? "half" : "empty";
        return (
          <span key={n} className="relative inline-flex">
            <StarIcon fill={fill} sizePx={sizePx} error={error && displayValue === 0} />
            {isInteractive && (
              <>
                <span
                  className="absolute inset-y-0 left-0 w-1/2 cursor-pointer"
                  onMouseEnter={() => setHoverValue(n - 0.5)}
                  onClick={() => onChange(n - 0.5)}
                />
                <span
                  className="absolute inset-y-0 right-0 w-1/2 cursor-pointer"
                  onMouseEnter={() => setHoverValue(n)}
                  onClick={() => onChange(n)}
                />
              </>
            )}
          </span>
        );
      })}
    </div>
  );
}
