import Image from "next/image";
import type { RecommendedBook } from "@/types/forYou";

interface RecommendationCardProps {
  book: RecommendedBook;
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <span className="text-sky-500">
      {"★".repeat(fullStars)}
      {hasHalf ? "½" : ""}
      {"☆".repeat(5 - fullStars - (hasHalf ? 1 : 0))}
    </span>
  );
}

export default function RecommendationCard({ book }: RecommendationCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-3/4 w-full overflow-hidden bg-slate-100">
        <Image
          src={book.coverImage}
          alt={book.title}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover"
        />

        <span className="absolute top-3 left-3 flex size-10 items-center justify-center rounded-full bg-white/90 text-[10px] font-bold text-sky-600 shadow">
          {book.matchPercent}%
        </span>

        {book.isNew && (
          <span className="absolute top-3 right-3 rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-bold text-white shadow">
            NEW
          </span>
        )}
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-bold text-slate-800">
          {book.title}
        </h3>
        <p className="mt-0.5 truncate text-xs text-slate-500">{book.author}</p>

        <div className="mt-2 flex items-center gap-1.5">
          <StarRating rating={book.rating} />
          <span className="text-[10px] font-medium text-slate-500">
            {book.rating}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
            {book.matchPercent}% match
          </span>

          <div className="flex items-center gap-2">
            {book.genre && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-medium text-slate-600">
                {book.genre}
              </span>
            )}
            <button
              type="button"
              className="flex items-center gap-0.5 text-[10px] font-medium text-sky-600 hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              Blind date
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
