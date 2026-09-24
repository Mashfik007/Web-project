import BookDetailsPage from "@/Components/BookDetails/BookDetailsPage/BookDetailsPage";
import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";
import type { BookDetails } from "@/types/bookDetails";
import mongoose from "mongoose";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string; bookId: string }>;
}

type BookRecord = {
  _id: { toString(): string };
  title: string;
  author: string;
  coverImage?: string;
  tags?: string[];
  rating?: {
    score?: number;
    totalRatings?: number;
    totalReviews?: number;
  };
  description?: string;
  price?: {
    amount?: number;
    currency?: string;
  };
  availability?: {
    current?: number;
    total?: number;
  };
  metadata?: {
    publisher?: string;
    language?: string;
    series?: string;
    isbn?: string;
    published?: number;
    copiesHeld?: string;
    pages?: number;
    genre?: string;
    deweyDecimal?: string;
  };
  community?: {
    totalOnShelf?: number;
    members?: BookDetails["community"]["members"];
  };
  matchScore?: {
    score?: number;
    maxScore?: number;
    label?: string;
    description?: string;
  };
};

function toBookDetails(book: BookRecord): BookDetails {
  return {
    id: book._id.toString(),
    title: book.title,
    author: book.author,
    coverImage: book.coverImage
      ? `/api/uploads/${book.coverImage}`
      : "/svg/book.svg",
    tags: book.tags ?? [],
    rating: {
      score: book.rating?.score ?? 0,
      totalRatings: book.rating?.totalRatings ?? 0,
      totalReviews: book.rating?.totalReviews ?? 0,
    },
    description: book.description ?? "",
    price: {
      amount: book.price?.amount ?? 0,
      currency: book.price?.currency ?? "৳",
    },
    availability: {
      current: book.availability?.current ?? 0,
      total: book.availability?.total ?? 0,
    },
    metadata: {
      publisher: book.metadata?.publisher ?? "",
      language: book.metadata?.language ?? "",
      series: book.metadata?.series ?? "",
      isbn: book.metadata?.isbn ?? "",
      published: book.metadata?.published ?? 0,
      copiesHeld: book.metadata?.copiesHeld ?? "",
      pages: book.metadata?.pages ?? 0,
      genre: book.metadata?.genre ?? "",
      deweyDecimal: book.metadata?.deweyDecimal ?? "",
    },
    community: {
      totalOnShelf: book.community?.totalOnShelf ?? 0,
      members: book.community?.members ?? [],
    },
    matchScore: {
      score: book.matchScore?.score ?? 0,
      maxScore: book.matchScore?.maxScore ?? 100,
      label: book.matchScore?.label ?? "",
      description: book.matchScore?.description ?? "",
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { id, bookId } = await params;

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    notFound();
  }

  await connectDB();
  const record = await Book.findById(bookId).lean<BookRecord | null>();

  if (!record) {
    notFound();
  }

  return (
    <BookDetailsPage
      book={toBookDetails(record)}
      userId={id}
      backHref={`/user/${id}/browsebook`}
      checkoutHref={`/user/${id}/checkout/${bookId}`}
    />
  );
}
