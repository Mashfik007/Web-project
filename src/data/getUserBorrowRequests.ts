import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";
import { BorrowRequest } from "@/Model/BorrowRequests";
import { User } from "@/Model/Users";
import type {
  BorrowRequestStatus,
  BorrowRequestsData,
} from "@/types/borrowRequests";
import mongoose from "mongoose";

type StoredRequest = {
  _id: { toString(): string };
  book: string;
  bookId?: string;
  userId?: string;
  ownerId?: string;
  requested: string;
  expectedReturn: string;
  status: "Pending" | "Approved" | "Rejected";
  reason?: string;
};

const statusMap: Record<StoredRequest["status"], BorrowRequestStatus> = {
  Pending: "pending",
  Approved: "approved",
  Rejected: "declined",
};

const colors = [
  "bg-sky-500 text-white",
  "bg-violet-500 text-white",
  "bg-emerald-500 text-white",
  "bg-amber-500 text-white",
  "bg-rose-500 text-white",
];

function coverPath(coverImage?: string) {
  return coverImage ? `/api/uploads/${coverImage}` : "/svg/book.svg";
}

function initials(name: string) {
  const letters = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "");
  return letters.join("") || "R";
}

function colorFor(name: string) {
  const code = name.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return colors[code % colors.length];
}

export async function getUserBorrowRequests(
  userId: string,
): Promise<BorrowRequestsData> {
  await connectDB();

  const records = await BorrowRequest.find({
    $or: [{ userId }, { ownerId: userId }],
  })
    .sort({ createdAt: -1 })
    .lean<StoredRequest[]>();

  const bookIds = records
    .map((record) => record.bookId)
    .filter((id): id is string => typeof id === "string" && mongoose.Types.ObjectId.isValid(id));
  const personIds = records
    .flatMap((record) => [record.userId, record.ownerId])
    .filter((id): id is string => typeof id === "string" && mongoose.Types.ObjectId.isValid(id));

  const [books, people] = await Promise.all([
    bookIds.length
      ? Book.find({ _id: { $in: bookIds } })
          .select("coverImage")
          .lean<{ _id: { toString(): string }; coverImage?: string }[]>()
      : [],
    personIds.length
      ? User.find({ _id: { $in: personIds } })
          .select("name")
          .lean<{ _id: { toString(): string }; name?: string }[]>()
      : [],
  ]);
  const covers = new Map(
    books.map((book) => [book._id.toString(), coverPath(book.coverImage)]),
  );
  const names = new Map(
    people.map((person) => [person._id.toString(), person.name?.trim() || "Reader"]),
  );

  const requests = records.map((record) => {
    const received = record.ownerId === userId;
    const counterpart = received
      ? names.get(record.userId ?? "") || "A reader"
      : record.ownerId
        ? names.get(record.ownerId) || "A reader"
        : "Library";
    return {
      id: record._id.toString(),
      userName: counterpart,
      initials: counterpart === "Library" ? "LB" : initials(counterpart),
      avatarColor:
        counterpart === "Library" ? "bg-sky-100 text-sky-700" : colorFor(counterpart),
      bookTitle: record.book,
      coverImage: covers.get(record.bookId ?? "") ?? "/svg/book.svg",
      status: statusMap[record.status] ?? "pending",
      requestedAt: record.requested,
      expectedReturn: record.expectedReturn,
      reason: record.reason ?? "",
      direction: received ? ("received" as const) : ("sent" as const),
      counterpart,
    };
  });

  const count = (status: BorrowRequestStatus | "all") =>
    status === "all"
      ? requests.length
      : requests.filter((request) => request.status === status).length;

  return {
    title: "Borrow Requests",
    subtitle: "Requests you sent to the library or another reader, and requests waiting on you",
    filters: [
      { id: "all", label: "All", status: "all", count: count("all") },
      { id: "pending", label: "Pending", status: "pending", count: count("pending") },
      { id: "approved", label: "Approved", status: "approved", count: count("approved") },
      { id: "declined", label: "Declined", status: "declined", count: count("declined") },
    ],
    requests,
  };
}
