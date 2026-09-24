"use client";

// incoming borrow requests — approve or reject
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminPageShell from "@/Components/AdminCatalog/AdminPageShell/AdminPageShell";
import AdminTable from "@/Components/AdminCatalog/AdminTable/AdminTable";
import StatusBadge from "@/Components/AdminCatalog/StatusBadge/StatusBadge";
import ViewButton from "@/Components/AdminCatalog/ViewButton/ViewButton";
import AdminFilterTabs from "@/Components/AdminOps/AdminFilterTabs/AdminFilterTabs";
import BookCell from "@/Components/AdminOps/BookCell/BookCell";
import MemberCell from "@/Components/AdminOps/MemberCell/MemberCell";
import TextAction from "@/Components/AdminOps/TextAction/TextAction";
import {
  ConfirmModal,
  StatusModal,
  openModal,
  useFeedback,
} from "@/Components/Modal";
import { decideBorrowRequest } from "@/Controller/admin.controller";
import type { AdminBorrowRequest, AdminBorrowStatus } from "@/types/adminOps";

interface BorrowRequestsPageProps {
  requests: AdminBorrowRequest[];
}

export default function BorrowRequestsPage({
  requests,
}: BorrowRequestsPageProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<"All" | AdminBorrowStatus>("All");
  const [confirm, setConfirm] = useState<{
    item: AdminBorrowRequest;
    action: "approve" | "reject";
  } | null>(null);
  const feedback = useFeedback();

  const visible = useMemo(
    () =>
      filter === "All"
        ? requests
        : requests.filter((item) => item.status === filter),
    [filter, requests],
  );

  const count = (status: AdminBorrowStatus) =>
    requests.filter((item) => item.status === status).length;

  return (
    <AdminPageShell
      title="Borrow Requests"
      subtitle="Review and action all borrowing requests"
    >
      <AdminFilterTabs
        active={filter}
        onChange={(id) => setFilter(id as typeof filter)}
        tabs={[
          { id: "All", label: "All", count: requests.length },
          { id: "Pending", label: "Pending", count: count("Pending") },
          { id: "Approved", label: "Approved", count: count("Approved") },
          { id: "Rejected", label: "Rejected", count: count("Rejected") },
        ]}
      />

      <AdminTable
        columns={[
          "Member",
          "Book",
          "Requested",
          "Expected Return",
          "Status",
          "Actions",
        ]}
        from={visible.length === 0 ? 0 : 1}
        to={visible.length}
        total={visible.length}
      >
        {visible.map((item) => (
          <tr key={item.id} className="text-sm">
            <td className="px-4 py-3">
              <MemberCell
                name={item.member}
                initials={item.initials}
                avatarClass={item.avatarClass}
              />
            </td>
            <td className="px-4 py-3">
              <BookCell title={item.book} />
            </td>
            <td className="px-4 py-3 text-slate-500">{item.requested}</td>
            <td className="px-4 py-3 text-slate-500">{item.expectedReturn}</td>
            <td className="px-4 py-3">
              <StatusBadge
                label={item.status}
                tone={
                  item.status === "Approved"
                    ? "green"
                    : item.status === "Rejected"
                      ? "red"
                      : "orange"
                }
              />
            </td>
            <td className="px-4 py-3">
              {item.status === "Pending" ? (
                <div className="flex items-center gap-2">
                  <TextAction
                    label="Approve"
                    tone="green"
                    onClick={() => {
                      setConfirm({ item, action: "approve" });
                      openModal("admin-borrow-confirm");
                    }}
                  />
                  <TextAction
                    label="Reject"
                    tone="red"
                    onClick={() => {
                      setConfirm({ item, action: "reject" });
                      openModal("admin-borrow-confirm");
                    }}
                  />
                </div>
              ) : (
                <ViewButton
                  onClick={() =>
                    feedback.success(
                      item.book,
                      `${item.member} · ${item.status} · requested ${item.requested}`,
                    )
                  }
                />
              )}
            </td>
          </tr>
        ))}
      </AdminTable>

      <ConfirmModal
        id="admin-borrow-confirm"
        title={
          confirm?.action === "approve" ? "Approve request" : "Reject request"
        }
        message={
          confirm
            ? `${confirm.action === "approve" ? "Approve" : "Reject"} ${confirm.item.member}'s request for "${confirm.item.book}"?`
            : ""
        }
        confirmLabel={confirm?.action === "approve" ? "Approve" : "Reject"}
        tone={confirm?.action === "approve" ? "success" : "danger"}
        onConfirm={() => {
          const current = confirm;
          setConfirm(null);
          if (!current) return;

          void decideBorrowRequest(current.item.id, current.action).then(
            (result) => {
              if (!result.ok) {
                feedback.failed(
                  current.action === "approve"
                    ? "Could not approve request"
                    : "Could not reject request",
                  result.message,
                );
                return;
              }
              feedback.success(
                current.action === "approve"
                  ? "Request approved"
                  : "Request rejected",
                result.message,
              );
              router.refresh();
            },
          );
        }}
      />

      <StatusModal
        id={feedback.id}
        variant={feedback.status.variant}
        title={feedback.status.title}
        message={feedback.status.message}
      />
    </AdminPageShell>
  );
}
