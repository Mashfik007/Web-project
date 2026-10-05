"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ConfirmModal,
  StatusModal,
  openModal,
  useFeedback,
} from "@/Components/Modal";
import type { ShelfBook } from "@/types/myShelf";

interface ReadingBookCardProps {
  userId: string;
  book: ShelfBook;
  variant?: "reading" | "simple";
  canRemove?: boolean;
}

export default function ReadingBookCard({
  userId,
  book,
  variant = "reading",
  canRemove = false,
}: ReadingBookCardProps) {
  const router = useRouter();
  const progress =
    book.pages > 0 ? Math.round((book.currentPage / book.pages) * 100) : 0;
  const pagesLeft = book.pages - book.currentPage;
  const isReading = variant === "reading" && book.currentPage > 0;
  const feedback = useFeedback();
  const renewId = `renew-${book.id}`;
  const returnId = `return-${book.id}`;
  const removeId = `remove-wishlist-${book.id}`;

  async function updateLoan(action: "renew" | "return") {
    try {
      const response = await fetch(`/api/users/shelf/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, loanId: book.id }),
      });
      const payload = await response.json();
      if (!response.ok) {
        feedback.failed(
          action === "renew" ? "Could not renew" : "Could not return",
          payload.message || "Request failed",
        );
        return;
      }

      feedback.success(
        action === "renew" ? "Book renewed" : "Book returned",
        payload.message,
      );
      router.refresh();
    } catch {
      feedback.failed("Request failed", "Could not reach the server.");
    }
  }

  async function removeFromWishlist() {
    try {
      const response = await fetch("/api/users/shelf/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, loanId: book.id }),
      });
      const payload = await response.json();
      if (!response.ok) {
        feedback.failed(
          "Could not remove",
          payload.message || "Request failed",
        );
        return;
      }

      feedback.success("Removed", payload.message || "Removed from Want to Read");
      router.refresh();
    } catch {
      feedback.failed("Request failed", "Could not reach the server.");
    }
  }

  return (
    <article className="rounded-2xl border border-sky-100 bg-slate-50/80 p-5">
      <div className="flex gap-4">
        <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl shadow-sm">
          {book.blindDate ? (
            <div className="flex h-full w-full items-center justify-center bg-slate-800 px-1 text-center text-[10px] font-bold tracking-wide text-white uppercase">
              Blind date
            </div>
          ) : (
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              sizes="80px"
              className="object-cover"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-800">
                {book.title}
              </h3>
              <p className="mt-0.5 text-sm text-slate-500">{book.author}</p>
            </div>

            {isReading && book.daysLeft > 0 && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-semibold text-sky-700">
                <Image
                  src="/svg/clock.svg"
                  alt="Time"
                  width={16}
                  height={16}
                  className="size-3"
                />
                {book.daysLeft}d left
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-medium text-sky-700">
              {book.category}
            </span>
            <span className="text-xs text-slate-400">{book.pages} pages</span>
          </div>

          {isReading ? (
            <>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Page {book.currentPage} of {book.pages}
                </span>
                <span className="font-semibold text-sky-600">{progress}%</span>
              </div>

              <progress
                className="progress progress-primary mt-2"
                value={progress}
                max={100}
              />

              <p className="mt-2 text-xs text-slate-500">
                {pagesLeft} pages to go · due {book.dueDate}
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => openModal(renewId)}
                  className="btn btn-ghost btn-sm"
                >
                  <Image
                    src="/svg/refresh.svg"
                    alt="Refresh"
                    width={14}
                    height={14}
                    className="size-3.5"
                  />
                  Renew
                </button>

                <button
                  type="button"
                  onClick={() => openModal(returnId)}
                  className="btn btn-ghost btn-sm"
                >
                  <Image
                    src="/svg/arrow-left.svg"
                    alt="Back"
                    width={14}
                    height={14}
                    className="size-3.5"
                  />
                  Return
                </button>
              </div>
            </>
          ) : (
            <div className="mt-3">
              <p className="text-xs text-slate-500">
                {book.currentPage >= book.pages && book.pages > 0
                  ? `Completed · ${book.dueDate}`
                  : book.checkedOut
                    ? "Returned to the library"
                    : book.blindDate
                      ? "Blind date surprise — cover stays hidden until you borrow it"
                      : "On your wishlist"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {book.checkedOut ? (
                  <button
                    type="button"
                    onClick={() => openModal(returnId)}
                    className="btn btn-ghost btn-sm"
                  >
                    Return
                  </button>
                ) : null}
                {canRemove ? (
                  <button
                    type="button"
                    onClick={() => openModal(removeId)}
                    className="btn btn-error btn-soft btn-sm"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        id={renewId}
        title="Renew this book"
        message={`Extend the due date for "${book.title}" by 14 days?`}
        confirmLabel="Renew"
        onConfirm={() => {
          void updateLoan("renew");
        }}
      />
      <ConfirmModal
        id={returnId}
        title="Return this book"
        message={`Mark "${book.title}" as returned to the library?`}
        confirmLabel="Return"
        tone="success"
        onConfirm={() => {
          void updateLoan("return");
        }}
      />
      {canRemove ? (
        <ConfirmModal
          id={removeId}
          title="Remove from Want to Read"
          message={`Remove "${book.blindDate ? "this blind date pick" : book.title}" from your wishlist?`}
          confirmLabel="Delete"
          tone="danger"
          onConfirm={() => {
            void removeFromWishlist();
          }}
        />
      ) : null}
      <StatusModal
        id={feedback.id}
        variant={feedback.status.variant}
        title={feedback.status.title}
        message={feedback.status.message}
      />
    </article>
  );
}
