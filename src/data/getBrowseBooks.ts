import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";
import type { Book as BrowseBook, BookAvailability } from "@/types/book";

type BookRecord = {
  _id: { toString(): string };
  title: string;
  author: string;
  coverImage?: string;
  rating?: {
    score?: number;
  };
  availability?: {
    current?: number;
  };
  metadata?: {
    published?: number;
    genre?: string;
  };
};

function toBrowseBook(book: BookRecord): BrowseBook {
  const copies = book.availability?.current ?? 0;
  const availability: BookAvailability = copies > 0 ? "Available" : "On Loan";

  return {
    id: book._id.toString(),
    title: book.title,
    author: book.author,
    rating: book.rating?.score ?? 0,
    year: book.metadata?.published ?? 0,
    format: "PHYSICAL",
    availability,
    image: book.coverImage ? `/api/uploads/${book.coverImage}` : "/svg/book.svg",
    genre: book.metadata?.genre ?? "",
  };
}

export async function getBrowseBooks(): Promise<BrowseBook[]> {
  await connectDB();
  const records = await Book.find().sort({ createdAt: -1 }).lean<BookRecord[]>();
  return records.map(toBrowseBook);
}
