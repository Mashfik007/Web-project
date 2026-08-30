"use client";

import Image from "next/image";
// books catalog for admin — add, edit, delete
import { useState } from "react";
import AdminPageShell from "@/Components/AdminCatalog/AdminPageShell/AdminPageShell";
import AdminSearchRow from "@/Components/AdminCatalog/AdminSearchRow/AdminSearchRow";
import AdminTable from "@/Components/AdminCatalog/AdminTable/AdminTable";
import DeleteButton from "@/Components/AdminCatalog/DeleteButton/DeleteButton";
import EditButton from "@/Components/AdminCatalog/EditButton/EditButton";
import FilterSelect from "@/Components/AdminCatalog/FilterSelect/FilterSelect";
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
import type { AdminBook } from "@/types/adminCatalog";

const categoryClass: Record<string, string> = {
  Fiction: "bg-sky-50 text-sky-600",
  History: "bg-emerald-50 text-emerald-600",
  "Non-Fiction": "bg-teal-50 text-teal-600",
  Technology: "bg-cyan-50 text-cyan-600",
  Science: "bg-blue-50 text-blue-700",
};

const statusTone = {
  Available: "green",
  "On Loan": "orange",
  Reserved: "purple",
} as const;

interface BooksPageProps {
  books: AdminBook[];
}

export default function BooksPage({ books }: BooksPageProps) {
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<AdminBook | null>(null);
  const [deleting, setDeleting] = useState<AdminBook | null>(null);
  const feedback = useFeedback();

  function handleSave(form: HTMLFormElement) {
    if (
      !formHasValues(form, ["title", "author", "isbn", "category", "copies"])
    ) {
      feedback.failed(
        "Could not save book",
        "Please fill in every field and try again.",
      );
      return;
    }
    feedback.success(
      formMode === "edit" ? "Book updated" : "Book added",
      "The catalog was saved successfully.",
    );
  }

  return (
    <AdminPageShell
      title="Books"
      subtitle="Manage your entire book catalog"
      addLabel="Add Book"
      onAdd={() => {
        setEditing(null);
        setFormMode("add");
        openModal("book-form");
      }}
    >
      <AdminSearchRow placeholder="Search title or author...">
        <FilterSelect
          name="category"
          options={[
            "All",
            "Fiction",
            "Science",
            "Technology",
            "History",
            "Non-Fiction",
          ]}
        />
        <FilterSelect
          name="status"
          options={["All", "Available", "On Loan", "Reserved"]}
        />
      </AdminSearchRow>

      <AdminTable
        columns={[
          "Cover",
          "Title & Author",
          "ISBN",
          "Category",
          "Copies",
          "Available",
          "Status",
          "Actions",
        ]}
        from={1}
        to={books.length}
        total={books.length}
      >
        {books.map((book) => (
          <tr key={book.id} className="text-sm">
            <td className="px-4 py-3">
              <span
                className={`flex size-9 items-center justify-center rounded-lg ${book.coverClass}`}
              >
                <Image
                  src="/svg/book.svg"
                  alt="Book"
                  width={16}
                  height={16}
                  className="size-4"
                />
              </span>
            </td>
            <td className="px-4 py-3">
              <p className="font-semibold text-slate-800">{book.title}</p>
              <p className="text-xs text-slate-400">{book.author}</p>
            </td>
            <td className="px-4 py-3 text-slate-500">{book.isbn}</td>
            <td className="px-4 py-3">
              <span
                className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${categoryClass[book.category] ?? "bg-slate-50 text-slate-600"}`}
              >
                {book.category}
              </span>
            </td>
            <td className="px-4 py-3 text-slate-700">{book.copies}</td>
            <td
              className={`px-4 py-3 font-medium ${book.available === 0 ? "text-red-500" : "text-emerald-600"}`}
            >
              {book.available}
            </td>
            <td className="px-4 py-3">
              <StatusBadge label={book.status} tone={statusTone[book.status]} />
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1">
                <EditButton
                  onClick={() => {
                    setEditing(book);
                    setFormMode("edit");
                    openModal("book-form");
                  }}
                />
                <DeleteButton
                  onClick={() => {
                    setDeleting(book);
                    openModal("book-delete");
                  }}
                />
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      <FormModal
        id="book-form"
        key={editing?.id ?? "add"}
        title={formMode === "edit" ? "Edit Book" : "Add Book"}
        submitLabel={formMode === "edit" ? "Update Book" : "Add Book"}
        onSubmit={handleSave}
      >
        <FormField
          label="Title"
          name="title"
          placeholder="Book title"
          defaultValue={editing?.title}
        />
        <FormField
          label="Author"
          name="author"
          placeholder="Author name"
          defaultValue={editing?.author}
        />
        <FormField
          label="ISBN"
          name="isbn"
          placeholder="978-..."
          defaultValue={editing?.isbn}
        />
        <FormField
          label="Category"
          name="category"
          as="select"
          defaultValue={editing?.category ?? "Fiction"}
          options={[
            "Fiction",
            "Science",
            "Technology",
            "History",
            "Non-Fiction",
          ]}
        />
        <FormField
          label="Copies"
          name="copies"
          type="number"
          placeholder="0"
          defaultValue={editing ? String(editing.copies) : ""}
        />
      </FormModal>

      <ConfirmModal
        id="book-delete"
        title="Delete book"
        message={`Remove "${deleting?.title ?? "this book"}" from the catalog? This cannot be undone.`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => {
          setDeleting(null);
          feedback.success(
            "Book deleted",
            "The book was removed from the catalog.",
          );
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
