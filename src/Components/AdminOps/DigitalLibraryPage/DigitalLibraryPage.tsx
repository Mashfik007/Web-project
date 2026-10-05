"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AdminPageShell from "@/Components/AdminCatalog/AdminPageShell/AdminPageShell";
import AdminSearchRow from "@/Components/AdminCatalog/AdminSearchRow/AdminSearchRow";
import FilterSelect from "@/Components/AdminCatalog/FilterSelect/FilterSelect";
import AdminCard from "@/Components/AdminOps/AdminCard/AdminCard";
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
  addDigitalResource,
  deleteDigitalResource,
} from "@/Controller/admin.controller";
import type { AdminDigitalResource } from "@/types/adminOps";

interface DigitalLibraryPageProps {
  resources: AdminDigitalResource[];
}

function readResourceForm(form: HTMLFormElement) {
  const data = new FormData(form);
  const text = (name: string) => String(data.get(name) ?? "").trim();
  const file = data.get("file");

  return {
    title: text("title"),
    author: text("author"),
    format: text("format") as "PDF" | "EPUB",
    category: text("category"),
    file: file instanceof File ? file : null,
  };
}

export default function DigitalLibraryPage({
  resources,
}: DigitalLibraryPageProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<AdminDigitalResource | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  const feedback = useFeedback();

  async function handleUpload(form: HTMLFormElement) {
    if (!formHasValues(form, ["title", "author", "format", "category"])) {
      feedback.failed(
        "Upload failed",
        "Please fill in all resource details.",
      );
      return;
    }

    const resource = readResourceForm(form);
    if (!resource.file || resource.file.size === 0) {
      feedback.failed("Upload failed", "Please choose a PDF or EPUB file.");
      return;
    }

    const result = await addDigitalResource(
      {
        title: resource.title,
        author: resource.author,
        format: resource.format,
        category: resource.category,
      },
      resource.file,
    );

    if (!result.ok) {
      feedback.failed("Upload failed", result.message);
      return;
    }

    setFormVersion((version) => version + 1);
    router.refresh();
    feedback.success("Resource uploaded", result.message);
  }

  async function handleDelete() {
    if (!deleting) {
      feedback.failed("Delete failed", "No resource selected.");
      return;
    }

    const result = await deleteDigitalResource(deleting.id);
    setDeleting(null);

    if (!result.ok) {
      feedback.failed("Delete failed", result.message);
      return;
    }

    router.refresh();
    feedback.success("Resource deleted", result.message);
  }

  return (
    <AdminPageShell
      title="Digital Library"
      subtitle="Manage eBooks, PDFs and digital resources"
      addLabel="Upload New"
      onAdd={() => openModal("upload-resource")}
      framed={false}
    >
      <AdminCard>
        <AdminSearchRow placeholder="Search digital resources...">
          <FilterSelect name="format" options={["All", "PDF", "EPUB"]} />
        </AdminSearchRow>
      </AdminCard>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {resources.length === 0 ? (
          <p className="col-span-full rounded-xl bg-base-100 px-4 py-10 text-center text-sm text-slate-500 shadow-sm">
            No digital resources yet. Upload a PDF or EPUB to get started.
          </p>
        ) : (
          resources.map((resource) => (
            <article
              key={resource.id}
              className="card bg-base-100 overflow-hidden shadow-sm"
            >
              <div
                className={`relative flex h-28 items-center justify-center ${resource.coverClass}`}
              >
                <Image
                  src="/svg/book.svg"
                  alt="Book"
                  width={16}
                  height={16}
                  className="size-10"
                />
                <span
                  className={`badge badge-sm absolute top-3 right-3 ${
                    resource.format === "PDF"
                      ? "badge-error"
                      : "badge-secondary"
                  }`}
                >
                  {resource.format}
                </span>
              </div>
              <div className="p-4">
                <h3 className="truncate font-semibold text-slate-800">
                  {resource.title}
                </h3>
                <p className="mt-0.5 text-xs text-slate-400">
                  {resource.author}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{resource.downloads} downloads</span>
                  <span>{resource.size}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="badge badge-soft badge-info badge-sm">
                    {resource.category}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="btn btn-ghost btn-square btn-sm"
                      aria-label="Download"
                      onClick={async () => {
                        try {
                          await fetch("/api/users/digital-resources/download", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: resource.id }),
                          });
                        } catch {
                          // Still open the file if logging fails.
                        }
                        window.open(
                          `/api/uploads/${resource.fileId}?download=1`,
                          "_blank",
                          "noopener,noreferrer",
                        );
                        router.refresh();
                      }}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleting(resource);
                        openModal("delete-resource");
                      }}
                      className="btn btn-error btn-soft btn-square btn-sm"
                      aria-label="Delete"
                    >
                      ⌫
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <FormModal
        key={formVersion}
        id="upload-resource"
        title="Upload resource"
        submitLabel="Upload"
        onSubmit={handleUpload}
      >
        <FormField label="Title" name="title" placeholder="Resource title" />
        <FormField label="Author" name="author" placeholder="Author" />
        <FormField
          label="Format"
          name="format"
          as="select"
          options={["PDF", "EPUB"]}
        />
        <FormField
          label="Category"
          name="category"
          as="select"
          options={["Technology", "Fiction", "Science", "Non-Fiction"]}
        />
        <FormField
          label="Digital file"
          name="file"
          type="file"
          accept=".pdf,.epub,application/pdf,application/epub+zip"
          required
        />
      </FormModal>

      <ConfirmModal
        id="delete-resource"
        title="Delete resource"
        message={`Do you want to really delete "${deleting?.title ?? "this file"}"?`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={handleDelete}
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
