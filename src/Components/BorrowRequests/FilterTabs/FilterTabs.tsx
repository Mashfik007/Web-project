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
            className={`btn btn-sm ${
              isActive ? "btn-primary" : "btn-ghost"
            }`}
          >
            {filter.label}
            <span className={`badge badge-sm ${isActive ? "badge-ghost" : "badge-soft badge-info"}`}>
              {filter.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
