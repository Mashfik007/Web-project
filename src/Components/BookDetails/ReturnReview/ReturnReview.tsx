"use client";

import { useState } from "react";
import { StatusModal, useFeedback } from "@/Components/Modal/AppModal";

export default function ReturnReview() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [note, setNote] = useState("");
  const feedback = useFeedback();

  const displayRating = hoveredRating || rating;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-800">
          Leave a Return Review
        </h3>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Returning this book? Share a quick rating for fellow readers.
      </p>

      <div className="mt-4 flex gap-1">
        {Array.from({ length: 5 }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayRating;

          return (
            <button
              key={starValue}
              type="button"
              aria-label={`Rate ${starValue} stars`}
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHoveredRating(starValue)}
              onMouseLeave={() => setHoveredRating(0)}
              className={`text-2xl transition ${
                isFilled ? "text-sky-500" : "text-slate-300"
              }`}
            >
              {isFilled ? "★" : "☆"}
            </button>
          );
        })}
      </div>

      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Write a brief note for other readers... (optional)"
        rows={3}
        className="mt-4 w-full resize-none rounded-xl border border-sky-100 bg-sky-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-sky-300 focus:outline-none"
      />

      <button
        type="button"
        onClick={() => {
          if (rating === 0) {
            feedback.failed(
              "Review not submitted",
              "Choose a star rating before sending your return review.",
            );
            return;
          }
          feedback.success(
            "Review submitted",
            note.trim()
              ? "Thanks — your rating and note will help other readers."
              : "Thanks — your rating will help other readers.",
          );
        }}
        className="mt-4 w-full rounded-xl bg-sky-100 px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-200"
      >
        Submit Review
      </button>

      <StatusModal
        open={feedback.status !== null}
        onClose={feedback.closeStatus}
        variant={feedback.status?.variant ?? "success"}
        title={feedback.status?.title ?? ""}
        message={feedback.status?.message ?? ""}
      />
    </article>
  );
}
