import type { BookDetails } from "@/types/bookDetails";

interface BookHeaderProps {
  book: Pick<
    BookDetails,
    "tags" | "title" | "author" | "rating" | "description"
  >;
}

function StarRating({ score }: { score: number }) {
  const fullStars = Math.floor(score);
  const hasHalf = score - fullStars >= 0.5;

  return (
    <span className="text-sky-500">
      {"★".repeat(fullStars)}
      {hasHalf ? "½" : ""}
      {"☆".repeat(5 - fullStars - (hasHalf ? 1 : 0))}
    </span>
  );
}

export default function BookHeader({ book }: BookHeaderProps) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {book.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700"
          >
            {tag}
          </span>
        ))}
      </div>

      <h1 className="mt-4 font-serif text-4xl font-bold text-slate-800">
        {book.title}
      </h1>

      <p className="mt-2 text-base text-slate-500">by {book.author}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <StarRating score={book.rating.score} />
        <span className="text-sm font-semibold text-slate-800">
          {book.rating.score}
        </span>
        <span className="text-sm text-sky-600 underline decoration-sky-200 underline-offset-2">
          {book.rating.totalRatings.toLocaleString()} ratings
        </span>
        <span className="text-sm text-sky-600 underline decoration-sky-200 underline-offset-2">
          {book.rating.totalReviews.toLocaleString()} reviews
        </span>
      </div>

      <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-600">
        {book.description}
      </p>
    </div>
  );
}
