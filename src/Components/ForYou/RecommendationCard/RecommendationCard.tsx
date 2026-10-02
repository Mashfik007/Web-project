"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ConfirmModal,
  StatusModal,
  openModal,
  useFeedback,
} from "@/Components/Modal";
import type { RecommendedBook } from "@/types/forYou";

interface RecommendationCardProps {
  book: RecommendedBook;
  userId: string;
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

export default function RecommendationCard({
  book,
  userId,
}: RecommendationCardProps) {
  const router = useRouter();
  const feedback = useFeedback();
  const dateModalId = `date-${book.id}`;

  async function wrapForShelf() {
    const response = await fetch("/api/users/shelf/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        bookId: String(book.id),
        blindDate: true,
      }),
    });
    const payload = await response.json();
    if (!response.ok) {
      feedback.failed(
        "Could not wrap this book",
        payload.message || "Request failed",
      );
      return;
    }

    feedback.success("Blind date booked", payload.message);
    router.refresh();
  }

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
            {book.category && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-medium text-slate-600">
                {book.category}
              </span>
            )}
            <button
              type="button"
              onClick={() => openModal(dateModalId)}
              className="flex items-center gap-0.5 text-[10px] font-medium text-sky-600 hover:underline"
            >
              <Image
                src="/svg/heart.svg"
                alt="Favorite"
                width={16}
                height={16}
                className="size-3"
              />
              Blind date
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        id={dateModalId}
        title="Blind date this book"
        message={`Wrap "${book.title}" as a surprise pick? The cover stays hidden until you start reading.`}
        confirmLabel="Wrap it"
        onConfirm={() => {
          void wrapForShelf();
        }}
      />
      <StatusModal
        id={feedback.id}
        variant={feedback.status.variant}
        title={feedback.status.title}
        message={feedback.status.message}
      />
    </article>
  );
}
