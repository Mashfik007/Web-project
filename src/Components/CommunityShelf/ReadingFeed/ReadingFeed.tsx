import heartIcon from "@svg/heart.svg";
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
                <Image
                  src={heartIcon}
                  alt="Favorite"
                  width={16}
                  height={16}
                  className="size-3"
                />
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
