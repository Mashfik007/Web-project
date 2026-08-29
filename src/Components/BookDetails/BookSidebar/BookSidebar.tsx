"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ConfirmModal,
  FormField,
  FormModal,
  StatusModal,
  formHasValues,
  useFeedback,
} from "@/Components/Modal/AppModal";
import type { BookDetails } from "@/types/bookDetails";

interface BookSidebarProps {
  book: Pick<BookDetails, "title" | "author" | "coverImage" | "availability">;
}

export default function BookSidebar({ book }: BookSidebarProps) {
  const [borrowing, setBorrowing] = useState(false);
  const [sharing, setSharing] = useState(false);
  const feedback = useFeedback();

  return (
    <aside className="flex flex-col gap-4">
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl shadow-md">
        <Image
          src={book.coverImage}
          alt={`${book.title} cover`}
          fill
          sizes="(max-width: 768px) 100vw, 280px"
          className="object-cover"
          priority
        />
      </div>

      <button
        type="button"
        onClick={() => setBorrowing(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
      >
        Borrow This Book
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() =>
            feedback.success(
              "Added to wishlist",
              `"${book.title}" is now on your shelf.`,
            )
          }
          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
        >
          Wishlist
        </button>
        <button
          type="button"
          onClick={() => setSharing(true)}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
        >
          Share
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500" />
          <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Copies Available
          </p>
        </div>
        <p className="mt-1 text-sm font-semibold text-slate-800">
          {book.availability.current}{" "}
          <span className="font-normal text-slate-500">
            of {book.availability.total}
          </span>
        </p>
      </div>

      <FormModal
        open={borrowing}
        onClose={() => setBorrowing(false)}
        title="Borrow this book"
        submitLabel="Send request"
        onSubmit={(form) => {
          if (!formHasValues(form, ["returnDate"])) {
            setBorrowing(false);
            feedback.failed(
              "Request not sent",
              "Choose an expected return date.",
            );
            return;
          }
          setBorrowing(false);
          feedback.success(
            "Borrow request sent",
            `We'll notify you when "${book.title}" is approved.`,
          );
        }}
      >
        <p className="text-sm text-slate-500">
          Request <b>{book.title}</b> by {book.author}.
        </p>
        <FormField
          label="Expected return"
          name="returnDate"
          type="date"
          defaultValue={new Date(Date.now() + 14 * 86400000)
            .toISOString()
            .slice(0, 10)}
        />
      </FormModal>

      <ConfirmModal
        open={sharing}
        onClose={() => setSharing(false)}
        title="Share this title"
        message={`Copy a Folio link for "${book.title}" to send to a friend.`}
        confirmLabel="Copy link"
        onConfirm={() => {
          setSharing(false);
          feedback.success("Link copied", "You can paste it anywhere.");
        }}
      />

      <StatusModal
        open={feedback.status !== null}
        onClose={feedback.closeStatus}
        variant={feedback.status?.variant ?? "success"}
        title={feedback.status?.title ?? ""}
        message={feedback.status?.message ?? ""}
      />
    </aside>
  );
}
