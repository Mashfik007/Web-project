import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";
import { DigitalResource } from "@/Model/DigitalResources";
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
    category?: string;
  };
};

type DigitalRecord = {
  _id: { toString(): string };
  title: string;
  author: string;
  format: "PDF" | "EPUB";
  category: string;
  fileId: string;
  size?: number;
  createdAt?: Date | string;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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
    category: book.metadata?.category ?? "",
  };
}

function toDigitalBrowseBook(resource: DigitalRecord): BrowseBook {
  const created = resource.createdAt ? new Date(resource.createdAt) : null;
  const year =
    created && !Number.isNaN(created.getTime())
      ? created.getFullYear()
      : new Date().getFullYear();

  return {
    id: resource._id.toString(),
    title: resource.title,
    author: resource.author,
    rating: 0,
    year,
    format: "DIGITAL",
    availability: "Available",
    image: "/svg/book.svg",
    category: resource.category,
    fileId: resource.fileId,
    digitalFormat: resource.format,
    sizeLabel: formatFileSize(resource.size ?? 0),
  };
}

export async function getBrowseBooks(): Promise<BrowseBook[]> {
  await connectDB();

  const [physical, digital] = await Promise.all([
    Book.find().sort({ createdAt: -1 }).lean<BookRecord[]>(),
    DigitalResource.find().sort({ createdAt: -1 }).lean<DigitalRecord[]>(),
  ]);

  return [
    ...digital.map(toDigitalBrowseBook),
    ...physical.map(toBrowseBook),
  ];
}
