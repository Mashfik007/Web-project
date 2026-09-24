import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";
import { Publisher } from "@/Model/Publishers";
import type { AdminPublisher } from "@/types/adminCatalog";

type StoredPublisher = {
  _id: { toString(): string };
  name: string;
  city: string;
  email: string;
  status: "Active" | "Inactive";
};

export async function getPublishersData(
  _adminId: string,
): Promise<AdminPublisher[]> {
  await connectDB();

  const [publishers, counts] = await Promise.all([
    Publisher.find().sort({ createdAt: -1 }).lean<StoredPublisher[]>(),
    Book.aggregate<{ _id: string; total: number }>([
      { $group: { _id: "$metadata.publisher", total: { $sum: 1 } } },
    ]),
  ]);

  const totals = new Map(
    counts.map((count) => [count._id?.toLowerCase() ?? "", count.total]),
  );

  return publishers.map((publisher) => ({
    id: publisher._id.toString(),
    name: publisher.name,
    city: publisher.city,
    email: publisher.email,
    totalBooks: totals.get(publisher.name.toLowerCase()) ?? 0,
    status: publisher.status,
  }));
}
