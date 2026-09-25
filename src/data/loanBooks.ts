import { ArchivedBook } from "@/Model/ArchivedBooks";
import { Book } from "@/Model/Books";
import mongoose from "mongoose";

export type LoanBook = {
  _id: { toString(): string };
  title: string;
  author: string;
  coverImage?: string;
  metadata?: {
    pages?: number;
    genre?: string;
  };
};

export async function booksForLoans(bookIds: string[]) {
  const ids = [...new Set(bookIds.filter((id) => mongoose.Types.ObjectId.isValid(id)))];
  const books = new Map<string, LoanBook>();
  if (ids.length === 0) return books;

  const live = await Book.find({ _id: { $in: ids } }).lean<LoanBook[]>();
  for (const book of live) books.set(book._id.toString(), book);

  const missing = ids.filter((id) => !books.has(id));
  if (missing.length === 0) return books;

  const archives = await ArchivedBook.find({ originalId: { $in: missing } })
    .sort({ archivedAt: -1 })
    .lean<{ originalId: { toString(): string }; book?: LoanBook }[]>();

  for (const archive of archives) {
    const id = archive.originalId.toString();
    if (books.has(id) || !archive.book?.title) continue;
    books.set(id, {
      _id: { toString: () => id },
      title: archive.book.title,
      author: archive.book.author || "Library copy",
      coverImage: archive.book.coverImage,
      metadata: archive.book.metadata,
    });
  }

  return books;
}

export function bookOrKeptCopy(books: Map<string, LoanBook>, bookId: string): LoanBook {
  return (
    books.get(bookId) ?? {
      _id: { toString: () => bookId },
      title: "Borrowed book",
      author: "Still on your shelf",
    }
  );
}
