"use client";

import { useState } from "react";
import {
  AdminPageShell,
  AdminSearchRow,
  AdminTable,
  DeleteButton,
  EditButton,
  FilterSelect,
  StatusBadge,
  ViewButton,
} from "@/Components/AdminCatalog/AdminCatalogUi";
import {
  ConfirmModal,
  FormField,
  FormModal,
  StatusModal,
  formHasValues,
  useFeedback,
} from "@/Components/Modal/AppModal";
import type { AdminUser } from "@/types/adminCatalog";

const roleClass = {
  Member: "bg-sky-50 text-sky-600",
  Librarian: "bg-violet-50 text-violet-600",
  Admin: "bg-rose-50 text-rose-600",
};

interface UsersPageProps {
  users: AdminUser[];
}

export default function UsersPage({ users }: UsersPageProps) {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState<AdminUser | null>(null);
  const feedback = useFeedback();

  function handleSave(form: HTMLFormElement) {
    if (!formHasValues(form, ["name", "email", "phone", "role"])) {
      setFormMode(null);
      feedback.failed("Could not save user", "Please fill in all user details.");
      return;
    }
    setFormMode(null);
    feedback.success(
      formMode === "edit" ? "User updated" : "User added",
      "The member record was saved successfully.",
    );
  }

  return (
    <AdminPageShell
      title="Users"
      subtitle="Manage library members and staff"
      addLabel="Add User"
      onAdd={() => {
        setEditing(null);
        setFormMode("add");
      }}
    >
      <AdminSearchRow placeholder="Search by name or email...">
        <FilterSelect
          name="role"
          options={["All", "Member", "Librarian", "Admin"]}
        />
        <FilterSelect name="status" options={["All", "Active", "Suspended"]} />
      </AdminSearchRow>

      <AdminTable
        columns={[
          "Member",
          "Email",
          "Phone",
          "Role",
          "Status",
          "Joined",
          "Borrows",
          "Actions",
        ]}
        from={1}
        to={users.length}
        total={users.length}
      >
        {users.map((user) => (
          <tr key={user.id} className="text-sm">
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <span
                  className={`flex size-9 items-center justify-center rounded-full text-xs font-semibold ${user.avatarClass}`}
                >
                  {user.initials}
                </span>
                <span className="font-semibold text-slate-800">{user.name}</span>
              </div>
            </td>
            <td className="px-4 py-3 text-slate-500">{user.email}</td>
            <td className="px-4 py-3 text-slate-500">{user.phone}</td>
            <td className="px-4 py-3">
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${roleClass[user.role]}`}
              >
                {user.role}
              </span>
            </td>
            <td className="px-4 py-3">
              <StatusBadge
                label={user.status}
                tone={user.status === "Active" ? "green" : "red"}
              />
            </td>
            <td className="px-4 py-3 text-slate-500">{user.joined}</td>
            <td className="px-4 py-3 text-slate-700">{user.borrows}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1">
                <ViewButton
                  onClick={() =>
                    feedback.success(
                      user.name,
                      `${user.email} · ${user.role} · Joined ${user.joined}`,
                    )
                  }
                />
                <EditButton
                  onClick={() => {
                    setEditing(user);
                    setFormMode("edit");
                  }}
                />
                <DeleteButton onClick={() => setDeleting(user)} />
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      <FormModal
        open={formMode !== null}
        onClose={() => setFormMode(null)}
        title={formMode === "edit" ? "Edit User" : "Add User"}
        onSubmit={handleSave}
      >
        <FormField
          label="Name"
          name="name"
          placeholder="Full name"
          defaultValue={editing?.name}
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="email@example.com"
          defaultValue={editing?.email}
        />
        <FormField
          label="Phone"
          name="phone"
          placeholder="+880 ..."
          defaultValue={editing?.phone}
        />
        <FormField
          label="Role"
          name="role"
          as="select"
          defaultValue={editing?.role ?? "Member"}
          options={["Member", "Librarian", "Admin"]}
        />
      </FormModal>

      <ConfirmModal
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title="Delete user"
        message={`Remove "${deleting?.name ?? "this user"}" from the library?`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => {
          setDeleting(null);
          feedback.success("User deleted", "The member was removed.");
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
