"use client";

// incoming borrow requests — approve or reject
import { useEffect, useMemo, useState } from "react";
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
  FormField,
  FormModal,
  StatusModal,
  formHasValues,
  openModal,
  useFeedback,
} from "@/Components/Modal";
import { decideBorrowRequest } from "@/Controller/admin.controller";
import { getChatSocket } from "@/lib/chatSocket";
import type { AdminBorrowRequest, AdminBorrowStatus } from "@/types/adminOps";
import type { BorrowUpdatePayload } from "@/types/realtime";

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

  useEffect(() => {
    const socket = getChatSocket();

    function syncRooms() {
      socket.emit("rooms:sync");
    }

    function onBorrowUpdate(update: BorrowUpdatePayload) {
      if (!update?.id || update.scope !== "library") return;
      if (update.action === "created") {
        feedback.success(
          "New borrow request",
          `${update.member} requested "${update.book}".`,
        );
      }
      router.refresh();
    }

    socket.on("connect", syncRooms);
    socket.on("borrow:update", onBorrowUpdate);
    if (socket.connected) syncRooms();

    return () => {
      socket.off("connect", syncRooms);
      socket.off("borrow:update", onBorrowUpdate);
    };
  }, [router]);

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
                      openModal("admin-borrow-reject");
                    }}
                  />
                </div>
              ) : (
                <ViewButton
                  onClick={() =>
                    feedback.success(
                      item.book,
                      `${item.member} · ${item.status} · requested ${item.requested}${
                        item.reason ? ` · ${item.reason}` : ""
                      }`,
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
        title="Approve request"
        message={
          confirm
            ? `Approve ${confirm.item.member}'s request for "${confirm.item.book}"? It will show under Currently Reading.`
            : ""
        }
        confirmLabel="Approve"
        tone="success"
        onConfirm={() => {
          const current = confirm;
          setConfirm(null);
          if (!current) return;

          void decideBorrowRequest(current.item.id, "approve").then((result) => {
            if (!result.ok) {
              feedback.failed("Could not approve request", result.message);
              return;
            }
            feedback.success("Request approved", result.message);
            router.refresh();
          });
        }}
      />

      <FormModal
        id="admin-borrow-reject"
        title="Reject request"
        submitLabel="Reject"
        onSubmit={async (form) => {
          if (!formHasValues(form, ["reason"])) {
            feedback.failed(
              "Could not reject request",
              "Write a reason before rejecting.",
            );
            return;
          }

          const current = confirm;
          setConfirm(null);
          if (!current) return;

          const reason = String(new FormData(form).get("reason") ?? "").trim();
          const result = await decideBorrowRequest(
            current.item.id,
            "reject",
            reason,
          );
          if (!result.ok) {
            feedback.failed("Could not reject request", result.message);
            return;
          }
          feedback.success("Request rejected", result.message);
          router.refresh();
        }}
      >
        <p className="text-sm text-slate-500">
          {confirm
            ? `Reject ${confirm.item.member}'s request for "${confirm.item.book}".`
            : "This book will not be added to Currently Reading."}
        </p>
        <FormField
          label="Reason"
          name="reason"
          as="textarea"
          placeholder="Why is this request being rejected?"
          required
        />
      </FormModal>

      <StatusModal
        id={feedback.id}
        variant={feedback.status.variant}
        title={feedback.status.title}
        message={feedback.status.message}
      />
    </AdminPageShell>
  );
}
