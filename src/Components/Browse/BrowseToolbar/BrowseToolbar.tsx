"use client";

import Image from "next/image";

interface BrowseToolbarProps {
  total: number;
  sort: string;
  query: string;
  onSortChange: (value: string) => void;
  onQueryChange: (value: string) => void;
}

export default function BrowseToolbar({
  total,
  sort,
  query,
  onSortChange,
  onQueryChange,
}: BrowseToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-700">{total}</span>{" "}
        results
      </p>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="input input-sm flex w-full items-center gap-2 sm:w-64">
          <Image
            src="/svg/search.svg"
            alt=""
            width={14}
            height={14}
            className="size-3.5 shrink-0 opacity-50"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search title, author..."
            className="grow"
            aria-label="Search books"
          />
        </label>

        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="select select-sm"
        >
          <option>Most Relevant</option>
          <option>Highest Rated</option>
          <option>Newest First</option>
          <option>Oldest First</option>
          <option>Title A-Z</option>
        </select>
      </div>
    </div>
  );
}
