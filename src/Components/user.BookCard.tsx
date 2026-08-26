import Image from "next/image";
import type { Book } from "@/types/book";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <div className="relative h-66 w-full overflow-hidden">
        <Image
          src={book.image}
          alt={book.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />

        {/* Format */}
        <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2 py-1 text-[8px] font-bold tracking-wider text-slate-600">
          {book.format}
        </span>

        {/* Image text */}
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-3 py-3">
          <p className="text-[9px] text-white">{book.title}</p>
          <p className="text-[8px] text-white/70">{book.author}</p>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h2 className="truncate text-sm font-bold text-slate-700">
          {book.title}
        </h2>

        <p className="mt-1 text-xs text-sky-700">{book.author}</p>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-1">
          <span className="text-xs tracking-tight text-sky-600">
            {"★".repeat(Math.round(book.rating))}
            {"☆".repeat(5 - Math.round(book.rating))}
          </span>

          <span className="text-[10px] text-slate-500">{book.rating}</span>
        </div>

        {/* Bottom */}
        <div className="mt-3 flex items-center justify-between">
          <span
            className={`rounded-full border px-2 py-1 text-[9px] font-medium ${
              book.availability === "Available"
                ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                : "border-amber-200 bg-amber-50 text-amber-600"
            }`}
          >
            {book.availability}
          </span>

          <span className="text-[9px] text-slate-500">{book.year}</span>
        </div>
      </div>
    </article>
  );
}
