"use client";

import Image from "next/image";
import rotateCcwIcon from "@svg/rotate-ccw.svg";
import { useState } from "react";
import { StatusModal, useFeedback } from "@/Components/Modal";

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
          <Image
            src={rotateCcwIcon}
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
        className="textarea textarea-bordered mt-4 w-full"
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
        className="btn btn-primary btn-soft btn-block mt-4"
      >
        Submit Review
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
