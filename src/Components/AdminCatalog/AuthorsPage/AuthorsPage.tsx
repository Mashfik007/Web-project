"use client";

import { useState } from "react";
import AdminPageShell from "@/Components/AdminCatalog/AdminPageShell/AdminPageShell";
import AdminTable from "@/Components/AdminCatalog/AdminTable/AdminTable";
import DeleteButton from "@/Components/AdminCatalog/DeleteButton/DeleteButton";
import EditButton from "@/Components/AdminCatalog/EditButton/EditButton";
import StatusBadge from "@/Components/AdminCatalog/StatusBadge/StatusBadge";
import {
  ConfirmModal,
  FormField,
  FormModal,
  StatusModal,
  formHasValues,
  openModal,
  useFeedback,
} from "@/Components/Modal";
import type { AdminAuthor } from "@/types/adminCatalog";

interface AuthorsPageProps {
  authors: AdminAuthor[];
}

export default function AuthorsPage({ authors }: AuthorsPageProps) {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<AdminAuthor | null>(null);
  const [deleting, setDeleting] = useState<AdminAuthor | null>(null);
  const feedback = useFeedback();

  function handleSave(form: HTMLFormElement) {
    if (!formHasValues(form, ["name", "nationality"])) {
      feedback.failed("Could not save author", "Name and nationality are required.");
      return;
    }
    feedback.success(
      formMode === "edit" ? "Author updated" : "Author added",
      "The author record was saved successfully.",
    );
  }

  return (
    <AdminPageShell
      title="Authors"
      subtitle="Manage book authors and contributors"
      addLabel="Add Author"
      onAdd={() => {
        setEditing(null);
        setFormMode("add");
        openModal("author-form");
      }}
    >
      <AdminTable
        columns={["Author", "Nationality", "Total Books", "Status", "Actions"]}
        from={1}
        to={authors.length}
        total={authors.length}
      >
        {authors.map((author) => (
          <tr key={author.id} className="text-sm">
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <span
                  className={`flex size-9 items-center justify-center rounded-full text-xs font-semibold ${author.avatarClass}`}
                >
                  {author.initials}
                </span>
                <span className="font-semibold text-slate-800">
                  {author.name}
                </span>
              </div>
            </td>
            <td className="px-4 py-3 text-slate-500">{author.nationality}</td>
            <td className="px-4 py-3 text-slate-700">{author.totalBooks}</td>
            <td className="px-4 py-3">
              <StatusBadge
                label={author.status}
                tone={author.status === "Active" ? "green" : "red"}
              />
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1">
                <EditButton
                  onClick={() => {
                    setEditing(author);
                    setFormMode("edit");
                    openModal("author-form");
                  }}
                />
                <DeleteButton
                  onClick={() => {
                    setDeleting(author);
                    openModal("author-delete");
                  }}
                />
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      <FormModal
        id="author-form"
        key={editing?.id ?? "add"}
        title={formMode === "edit" ? "Edit Author" : "Add Author"}
        onSubmit={handleSave}
      >
        <FormField
          label="Name"
          name="name"
          placeholder="Author name"
          defaultValue={editing?.name}
        />
        <FormField
          label="Nationality"
          name="nationality"
          placeholder="Nationality"
          defaultValue={editing?.nationality}
        />
      </FormModal>

      <ConfirmModal
        id="author-delete"
        title="Delete author"
        message={`Remove "${deleting?.name ?? "this author"}" from the directory?`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => {
          setDeleting(null);
          feedback.success("Author deleted", "The author was removed.");
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
