"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  AppModal,
  FormField,
  FormModal,
  ModalButton,
  StatusModal,
  closeModal,
  formHasValues,
  openModal,
  useFeedback,
} from "@/Components/Modal";

export type WantToReadBook = {
  id: string | number;
  bookId: string;
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
  hasActiveReading?: boolean;
  onBooksChange?: (books: WantToReadBook[]) => void;
}

export default function WantToReadModal({
  id = "want-to-read",
  userId,
  books,
  hasActiveReading = false,
  onBooksChange,
}: WantToReadModalProps) {
  const feedback = useFeedback();
  const [pending, setPending] = useState<WantToReadBook | null>(null);
  const [borrowTarget, setBorrowTarget] = useState<WantToReadBook | null>(null);
  const removeId = "want-to-read-remove";
  const borrowId = "want-to-read-borrow";

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

  async function requestBorrow(form: HTMLFormElement) {
    if (!borrowTarget) return false;

    if (hasActiveReading) {
      feedback.failed(
        "Request blocked",
        "Finish and return your current book before requesting another.",
      );
      return false;
    }

    if (!formHasValues(form, ["returnDate"])) {
      feedback.failed("Request not sent", "Choose an expected return date.");
      return false;
    }

    try {
      const response = await fetch("/api/users/shelf/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          bookId: borrowTarget.bookId,
          returnDate: String(new FormData(form).get("returnDate") ?? ""),
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        feedback.failed(
          "Request not sent",
          payload.message || "Could not send borrow request.",
        );
        return false;
      }

      feedback.success(
        "Request sent",
        payload.message ||
          "Your borrow request was sent. It appears under Currently Reading after approval.",
      );
      openModal(id);
      return true;
    } catch {
      feedback.failed("Request not sent", "Could not reach the server.");
      return false;
    }
  }

  return (
    <>
      <AppModal id={id} title="Want to Read">
        <p className="mb-4 text-sm text-slate-500">
          Books waiting on your shelf
          {books.length > 0 ? ` · ${books.length}` : ""}.
        </p>

        {hasActiveReading ? (
          <p className="mb-4 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Finish and return your current book before requesting a Blind Date
            or Want to Read title.
          </p>
        ) : null}

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
                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    type="button"
                    disabled={hasActiveReading || !book.bookId}
                    title={
                      hasActiveReading
                        ? "Finish and return your current book first"
                        : "Send a borrow request"
                    }
                    className="btn btn-primary btn-soft btn-xs"
                    onClick={() => {
                      setBorrowTarget(book);
                      openModal(borrowId);
                    }}
                  >
                    Borrow
                  </button>
                  <button
                    type="button"
                    className="btn btn-error btn-soft btn-xs"
                    onClick={() => {
                      setPending(book);
                      openModal(removeId);
                    }}
                  >
                    Remove
                  </button>
                </div>
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

      <FormModal
        id={borrowId}
        title="Borrow request"
        submitLabel="Send request"
        onSubmit={requestBorrow}
      >
        <p className="text-sm text-slate-500">
          Request{" "}
          <b>
            {borrowTarget?.blindDate
              ? "your blind date surprise"
              : borrowTarget?.title || "this book"}
          </b>
          .
        </p>
        {hasActiveReading ? (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Finish and return your current book before sending this request.
          </p>
        ) : null}
        <FormField
          label="Expected return"
          name="returnDate"
          type="date"
          defaultValue={new Date(Date.now() + 14 * 86400000)
            .toISOString()
            .slice(0, 10)}
          required
        />
      </FormModal>

      <StatusModal
        id={feedback.id}
        variant={feedback.status.variant}
        title={feedback.status.title}
        message={feedback.status.message}
      />
    </>
  );
}

export async function loadWantToReadBooks(): Promise<{
  books: WantToReadBook[];
  hasActiveReading: boolean;
}> {
  const response = await fetch("/api/users/shelf", { cache: "no-store" });
  const payload = await response.json();
  if (!response.ok) return { books: [], hasActiveReading: false };

  const books = Array.isArray(payload?.data?.wantToRead)
    ? payload.data.wantToRead
    : [];
  const reading = Array.isArray(payload?.data?.currentlyReading)
    ? payload.data.currentlyReading
    : [];

  return {
    hasActiveReading: reading.length > 0,
    books: books.map(
      (book: {
        id: string | number;
        bookId?: string;
        title: string;
        author: string;
        coverImage: string;
        category: string;
        blindDate?: boolean;
      }) => ({
        id: book.id,
        bookId: book.bookId || "",
        title: book.title,
        author: book.author,
        coverImage: book.coverImage || "/svg/book.svg",
        category: book.category || "General",
        blindDate: Boolean(book.blindDate),
      }),
    ),
  };
}
