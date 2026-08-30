"use client";

import Image from "next/image";
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
import type { AdminDigitalResource } from "@/types/adminOps";

interface DigitalLibraryPageProps {
  resources: AdminDigitalResource[];
}

export default function DigitalLibraryPage({
  resources,
}: DigitalLibraryPageProps) {
  const [deleting, setDeleting] = useState<AdminDigitalResource | null>(null);
  const feedback = useFeedback();

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
        {resources.map((resource) => (
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
                  resource.format === "PDF" ? "badge-error" : "badge-secondary"
                }`}
              >
                {resource.format}
              </span>
            </div>
            <div className="p-4">
              <h3 className="truncate font-semibold text-slate-800">
                {resource.title}
              </h3>
              <p className="mt-0.5 text-xs text-slate-400">{resource.author}</p>
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
                    onClick={() =>
                      feedback.success(
                        "Download started",
                        `${resource.title} (${resource.size}) is ready.`,
                      )
                    }
                    className="btn btn-ghost btn-square btn-sm"
                    aria-label="Download"
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
        ))}
      </div>

      <FormModal
        id="upload-resource"
        title="Upload resource"
        submitLabel="Upload"
        onSubmit={(form) => {
          if (!formHasValues(form, ["title", "author", "format", "category"])) {
            feedback.failed(
              "Upload failed",
              "Please fill in all resource details.",
            );
            return;
          }
          feedback.success(
            "Resource uploaded",
            "The digital file is now in the library.",
          );
        }}
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
      </FormModal>

      <ConfirmModal
        id="delete-resource"
        title="Delete resource"
        message={`Remove "${deleting?.title ?? "this file"}" from the digital library?`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => {
          setDeleting(null);
          feedback.success("Resource deleted", "The file was removed.");
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
