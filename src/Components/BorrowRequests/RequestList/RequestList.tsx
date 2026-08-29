"use client";

import { useMemo, useState } from "react";
import FilterTabs from "../FilterTabs/FilterTabs";
import RequestCard from "../RequestCard/RequestCard";
import {
  ConfirmModal,
  StatusModal,
  useFeedback,
} from "@/Components/Modal/AppModal";
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
    "pending",
  );
  const [localRequests, setLocalRequests] = useState(requests);
  const [confirm, setConfirm] = useState<{
    id: string;
    action: "approve" | "decline";
    title: string;
  } | null>(null);
  const feedback = useFeedback();

  const visibleRequests = useMemo(
    () =>
      activeStatus === "all"
        ? localRequests
        : localRequests.filter((request) => request.status === activeStatus),
    [activeStatus, localRequests],
  );

  function handleApprove(id: string) {
    setLocalRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status: "approved" as const } : request,
      ),
    );
  }

  function handleDecline(id: string) {
    setLocalRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status: "declined" as const } : request,
      ),
    );
  }

  const liveFilters = filters.map((filter) => ({
    ...filter,
    count:
      filter.status === "all"
        ? localRequests.length
        : localRequests.filter((request) => request.status === filter.status)
            .length,
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
          <div className="alert rounded-2xl border border-slate-200 bg-white shadow-sm">
            <span className="text-sm text-slate-500">
              No requests in this category.
            </span>
          </div>
        ) : (
          visibleRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onApprove={(id) =>
                setConfirm({
                  id,
                  action: "approve",
                  title: request.bookTitle,
                })
              }
              onDecline={(id) =>
                setConfirm({
                  id,
                  action: "decline",
                  title: request.bookTitle,
                })
              }
            />
          ))
        )}
      </div>

      <ConfirmModal
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        title={confirm?.action === "approve" ? "Approve request" : "Decline request"}
        message={
          confirm
            ? `${confirm.action === "approve" ? "Approve" : "Decline"} the request for "${confirm.title}"?`
            : ""
        }
        confirmLabel={confirm?.action === "approve" ? "Approve" : "Decline"}
        tone={confirm?.action === "approve" ? "success" : "danger"}
        onConfirm={() => {
          if (!confirm) return;
          if (confirm.action === "approve") handleApprove(confirm.id);
          else handleDecline(confirm.id);
          const title = confirm.title;
          const action = confirm.action;
          setConfirm(null);
          feedback.success(
            action === "approve" ? "Request approved" : "Request declined",
            `"${title}" was ${action === "approve" ? "approved" : "declined"}.`,
          );
        }}
      />

      <StatusModal
        open={feedback.status !== null}
        onClose={feedback.closeStatus}
        variant={feedback.status?.variant ?? "success"}
        title={feedback.status?.title ?? ""}
        message={feedback.status?.message ?? ""}
      />
    </div>
  );
}
