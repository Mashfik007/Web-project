import BookDetailsPage from "@/Components/BookDetails/BookDetailsPage/BookDetailsPage";
import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";
import { ShelfLoan } from "@/Model/ShelfLoans";
import { User } from "@/Model/Users";
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

  const loans = await ShelfLoan.find({ bookId, status: "reading", userId: { $ne: id } })
    .select("userId")
    .lean<{ userId: string }[]>();
  const holderIds = [...new Set(loans.map((loan) => loan.userId))].filter((holderId) =>
    mongoose.Types.ObjectId.isValid(holderId),
  );
  const accounts = holderIds.length
    ? await User.find({ _id: { $in: holderIds }, isAdmin: { $ne: true } })
        .select("name")
        .lean<{ _id: { toString(): string }; name?: string }[]>()
    : [];
  const colors = ["bg-sky-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];
  const holders = accounts.map((account) => {
    const name = account.name?.trim() || "Reader";
    const letters = name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
    const code = name.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
    return {
      id: account._id.toString(),
      name,
      initials: letters || "R",
      color: colors[code % colors.length],
    };
  });

  const book = toBookDetails(record);
  book.community = {
    totalOnShelf: holders.length,
    members: holders,
  };

  return (
    <BookDetailsPage
      book={book}
      userId={id}
      backHref={`/user/${id}/browsebook`}
      checkoutHref={`/user/${id}/checkout/${bookId}`}
    />
  );
}
