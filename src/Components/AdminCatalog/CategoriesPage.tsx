"use client";

import { useState } from "react";
import {
  AdminPageShell,
  AdminTable,
  DeleteButton,
  EditButton,
  StatusBadge,
} from "@/Components/AdminCatalog/AdminCatalogUi";
import {
  ConfirmModal,
  FormField,
  FormModal,
  StatusModal,
  formHasValues,
  useFeedback,
} from "@/Components/Modal/AppModal";
import type { AdminCategory } from "@/types/adminCatalog";

interface CategoriesPageProps {
  categories: AdminCategory[];
}

export default function CategoriesPage({ categories }: CategoriesPageProps) {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [deleting, setDeleting] = useState<AdminCategory | null>(null);
  const feedback = useFeedback();

  function handleSave(form: HTMLFormElement) {
    if (!formHasValues(form, ["name", "description"])) {
      setFormMode(null);
      feedback.failed("Could not save category", "Name and description are required.");
      return;
    }
    setFormMode(null);
    feedback.success(
      formMode === "edit" ? "Category updated" : "Category added",
      "The category list was saved successfully.",
    );
  }

  return (
    <AdminPageShell
      title="Categories"
      subtitle="Organize your collection by subject"
      addLabel="Add Category"
      onAdd={() => {
        setEditing(null);
        setFormMode("add");
      }}
    >
      <AdminTable
        columns={["Name", "Description", "Total Books", "Status", "Actions"]}
        from={1}
        to={categories.length}
        total={categories.length}
      >
        {categories.map((category) => (
          <tr key={category.id} className="text-sm">
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
                    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
                    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
                  </svg>
                </span>
                <span className="font-semibold text-slate-800">
                  {category.name}
                </span>
              </div>
            </td>
            <td className="px-4 py-3 text-slate-500">{category.description}</td>
            <td className="px-4 py-3 text-slate-700">{category.totalBooks}</td>
            <td className="px-4 py-3">
              <StatusBadge
                label={category.status}
                tone={category.status === "Active" ? "green" : "purple"}
              />
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <EditButton
                  onClick={() => {
                    setEditing(category);
                    setFormMode("edit");
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    feedback.success(
                      category.status === "Active"
                        ? "Category deactivated"
                        : "Category activated",
                      `${category.name} is now ${category.status === "Active" ? "inactive" : "active"}.`,
                    )
                  }
                  className="text-xs font-medium text-orange-500 hover:text-orange-600"
                >
                  {category.status === "Active" ? "Deactivate" : "Activate"}
                </button>
                <DeleteButton onClick={() => setDeleting(category)} />
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      <FormModal
        open={formMode !== null}
        onClose={() => setFormMode(null)}
        title={formMode === "edit" ? "Edit Category" : "Add Category"}
        onSubmit={handleSave}
      >
        <FormField
          label="Name"
          name="name"
          placeholder="Category name"
          defaultValue={editing?.name}
        />
        <FormField
          label="Description"
          name="description"
          as="textarea"
          placeholder="Short description"
          defaultValue={editing?.description}
        />
      </FormModal>

      <ConfirmModal
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title="Delete category"
        message={`Delete "${deleting?.name ?? "this category"}"? Books in this category will need a new one.`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => {
          setDeleting(null);
          feedback.success("Category deleted", "The category was removed.");
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
