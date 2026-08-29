"use client";

import { useMemo, useState } from "react";
import AdminPageShell from "@/Components/AdminCatalog/AdminPageShell/AdminPageShell";
import AdminTable from "@/Components/AdminCatalog/AdminTable/AdminTable";
import StatusBadge from "@/Components/AdminCatalog/StatusBadge/StatusBadge";
import ViewButton from "@/Components/AdminCatalog/ViewButton/ViewButton";
import AdminFilterTabs from "@/Components/AdminOps/AdminFilterTabs/AdminFilterTabs";
import BookCell from "@/Components/AdminOps/BookCell/BookCell";
import MemberCell from "@/Components/AdminOps/MemberCell/MemberCell";
import TextAction from "@/Components/AdminOps/TextAction/TextAction";
import {
  FormField,
  FormModal,
  StatusModal,
  openModal,
  useFeedback,
} from "@/Components/Modal";
import type { AdminReturnRecord, AdminReturnStatus } from "@/types/adminOps";

interface ReturnsPageProps {
  records: AdminReturnRecord[];
}

export default function ReturnsPage({ records }: ReturnsPageProps) {
  const [filter, setFilter] = useState<"All" | AdminReturnStatus>("All");
  const [returning, setReturning] = useState<AdminReturnRecord | null>(null);
  const feedback = useFeedback();

  const visible = useMemo(
    () =>
      filter === "All"
        ? records
        : records.filter((item) => item.status === filter),
    [filter, records],
  );

  const tone: Record<AdminReturnStatus, "green" | "red" | "orange" | "teal"> = {
    Returned: "green",
    Overdue: "red",
    "Due Today": "orange",
    Active: "teal",
  };

  return (
    <AdminPageShell
      title="Returns"
      subtitle="Track all issued books and their return status."
    >
      <AdminFilterTabs
        active={filter}
        onChange={(id) => setFilter(id as typeof filter)}
        tabs={[
          { id: "All", label: "All" },
          { id: "Returned", label: "Returned" },
          { id: "Overdue", label: "Overdue" },
          { id: "Due Today", label: "Due Today" },
          { id: "Active", label: "Active" },
        ]}
      />

      <AdminTable
        columns={[
          "Member",
          "Book",
          "Issue Date",
          "Due Date",
          "Return Date",
          "Days Overdue",
          "Fine",
          "Status",
          "Actions",
        ]}
        from={1}
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
            <td className="px-4 py-3 text-slate-500">{item.issueDate}</td>
            <td className="px-4 py-3 text-slate-500">{item.dueDate}</td>
            <td className="px-4 py-3 text-slate-500">
              {item.returnDate ?? "—"}
            </td>
            <td
              className={`px-4 py-3 font-medium ${item.daysOverdue > 0 ? "text-red-500" : "text-emerald-600"}`}
            >
              {item.daysOverdue > 0 ? `+${item.daysOverdue}` : 0}
            </td>
            <td className="px-4 py-3 text-slate-700">৳{item.fine}</td>
            <td className="px-4 py-3">
              <StatusBadge label={item.status} tone={tone[item.status]} />
            </td>
            <td className="px-4 py-3">
              {item.status === "Returned" ? (
                <ViewButton
                  onClick={() =>
                    feedback.success(
                      item.book,
                      `Returned by ${item.member} on ${item.returnDate}.`,
                    )
                  }
                />
              ) : (
                <TextAction
                  label="Return"
                  tone="sky"
                  onClick={() => {
                    setReturning(item);
                    openModal("return-form");
                  }}
                />
              )}
            </td>
          </tr>
        ))}
      </AdminTable>

      <FormModal
        id="return-form"
        key={returning?.id ?? "return"}
        title="Confirm return"
        submitLabel="Mark returned"
        onSubmit={() => {
          const book = returning?.book;
          setReturning(null);
          feedback.success("Book returned", `"${book}" was marked as returned.`);
        }}
      >
        <p className="text-sm text-slate-500">
          Confirm return for <b>{returning?.book}</b> from {returning?.member}.
        </p>
        <FormField
          label="Return date"
          name="returnDate"
          type="date"
          defaultValue={new Date().toISOString().slice(0, 10)}
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
