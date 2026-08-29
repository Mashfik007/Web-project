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
            className={`btn btn-sm ${
              isActive ? "btn-primary" : "btn-ghost"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
