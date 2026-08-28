"use client";

import type { OrderFilter, OrderStatus } from "@/types/myOrders";

interface OrderFilterTabsProps {
  filters: OrderFilter[];
  activeStatus: OrderStatus | "all";
  onChange: (status: OrderStatus | "all") => void;
}

export default function OrderFilterTabs({
  filters,
  activeStatus,
  onChange,
}: OrderFilterTabsProps) {
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
          </button>
        );
      })}
    </div>
  );
}
