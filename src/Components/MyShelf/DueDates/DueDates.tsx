import clockIcon from "@svg/clock.svg";
import Image from "next/image";
import type { DueDateItem } from "@/types/myShelf";

interface DueDatesProps {
  dueDates: DueDateItem[];
}

export default function DueDates({ dueDates }: DueDatesProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
          <Image
            src={clockIcon}
            alt="Time"
            width={16}
            height={16}
            className="size-4"
          />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">Due Dates</h3>
      </div>

      <ul className="mt-4 space-y-3">
        {dueDates.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <div className="relative size-10 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={item.coverImage}
                alt={item.title}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
              {item.title}
            </p>
            <span className="shrink-0 rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-semibold text-sky-700">
              {item.dueDate}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
