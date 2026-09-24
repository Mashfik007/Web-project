import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";
import { BorrowRequest } from "@/Model/BorrowRequests";
import type {
  BorrowRequestStatus,
  BorrowRequestsData,
} from "@/types/borrowRequests";

type StoredRequest = {
  _id: { toString(): string };
  book: string;
  bookId?: string;
  requested: string;
  expectedReturn: string;
  status: "Pending" | "Approved" | "Rejected";
};

const statusMap: Record<StoredRequest["status"], BorrowRequestStatus> = {
  Pending: "pending",
  Approved: "approved",
  Rejected: "declined",
};

function coverPath(coverImage?: string) {
  return coverImage ? `/api/uploads/${coverImage}` : "/svg/book.svg";
}

export async function getUserBorrowRequests(
  userId: string,
): Promise<BorrowRequestsData> {
  await connectDB();

  const records = await BorrowRequest.find({ userId })
    .sort({ createdAt: -1 })
    .lean<StoredRequest[]>();

  const bookIds = records
    .map((record) => record.bookId)
    .filter((id): id is string => Boolean(id));
  const books = bookIds.length
    ? await Book.find({ _id: { $in: bookIds } })
        .select("coverImage")
        .lean<{ _id: { toString(): string }; coverImage?: string }[]>()
    : [];
  const covers = new Map(
    books.map((book) => [book._id.toString(), coverPath(book.coverImage)]),
  );

  const requests = records.map((record) => ({
    id: record._id.toString(),
    userName: "You",
    initials: "Me",
    avatarColor: "bg-sky-100 text-sky-700",
    bookTitle: record.book,
    coverImage: covers.get(record.bookId ?? "") ?? "/svg/book.svg",
    status: statusMap[record.status] ?? "pending",
    requestedAt: record.requested,
    expectedReturn: record.expectedReturn,
  }));

  const count = (status: BorrowRequestStatus | "all") =>
    status === "all"
      ? requests.length
      : requests.filter((request) => request.status === status).length;

  return {
    title: "Borrow Requests",
    subtitle: "Requests you sent, including ones the library cancelled",
    filters: [
      { id: "all", label: "All", status: "all", count: count("all") },
      { id: "pending", label: "Pending", status: "pending", count: count("pending") },
      { id: "approved", label: "Approved", status: "approved", count: count("approved") },
      { id: "declined", label: "Cancelled", status: "declined", count: count("declined") },
    ],
    requests,
  };
}
