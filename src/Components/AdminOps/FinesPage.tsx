"use client";

import { useState } from "react";
import {
  AdminPageShell,
  AdminTable,
  StatusBadge,
  ViewButton,
} from "@/Components/AdminCatalog/AdminCatalogUi";
import { AdminCard, MemberCell, TextAction } from "@/Components/AdminOps/AdminOpsUi";
import {
  ConfirmModal,
  FormField,
  FormModal,
  StatusModal,
  formHasValues,
  useFeedback,
} from "@/Components/Modal/AppModal";
import type { AdminFine, AdminFineSummary } from "@/types/adminOps";

interface FinesPageProps {
  summary: AdminFineSummary;
  fines: AdminFine[];
}

const cards = [
  { key: "totalCollected", label: "Total Collected", icon: "✓", color: "text-emerald-500 bg-emerald-50" },
  { key: "pendingAmount", label: "Pending Amount", icon: "◷", color: "text-orange-500 bg-orange-50" },
  { key: "waived", label: "Waived", icon: "↺", color: "text-violet-500 bg-violet-50" },
  { key: "thisMonth", label: "This Month", icon: "↗", color: "text-sky-500 bg-sky-50" },
] as const;

export default function FinesPage({ summary, fines }: FinesPageProps) {
  const [adding, setAdding] = useState(false);
  const [paying, setPaying] = useState<AdminFine | null>(null);
  const [waiving, setWaiving] = useState<AdminFine | null>(null);
  const feedback = useFeedback();

  return (
    <AdminPageShell
      title="Fines"
      subtitle="Track and manage overdue and damage fines"
      addLabel="Add Fine"
      onAdd={() => setAdding(true)}
      framed={false}
    >
      <div className="mb-5 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.key}
            className="card bg-base-100 p-4 shadow-sm"
          >
            <span
              className={`flex size-9 items-center justify-center rounded-lg text-sm font-bold ${card.color}`}
            >
              {card.icon}
            </span>
            <p className="mt-3 text-xl font-bold text-slate-800">
              ৳{summary[card.key].toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-slate-500">{card.label}</p>
          </article>
        ))}
      </div>

      <AdminCard>
        <AdminTable
          columns={[
            "Member",
            "Book",
            "Type",
            "Amount",
            "Date",
            "Status",
            "Actions",
          ]}
          from={1}
          to={fines.length}
          total={fines.length}
        >
          {fines.map((fine) => (
            <tr key={fine.id} className="text-sm">
              <td className="px-4 py-3">
                <MemberCell
                  name={fine.member}
                  initials={fine.initials}
                  avatarClass={fine.avatarClass}
                />
              </td>
              <td className="px-4 py-3 text-slate-700">{fine.book}</td>
              <td className="px-4 py-3">
                <StatusBadge
                  label={fine.type}
                  tone={
                    fine.type === "Overdue"
                      ? "orange"
                      : fine.type === "Damage"
                        ? "red"
                        : "slate"
                  }
                />
              </td>
              <td className="px-4 py-3 font-medium text-slate-800">
                ৳{fine.amount}
              </td>
              <td className="px-4 py-3 text-slate-500">{fine.date}</td>
              <td className="px-4 py-3">
                <StatusBadge
                  label={fine.status}
                  tone={
                    fine.status === "Paid"
                      ? "green"
                      : fine.status === "Waived"
                        ? "purple"
                        : "orange"
                  }
                />
              </td>
              <td className="px-4 py-3">
                {fine.status === "Pending" ? (
                  <div className="flex items-center gap-2">
                    <TextAction
                      label="Pay"
                      tone="green"
                      onClick={() => setPaying(fine)}
                    />
                    <TextAction
                      label="Waive"
                      tone="slate"
                      onClick={() => setWaiving(fine)}
                    />
                  </div>
                ) : (
                  <ViewButton
                    onClick={() =>
                      feedback.success(
                        fine.book,
                        `${fine.member} · ৳${fine.amount} · ${fine.status}`,
                      )
                    }
                  />
                )}
              </td>
            </tr>
          ))}
        </AdminTable>
      </AdminCard>

      <FormModal
        open={adding}
        onClose={() => setAdding(false)}
        title="Add Fine"
        submitLabel="Add Fine"
        onSubmit={(form) => {
          if (!formHasValues(form, ["member", "book", "type", "amount", "date"])) {
            setAdding(false);
            feedback.failed("Could not add fine", "Please complete every field.");
            return;
          }
          setAdding(false);
          feedback.success("Fine added", "The fine was recorded successfully.");
        }}
      >
        <FormField label="Member" name="member" placeholder="Member name" />
        <FormField label="Book" name="book" placeholder="Book title" />
        <FormField
          label="Type"
          name="type"
          as="select"
          options={["Overdue", "Damage", "Lost"]}
        />
        <FormField label="Amount" name="amount" type="number" placeholder="0" />
        <FormField label="Date" name="date" type="date" />
      </FormModal>

      <ConfirmModal
        open={paying !== null}
        onClose={() => setPaying(null)}
        title="Collect payment"
        message={`Mark ৳${paying?.amount ?? 0} from ${paying?.member} as paid?`}
        confirmLabel="Mark paid"
        tone="success"
        onConfirm={() => {
          setPaying(null);
          feedback.success("Payment recorded", "The fine was marked as paid.");
        }}
      />

      <ConfirmModal
        open={waiving !== null}
        onClose={() => setWaiving(null)}
        title="Waive fine"
        message={`Waive ৳${waiving?.amount ?? 0} for ${waiving?.member}?`}
        confirmLabel="Waive"
        tone="danger"
        onConfirm={() => {
          setWaiving(null);
          feedback.success("Fine waived", "The fine was waived.");
        }}
      />

      <StatusModal
        open={feedback.status !== null}
        onClose={feedback.closeStatus}
        variant={feedback.status?.variant ?? "success"}
        title={feedback.status?.title ?? ""}
        message={feedback.status?.message ?? ""}
      />
    </AdminPageShell>
  );
}
