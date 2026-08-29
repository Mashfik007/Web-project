"use client";

interface BrowseToolbarProps {
  total: number;
  sort: string;
  onSortChange: (value: string) => void;
}

export default function BrowseToolbar({
  total,
  sort,
  onSortChange,
}: BrowseToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-700">{total}</span>{" "}
        results
      </p>

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
  );
}
