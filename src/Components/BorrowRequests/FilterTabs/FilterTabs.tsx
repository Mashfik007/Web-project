"use client";

import type { BorrowRequestFilter, BorrowRequestStatus } from "@/types/borrowRequests";

interface FilterTabsProps {
  filters: BorrowRequestFilter[];
  activeStatus: BorrowRequestStatus | "all";
  onChange: (status: BorrowRequestStatus | "all") => void;
}

export default function FilterTabs({
  filters,
  activeStatus,
  onChange,
}: FilterTabsProps) {
  return (
    <div role="tablist" className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = activeStatus === filter.status;

        return (
          <button
            key={filter.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter.status)}
            className={`btn btn-sm h-9 min-h-0 rounded-full border-0 px-4 ${
              isActive
                ? "bg-sky-500 text-white hover:bg-sky-600"
                : "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
            }`}
          >
            {filter.label}
            <span
              className={`badge badge-sm ml-1.5 border-0 ${
                isActive
                  ? "bg-white/25 text-white"
                  : "bg-sky-100 text-sky-700"
              }`}
            >
              {filter.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
