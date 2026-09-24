"use client";

import Image from "next/image";
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
  addPublisher,
  deletePublisher,
  restorePublisher,
  togglePublisher,
  updatePublisher,
} from "@/Controller/admin.controller";
import type { ArchivedPublisherItem } from "@/data/getArchivedPublishers";
import type { AdminPublisher } from "@/types/adminCatalog";

interface PublishersPageProps {
  publishers: AdminPublisher[];
  archivedPublishers: ArchivedPublisherItem[];
}

export default function PublishersPage({
  publishers,
  archivedPublishers,
}: PublishersPageProps) {
  const router = useRouter();
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  const [editing, setEditing] = useState<AdminPublisher | null>(null);
  const [deleting, setDeleting] = useState<AdminPublisher | null>(null);
  const [archiveId, setArchiveId] = useState("");
  const feedback = useFeedback();

  async function handleSave(form: HTMLFormElement) {
    if (!formHasValues(form, ["name", "city", "email"])) {
      feedback.failed(
        "Could not save publisher",
        "Name, city, and email are required.",
      );
      return;
    }

    const data = new FormData(form);
    const publisher = {
      name: String(data.get("name") ?? "").trim(),
      city: String(data.get("city") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
    };

    const result =
      formMode === "edit" && editing
        ? await updatePublisher(editing.id, publisher)
        : await addPublisher(publisher);

    if (!result.ok) {
      feedback.failed(
        formMode === "edit"
          ? "Could not update publisher"
          : "Could not add publisher",
        result.message,
      );
      return;
    }

    router.refresh();
    feedback.success(
      formMode === "edit" ? "Publisher updated" : "Publisher added",
      result.message,
    );
  }

  async function handleToggle(publisher: AdminPublisher) {
    const result = await togglePublisher(publisher.id);
    if (!result.ok) {
      feedback.failed("Could not update publisher", result.message);
      return;
    }
    router.refresh();
    feedback.success(
      publisher.status === "Active"
        ? "Publisher deactivated"
        : "Publisher activated",
      result.message,
    );
  }

  async function handleRestore() {
    if (!archiveId) {
      feedback.failed(
        "Could not restore publisher",
        "Select an archived publisher first.",
      );
      return;
    }

    const result = await restorePublisher(archiveId);
    if (!result.ok) {
      feedback.failed("Could not restore publisher", result.message);
      return;
    }

    setArchiveId("");
    router.refresh();
    feedback.success("Publisher restored", result.message);
  }

  return (
    <AdminPageShell
      title="Publishers"
      subtitle="Directory of publishing houses"
      addLabel="Add Publisher"
      onAdd={() => {
        setEditing(null);
        setFormMode("add");
        setFormVersion((version) => version + 1);
        openModal("publisher-form");
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
          {archivedPublishers.map((archive) => (
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
        columns={[
          "Publisher",
          "City",
          "Contact Email",
          "Total Books",
          "Status",
          "Actions",
        ]}
        from={publishers.length === 0 ? 0 : 1}
        to={publishers.length}
        total={publishers.length}
      >
        {publishers.map((publisher) => (
          <tr key={publisher.id} className="text-sm">
            <td className="px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="text-sky-500">
                  <Image
                    src="/svg/building.svg"
                    alt="Publisher"
                    width={16}
                    height={16}
                    className="size-4"
                  />
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
              <StatusBadge
                label={publisher.status}
                tone={publisher.status === "Active" ? "green" : "red"}
              />
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <EditButton
                  onClick={() => {
                    setEditing(publisher);
                    setFormMode("edit");
                    setFormVersion((version) => version + 1);
                    openModal("publisher-form");
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    void handleToggle(publisher);
                  }}
                  className="text-xs font-medium text-orange-500 hover:text-orange-600"
                >
                  {publisher.status === "Active" ? "Deactivate" : "Activate"}
                </button>
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
        key={formVersion}
        title={formMode === "edit" ? "Edit Publisher" : "Add Publisher"}
        submitLabel={formMode === "edit" ? "Update Publisher" : "Add Publisher"}
        onSubmit={handleSave}
      >
        <FormField
          label="Publisher"
          name="name"
          placeholder="Publishing house"
          defaultValue={editing?.name}
          required
        />
        <FormField
          label="City"
          name="city"
          placeholder="City"
          defaultValue={editing?.city}
          required
        />
        <FormField
          label="Contact email"
          name="email"
          type="email"
          placeholder="email@publisher.com"
          defaultValue={editing?.email}
          required
        />
      </FormModal>

      <ConfirmModal
        id="publisher-delete"
        title="Delete publisher"
        message={`Remove "${deleting?.name ?? "this publisher"}" from the directory?`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => {
          const id = deleting?.id;
          setDeleting(null);
          if (!id) return;

          void deletePublisher(id).then((result) => {
            if (!result.ok) {
              feedback.failed("Could not delete publisher", result.message);
              return;
            }
            feedback.success("Publisher deleted", result.message);
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
