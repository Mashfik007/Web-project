"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { DigitalFileFormat } from "@/types/book";

export type DigitalBookDetailsData = {
  id: string;
  title: string;
  author: string;
  format: DigitalFileFormat;
  category: string;
  fileId: string;
  sizeLabel: string;
  downloads: number;
  year: number;
};

interface DigitalBookDetailsProps {
  book: DigitalBookDetailsData;
  backHref: string;
}

const coverByCategory: Record<string, string> = {
  Technology: "bg-sky-100 text-sky-600",
  Fiction: "bg-violet-100 text-violet-600",
  Science: "bg-amber-100 text-amber-600",
  "Non-Fiction": "bg-emerald-100 text-emerald-600",
};

export default function DigitalBookDetails({
  book,
  backHref,
}: DigitalBookDetailsProps) {
  const [downloads, setDownloads] = useState(book.downloads);
  const [busy, setBusy] = useState(false);
  const coverClass =
    coverByCategory[book.category] ?? "bg-slate-100 text-slate-600";

  async function openFile(asDownload: boolean) {
    if (busy) return;
    setBusy(true);
    try {
      const response = await fetch("/api/users/digital-resources/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: book.id }),
      });
      if (response.ok) {
        const payload = await response.json();
        if (typeof payload?.data?.downloads === "number") {
          setDownloads(payload.data.downloads);
        }
      }
    } catch {
      // Still open the file even if the counter update fails.
    } finally {
      setBusy(false);
    }

    const url = asDownload
      ? `/api/uploads/${book.fileId}?download=1`
      : `/api/uploads/${book.fileId}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="min-h-screen w-full bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-6 md:px-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-sm text-sky-700 hover:underline"
        >
          ← Back to Browse
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[220px_minmax(0,1fr)]">
          <div
            className={`relative flex aspect-3/4 items-center justify-center overflow-hidden rounded-2xl shadow-md ${coverClass}`}
          >
            <Image
              src="/svg/book.svg"
              alt={book.title}
              width={64}
              height={64}
              className="size-16 opacity-80"
            />
            <span
              className={`badge absolute top-3 right-3 ${
                book.format === "PDF" ? "badge-error" : "badge-secondary"
              }`}
            >
              {book.format}
            </span>
          </div>

          <div>
            <span className="badge badge-soft badge-info badge-sm">
              {book.category}
            </span>

            <h1 className="mt-4 font-serif text-4xl font-bold text-slate-800">
              {book.title}
            </h1>
            <p className="mt-2 text-base text-slate-500">by {book.author}</p>

            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-600">
              This {book.format} is available to read online or download from
              the digital library.
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <dt className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  Format
                </dt>
                <dd className="mt-1 font-semibold text-slate-800">
                  {book.format}
                </dd>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <dt className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  Size
                </dt>
                <dd className="mt-1 font-semibold text-slate-800">
                  {book.sizeLabel}
                </dd>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <dt className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  Downloads
                </dt>
                <dd className="mt-1 font-semibold text-slate-800">
                  {downloads}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-3">
              {book.format === "PDF" ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void openFile(false)}
                  className="btn btn-primary"
                >
                  Read Online
                </button>
              ) : null}
              <button
                type="button"
                disabled={busy}
                onClick={() => void openFile(true)}
                className="btn btn-outline"
              >
                Download {book.format}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
