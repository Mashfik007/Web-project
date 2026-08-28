import Image from "next/image";
import type { ReadingFeedItem } from "@/types/communityShelf";

interface ReadingFeedProps {
  items: ReadingFeedItem[];
}

export default function ReadingFeed({ items }: ReadingFeedProps) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-emerald-500" />
        <h3 className="text-sm font-semibold text-slate-800">
          Currently Reading
        </h3>
      </div>

      <ul className="mt-4 space-y-5">
        {items.map((item) => (
          <li
            key={item.id}
            className="border-b border-slate-100 pb-5 last:border-0 last:pb-0"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${item.avatarColor}`}
                >
                  {item.initials}
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    {item.userName}
                  </p>
                  <p className="text-[10px] text-slate-400">{item.timeAgo}</p>
                </div>
              </div>

              <button
                type="button"
                className="flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-rose-500"
              >
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
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                Like
              </button>
            </div>

            <div className="mt-3 flex gap-3">
              <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md">
                <Image
                  src={item.book.coverImage}
                  alt={item.book.title}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-800">
                  {item.book.title}
                </p>
                <p className="truncate text-[10px] text-slate-500">
                  {item.book.author}
                </p>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sky-100">
                  <div
                    className="h-full rounded-full bg-sky-500"
                    style={{ width: `${item.progressPercent}%` }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-sky-600">
                  {item.progressPercent}% complete
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-500 italic">
              &ldquo;{item.quote}&rdquo;
            </p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
