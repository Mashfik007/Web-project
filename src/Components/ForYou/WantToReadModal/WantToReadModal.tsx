"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  AppModal,
  ModalButton,
  StatusModal,
  closeModal,
  openModal,
  useFeedback,
} from "@/Components/Modal";

export type WantToReadBook = {
  id: string | number;
  title: string;
  author: string;
  coverImage: string;
  category: string;
  blindDate?: boolean;
};

interface WantToReadModalProps {
  id?: string;
  userId: string;
  books: WantToReadBook[];
  onBooksChange?: (books: WantToReadBook[]) => void;
}

export default function WantToReadModal({
  id = "want-to-read",
  userId,
  books,
  onBooksChange,
}: WantToReadModalProps) {
  const feedback = useFeedback();
  const [pending, setPending] = useState<WantToReadBook | null>(null);
  const removeId = "want-to-read-remove";

  async function removeBook(book: WantToReadBook) {
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

      const next = books.filter((item) => item.id !== book.id);
      onBooksChange?.(next);
      feedback.success(
        "Removed",
        payload.message || "Removed from Want to Read",
      );
      openModal(id);
    } catch {
      feedback.failed("Request failed", "Could not reach the server.");
    } finally {
      setPending(null);
    }
  }

  return (
    <>
      <AppModal id={id} title="Want to Read">
        <p className="mb-4 text-sm text-slate-500">
          Books waiting on your shelf
          {books.length > 0 ? ` · ${books.length}` : ""}.
        </p>

        {books.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400">
            No Want to Read books yet.
          </p>
        ) : (
          <ul className="max-h-[50vh] space-y-3 overflow-y-auto pr-1">
            {books.map((book) => (
              <li
                key={book.id}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5"
              >
                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-200">
                  {book.blindDate ? (
                    <div className="flex h-full w-full items-center justify-center bg-slate-800 px-1 text-center text-[9px] font-bold tracking-wide text-white uppercase">
                      Blind date
                    </div>
                  ) : (
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {book.blindDate ? "Surprise pick" : book.title}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {book.blindDate
                      ? "Cover hidden until you borrow it"
                      : book.author}
                  </p>
                  <p className="mt-1 text-[10px] font-medium text-sky-700">
                    {book.category}
                    {book.blindDate ? " · Blind date" : ""}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-error btn-soft btn-xs shrink-0"
                  onClick={() => {
                    setPending(book);
                    openModal(removeId);
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="modal-action">
          <ModalButton tone="secondary" onClick={() => closeModal(id)}>
            Close
          </ModalButton>
          <Link
            href={`/user/${userId}/shelf`}
            className="btn btn-primary"
            onClick={() => closeModal(id)}
          >
            Open My Shelf
          </Link>
        </div>
      </AppModal>

      <AppModal id={removeId} title="Remove from Want to Read">
        <p className="text-sm leading-relaxed text-slate-500">
          {pending
            ? `Remove "${pending.blindDate ? "this blind date pick" : pending.title}" from your wishlist?`
            : "Remove this book from your wishlist?"}
        </p>
        <div className="modal-action">
          <ModalButton
            tone="secondary"
            onClick={() => {
              setPending(null);
              openModal(id);
            }}
          >
            Cancel
          </ModalButton>
          <ModalButton
            tone="danger"
            onClick={() => {
              if (pending) void removeBook(pending);
            }}
          >
            Delete
          </ModalButton>
        </div>
      </AppModal>

      <StatusModal
        id={feedback.id}
        variant={feedback.status.variant}
        title={feedback.status.title}
        message={feedback.status.message}
      />
    </>
  );
}

export async function loadWantToReadBooks(): Promise<WantToReadBook[]> {
  const response = await fetch("/api/users/shelf", { cache: "no-store" });
  const payload = await response.json();
  if (!response.ok) return [];

  const books = Array.isArray(payload?.data?.wantToRead)
    ? payload.data.wantToRead
    : [];

  return books.map(
    (book: {
      id: string | number;
      title: string;
      author: string;
      coverImage: string;
      category: string;
      blindDate?: boolean;
    }) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      coverImage: book.coverImage || "/svg/book.svg",
      category: book.category || "General",
      blindDate: Boolean(book.blindDate),
    }),
  );
}
