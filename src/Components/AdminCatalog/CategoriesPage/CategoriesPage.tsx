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
  addCategory,
  deleteCategory,
  restoreCategory,
  toggleCategory,
  updateCategory,
} from "@/Controller/admin.controller";
import type { ArchivedCategoryItem } from "@/data/getArchivedCategories";
import type { AdminCategory } from "@/types/adminCatalog";

interface CategoriesPageProps {
  categories: AdminCategory[];
  archivedCategories: ArchivedCategoryItem[];
}

export default function CategoriesPage({
  categories,
  archivedCategories,
}: CategoriesPageProps) {
  const router = useRouter();
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [deleting, setDeleting] = useState<AdminCategory | null>(null);
  const [toggling, setToggling] = useState<AdminCategory | null>(null);
  const [archiveId, setArchiveId] = useState("");
  const feedback = useFeedback();

  async function handleSave(form: HTMLFormElement) {
    if (!formHasValues(form, ["name", "description"])) {
      feedback.failed(
        "Could not save category",
        "Name and description are required.",
      );
      return;
    }

    const data = new FormData(form);
    const category = {
      name: String(data.get("name") ?? "").trim(),
      description: String(data.get("description") ?? "").trim(),
    };

    const result =
      formMode === "edit" && editing
        ? await updateCategory(editing.id, category)
        : await addCategory(category);

    if (!result.ok) {
      feedback.failed(
        formMode === "edit"
          ? "Could not update category"
          : "Could not add category",
        result.message,
      );
      return;
    }

    router.refresh();
    feedback.success(
      formMode === "edit" ? "Category updated" : "Category added",
      result.message,
    );
  }

  async function handleToggle(category: AdminCategory) {
    const result = await toggleCategory(category.id);
    if (!result.ok) {
      feedback.failed("Could not update category", result.message);
      return;
    }
    router.refresh();
    feedback.success(
      category.status === "Active" ? "Category deactivated" : "Category activated",
      result.message,
    );
  }

  async function handleRestore() {
    if (!archiveId) {
      feedback.failed(
        "Could not restore category",
        "Select an archived category first.",
      );
      return;
    }

    const result = await restoreCategory(archiveId);
    if (!result.ok) {
      feedback.failed("Could not restore category", result.message);
      return;
    }

    setArchiveId("");
    router.refresh();
    feedback.success("Category restored", result.message);
  }

  return (
    <AdminPageShell
      title="Categories"
      subtitle="Organize your collection by subject"
      addLabel="Add Category"
      onAdd={() => {
        setEditing(null);
        setFormMode("add");
        setFormVersion((version) => version + 1);
        openModal("category-form");
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
          {archivedCategories.map((archive) => (
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
        columns={["Name", "Description", "Total Books", "Status", "Actions"]}
        from={categories.length === 0 ? 0 : 1}
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
                    setFormVersion((version) => version + 1);
                    openModal("category-form");
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setToggling(category);
                    openModal("category-toggle");
                  }}
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
        key={formVersion}
        title={formMode === "edit" ? "Edit Category" : "Add Category"}
        submitLabel={formMode === "edit" ? "Update Category" : "Add Category"}
        onSubmit={handleSave}
      >
        <FormField
          label="Name"
          name="name"
          placeholder="Category name"
          defaultValue={editing?.name}
          required
        />
        <FormField
          label="Description"
          name="description"
          as="textarea"
          placeholder="Short description"
          defaultValue={editing?.description}
          required
        />
      </FormModal>

      <ConfirmModal
        id="category-toggle"
        title={toggling?.status === "Active" ? "Deactivate category" : "Activate category"}
        message={
          toggling?.status === "Active"
            ? `Do you want to really deactivate "${toggling?.name ?? "this category"}"?`
            : `Do you want to really activate "${toggling?.name ?? "this category"}"?`
        }
        confirmLabel={toggling?.status === "Active" ? "Deactivate" : "Activate"}
        tone={toggling?.status === "Active" ? "danger" : "primary"}
        onConfirm={() => {
          const category = toggling;
          setToggling(null);
          if (!category) return;
          void handleToggle(category);
        }}
      />

      <ConfirmModal
        id="category-delete"
        title="Delete category"
        message={`Do you want to really delete "${deleting?.name ?? "this category"}"?`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => {
          const id = deleting?.id;
          setDeleting(null);
          if (!id) return;

          void deleteCategory(id).then((result) => {
            if (!result.ok) {
              feedback.failed("Could not delete category", result.message);
              return;
            }
            feedback.success("Category deleted", result.message);
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
