"use client";

import Image from "next/image";
// books catalog for admin — add, edit, delete
import { useRouter } from "next/navigation";
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
import { addBooks, deleteBook } from "@/Controller/admin.controller";
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

const genres = [
  "Fiction",
  "Science",
  "Technology",
  "History",
  "Non-Fiction",
];

const bookFormFields = [
  "title",
  "author",
  "coverImage",
  "tags",
  "rating.score",
  "rating.totalRatings",
  "rating.totalReviews",
  "description",
  "price.amount",
  "price.currency",
  "availability.current",
  "availability.total",
  "metadata.publisher",
  "metadata.language",
  "metadata.series",
  "metadata.isbn",
  "metadata.published",
  "metadata.copiesHeld",
  "metadata.pages",
  "metadata.genre",
  "metadata.deweyDecimal",
  "community.totalOnShelf",
  "matchScore.score",
  "matchScore.maxScore",
  "matchScore.label",
  "matchScore.description",
];

function FormSection({ title }: { title: string }) {
  return (
    <p className="pt-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
      {title}
    </p>
  );
}

function readBookForm(form: HTMLFormElement) {
  const data = new FormData(form);
  const text = (name: string) => String(data.get(name) ?? "").trim();
  const number = (name: string) => Number(text(name));
  const cover = data.get("coverImage");

  return {
    title: text("title"),
    author: text("author"),
    coverImage: cover instanceof File ? cover : null,
    tags: text("tags")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    rating: {
      score: number("rating.score"),
      totalRatings: number("rating.totalRatings"),
      totalReviews: number("rating.totalReviews"),
    },
    description: text("description"),
    price: {
      amount: number("price.amount"),
      currency: text("price.currency"),
    },
    availability: {
      current: number("availability.current"),
      total: number("availability.total"),
    },
    metadata: {
      publisher: text("metadata.publisher"),
      language: text("metadata.language"),
      series: text("metadata.series"),
      isbn: text("metadata.isbn"),
      published: number("metadata.published"),
      copiesHeld: text("metadata.copiesHeld"),
      pages: number("metadata.pages"),
      genre: text("metadata.genre"),
      deweyDecimal: text("metadata.deweyDecimal"),
    },
    community: {
      totalOnShelf: number("community.totalOnShelf"),
      members: [],
    },
    matchScore: {
      score: number("matchScore.score"),
      maxScore: number("matchScore.maxScore"),
      label: text("matchScore.label"),
      description: text("matchScore.description"),
    },
  };
}

interface BooksPageProps {
  books: AdminBook[];
}

export default function BooksPage({ books }: BooksPageProps) {
  const router = useRouter();
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<AdminBook | null>(null);
  const [deleting, setDeleting] = useState<AdminBook | null>(null);
  const feedback = useFeedback();

  async function handleSave(form: HTMLFormElement) {
    if (!formHasValues(form, bookFormFields)) {
      feedback.failed(
        "Could not save book",
        "Please fill in every field and try again.",
      );
      return;
    }
    if (formMode === "add") {
      const book = readBookForm(form);
      if (!book.coverImage) {
        feedback.failed(
          "Could not save book",
          "Please choose a cover image.",
        );
        return;
      }
      const saved = await addBooks(
        {
          ...book,
          coverImage: book.coverImage.name,
        },
        book.coverImage,
      );
      if (!saved) {
        feedback.failed(
          "Could not save book",
          "The book could not be saved.",
        );
        return;
      }
      router.refresh();
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
          options={["All", ...genres]}
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
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="size-9 rounded-lg object-cover"
                />
              ) : (
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
              )}
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
        <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
          <FormSection title="Book" />
          <FormField
            label="Title"
            name="title"
            placeholder="The Midnight Library"
            defaultValue={editing?.title}
            required
          />
          <FormField
            label="Author"
            name="author"
            placeholder="Matt Haig"
            defaultValue={editing?.author}
            required
          />
          <FormField
            label="Cover image"
            name="coverImage"
            type="file"
            accept="image/*"
            required
          />
          <FormField
            label="Tags"
            name="tags"
            placeholder="Fiction, 2020, 288 pages"
            required
          />
          <FormField
            label="Description"
            name="description"
            as="textarea"
            placeholder="Book description"
            required
          />

          <FormSection title="Rating" />
          <FormField
            label="Score"
            name="rating.score"
            type="number"
            placeholder="4.8"
            min={0}
            max={5}
            step={0.1}
            required
          />
          <FormField
            label="Total ratings"
            name="rating.totalRatings"
            type="number"
            placeholder="1836"
            min={0}
            step={1}
            required
          />
          <FormField
            label="Total reviews"
            name="rating.totalReviews"
            type="number"
            placeholder="581"
            min={0}
            step={1}
            required
          />

          <FormSection title="Price" />
          <FormField
            label="Amount"
            name="price.amount"
            type="number"
            placeholder="350"
            min={0}
            step={1}
            required
          />
          <FormField
            label="Currency"
            name="price.currency"
            placeholder="৳"
            defaultValue="৳"
            required
          />

          <FormSection title="Availability" />
          <FormField
            label="Current copies"
            name="availability.current"
            type="number"
            placeholder="2"
            min={0}
            step={1}
            defaultValue={editing ? String(editing.available) : ""}
            required
          />
          <FormField
            label="Total copies"
            name="availability.total"
            type="number"
            placeholder="4"
            min={0}
            step={1}
            defaultValue={editing ? String(editing.copies) : ""}
            required
          />

          <FormSection title="Metadata" />
          <FormField
            label="Publisher"
            name="metadata.publisher"
            placeholder="Canongate Books"
            required
          />
          <FormField
            label="Language"
            name="metadata.language"
            placeholder="English"
            defaultValue="English"
            required
          />
          <FormField
            label="Series"
            name="metadata.series"
            placeholder="Standalone"
            required
          />
          <FormField
            label="ISBN"
            name="metadata.isbn"
            placeholder="978-1-78689-274-4"
            defaultValue={editing?.isbn}
            required
          />
          <FormField
            label="Published year"
            name="metadata.published"
            type="number"
            placeholder="2020"
            min={0}
            step={1}
            required
          />
          <FormField
            label="Copies held"
            name="metadata.copiesHeld"
            placeholder="4 copies across 3 branches"
            required
          />
          <FormField
            label="Pages"
            name="metadata.pages"
            type="number"
            placeholder="288"
            min={1}
            step={1}
            required
          />
          <FormField
            label="Genre"
            name="metadata.genre"
            as="select"
            defaultValue={editing?.category ?? "Fiction"}
            options={genres}
            required
          />
          <FormField
            label="Dewey decimal"
            name="metadata.deweyDecimal"
            placeholder="823.14"
            required
          />

          <FormSection title="Community" />
          <FormField
            label="Total on shelf"
            name="community.totalOnShelf"
            type="number"
            placeholder="7"
            min={0}
            step={1}
            required
          />

          <FormSection title="Match score" />
          <FormField
            label="Score"
            name="matchScore.score"
            type="number"
            placeholder="87"
            min={0}
            step={1}
            required
          />
          <FormField
            label="Max score"
            name="matchScore.maxScore"
            type="number"
            placeholder="100"
            min={0}
            step={1}
            defaultValue="100"
            required
          />
          <FormField
            label="Label"
            name="matchScore.label"
            placeholder="Strong Match"
            required
          />
          <FormField
            label="Description"
            name="matchScore.description"
            as="textarea"
            placeholder="Why this book matches the reader"
            required
          />
        </div>
      </FormModal>

      <ConfirmModal
        id="book-delete"
        title="Delete book"
        message={`Remove "${deleting?.title ?? "this book"}" from the catalog? This cannot be undone.`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => {
          const id = deleting?.id;
          setDeleting(null);
          if (!id) return;

          void deleteBook(id).then((deleted) => {
            if (!deleted) {
              feedback.failed(
                "Could not delete book",
                "The book is still in the catalog.",
              );
              return;
            }
            feedback.success(
              "Book deleted",
              "The book was removed from the catalog.",
            );
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
