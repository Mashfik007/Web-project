import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";
import { BorrowRequest } from "@/Model/BorrowRequests";
import { FriendRequest } from "@/Model/FriendRequests";
import { ReadingActivity } from "@/Model/ReadingActivities";
import { ShelfLoan } from "@/Model/ShelfLoans";
import { User } from "@/Model/Users";
import type {
  CommunityBook,
  CommunityBorrowStep,
  CommunityShelfData,
  FriendStatus,
} from "@/types/communityShelf";
import mongoose from "mongoose";

const colors = [
  "bg-sky-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
];

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

function dayKey(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy.toISOString().slice(0, 10);
}

function streakFor(logs: { loggedAt?: Date }[]) {
  const active = new Set(
    logs.filter((log) => log.loggedAt).map((log) => dayKey(new Date(log.loggedAt as Date))),
  );
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  if (!active.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (active.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function coverOf(book?: { title: string; author: string; coverImage?: string }): CommunityBook {
  return {
    title: book?.title ?? "Nothing checked out",
    author: book?.author ?? "Library catalog",
    coverImage: book?.coverImage ? `/api/uploads/${book.coverImage}` : "/svg/book.svg",
  };
}

function timeAgo(date?: Date) {
  if (!date) return "recently";
  const minutes = Math.max(1, Math.round((Date.now() - new Date(date).getTime()) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export async function getCommunityShelf(userId: string): Promise<CommunityShelfData> {
  await connectDB();

  const [accounts, friendRows, loans, requests, activities, bookCount, approved] =
    await Promise.all([
      User.find().select("name").sort({ name: 1 }).lean<
        { _id: { toString(): string }; name: string }[]
      >(),
      FriendRequest.find({
        $or: [{ fromId: userId }, { toId: userId }],
      }).lean<{ fromId: string; toId: string; status: "pending" | "accepted" | "declined" }[]>(),
      ShelfLoan.find({ status: { $in: ["reading", "returned"] } }).lean<
        {
          userId: string;
          bookId: string;
          status: "reading" | "returned";
          currentPage?: number;
          updatedAt?: Date;
        }[]
      >(),
      BorrowRequest.find({ userId }).sort({ createdAt: -1 }).lean<
        { book: string; status: "Pending" | "Approved" | "Rejected"; bookId?: string }[]
      >(),
      ReadingActivity.find().sort({ loggedAt: -1 }).lean<
        { userId: string; bookId: string; page?: number; loggedAt?: Date }[]
      >(),
      Book.countDocuments(),
      BorrowRequest.find({ status: "Approved" }).select("userId bookId").lean<
        { userId?: string; bookId?: string }[]
      >(),
    ]);

  const approvedLoans = new Set(
    approved
      .filter((item) => item.userId && item.bookId)
      .map((item) => `${item.userId}:${item.bookId}`),
  );
  const readingLoans = loans.filter(
    (loan) => loan.status === "reading" && approvedLoans.has(`${loan.userId}:${loan.bookId}`),
  );
  const readingByUser = new Map<string, { bookId: string; currentPage: number }>();
  for (const loan of readingLoans) {
    if (!readingByUser.has(loan.userId)) {
      readingByUser.set(loan.userId, {
        bookId: loan.bookId,
        currentPage: loan.currentPage ?? 0,
      });
    }
  }

  const logsByUser = new Map<string, { loggedAt?: Date }[]>();
  for (const activity of activities) {
    const list = logsByUser.get(activity.userId) ?? [];
    list.push(activity);
    logsByUser.set(activity.userId, list);
  }

  function friendStatus(memberId: string): FriendStatus {
    const outgoing = friendRows.find((row) => row.fromId === userId && row.toId === memberId);
    const incoming = friendRows.find((row) => row.fromId === memberId && row.toId === userId);
    if (outgoing?.status === "accepted" || incoming?.status === "accepted") return "friends";
    if (incoming?.status === "pending") return "incoming";
    if (outgoing?.status === "pending") return "outgoing";
    return "none";
  }

  const bookIds = [
    ...loans.map((loan) => loan.bookId),
    ...activities.map((item) => item.bookId),
  ].filter((id) => mongoose.Types.ObjectId.isValid(id));
  const books = await Book.find({ _id: { $in: bookIds } }).lean<
    {
      _id: { toString(): string };
      title: string;
      author: string;
      coverImage?: string;
      metadata?: { pages?: number };
    }[]
  >();
  const booksById = new Map(books.map((book) => [book._id.toString(), book]));
  const names = new Map(accounts.map((account) => [account._id.toString(), account.name]));

  const members = accounts
    .filter((account) => account._id.toString() !== userId)
    .map((account) => {
      const memberId = account._id.toString();
      const status = friendStatus(memberId);
      const mine = loans.filter((loan) => loan.userId === memberId);
      const readingNow = mine
        .filter((loan) => {
          const book = booksById.get(loan.bookId);
          const pages = book?.metadata?.pages ?? 0;
          const finished = pages > 0 && (loan.currentPage ?? 0) >= pages;
          return (
            loan.status === "reading" &&
            !finished &&
            approvedLoans.has(`${memberId}:${loan.bookId}`)
          );
        })
        .flatMap((loan) => {
          const book = booksById.get(loan.bookId);
          return book ? [coverOf(book)] : [];
        });
      const finished = mine
        .filter((loan) => {
          const book = booksById.get(loan.bookId);
          const pages = book?.metadata?.pages ?? 0;
          return pages > 0 && (loan.currentPage ?? 0) >= pages;
        })
        .flatMap((loan) => {
          const book = booksById.get(loan.bookId);
          return book ? [coverOf(book)] : [];
        });
      return {
        id: memberId,
        name: account.name,
        initials: initials(account.name),
        avatarColor: colorFor(account.name),
        location: "Main Branch",
        isFriend: status === "friends",
        friendStatus: status,
        streakDays: streakFor(logsByUser.get(memberId) ?? []),
        booksBorrowed: mine.length,
        readingNow,
        finished,
        currentlyReading: readingNow[0] ?? coverOf(),
      };
    });

  const returnedLoans = new Set(
    loans
      .filter((loan) => loan.userId === userId && loan.status === "returned")
      .map((loan) => loan.bookId),
  );

  const borrowRequests = requests
    .filter((request) => request.status !== "Rejected")
    .map((request, index) => {
      const onLoan = request.bookId ? readingByUser.get(userId)?.bookId === request.bookId : false;
      const returned = request.bookId ? returnedLoans.has(request.bookId) : false;
      const currentStep: CommunityBorrowStep = returned
        ? "returned"
        : onLoan
          ? "on-loan"
          : request.status === "Approved"
            ? "approved"
            : "pending";
      return {
        id: `${request.book}-${index}`,
        requestedFrom: "Library desk",
        bookTitle: request.book,
        currentStep,
        dotColor: colorFor(request.book),
      };
    });

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const borrowedThisMonth = readingLoans.filter(
    (loan) => loan.updatedAt && new Date(loan.updatedAt) >= monthStart,
  ).length;

  const readingFeed = activities.slice(0, 8).flatMap((item) => {
    const book = booksById.get(item.bookId);
    const name = names.get(item.userId) || "A reader";
    if (!book) return [];
    const pages = book.metadata?.pages ?? 0;
    const progress =
      pages > 0 ? Math.min(100, Math.round(((item.page ?? 0) / pages) * 100)) : 0;
    return [
      {
        id: `${item.userId}-${item.bookId}-${item.loggedAt ?? ""}`,
        userName: name,
        initials: initials(name),
        avatarColor: colorFor(name),
        timeAgo: timeAgo(item.loggedAt),
        likes: 0,
        book: {
          title: book.title,
          author: book.author,
          coverImage: book.coverImage
            ? `/api/uploads/${book.coverImage}`
            : "/svg/book.svg",
        },
        progressPercent: progress,
        quote: progress > 0 ? `${progress}% through ${book.title}` : `Started ${book.title}`,
      },
    ];
  });

  return {
    viewerId: userId,
    header: {
      brand: "FOLIO NETWORK",
      title: "Community Shelf",
      subtitle: "Readers and books from this library",
    },
    stats: [
      { id: "total-books", label: "Total Books in Network", value: bookCount, theme: "blue" },
      { id: "active-members", label: "Active Members", value: accounts.length, theme: "purple" },
      { id: "borrowed-month", label: "Borrowed This Month", value: borrowedThisMonth, theme: "green" },
    ],
    tabs: [
      { id: "local-readers", label: "Local Readers" },
      { id: "friends", label: "Friends" },
      { id: "popular", label: "Popular" },
    ],
    members,
    borrowRequests,
    activeRequestCount: borrowRequests.filter((request) => request.currentStep !== "returned").length,
    readingFeed,
  };
}
