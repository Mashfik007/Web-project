"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StatusModal, useFeedback } from "@/Components/Modal";
import type { BookReviewItem } from "@/types/bookDetails";

interface ReturnReviewProps {
  bookId: string;
  canReview: boolean;
  viewerReview: BookReviewItem | null;
}

export default function ReturnReview({
  bookId,
  canReview,
  viewerReview,
}: ReturnReviewProps) {
  const router = useRouter();
  const [rating, setRating] = useState(viewerReview?.rating ?? 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [note, setNote] = useState(viewerReview?.note ?? "");
  const [submitting, setSubmitting] = useState(false);
  const feedback = useFeedback();

  const displayRating = hoveredRating || rating;
  const locked = !canReview;

  async function submitReview() {
    if (locked || submitting) return;
    if (rating < 1) {
      feedback.failed(
        "Review not submitted",
        "Choose a star rating before sending your return review.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/users/books/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          rating,
          note: note.trim(),
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        feedback.failed(
          "Review not submitted",
          payload.message || "Could not save your review.",
        );
        return;
      }

      feedback.success(
        viewerReview ? "Review updated" : "Review submitted",
        note.trim()
          ? "Thanks — your rating and note will help other readers."
          : "Thanks — your rating will help other readers.",
      );
      router.refresh();
    } catch {
      feedback.failed("Review not submitted", "Could not reach the server.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
          <Image
            src="/svg/rotate-ccw.svg"
            alt="Return"
            width={16}
            height={16}
            className="size-4"
          />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">
          Leave a Return Review
        </h3>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {locked
          ? "You can leave a review only after returning this book to the library."
          : viewerReview
            ? "Update your rating for fellow readers."
            : "You returned this book — share a quick rating for fellow readers."}
      </p>

      <div className="mt-4 flex gap-1">
        {Array.from({ length: 5 }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayRating;

          return (
            <button
              key={starValue}
              type="button"
              disabled={locked || submitting}
              aria-label={`Rate ${starValue} stars`}
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHoveredRating(starValue)}
              onMouseLeave={() => setHoveredRating(0)}
              className={`text-2xl transition disabled:cursor-not-allowed ${
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
        placeholder={
          locked
            ? "Return the book to unlock reviews"
            : "Write a brief note for other readers... (optional)"
        }
        rows={3}
        disabled={locked || submitting}
        maxLength={1000}
        className="textarea textarea-bordered mt-4 w-full disabled:bg-slate-50"
      />

      <button
        type="button"
        disabled={locked || submitting}
        onClick={() => {
          void submitReview();
        }}
        className="btn btn-primary btn-soft btn-block mt-4"
      >
        {locked
          ? "Return book to review"
          : submitting
            ? "Saving..."
            : viewerReview
              ? "Update Review"
              : "Submit Review"}
      </button>

      <StatusModal
        id={feedback.id}
        variant={feedback.status.variant}
        title={feedback.status.title}
        message={feedback.status.message}
      />
    </article>
  );
}
