import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/types/book";

interface BookCardProps {
  book: Book;
  userId: string;
}

const digitalCoverClass: Record<string, string> = {
  Technology: "bg-sky-100 text-sky-600",
  Fiction: "bg-violet-100 text-violet-600",
  Science: "bg-amber-100 text-amber-600",
  "Non-Fiction": "bg-emerald-100 text-emerald-600",
};

export default function BookCard({ book, userId }: BookCardProps) {
  const href =
    book.format === "DIGITAL"
      ? `/user/${userId}/browsebook/digital/${book.id}`
      : `/user/${userId}/browsebook/${book.id}`;

  const coverClass =
    digitalCoverClass[book.category] ?? "bg-slate-100 text-slate-600";

  return (
    <Link
      href={href}
      className="block overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-66 w-full overflow-hidden">
        {book.format === "DIGITAL" ? (
          <div
            className={`flex h-full w-full items-center justify-center ${coverClass}`}
          >
            <Image
              src="/svg/book.svg"
              alt={book.title}
              width={48}
              height={48}
              className="size-12 opacity-80"
            />
          </div>
        ) : (
          <Image
            src={book.image}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        )}

        <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2 py-1 text-[8px] font-bold tracking-wider text-slate-600">
          {book.format === "DIGITAL"
            ? (book.digitalFormat ?? "DIGITAL")
            : book.format}
        </span>

        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-3 py-3">
          <p className="text-[9px] text-white">{book.title}</p>
          <p className="text-[8px] text-white/70">{book.author}</p>
        </div>
      </div>

      <div className="p-3">
        <h2 className="truncate text-sm font-bold text-slate-700">
          {book.title}
        </h2>

        <p className="mt-1 text-xs text-sky-700">{book.author}</p>

        {book.format === "DIGITAL" ? (
          <div className="mt-3 flex items-center gap-1 text-[10px] text-slate-500">
            <span>{book.category}</span>
            {book.sizeLabel ? (
              <>
                <span>·</span>
                <span>{book.sizeLabel}</span>
              </>
            ) : null}
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-1">
            <span className="text-xs tracking-tight text-sky-600">
              {"★".repeat(Math.round(book.rating))}
              {"☆".repeat(5 - Math.round(book.rating))}
            </span>
            <span className="text-[10px] text-slate-500">{book.rating}</span>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span
            className={`badge badge-xs ${
              book.availability === "Available"
                ? "badge-soft badge-success"
                : "badge-soft badge-warning"
            }`}
          >
            {book.availability}
          </span>

          <span className="text-[9px] text-slate-500">{book.year}</span>
        </div>
      </div>
    </Link>
  );
}
