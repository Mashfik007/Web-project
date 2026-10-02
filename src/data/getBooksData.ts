import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";
import type { AdminBook, AdminBookStatus } from "@/types/adminCatalog";

type StoredBook = {
  _id: { toString(): string };
  title: string;
  author: string;
  coverImage?: string;
  availability?: {
    current?: number;
    total?: number;
  };
  metadata?: {
    isbn?: string;
    category?: string;
  };
};

export type BookFilters = {
  author?: string;
  category?: string;
  available?: string;
};

const coverByCategory: Record<string, string> = {
  Fiction: "bg-sky-100 text-sky-600",
  History: "bg-emerald-100 text-emerald-600",
  "Non-Fiction": "bg-teal-100 text-teal-600",
  Technology: "bg-cyan-100 text-cyan-600",
  Science: "bg-blue-100 text-blue-600",
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getBooksData(
  _adminId: string,
  filters: BookFilters = {},
): Promise<AdminBook[]> {
  await connectDB();

  const query: Record<string, unknown> = {};
  const author = filters.author?.trim();
  const category = filters.category?.trim();
  const available = filters.available?.trim().toLowerCase();

  if (author && author.toLowerCase() !== "all") {
    const pattern = new RegExp(escapeRegex(author), "i");
    query.$or = [{ title: pattern }, { author: pattern }];
  }

  if (category && category.toLowerCase() !== "all") {
    query["metadata.category"] = new RegExp(
      `^${escapeRegex(category)}$`,
      "i",
    );
  }

  if (available === "available") {
    query["availability.current"] = { $gt: 0 };
  } else if (available === "on loan") {
    query["availability.current"] = { $lte: 0 };
  } else if (available === "reserved") {
    query["availability.current"] = { $lt: 0 };
  }

  const books = await Book.find(query)
    .sort({ createdAt: -1 })
    .lean<StoredBook[]>();

  return books.map((book) => {
    const available = book.availability?.current ?? 0;
    const copies = book.availability?.total ?? 0;
    const category =
      book.metadata?.category ?? "";
    const status: AdminBookStatus = available === 0 ? "On Loan" : "Available";

    return {
      id: book._id.toString(),
      title: book.title,
      author: book.author,
      coverImage: book.coverImage ? `/api/uploads/${book.coverImage}` : "",
      isbn: book.metadata?.isbn ?? "",
      category,
      copies,
      available,
      status,
      coverClass: coverByCategory[category] ?? "bg-slate-100 text-slate-600",
    };
  });
}
