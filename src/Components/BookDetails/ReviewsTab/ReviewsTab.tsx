import type { BookReviewItem } from "@/types/bookDetails";

interface ReviewsTabProps {
  reviews: BookReviewItem[];
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-sky-500" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </span>
  );
}

export default function ReviewsTab({ reviews }: ReviewsTabProps) {
  if (reviews.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-500">
        No reviews yet. Readers can leave one after returning this book.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li
          key={review.id}
          className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3"
        >
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white">
              {review.initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-800">
                  {review.userName}
                </p>
                <p className="text-xs text-slate-400">{review.createdAt}</p>
              </div>
              <div className="mt-1">
                <Stars rating={review.rating} />
              </div>
              {review.note ? (
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {review.note}
                </p>
              ) : null}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
