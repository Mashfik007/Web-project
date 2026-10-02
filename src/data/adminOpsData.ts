import connectDB from "@/dbConfig/dbConfig";
import { DigitalResource } from "@/Model/DigitalResources";
import type { AdminDigitalResource } from "@/types/adminOps";

const coverByCategory: Record<string, string> = {
  Technology: "bg-sky-100 text-sky-600",
  Fiction: "bg-violet-100 text-violet-600",
  Science: "bg-amber-100 text-amber-600",
  "Non-Fiction": "bg-emerald-100 text-emerald-600",
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function getAdminDigitalResources(
  _adminId: string,
): Promise<AdminDigitalResource[]> {
  await connectDB();

  const resources = await DigitalResource.find()
    .sort({ createdAt: -1 })
    .lean();

  return resources.map((resource) => ({
    id: String(resource._id),
    title: resource.title,
    author: resource.author,
    format: resource.format as "PDF" | "EPUB",
    category: resource.category,
    downloads: resource.downloads ?? 0,
    size: formatFileSize(resource.size ?? 0),
    fileId: resource.fileId,
    coverClass:
      coverByCategory[resource.category] ?? "bg-slate-100 text-slate-600",
  }));
}
