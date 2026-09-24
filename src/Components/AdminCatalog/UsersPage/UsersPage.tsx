"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminPageShell from "@/Components/AdminCatalog/AdminPageShell/AdminPageShell";
import AdminSearchRow from "@/Components/AdminCatalog/AdminSearchRow/AdminSearchRow";
import AdminTable from "@/Components/AdminCatalog/AdminTable/AdminTable";
import DeleteButton from "@/Components/AdminCatalog/DeleteButton/DeleteButton";
import EditButton from "@/Components/AdminCatalog/EditButton/EditButton";
import FilterSelect from "@/Components/AdminCatalog/FilterSelect/FilterSelect";
import StatusBadge from "@/Components/AdminCatalog/StatusBadge/StatusBadge";
import ViewButton from "@/Components/AdminCatalog/ViewButton/ViewButton";
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
  addUser,
  deleteUser,
  restoreUser,
  toggleUser,
  updateUser,
} from "@/Controller/admin.controller";
import type { ArchivedUserItem } from "@/data/getArchivedUsers";
import type { AdminUser, AdminUserRole } from "@/types/adminCatalog";

const roleClass = {
  Member: "bg-sky-50 text-sky-600",
  Librarian: "bg-violet-50 text-violet-600",
  Admin: "bg-rose-50 text-rose-600",
};

const roles: AdminUserRole[] = ["Member", "Librarian", "Admin"];

interface UsersPageProps {
  users: AdminUser[];
  archivedUsers: ArchivedUserItem[];
}

export default function UsersPage({ users, archivedUsers }: UsersPageProps) {
  const router = useRouter();
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState<AdminUser | null>(null);
  const [archiveId, setArchiveId] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const feedback = useFeedback();

  const visibleUsers = users.filter((user) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query);
    const matchesRole = role === "All" || user.role === role;
    const matchesStatus = status === "All" || user.status === status;
    return matchesSearch && matchesRole && matchesStatus;
  });

  async function handleSave(form: HTMLFormElement) {
    if (!formHasValues(form, ["name", "email", "phone", "role"])) {
      feedback.failed(
        "Could not save user",
        "Please fill in all user details.",
      );
      return;
    }

    const data = new FormData(form);
    const user = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      role: String(data.get("role") ?? "Member") as AdminUserRole,
    };

    const result =
      formMode === "edit" && editing
        ? await updateUser(editing.id, user)
        : await addUser(user);

    if (!result.ok) {
      feedback.failed(
        formMode === "edit" ? "Could not update user" : "Could not add user",
        result.message,
      );
      return;
    }

    router.refresh();
    feedback.success(
      formMode === "edit" ? "User updated" : "User added",
      result.message,
    );
  }

  async function handleToggle(user: AdminUser) {
    const result = await toggleUser(user.id);
    if (!result.ok) {
      feedback.failed("Could not update user", result.message);
      return;
    }
    router.refresh();
    feedback.success(
      user.status === "Active" ? "User suspended" : "User activated",
      result.message,
    );
  }

  async function handleRestore() {
    if (!archiveId) {
      feedback.failed(
        "Could not restore user",
        "Select an archived user first.",
      );
      return;
    }

    const result = await restoreUser(archiveId);
    if (!result.ok) {
      feedback.failed("Could not restore user", result.message);
      return;
    }

    setArchiveId("");
    router.refresh();
    feedback.success("User restored", result.message);
  }

  return (
    <AdminPageShell
      title="Users"
      subtitle="Manage library members and staff"
      addLabel="Add User"
      onAdd={() => {
        setEditing(null);
        setFormMode("add");
        setFormVersion((version) => version + 1);
        openModal("user-form");
      }}
    >
      <AdminSearchRow
        placeholder="Search by name or email..."
        value={search}
        onChange={setSearch}
      >
        <FilterSelect
          name="role"
          options={["All", ...roles]}
          value={role}
          onChange={setRole}
        />
        <FilterSelect
          name="status"
          options={["All", "Active", "Suspended"]}
          value={status}
          onChange={setStatus}
        />
        <select
          name="archive"
          className="select"
          value={archiveId}
          onChange={(event) => setArchiveId(event.target.value)}
        >
          <option value="">Restore from archive</option>
          {archivedUsers.map((archive) => (
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
        from={visibleUsers.length === 0 ? 0 : 1}
        to={visibleUsers.length}
        total={visibleUsers.length}
      >
        {visibleUsers.map((user) => (
          <tr key={user.id} className="text-sm">
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <span
                  className={`flex size-9 items-center justify-center rounded-full text-xs font-semibold ${user.avatarClass}`}
                >
                  {user.initials}
                </span>
                <span className="font-semibold text-slate-800">
                  {user.name}
                </span>
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
              <div className="flex items-center gap-2">
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
                    setFormVersion((version) => version + 1);
                    openModal("user-form");
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    void handleToggle(user);
                  }}
                  className="text-xs font-medium text-orange-500 hover:text-orange-600"
                >
                  {user.status === "Active" ? "Suspend" : "Activate"}
                </button>
                <DeleteButton
                  onClick={() => {
                    setDeleting(user);
                    openModal("user-delete");
                  }}
                />
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      <FormModal
        id="user-form"
        key={formVersion}
        title={formMode === "edit" ? "Edit User" : "Add User"}
        submitLabel={formMode === "edit" ? "Update User" : "Add User"}
        onSubmit={handleSave}
      >
        <FormField
          label="Name"
          name="name"
          placeholder="Full name"
          defaultValue={editing?.name}
          required
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="email@example.com"
          defaultValue={editing?.email}
          required
        />
        <FormField
          label="Phone"
          name="phone"
          placeholder="+880 ..."
          defaultValue={editing?.phone}
          required
        />
        <FormField
          label="Role"
          name="role"
          as="select"
          defaultValue={editing?.role ?? "Member"}
          options={roles}
          required
        />
      </FormModal>

      <ConfirmModal
        id="user-delete"
        title="Delete user"
        message={`Remove "${deleting?.name ?? "this user"}" from the library?`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => {
          const id = deleting?.id;
          setDeleting(null);
          if (!id) return;

          void deleteUser(id).then((result) => {
            if (!result.ok) {
              feedback.failed("Could not delete user", result.message);
              return;
            }
            feedback.success("User deleted", result.message);
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
