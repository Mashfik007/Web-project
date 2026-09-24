import connectDB from "@/dbConfig/dbConfig";
import { ArchivedAuthor } from "@/Model/ArchivedAuthors";

export type ArchivedAuthorItem = {
  id: string;
  name: string;
};

type StoredArchive = {
  _id: { toString(): string };
  author?: {
    name?: string;
  };
};

export async function getArchivedAuthors(): Promise<ArchivedAuthorItem[]> {
  await connectDB();

  const archives = await ArchivedAuthor.find()
    .sort({ archivedAt: -1 })
    .lean<StoredArchive[]>();

  return archives.map((archive) => ({
    id: archive._id.toString(),
    name: archive.author?.name || "Untitled",
  }));
}
