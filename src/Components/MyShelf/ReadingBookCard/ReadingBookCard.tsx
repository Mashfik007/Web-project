"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ConfirmModal,
  StatusModal,
  useFeedback,
} from "@/Components/Modal/AppModal";
import type { ShelfBook } from "@/types/myShelf";

interface ReadingBookCardProps {
  book: ShelfBook;
  variant?: "reading" | "simple";
}

export default function ReadingBookCard({
  book,
  variant = "reading",
}: ReadingBookCardProps) {
  const progress = Math.round((book.currentPage / book.pages) * 100);
  const pagesLeft = book.pages - book.currentPage;
  const isReading = variant === "reading" && book.currentPage > 0;
  const [action, setAction] = useState<"renew" | "return" | null>(null);
  const feedback = useFeedback();

  return (
    <article className="rounded-2xl border border-sky-100 bg-slate-50/80 p-5">
      <div className="flex gap-4">
        <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl shadow-sm">
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            sizes="80px"
            className="object-cover"
          />
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                {book.daysLeft}d left
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-medium text-sky-700">
              {book.genre}
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

              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-sky-100">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                {pagesLeft} pages to go · due {book.dueDate}
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setAction("renew")}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-3.5"
                  >
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M8 16H3v5" />
                  </svg>
                  Renew
                </button>

                <button
                  type="button"
                  onClick={() => setAction("return")}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-3.5"
                  >
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                  </svg>
                  Return
                </button>
              </div>
            </>
          ) : (
            <p className="mt-3 text-xs text-slate-500">
              {book.currentPage >= book.pages
                ? `Completed · returned ${book.dueDate}`
                : "On your wishlist"}
            </p>
          )}
        </div>
      </div>

      <ConfirmModal
        open={action === "renew"}
        onClose={() => setAction(null)}
        title="Renew this book"
        message={`Extend the due date for "${book.title}"?`}
        confirmLabel="Renew"
        onConfirm={() => {
          setAction(null);
          feedback.success("Book renewed", `"${book.title}" is due later.`);
        }}
      />
      <ConfirmModal
        open={action === "return"}
        onClose={() => setAction(null)}
        title="Return this book"
        message={`Mark "${book.title}" as returned to the library?`}
        confirmLabel="Return"
        tone="success"
        onConfirm={() => {
          setAction(null);
          feedback.success("Return started", `"${book.title}" is marked for return.`);
        }}
      />
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
