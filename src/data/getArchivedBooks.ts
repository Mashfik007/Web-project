import connectDB from "@/dbConfig/dbConfig";
import { ArchivedBook } from "@/Model/ArchivedBooks";

export type ArchivedBookItem = {
  id: string;
  title: string;
  author: string;
};

type StoredArchive = {
  _id: { toString(): string };
  book?: {
    title?: string;
    author?: string;
  };
};

export async function getArchivedBooks(): Promise<ArchivedBookItem[]> {
  await connectDB();

  const archives = await ArchivedBook.find()
    .sort({ archivedAt: -1 })
    .lean<StoredArchive[]>();

  return archives.map((archive) => ({
    id: archive._id.toString(),
    title: archive.book?.title || "Untitled",
    author: archive.book?.author || "Unknown author",
  }));
}
