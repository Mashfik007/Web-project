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
    genre?: string;
  };
};

const coverByGenre: Record<string, string> = {
  Fiction: "bg-sky-100 text-sky-600",
  History: "bg-emerald-100 text-emerald-600",
  "Non-Fiction": "bg-teal-100 text-teal-600",
  Technology: "bg-cyan-100 text-cyan-600",
  Science: "bg-blue-100 text-blue-600",
};

export async function getBooksData(_adminId: string): Promise<AdminBook[]> {
  await connectDB();

  const books = await Book.find()
    .sort({ createdAt: -1 })
    .lean<StoredBook[]>();

  return books.map((book) => {
    const available = book.availability?.current ?? 0;
    const copies = book.availability?.total ?? 0;
    const category = book.metadata?.genre ?? "";
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
      coverClass: coverByGenre[category] ?? "bg-slate-100 text-slate-600",
    };
  });
}
