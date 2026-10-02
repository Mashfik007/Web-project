import DigitalBookDetails from "@/Components/Browse/DigitalBookDetails/DigitalBookDetails";
import connectDB from "@/dbConfig/dbConfig";
import { DigitalResource } from "@/Model/DigitalResources";
import mongoose from "mongoose";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string; resourceId: string }>;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function Page({ params }: PageProps) {
  const { id, resourceId } = await params;

  if (!mongoose.Types.ObjectId.isValid(resourceId)) {
    notFound();
  }

  await connectDB();
  const resource = await DigitalResource.findById(resourceId).lean<{
    _id: { toString(): string };
    title: string;
    author: string;
    format: "PDF" | "EPUB";
    category: string;
    fileId: string;
    size?: number;
    downloads?: number;
    createdAt?: Date | string;
  } | null>();

  if (!resource) {
    notFound();
  }

  const created = resource.createdAt ? new Date(resource.createdAt) : null;
  const year =
    created && !Number.isNaN(created.getTime())
      ? created.getFullYear()
      : new Date().getFullYear();

  return (
    <DigitalBookDetails
      book={{
        id: resource._id.toString(),
        title: resource.title,
        author: resource.author,
        format: resource.format,
        category: resource.category,
        fileId: resource.fileId,
        sizeLabel: formatFileSize(resource.size ?? 0),
        downloads: resource.downloads ?? 0,
        year,
      }}
      backHref={`/user/${id}/browsebook`}
    />
  );
}
