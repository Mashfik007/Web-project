import connectDB from "@/dbConfig/dbConfig";
import { ArchivedLibraryUser } from "@/Model/ArchivedLibraryUsers";

export type ArchivedUserItem = {
  id: string;
  name: string;
};

type StoredArchive = {
  _id: { toString(): string };
  user?: {
    name?: string;
  };
};

export async function getArchivedUsers(): Promise<ArchivedUserItem[]> {
  await connectDB();

  const archives = await ArchivedLibraryUser.find()
    .sort({ archivedAt: -1 })
    .lean<StoredArchive[]>();

  return archives.map((archive) => ({
    id: archive._id.toString(),
    name: archive.user?.name || "Untitled",
  }));
}
