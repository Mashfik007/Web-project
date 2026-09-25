"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { StatusModal, useFeedback } from "@/Components/Modal";
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
  const router = useRouter();
  const feedback = useFeedback();
  const [activeStatus, setActiveStatus] = useState<BorrowRequestStatus | "all">("all");
  const [busyId, setBusyId] = useState("");

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

  async function respond(id: string, action: "approve" | "decline") {
    setBusyId(id);
    try {
      const response = await fetch("/api/users/community/borrow/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: id, action }),
      });
      const payload = await response.json();
      if (!response.ok) {
        feedback.failed("Borrow request", payload.message || "Could not update the request");
        return;
      }
      feedback.success("Borrow request", payload.message || "Updated");
      router.refresh();
    } catch {
      feedback.failed("Borrow request", "Could not reach the server.");
    } finally {
      setBusyId("");
    }
  }

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
            <RequestCard
              key={request.id}
              request={request}
              onApprove={
                request.direction === "received" &&
                request.status === "pending" &&
                busyId !== request.id
                  ? (id) => {
                      void respond(id, "approve");
                    }
                  : undefined
              }
              onDecline={
                request.direction === "received" &&
                request.status === "pending" &&
                busyId !== request.id
                  ? (id) => {
                      void respond(id, "decline");
                    }
                  : undefined
              }
            />
          ))
        )}
      </div>

      <StatusModal
        id={feedback.id}
        variant={feedback.status.variant}
        title={feedback.status.title}
        message={feedback.status.message}
      />
    </div>
  );
}
