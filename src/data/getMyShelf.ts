import connectDB from "@/dbConfig/dbConfig";
import { bookOrKeptCopy, booksForLoans } from "@/data/loanBooks";
import { Follow } from "@/Model/Follows";
import { ReadingActivity } from "@/Model/ReadingActivities";
import { ShelfLoan } from "@/Model/ShelfLoans";
import { User } from "@/Model/Users";
import type {
  CategoryStat,
  DueDateItem,
  MyShelfData,
  ShelfBook,
  ShelfPerson,
  ShelfStat,
} from "@/types/myShelf";
import mongoose from "mongoose";

type LoanRecord = {
  _id: { toString(): string };
  bookId: string;
  status: "reading" | "wishlist" | "returned";
  currentPage?: number;
  dueDate?: Date | null;
  returnedAt?: Date | null;
  blindDate?: boolean;
  updatedAt?: Date;
};

type StoredBook = {
  _id: { toString(): string };
  title: string;
  author: string;
  coverImage?: string;
  metadata?: {
    pages?: number;
    category?: string;
  };
};

type ActivityRecord = {
  loggedAt?: Date;
  hours?: number;
};

const ACTIVITY_DAYS = 84;

function dayKey(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy.toISOString().slice(0, 10);
}

function formatDue(date?: Date | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function daysUntil(date?: Date | null) {
  if (!date) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(date);
  due.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / 86400000);
}

function initials(name: string) {
  const letters = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "");
  return letters.join("") || "R";
}

function toShelfBook(loan: LoanRecord, book: StoredBook): ShelfBook {
  return {
    id: loan._id.toString(),
    bookId: loan.bookId,
    title: book.title,
    author: book.author,
    category: book.metadata?.category ?? "General",
    pages: book.metadata?.pages ?? 0,
    currentPage: loan.currentPage ?? 0,
    coverImage: book.coverImage
      ? `/api/uploads/${book.coverImage}`
      : "/svg/book.svg",
    dueDate: formatDue(loan.returnedAt ?? loan.dueDate),
    daysLeft: loan.status === "reading" ? daysUntil(loan.dueDate) : 0,
    blindDate: Boolean(loan.blindDate) && loan.status !== "reading",
    checkedOut: loan.status === "reading",
  };
}

function finishedBook(book: ShelfBook) {
  return book.pages > 0 && book.currentPage >= book.pages;
}

function activityLevels(logs: ActivityRecord[]) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (ACTIVITY_DAYS - 1));
  const hours = new Array<number>(ACTIVITY_DAYS).fill(0);

  for (const log of logs) {
    if (!log.loggedAt) continue;
    const day = new Date(log.loggedAt);
    day.setHours(0, 0, 0, 0);
    const index = Math.round((day.getTime() - start.getTime()) / 86400000);
    if (index >= 0 && index < ACTIVITY_DAYS) {
      hours[index] += log.hours ?? 1;
    }
  }

  return hours.map((value) => (value <= 0 ? 0 : value >= 3 ? 3 : value));
}

function readingStreak(logs: ActivityRecord[]) {
  const active = new Set(
    logs
      .filter((log) => log.loggedAt)
      .map((log) => dayKey(new Date(log.loggedAt as Date))),
  );
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  if (!active.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (active.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function categoryStats(books: ShelfBook[]): CategoryStat[] {
  const counts = new Map<string, number>();
  for (const book of books) {
    counts.set(book.category, (counts.get(book.category) ?? 0) + 1);
  }
  const total = books.length || 1;
  return [...counts.entries()].map(([category, count]) => ({
    category,
    count,
    percentage: Math.round((count / total) * 100),
  }));
}

export async function getMyShelf(userId: string): Promise<MyShelfData> {
  await connectDB();

  const [loans, logs, followerCount, followingCount, following, accounts] =
    await Promise.all([
      ShelfLoan.find({ userId }).sort({ updatedAt: -1 }).lean<LoanRecord[]>(),
      ReadingActivity.find({ userId }).lean<ActivityRecord[]>(),
      Follow.countDocuments({ followingId: userId }),
      Follow.countDocuments({ followerId: userId }),
      Follow.find({ followerId: userId }).select("followingId").lean<{ followingId: string }[]>(),
      User.find({ isAdmin: { $ne: true } }).select("name").sort({ name: 1 }).limit(30).lean<
        { _id: { toString(): string }; name: string }[]
      >(),
    ]);

  const bookIds = loans
    .map((loan) => loan.bookId)
    .filter((id) => mongoose.Types.ObjectId.isValid(id));
  const booksById = await booksForLoans(bookIds);

  const shelfBooks = loans.map((loan) => {
    const book = bookOrKeptCopy(booksById, loan.bookId);
    return { loan, book: toShelfBook(loan, book) };
  });

  const currentlyReading = shelfBooks
    .filter((item) => item.loan.status === "reading" && !finishedBook(item.book))
    .map((item) => item.book);
  const wantToRead = shelfBooks
    .filter((item) => item.loan.status === "wishlist")
    .map((item) => item.book);
  const returned = shelfBooks.filter((item) => item.loan.status === "returned");
  const completed = shelfBooks
    .filter((item) => item.loan.status !== "wishlist" && finishedBook(item.book))
    .map((item) => item.book);
  const borrowedHistory = returned.map((item) => item.book);

  const year = new Date().getFullYear();
  const booksThisYear = shelfBooks.filter((item) => {
    if (item.loan.status === "wishlist" || !finishedBook(item.book)) return false;
    if (item.loan.status === "reading") return true;
    const returnedAt = item.loan.returnedAt ? new Date(item.loan.returnedAt) : null;
    return returnedAt?.getFullYear() === year;
  }).length;

  const streakDays = readingStreak(logs);
  const account = mongoose.Types.ObjectId.isValid(userId)
    ? await User.findById(userId).select("name createdAt").lean<{
        name?: string;
        createdAt?: Date;
      } | null>()
    : null;
  const name = account?.name?.trim() || `Member ${userId}`;
  const followed = new Set(following.map((item) => item.followingId));
  const people: ShelfPerson[] = accounts
    .filter((account) => account._id.toString() !== userId)
    .map((account) => ({
      id: account._id.toString(),
      name: account.name,
      following: followed.has(account._id.toString()),
    }));

  const dueDates: DueDateItem[] = currentlyReading.map((book) => ({
    id: book.id,
    title: book.title,
    coverImage: book.coverImage,
    dueDate: book.dueDate,
  }));

  const stats: ShelfStat[] = [
    {
      id: "books-read",
      label: "Books Read",
      value: booksThisYear,
      subtitle: "This year",
      theme: "blue",
    },
    {
      id: "currently-reading",
      label: "Currently Reading",
      value: currentlyReading.length,
      subtitle: "Active borrows",
      theme: "purple",
    },
    {
      id: "want-to-read",
      label: "Want to Read",
      value: wantToRead.length,
      subtitle: "On wishlist",
      theme: "pink",
    },
    {
      id: "days-streak",
      label: "Days Streak",
      value: streakDays,
      subtitle: "From 1-hour logs",
      theme: "amber",
    },
  ];

  return {
    userId,
    user: {
      initials: initials(name),
      name,
      quote: "One hour of reading at a time.",
      branch: "Main Branch",
      memberSince: account?.createdAt
        ? new Date(account.createdAt).getFullYear()
        : year,
      followers: followerCount,
      following: followingCount,
      booksThisYear,
      streakDays,
    },
    stats,
    tabs: [
      { id: "currently-reading", label: "Currently Reading", count: currentlyReading.length },
      { id: "completed", label: "Completed", count: completed.length },
      { id: "want-to-read", label: "Want to Read", count: wantToRead.length },
      { id: "borrowed-history", label: "Borrowed History", count: borrowedHistory.length },
    ],
    currentlyReading,
    completed,
    wantToRead,
    borrowedHistory,
    activity: activityLevels(logs),
    dueDates,
    categories: categoryStats([
      ...currentlyReading,
      ...wantToRead,
      ...borrowedHistory,
    ]),
    people,
  };
}
