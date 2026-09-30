"use client";

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
import {
  addCommunityGroup,
  deleteCommunityGroup,
  updateCommunityGroup,
} from "@/Controller/admin.controller";
import type { AdminCommunityGroup } from "@/data/getCommunityGroups";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CommunityGroupsPage({
  groups,
}: {
  groups: AdminCommunityGroup[];
}) {
  const router = useRouter();
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  const [editing, setEditing] = useState<AdminCommunityGroup | null>(null);
  const [deleting, setDeleting] = useState<AdminCommunityGroup | null>(null);
  const feedback = useFeedback();

  async function handleSave(form: HTMLFormElement) {
    if (!formHasValues(form, ["name", "description"])) {
      feedback.failed(
        "Could not save group",
        "Name and description are required.",
      );
      return;
    }

    const data = new FormData(form);
    const group = {
      name: String(data.get("name") ?? "").trim(),
      description: String(data.get("description") ?? "").trim(),
    };

    const result =
      formMode === "edit" && editing
        ? await updateCommunityGroup(editing.id, group)
        : await addCommunityGroup(group);

    if (!result.ok) {
      feedback.failed(
        formMode === "edit" ? "Could not update group" : "Could not create group",
        result.message,
      );
      return;
    }

    router.refresh();
    feedback.success(
      formMode === "edit" ? "Group updated" : "Group created",
      result.message,
    );
  }

  async function handleDelete() {
    if (!deleting) return;
    const result = await deleteCommunityGroup(deleting.id);
    if (!result.ok) {
      feedback.failed("Could not delete group", result.message);
      return;
    }
    setDeleting(null);
    router.refresh();
    feedback.success("Group deleted", result.message);
  }

  return (
    <AdminPageShell
      title="Community"
      subtitle="Create group chats that every reader can join"
      addLabel="Create Group"
      onAdd={() => {
        setEditing(null);
        setFormMode("add");
        setFormVersion((version) => version + 1);
        openModal("community-group-form");
      }}
    >
      <AdminTable
        columns={["Name", "Description", "Created", "Actions"]}
        from={groups.length === 0 ? 0 : 1}
        to={groups.length}
        total={groups.length}
      >
        {groups.length === 0 ? (
          <tr>
            <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-400">
              No groups yet. Readers Community is always available in chat.
            </td>
          </tr>
        ) : (
          groups.map((group) => (
            <tr key={group.id} className="text-sm">
              <td className="px-4 py-3 font-semibold text-slate-800">{group.name}</td>
              <td className="px-4 py-3 text-slate-500">{group.description}</td>
              <td className="px-4 py-3 text-slate-500">
                {group.createdAt
                  ? new Date(group.createdAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : ""}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <EditButton
                    onClick={() => {
                      setEditing(group);
                      setFormMode("edit");
                      setFormVersion((version) => version + 1);
                      openModal("community-group-form");
                    }}
                  />
                  <DeleteButton
                    onClick={() => {
                      setDeleting(group);
                      openModal("community-group-delete");
                    }}
                  />
                </div>
              </td>
            </tr>
          ))
        )}
      </AdminTable>

      <FormModal
        id="community-group-form"
        title={formMode === "edit" ? "Edit group" : "Create group"}
        submitLabel={formMode === "edit" ? "Save" : "Create"}
        onSubmit={handleSave}
      >
        <FormField
          key={`name-${formVersion}`}
          label="Name"
          name="name"
          placeholder="Mystery Circle"
          defaultValue={editing?.name}
          required
        />
        <FormField
          key={`description-${formVersion}`}
          label="Description"
          name="description"
          as="textarea"
          placeholder="What this group talks about"
          defaultValue={editing?.description}
          required
        />
      </FormModal>

      <ConfirmModal
        id="community-group-delete"
        title="Delete group"
        message={`Do you want to really delete "${deleting?.name ?? "this group"}"?`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => {
          void handleDelete();
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
