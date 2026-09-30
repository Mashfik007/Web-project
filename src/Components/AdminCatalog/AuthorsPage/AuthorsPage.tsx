"use client";

import { useRouter } from "next/navigation";
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
import {
  addAuthor,
  deleteAuthor,
  restoreAuthor,
  toggleAuthor,
  updateAuthor,
} from "@/Controller/admin.controller";
import type { ArchivedAuthorItem } from "@/data/getArchivedAuthors";
import type { AdminAuthor } from "@/types/adminCatalog";

interface AuthorsPageProps {
  authors: AdminAuthor[];
  archivedAuthors: ArchivedAuthorItem[];
}

export default function AuthorsPage({
  authors,
  archivedAuthors,
}: AuthorsPageProps) {
  const router = useRouter();
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  const [editing, setEditing] = useState<AdminAuthor | null>(null);
  const [deleting, setDeleting] = useState<AdminAuthor | null>(null);
  const [toggling, setToggling] = useState<AdminAuthor | null>(null);
  const [archiveId, setArchiveId] = useState("");
  const feedback = useFeedback();

  async function handleSave(form: HTMLFormElement) {
    if (!formHasValues(form, ["name", "nationality"])) {
      feedback.failed(
        "Could not save author",
        "Name and nationality are required.",
      );
      return;
    }

    const data = new FormData(form);
    const author = {
      name: String(data.get("name") ?? "").trim(),
      nationality: String(data.get("nationality") ?? "").trim(),
    };

    const result =
      formMode === "edit" && editing
        ? await updateAuthor(editing.id, author)
        : await addAuthor(author);

    if (!result.ok) {
      feedback.failed(
        formMode === "edit" ? "Could not update author" : "Could not add author",
        result.message,
      );
      return;
    }

    router.refresh();
    feedback.success(
      formMode === "edit" ? "Author updated" : "Author added",
      result.message,
    );
  }

  async function handleToggle(author: AdminAuthor) {
    const result = await toggleAuthor(author.id);
    if (!result.ok) {
      feedback.failed("Could not update author", result.message);
      return;
    }
    router.refresh();
    feedback.success(
      author.status === "Active" ? "Author deactivated" : "Author activated",
      result.message,
    );
  }

  async function handleRestore() {
    if (!archiveId) {
      feedback.failed(
        "Could not restore author",
        "Select an archived author first.",
      );
      return;
    }

    const result = await restoreAuthor(archiveId);
    if (!result.ok) {
      feedback.failed("Could not restore author", result.message);
      return;
    }

    setArchiveId("");
    router.refresh();
    feedback.success("Author restored", result.message);
  }

  return (
    <AdminPageShell
      title="Authors"
      subtitle="Manage book authors and contributors"
      addLabel="Add Author"
      onAdd={() => {
        setEditing(null);
        setFormMode("add");
        setFormVersion((version) => version + 1);
        openModal("author-form");
      }}
    >
      <div className="border-base-200 flex flex-wrap items-center gap-2 border-b p-4">
        <select
          name="archive"
          className="select"
          value={archiveId}
          onChange={(event) => setArchiveId(event.target.value)}
        >
          <option value="">Restore from archive</option>
          {archivedAuthors.map((archive) => (
            <option key={archive.id} value={archive.id}>
              {archive.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => {
            void handleRestore();
          }}
        >
          Restore
        </button>
      </div>

      <AdminTable
        columns={["Author", "Nationality", "Total Books", "Status", "Actions"]}
        from={authors.length === 0 ? 0 : 1}
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
              <div className="flex items-center gap-2">
                <EditButton
                  onClick={() => {
                    setEditing(author);
                    setFormMode("edit");
                    setFormVersion((version) => version + 1);
                    openModal("author-form");
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setToggling(author);
                    openModal("author-toggle");
                  }}
                  className="text-xs font-medium text-orange-500 hover:text-orange-600"
                >
                  {author.status === "Active" ? "Deactivate" : "Activate"}
                </button>
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
        key={formVersion}
        title={formMode === "edit" ? "Edit Author" : "Add Author"}
        submitLabel={formMode === "edit" ? "Update Author" : "Add Author"}
        onSubmit={handleSave}
      >
        <FormField
          label="Name"
          name="name"
          placeholder="Author name"
          defaultValue={editing?.name}
          required
        />
        <FormField
          label="Nationality"
          name="nationality"
          placeholder="Nationality"
          defaultValue={editing?.nationality}
          required
        />
      </FormModal>

      <ConfirmModal
        id="author-toggle"
        title={toggling?.status === "Active" ? "Deactivate author" : "Activate author"}
        message={
          toggling?.status === "Active"
            ? `Do you want to really deactivate "${toggling?.name ?? "this author"}"?`
            : `Do you want to really activate "${toggling?.name ?? "this author"}"?`
        }
        confirmLabel={toggling?.status === "Active" ? "Deactivate" : "Activate"}
        tone={toggling?.status === "Active" ? "danger" : "primary"}
        onConfirm={() => {
          const author = toggling;
          setToggling(null);
          if (!author) return;
          void handleToggle(author);
        }}
      />

      <ConfirmModal
        id="author-delete"
        title="Delete author"
        message={`Do you want to really delete "${deleting?.name ?? "this author"}"?`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => {
          const id = deleting?.id;
          setDeleting(null);
          if (!id) return;

          void deleteAuthor(id).then((result) => {
            if (!result.ok) {
              feedback.failed("Could not delete author", result.message);
              return;
            }
            feedback.success("Author deleted", result.message);
            router.refresh();
          });
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
