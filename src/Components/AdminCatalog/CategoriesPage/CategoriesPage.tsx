"use client";

import Image from "next/image";
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
      feedback.failed(
        "Could not save category",
        "Name and description are required.",
      );
      return;
    }
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
        openModal("category-form");
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
                  <Image
                    src="/svg/tag.svg"
                    alt="Category"
                    width={16}
                    height={16}
                    className="size-4"
                  />
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
                    openModal("category-form");
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
                <DeleteButton
                  onClick={() => {
                    setDeleting(category);
                    openModal("category-delete");
                  }}
                />
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      <FormModal
        id="category-form"
        key={editing?.id ?? "add"}
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
        id="category-delete"
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
        id={feedback.id}
        variant={feedback.status.variant}
        title={feedback.status.title}
        message={feedback.status.message}
      />
    </AdminPageShell>
  );
}
