import connectDB from "@/dbConfig/dbConfig";
import { ArchivedCategory } from "@/Model/ArchivedCategories";

export type ArchivedCategoryItem = {
  id: string;
  name: string;
};

type StoredArchive = {
  _id: { toString(): string };
  category?: {
    name?: string;
  };
};

export async function getArchivedCategories(): Promise<ArchivedCategoryItem[]> {
  await connectDB();

  const archives = await ArchivedCategory.find()
    .sort({ archivedAt: -1 })
    .lean<StoredArchive[]>();

  return archives.map((archive) => ({
    id: archive._id.toString(),
    name: archive.category?.name || "Untitled",
  }));
}
