"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ConfirmModal,
  FormField,
  FormModal,
  StatusModal,
  formHasValues,
  openModal,
  useFeedback,
} from "@/Components/Modal";
import type { BookDetails } from "@/types/bookDetails";

interface BookSidebarProps {
  userId: string;
  book: Pick<
    BookDetails,
    "id" | "title" | "author" | "coverImage" | "availability"
  >;
}

export default function BookSidebar({ userId, book }: BookSidebarProps) {
  const router = useRouter();
  const feedback = useFeedback();

  async function saveToShelf(path: "borrow" | "wishlist", returnDate?: string) {
    const response = await fetch(`/api/users/shelf/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        bookId: String(book.id),
        returnDate,
      }),
    });
    const payload = await response.json();
    if (!response.ok) {
      feedback.failed("Could not update shelf", payload.message || "Request failed");
      return;
    }

    feedback.success(
      path === "borrow" ? "Borrow saved" : "Wishlist saved",
      payload.message,
    );
    router.refresh();
  }

  async function copyShareLink() {
    const url = `${window.location.origin}/user/${userId}/browsebook/${book.id}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement("textarea");
        input.value = url;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      feedback.success("Link copied", "You can paste it anywhere.");
    } catch {
      feedback.failed("Could not copy link", "Copy this link manually: " + url);
    }
  }

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
        onClick={() => openModal("borrow-book")}
        className="btn btn-primary btn-block"
      >
        Borrow This Book
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            void saveToShelf("wishlist");
          }}
          className="btn btn-ghost"
        >
          Wishlist
        </button>
        <button
          type="button"
          onClick={() => openModal("share-book")}
          className="btn btn-ghost"
        >
          Share
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className={`size-2 rounded-full ${
              book.availability.current > 0 ? "bg-emerald-500" : "bg-rose-500"
            }`}
          />
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
        <p className="mt-1 text-xs text-slate-400">
          {book.availability.current > 0
            ? "In stock from library inventory"
            : "Currently out of stock"}
        </p>
      </div>

      <FormModal
        id="borrow-book"
        title="Borrow this book"
        submitLabel="Send request"
        onSubmit={async (form) => {
          if (!formHasValues(form, ["returnDate"])) {
            feedback.failed(
              "Request not sent",
              "Choose an expected return date.",
            );
            return;
          }
          await saveToShelf(
            "borrow",
            String(new FormData(form).get("returnDate") ?? ""),
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
        id="share-book"
        title="Share this title"
        message={`Copy a Folio link for "${book.title}" to send to a friend.`}
        confirmLabel="Copy link"
        onConfirm={() => {
          void copyShareLink();
        }}
      />

      <StatusModal
        id={feedback.id}
        variant={feedback.status.variant}
        title={feedback.status.title}
        message={feedback.status.message}
      />
    </aside>
  );
}
