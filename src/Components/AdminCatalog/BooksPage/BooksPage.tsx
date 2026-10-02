"use client";

import Image from "next/image";
// books catalog for admin — add, edit, delete
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminPageShell from "@/Components/AdminCatalog/AdminPageShell/AdminPageShell";
import CopyText from "@/Components/AdminCatalog/CopyText/CopyText";
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
import {
  addBooks,
  deleteBook,
  getBook,
  restoreBook,
  updateBook,
} from "@/Controller/admin.controller";
import type { ArchivedBookItem } from "@/data/getArchivedBooks";
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

const categoryOptions = [
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
  "metadata.category",
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
      category: text("metadata.category"),
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

type EditableBook = {
  title?: string;
  author?: string;
  coverImage?: string;
  tags?: string[];
  description?: string;
  rating?: {
    score?: number;
    totalRatings?: number;
    totalReviews?: number;
  };
  price?: {
    amount?: number;
    currency?: string;
  };
  availability?: {
    current?: number;
    total?: number;
  };
  metadata?: {
    publisher?: string;
    language?: string;
    series?: string;
    isbn?: string;
    published?: number;
    copiesHeld?: string;
    pages?: number;
    category?: string;
    deweyDecimal?: string;
  };
  community?: {
    totalOnShelf?: number;
    members?: {
      id: string;
      name: string;
      initials: string;
      color: string;
    }[];
  };
  matchScore?: {
    score?: number;
    maxScore?: number;
    label?: string;
    description?: string;
  };
};

function fieldText(value: string | number | undefined | null) {
  return value == null ? "" : String(value);
}

interface BooksPageProps {
  adminId: string;
  books: AdminBook[];
  archivedBooks: ArchivedBookItem[];
  author: string;
  category: string;
  available: string;
}

export default function BooksPage({
  adminId,
  books,
  archivedBooks,
  author,
  category,
  available,
}: BooksPageProps) {
  const router = useRouter();
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  const [editing, setEditing] = useState<AdminBook | null>(null);
  const [editingBook, setEditingBook] = useState<EditableBook | null>(null);
  const [deleting, setDeleting] = useState<AdminBook | null>(null);
  const [search, setSearch] = useState(author.toLowerCase() === "all" ? "" : author);
  const [archiveId, setArchiveId] = useState("");
  const feedback = useFeedback();

  useEffect(() => {
    setSearch(author.toLowerCase() === "all" ? "" : author);
  }, [author]);

  useEffect(() => {
    const nextAuthor = search.trim() || "all";
    if (nextAuthor === author) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams({
        author: nextAuthor,
        category,
        available,
      });
      router.replace(`/admin/${adminId}/books?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, author, category, available, adminId, router]);

  async function handleRestore() {
    if (!archiveId) {
      feedback.failed(
        "Could not restore book",
        "Select an archived book first.",
      );
      return;
    }

    const result = await restoreBook(archiveId);
    if (!result.ok) {
      feedback.failed("Could not restore book", result.message);
      return;
    }

    setArchiveId("");
    router.refresh();
    feedback.success("Book restored", result.message);
  }

  function updateFilters(next: { category?: string; available?: string }) {
    const params = new URLSearchParams({
      author,
      category: next.category ?? category,
      available: next.available ?? available,
    });
    router.replace(`/admin/${adminId}/books?${params.toString()}`);
  }

  async function openEditor(book: AdminBook) {
    const details = (await getBook(book.id)) as EditableBook | null;
    if (!details) {
      feedback.failed(
        "Could not open book",
        "The book details could not be loaded.",
      );
      return;
    }
    setEditing(book);
    setEditingBook(details);
    setFormMode("edit");
    setFormVersion((version) => version + 1);
    openModal("book-form");
  }

  async function handleSave(form: HTMLFormElement) {
    const requiredFields =
      formMode === "edit"
        ? bookFormFields.filter((name) => name !== "coverImage")
        : bookFormFields;
    if (!formHasValues(form, requiredFields)) {
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
      const result = await addBooks(
        {
          ...book,
          coverImage: book.coverImage.name,
        },
        book.coverImage,
      );
      if (!result.ok) {
        feedback.failed("Could not save book", result.message);
        return;
      }
      router.refresh();
      feedback.success("Book added", result.message);
      return;
    }
    if (formMode === "edit") {
      if (!editing || !editingBook) {
        feedback.failed(
          "Could not update book",
          "The book details could not be loaded.",
        );
        return;
      }
      const book = readBookForm(form);
      const image =
        book.coverImage && book.coverImage.size > 0
          ? book.coverImage
          : undefined;
      const result = await updateBook(
        editing.id,
        {
          ...book,
          coverImage: editingBook.coverImage || editing.coverImage,
          community: {
            totalOnShelf: book.community.totalOnShelf,
            members: editingBook.community?.members ?? [],
          },
        },
        image,
      );
      if (!result.ok) {
        feedback.failed("Could not update book", result.message);
        return;
      }
      router.refresh();
      feedback.success("Book updated", result.message);
    }
  }

  return (
    <AdminPageShell
      title="Books"
      subtitle="Manage your entire book catalog"
      addLabel="Add Book"
      onAdd={() => {
        setEditing(null);
        setEditingBook(null);
        setFormMode("add");
        setFormVersion((version) => version + 1);
        openModal("book-form");
      }}
    >
      <AdminSearchRow
        placeholder="Search title or author..."
        value={search}
        onChange={setSearch}
      >
        <FilterSelect
          name="category"
          options={["all", ...categoryOptions]}
          value={category}
          onChange={(value) => updateFilters({ category: value })}
        />
        <FilterSelect
          name="available"
          options={["all", "Available", "On Loan", "Reserved"]}
          value={available}
          onChange={(value) => updateFilters({ available: value })}
        />
        <select
          name="archive"
          className="select"
          value={archiveId}
          onChange={(event) => setArchiveId(event.target.value)}
        >
          <option value="">Restore from archive</option>
          {archivedBooks.map((archive) => (
            <option key={archive.id} value={archive.id}>
              {archive.title} — {archive.author}
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
          "Cover",
          "Title & Author",
          "ISBN",
          "Category",
          "Copies",
          "Available",
          "Status",
          "Actions",
        ]}
        from={books.length === 0 ? 0 : 1}
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
                <CopyText value={book.id} label="Copy ID" />
                <EditButton
                  onClick={() => {
                    void openEditor(book);
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
        key={formVersion}
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
            defaultValue={editingBook?.title ?? editing?.title}
            required
          />
          <FormField
            label="Author"
            name="author"
            placeholder="Matt Haig"
            defaultValue={editingBook?.author ?? editing?.author}
            required
          />
          {formMode === "edit" && editing?.coverImage ? (
            <img
              src={editing.coverImage}
              alt={editing.title}
              className="size-16 rounded-lg object-cover"
            />
          ) : null}
          <FormField
            label={
              formMode === "edit"
                ? "Cover image (leave empty to keep the current one)"
                : "Cover image"
            }
            name="coverImage"
            type="file"
            accept="image/*"
            required={formMode !== "edit"}
          />
          <FormField
            label="Tags"
            name="tags"
            placeholder="Fiction, 2020, 288 pages"
            defaultValue={editingBook?.tags?.join(", ")}
            required
          />
          <FormField
            label="Description"
            name="description"
            as="textarea"
            placeholder="Book description"
            defaultValue={editingBook?.description}
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
            defaultValue={fieldText(editingBook?.rating?.score)}
            required
          />
          <FormField
            label="Total ratings"
            name="rating.totalRatings"
            type="number"
            placeholder="1836"
            min={0}
            step={1}
            defaultValue={fieldText(editingBook?.rating?.totalRatings)}
            required
          />
          <FormField
            label="Total reviews"
            name="rating.totalReviews"
            type="number"
            placeholder="581"
            min={0}
            step={1}
            defaultValue={fieldText(editingBook?.rating?.totalReviews)}
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
            defaultValue={fieldText(editingBook?.price?.amount)}
            required
          />
          <FormField
            label="Currency"
            name="price.currency"
            placeholder="৳"
            defaultValue={editingBook?.price?.currency ?? "৳"}
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
            defaultValue={fieldText(
              editingBook?.availability?.current ?? editing?.available,
            )}
            required
          />
          <FormField
            label="Total copies"
            name="availability.total"
            type="number"
            placeholder="4"
            min={0}
            step={1}
            defaultValue={fieldText(
              editingBook?.availability?.total ?? editing?.copies,
            )}
            required
          />

          <FormSection title="Metadata" />
          <FormField
            label="Publisher"
            name="metadata.publisher"
            placeholder="Canongate Books"
            defaultValue={editingBook?.metadata?.publisher}
            required
          />
          <FormField
            label="Language"
            name="metadata.language"
            placeholder="English"
            defaultValue={editingBook?.metadata?.language ?? "English"}
            required
          />
          <FormField
            label="Series"
            name="metadata.series"
            placeholder="Standalone"
            defaultValue={editingBook?.metadata?.series}
            required
          />
          <FormField
            label="ISBN"
            name="metadata.isbn"
            placeholder="978-1-78689-274-4"
            defaultValue={editingBook?.metadata?.isbn ?? editing?.isbn}
            required
          />
          <FormField
            label="Published year"
            name="metadata.published"
            type="number"
            placeholder="2020"
            min={0}
            step={1}
            defaultValue={fieldText(editingBook?.metadata?.published)}
            required
          />
          <FormField
            label="Copies held"
            name="metadata.copiesHeld"
            placeholder="4 copies across 3 branches"
            defaultValue={editingBook?.metadata?.copiesHeld}
            required
          />
          <FormField
            label="Pages"
            name="metadata.pages"
            type="number"
            placeholder="288"
            min={1}
            step={1}
            defaultValue={fieldText(editingBook?.metadata?.pages)}
            required
          />
          <FormField
            label="Category"
            name="metadata.category"
            as="select"
            defaultValue={
              editingBook?.metadata?.category ??
              editing?.category ??
              "Fiction"
            }
            options={
              editingBook?.metadata?.category &&
              !categoryOptions.includes(editingBook.metadata.category)
                ? [...categoryOptions, editingBook.metadata.category]
                : categoryOptions
            }
            required
          />
          <FormField
            label="Dewey decimal"
            name="metadata.deweyDecimal"
            placeholder="823.14"
            defaultValue={editingBook?.metadata?.deweyDecimal}
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
            defaultValue={fieldText(editingBook?.community?.totalOnShelf)}
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
            defaultValue={fieldText(editingBook?.matchScore?.score)}
            required
          />
          <FormField
            label="Max score"
            name="matchScore.maxScore"
            type="number"
            placeholder="100"
            min={0}
            step={1}
            defaultValue={fieldText(editingBook?.matchScore?.maxScore ?? 100)}
            required
          />
          <FormField
            label="Label"
            name="matchScore.label"
            placeholder="Strong Match"
            defaultValue={editingBook?.matchScore?.label}
            required
          />
          <FormField
            label="Description"
            name="matchScore.description"
            as="textarea"
            placeholder="Why this book matches the reader"
            defaultValue={editingBook?.matchScore?.description}
            required
          />
        </div>
      </FormModal>

      <ConfirmModal
        id="book-delete"
        title="Delete book"
        message={`Do you want to really delete "${deleting?.title ?? "this book"}"?`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => {
          const id = deleting?.id;
          setDeleting(null);
          if (!id) return;

          void deleteBook(id).then((result) => {
            if (!result.ok) {
              feedback.failed("Could not delete book", result.message);
              return;
            }
            feedback.success("Book deleted", result.message);
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
