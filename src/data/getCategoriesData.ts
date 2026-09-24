import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";
import { Category } from "@/Model/Categories";
import type { AdminCategory } from "@/types/adminCatalog";

type StoredCategory = {
  _id: { toString(): string };
  name: string;
  description: string;
  status: "Active" | "Inactive";
};

export async function getCategoriesData(
  _adminId: string,
): Promise<AdminCategory[]> {
  await connectDB();

  const [categories, counts] = await Promise.all([
    Category.find().sort({ createdAt: -1 }).lean<StoredCategory[]>(),
    Book.aggregate<{ _id: string; total: number }>([
      { $group: { _id: "$metadata.genre", total: { $sum: 1 } } },
    ]),
  ]);

  const totals = new Map(
    counts.map((count) => [count._id?.toLowerCase() ?? "", count.total]),
  );

  return categories.map((category) => ({
    id: category._id.toString(),
    name: category.name,
    description: category.description,
    totalBooks: totals.get(category.name.toLowerCase()) ?? 0,
    status: category.status,
  }));
}
