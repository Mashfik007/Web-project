"use client";

import { useState } from "react";
import AdminPageShell from "@/Components/AdminCatalog/AdminPageShell/AdminPageShell";
import AdminTable from "@/Components/AdminCatalog/AdminTable/AdminTable";
import DeleteButton from "@/Components/AdminCatalog/DeleteButton/DeleteButton";
import EditButton from "@/Components/AdminCatalog/EditButton/EditButton";
import {
  ConfirmModal,
  FormField,
  FormModal,
  StatusModal,
  formHasValues,
  openModal,
  useFeedback,
} from "@/Components/Modal";
import type { AdminPublisher } from "@/types/adminCatalog";

interface PublishersPageProps {
  publishers: AdminPublisher[];
}

export default function PublishersPage({ publishers }: PublishersPageProps) {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<AdminPublisher | null>(null);
  const [deleting, setDeleting] = useState<AdminPublisher | null>(null);
  const feedback = useFeedback();

  function handleSave(form: HTMLFormElement) {
    if (!formHasValues(form, ["name", "city", "email"])) {
      feedback.failed(
        "Could not save publisher",
        "Name, city, and email are required.",
      );
      return;
    }
    feedback.success(
      formMode === "edit" ? "Publisher updated" : "Publisher added",
      "The publisher directory was saved successfully.",
    );
  }

  return (
    <AdminPageShell
      title="Publishers"
      subtitle="Directory of publishing houses"
      addLabel="Add Publisher"
      onAdd={() => {
        setEditing(null);
        setFormMode("add");
        openModal("publisher-form");
      }}
    >
      <AdminTable
        columns={[
          "Publisher",
          "City",
          "Contact Email",
          "Total Books",
          "Actions",
        ]}
        from={1}
        to={publishers.length}
        total={publishers.length}
      >
        {publishers.map((publisher) => (
          <tr key={publisher.id} className="text-sm">
            <td className="px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="text-sky-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="size-4"
                  >
                    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
                    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                    <path d="M10 6h4" />
                    <path d="M10 10h4" />
                    <path d="M10 14h4" />
                    <path d="M10 18h4" />
                  </svg>
                </span>
                <span className="font-semibold text-slate-800">
                  {publisher.name}
                </span>
              </div>
            </td>
            <td className="px-4 py-3 text-slate-500">{publisher.city}</td>
            <td className="px-4 py-3">
              <a
                href={`mailto:${publisher.email}`}
                className="text-sky-500 hover:text-sky-600"
              >
                {publisher.email}
              </a>
            </td>
            <td className="px-4 py-3 text-slate-700">{publisher.totalBooks}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1">
                <EditButton
                  onClick={() => {
                    setEditing(publisher);
                    setFormMode("edit");
                    openModal("publisher-form");
                  }}
                />
                <DeleteButton
                  onClick={() => {
                    setDeleting(publisher);
                    openModal("publisher-delete");
                  }}
                />
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      <FormModal
        id="publisher-form"
        key={editing?.id ?? "add"}
        title={formMode === "edit" ? "Edit Publisher" : "Add Publisher"}
        onSubmit={handleSave}
      >
        <FormField
          label="Publisher"
          name="name"
          placeholder="Publishing house"
          defaultValue={editing?.name}
        />
        <FormField
          label="City"
          name="city"
          placeholder="City"
          defaultValue={editing?.city}
        />
        <FormField
          label="Contact email"
          name="email"
          type="email"
          placeholder="email@publisher.com"
          defaultValue={editing?.email}
        />
      </FormModal>

      <ConfirmModal
        id="publisher-delete"
        title="Delete publisher"
        message={`Remove "${deleting?.name ?? "this publisher"}" from the directory?`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => {
          setDeleting(null);
          feedback.success("Publisher deleted", "The publisher was removed.");
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
