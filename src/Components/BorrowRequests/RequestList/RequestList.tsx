"use client";

import { useMemo, useState } from "react";
import FilterTabs from "../FilterTabs/FilterTabs";
import RequestCard from "../RequestCard/RequestCard";
import type {
  BorrowRequestFilter,
  BorrowRequestStatus,
  IncomingBorrowRequest,
} from "@/types/borrowRequests";

interface RequestListProps {
  filters: BorrowRequestFilter[];
  requests: IncomingBorrowRequest[];
}

export default function RequestList({ filters, requests }: RequestListProps) {
  const [activeStatus, setActiveStatus] = useState<BorrowRequestStatus | "all">(
    "all",
  );

  const visibleRequests = useMemo(
    () =>
      activeStatus === "all"
        ? requests
        : requests.filter((request) => request.status === activeStatus),
    [activeStatus, requests],
  );

  const liveFilters = filters.map((filter) => ({
    ...filter,
    count:
      filter.status === "all"
        ? requests.length
        : requests.filter((request) => request.status === filter.status).length,
  }));

  return (
    <div className="space-y-5">
      <FilterTabs
        filters={liveFilters}
        activeStatus={activeStatus}
        onChange={setActiveStatus}
      />

      <div className="space-y-3">
        {visibleRequests.length === 0 ? (
          <div className="alert">
            <span className="text-sm">No requests in this category.</span>
          </div>
        ) : (
          visibleRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))
        )}
      </div>
    </div>
  );
}
