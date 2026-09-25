import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";

export type ScannedBook = {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  isbn: string;
};

type BookHit = {
  _id: { toString(): string };
  title: string;
  author: string;
  coverImage?: string;
  metadata?: { isbn?: string };
};

function isObjectId(value: string) {
  return /^[a-f\d]{24}$/i.test(value);
}

function addCode(found: Set<string>, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return;
  found.add(trimmed);
  const compact = trimmed.replace(/[-\s]/g, "");
  if (compact) found.add(compact);
}

function codesFromScan(raw: string) {
  const found = new Set<string>();
  addCode(found, raw);

  const readUrl = (url: URL) => {
    const pathMatch = url.pathname.match(/\/(?:browsebook|checkout)\/([^/]+)/);
    if (pathMatch?.[1]) addCode(found, decodeURIComponent(pathMatch[1]));
    for (const key of ["bookId", "isbn", "code"]) {
      const param = url.searchParams.get(key);
      if (param) addCode(found, param);
    }
  };

  const value = raw.trim();
  for (const part of value.split(/[\s,;]+/)) addCode(found, part);
  for (const line of value.split(/\r?\n/)) {
    const labeled = line.match(/^(?:book\s*id|isbn|code|id)\s*[:=]\s*(.+)$/i);
    if (labeled?.[1]) addCode(found, labeled[1]);
  }
  try {
    readUrl(new URL(value));
  } catch {
    if (value.startsWith("/")) {
      try {
        readUrl(new URL(value, "http://local"));
      } catch {
        // The scan is plain text, not a link.
      }
    }
  }

  return [...found];
}

export async function lookupScannedBook(raw: string): Promise<ScannedBook | null> {
  const codes = codesFromScan(raw);
  if (codes.length === 0) return null;

  const ids = codes.filter(isObjectId);
  const filters = [
    ...(ids.length > 0 ? [{ _id: { $in: ids } }] : []),
    { "metadata.isbn": { $in: codes } },
  ];

  await connectDB();
  const book = await Book.findOne({ $or: filters })
    .select("title author coverImage metadata.isbn")
    .lean<BookHit | null>();
  if (!book) return null;

  return {
    id: book._id.toString(),
    title: book.title,
    author: book.author,
    coverImage: book.coverImage ? `/api/uploads/${book.coverImage}` : "/svg/book.svg",
    isbn: book.metadata?.isbn ?? "",
  };
}
