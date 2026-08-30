"use client";

import { useState } from "react";
import AdminPageShell from "@/Components/AdminCatalog/AdminPageShell/AdminPageShell";
import AdminTable from "@/Components/AdminCatalog/AdminTable/AdminTable";
import StatusBadge from "@/Components/AdminCatalog/StatusBadge/StatusBadge";
import BookCell from "@/Components/AdminOps/BookCell/BookCell";
import MemberCell from "@/Components/AdminOps/MemberCell/MemberCell";
import TextAction from "@/Components/AdminOps/TextAction/TextAction";
import {
  ConfirmModal,
  StatusModal,
  openModal,
  useFeedback,
} from "@/Components/Modal";
import type { AdminReservation } from "@/types/adminOps";

interface ReservationsPageProps {
  reservations: AdminReservation[];
}

export default function ReservationsPage({
  reservations,
}: ReservationsPageProps) {
  const [notifying, setNotifying] = useState<AdminReservation | null>(null);
  const [cancelling, setCancelling] = useState<AdminReservation | null>(null);
  const feedback = useFeedback();

  return (
    <AdminPageShell
      title="Reservations"
      subtitle="Hold queue for books that are currently on loan"
    >
      <AdminTable
        columns={[
          "Member",
          "Book",
          "Reserved Date",
          "Queue",
          "Est. Wait",
          "Status",
          "Actions",
        ]}
        from={1}
        to={reservations.length}
        total={reservations.length}
      >
        {reservations.map((item) => (
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
            <td className="px-4 py-3 text-slate-500">{item.reservedDate}</td>
            <td className="px-4 py-3">
              <span className="badge badge-soft badge-info badge-sm">
                #{item.queue}
              </span>
            </td>
            <td className="px-4 py-3 text-slate-500">{item.estWait}</td>
            <td className="px-4 py-3">
              <StatusBadge
                label={item.status}
                tone={
                  item.status === "Ready"
                    ? "green"
                    : item.status === "Expired"
                      ? "red"
                      : "sky"
                }
              />
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <TextAction
                  label="Notify"
                  tone="sky"
                  onClick={() => {
                    setNotifying(item);
                    openModal("notify-reservation");
                  }}
                />
                <TextAction
                  label="Cancel"
                  tone="red"
                  onClick={() => {
                    setCancelling(item);
                    openModal("cancel-reservation");
                  }}
                />
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      <ConfirmModal
        id="notify-reservation"
        title="Notify member"
        message={`Send a ready-for-pickup notice to ${notifying?.member} for "${notifying?.book}"?`}
        confirmLabel="Send notice"
        onConfirm={() => {
          const name = notifying?.member;
          setNotifying(null);
          feedback.success(
            "Notice sent",
            `${name} was notified that the book is ready.`,
          );
        }}
      />

      <ConfirmModal
        id="cancel-reservation"
        title="Cancel reservation"
        message={`Cancel ${cancelling?.member}'s hold on "${cancelling?.book}"?`}
        confirmLabel="Cancel hold"
        tone="danger"
        onConfirm={() => {
          setCancelling(null);
          feedback.success(
            "Reservation cancelled",
            "The hold was removed from the queue.",
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
