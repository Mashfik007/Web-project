import connectDB from "@/dbConfig/dbConfig";
import { ArchivedPublisher } from "@/Model/ArchivedPublishers";

export type ArchivedPublisherItem = {
  id: string;
  name: string;
};

type StoredArchive = {
  _id: { toString(): string };
  publisher?: {
    name?: string;
  };
};

export async function getArchivedPublishers(): Promise<ArchivedPublisherItem[]> {
  await connectDB();

  const archives = await ArchivedPublisher.find()
    .sort({ archivedAt: -1 })
    .lean<StoredArchive[]>();

  return archives.map((archive) => ({
    id: archive._id.toString(),
    name: archive.publisher?.name || "Untitled",
  }));
}
