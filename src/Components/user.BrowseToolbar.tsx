interface BrowseToolbarProps {
  total: number;
}

export default function BrowseToolbar({ total }: BrowseToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-700">{total}</span>{" "}
        results
      </p>

      <select className="select select-sm rounded-xl border-slate-200 bg-white text-sm text-slate-600">
        <option>Most Relevant</option>
        <option>Highest Rated</option>
        <option>Newest First</option>
        <option>Oldest First</option>
        <option>Title A-Z</option>
      </select>
    </div>
  );
}
