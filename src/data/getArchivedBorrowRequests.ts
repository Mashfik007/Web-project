import connectDB from "@/dbConfig/dbConfig";
import { ArchivedBorrowRequest } from "@/Model/ArchivedBorrowRequests";

export type ArchivedBorrowRequestItem = {
  id: string;
  label: string;
};

type StoredArchive = {
  _id: { toString(): string };
  request?: {
    member?: string;
    book?: string;
  };
};

export async function getArchivedBorrowRequests(): Promise<
  ArchivedBorrowRequestItem[]
> {
  await connectDB();

  const archives = await ArchivedBorrowRequest.find()
    .sort({ archivedAt: -1 })
    .lean<StoredArchive[]>();

  return archives.map((archive) => ({
    id: archive._id.toString(),
    label: `${archive.request?.member || "Unknown"} — ${archive.request?.book || "Untitled"}`,
  }));
}
