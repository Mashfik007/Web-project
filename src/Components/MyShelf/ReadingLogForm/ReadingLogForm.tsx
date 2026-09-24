"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import type { ShelfBook } from "@/types/myShelf";

interface ReadingLogFormProps {
  userId: string;
  books: ShelfBook[];
}

export default function ReadingLogForm({ userId, books }: ReadingLogFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const loanId = String(form.get("loanId") ?? "");
    const page = Number(form.get("page"));

    setPending(true);
    setMessage("");

    try {
      const response = await fetch("/api/users/shelf/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, loanId, page }),
      });
      const payload = await response.json();
      setMessage(payload.message || "Could not save reading activity");
      if (response.ok) router.refresh();
    } catch {
      setMessage("Could not reach the server.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-sm font-semibold text-slate-800">Log reading</h2>
      <p className="mt-1 text-xs text-slate-500">
        Each save records 1 hour and your current page.
      </p>

      {books.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          Borrow a book before logging reading time.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          <label className="block text-xs font-medium text-slate-600">
            Book
            <select name="loanId" className="select select-sm mt-1 w-full" required>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-xs font-medium text-slate-600">
            Current page
            <input
              name="page"
              type="number"
              min={0}
              required
              defaultValue={books[0]?.currentPage ?? 0}
              className="input input-sm mt-1 w-full"
            />
          </label>

          <button type="submit" disabled={pending} className="btn btn-primary btn-sm">
            Log 1 hour
          </button>
        </div>
      )}

      {message ? <p className="mt-3 text-xs text-slate-500">{message}</p> : null}
    </form>
  );
}
