import connectDB from "@/dbConfig/dbConfig";
import { getMyShelf } from "@/data/getMyShelf";
import { Book } from "@/Model/Books";
import { FriendRequest } from "@/Model/FriendRequests";
import { ReadingActivity } from "@/Model/ReadingActivities";
import { ShelfLoan } from "@/Model/ShelfLoans";
import type {
  DashboardActivityItem,
  DashboardBadge,
  DashboardBook,
  DashboardData,
  DashboardMonth,
  DashboardStreakDay,
} from "@/types/dashboard";
import type { ShelfBook } from "@/types/myShelf";
import mongoose from "mongoose";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type LoanRow = {
  _id: { toString(): string };
  bookId: string;
  status: "reading" | "wishlist" | "returned";
  currentPage?: number;
  dueDate?: Date | null;
  returnedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

type LogRow = {
  _id: { toString(): string };
  bookId: string;
  loggedAt?: Date;
};

type StoredBook = {
  _id: { toString(): string };
  title: string;
  metadata?: { pages?: number };
};

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "GOOD MORNING";
  if (hour < 17) return "GOOD AFTERNOON";
  return "GOOD EVENING";
}

function dayKey(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy.toISOString().slice(0, 10);
}

function timeAgo(date?: Date) {
  if (!date) return "just now";
  const minutes = Math.max(1, Math.round((Date.now() - new Date(date).getTime()) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function nextDay(key: string) {
  const date = new Date(`${key}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function bestStreak(keys: Set<string>) {
  const sorted = [...keys].sort();
  let best = 0;
  let run = 0;
  let previous = "";
  for (const key of sorted) {
    run = previous && nextDay(previous) === key ? run + 1 : 1;
    best = Math.max(best, run);
    previous = key;
  }
  return best;
}

function card(book: ShelfBook, extra?: Pick<DashboardBook, "progress" | "detail">): DashboardBook {
  return {
    id: String(book.id),
    title: book.title,
    author: book.author,
    coverImage: book.coverImage,
    ...extra,
  };
}

function progressOf(book: ShelfBook) {
  if (book.pages <= 0) return 0;
  return Math.min(100, Math.round((book.currentPage / book.pages) * 100));
}

function monthGrid(activeDays: Set<string>): DashboardStreakDay[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const startPad = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: DashboardStreakDay[] = [];

  for (let index = 0; index < startPad; index += 1) {
    cells.push({ key: `pad-${index}`, label: "", state: "pad" });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const read = activeDays.has(dayKey(new Date(year, month, day)));
    cells.push({
      key: `day-${day}`,
      label: String(day),
      state: read ? "read" : day > today ? "ahead" : "missed",
    });
  }

  return cells;
}

function booksPerMonth(finishedAt: Date[]): DashboardMonth[] {
  const now = new Date();
  const counts = new Map<string, number>();
  for (const date of finishedAt) {
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from({ length: 6 }, (_, offset) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - offset), 1);
    return {
      month: monthNames[date.getMonth()],
      value: counts.get(`${date.getFullYear()}-${date.getMonth()}`) ?? 0,
    };
  });
}

function badges(input: {
  completed: number;
  streak: number;
  best: number;
  hours: number;
  friends: number;
  fastFinish: boolean;
}): DashboardBadge[] {
  const { completed, streak, best, hours, friends, fastFinish } = input;
  return [
    {
      name: "Bookworm",
      description: completed >= 20 ? "Read 20+ books" : `${completed} of 20 books`,
      active: completed >= 20,
      icon: "book",
    },
    {
      name: "Streak Master",
      description: best >= 14 ? `Best ${best} days` : `${streak} of 14 days`,
      active: best >= 14,
      icon: "streak",
    },
    {
      name: "Dedicated Reader",
      description: hours >= 10 ? "Logged 10 hours" : `${hours} of 10 hours`,
      active: hours >= 10,
      icon: "hours",
    },
    {
      name: "Social Butterfly",
      description: friends >= 3 ? "3 friends" : `${friends} of 3 friends`,
      active: friends >= 3,
      icon: "friends",
    },
    {
      name: "Speed Reader",
      description: fastFinish ? "Finished in under 2 days" : "Finish a book in under 2 days",
      active: fastFinish,
      icon: "speed",
    },
    {
      name: "Century Club",
      description: completed >= 100 ? "Read 100 books" : `${completed} of 100 books`,
      active: completed >= 100,
      icon: "century",
    },
  ];
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const shelf = await getMyShelf(userId);
  await connectDB();

  const [loans, logs, friends] = await Promise.all([
    ShelfLoan.find({ userId }).lean<LoanRow[]>(),
    ReadingActivity.find({ userId }).sort({ loggedAt: -1 }).lean<LogRow[]>(),
    FriendRequest.countDocuments({
      status: "accepted",
      $or: [{ fromId: userId }, { toId: userId }],
    }),
  ]);

  const bookIds = [...loans.map((loan) => loan.bookId), ...logs.map((log) => log.bookId)].filter(
    (id) => mongoose.Types.ObjectId.isValid(id),
  );
  const storedBooks = await Book.find({ _id: { $in: bookIds } })
    .select("title metadata.pages")
    .lean<StoredBook[]>();
  const booksById = new Map(storedBooks.map((book) => [book._id.toString(), book]));
  const titleOf = (bookId: string) => booksById.get(bookId)?.title ?? "a book";

  const activeDays = new Set(
    logs.filter((log) => log.loggedAt).map((log) => dayKey(new Date(log.loggedAt as Date))),
  );
  const best = bestStreak(activeDays);

  const events: { at: number; item: DashboardActivityItem }[] = [];
  for (const log of logs) {
    if (!log.loggedAt) continue;
    events.push({
      at: new Date(log.loggedAt).getTime(),
      item: {
        id: `log-${log._id.toString()}`,
        color: "bg-amber-400",
        action: "Logged 1 hour in",
        subject: titleOf(log.bookId),
        time: timeAgo(log.loggedAt),
      },
    });
  }

  for (const loan of loans) {
    const title = titleOf(loan.bookId);
    if (loan.status === "wishlist" && loan.createdAt) {
      events.push({
        at: new Date(loan.createdAt).getTime(),
        item: {
          id: `wish-${loan._id.toString()}`,
          color: "bg-cyan-500",
          action: "Added",
          subject: title,
          suffix: "to Want to Read",
          time: timeAgo(loan.createdAt),
        },
      });
    }
    if (loan.status !== "wishlist" && loan.createdAt) {
      events.push({
        at: new Date(loan.createdAt).getTime(),
        item: {
          id: `borrow-${loan._id.toString()}`,
          color: "bg-sky-500",
          action: "Borrowed",
          subject: title,
          time: timeAgo(loan.createdAt),
        },
      });
    }
    if (loan.status === "returned" && loan.returnedAt) {
      const onTime = !loan.dueDate || new Date(loan.returnedAt) <= new Date(loan.dueDate);
      events.push({
        at: new Date(loan.returnedAt).getTime(),
        item: {
          id: `return-${loan._id.toString()}`,
          color: "bg-emerald-500",
          action: "Returned",
          subject: title,
          suffix: onTime ? "on time" : "late",
          time: timeAgo(loan.returnedAt),
        },
      });
    }
  }

  const finishedAt: Date[] = [];
  let fastFinish = false;
  for (const loan of loans) {
    const pages = booksById.get(loan.bookId)?.metadata?.pages ?? 0;
    const finished = pages > 0 && (loan.currentPage ?? 0) >= pages && loan.status !== "wishlist";
    if (!finished) continue;
    const ended = loan.returnedAt ?? loan.updatedAt;
    if (ended) finishedAt.push(new Date(ended));
    if (loan.createdAt && ended) {
      const span = new Date(ended).getTime() - new Date(loan.createdAt).getTime();
      if (span >= 0 && span < 2 * 86400000) fastFinish = true;
    }
  }

  const readingBooks = shelf.currentlyReading.map((book) =>
    card(book, {
      progress: progressOf(book),
      detail: `${Math.max(book.pages - book.currentPage, 0)}p left · due ${book.dueDate}`,
    }),
  );

  return {
    userId,
    intro: {
      greeting: greeting(),
      name: shelf.user.name,
      dueBooks: shelf.currentlyReading.filter((book) => book.daysLeft >= 0 && book.daysLeft <= 7)
        .length,
      streak: shelf.user.streakDays,
      forYouHref: `/user/${userId}/foryou`,
      browseHref: `/user/${userId}/browsebook`,
    },
    reading: {
      counts: {
        reading: shelf.currentlyReading.length,
        completed: shelf.completed.length,
        want: shelf.wantToRead.length,
        history: shelf.borrowedHistory.length,
      },
      currentlyReading: readingBooks,
      completed: shelf.completed.map((book) => card(book)),
      wantToRead: shelf.wantToRead.map((book) => card(book)),
      history: shelf.borrowedHistory.map((book) =>
        card(book, { detail: book.dueDate === "—" ? undefined : `Returned ${book.dueDate}` }),
      ),
    },
    activity: events
      .sort((left, right) => right.at - left.at)
      .slice(0, 6)
      .map((event) => event.item),
    streak: {
      current: shelf.user.streakDays,
      best,
      days: monthGrid(activeDays),
    },
    booksPerMonth: booksPerMonth(finishedAt),
    badges: badges({
      completed: shelf.completed.length,
      streak: shelf.user.streakDays,
      best,
      hours: logs.length,
      friends,
      fastFinish,
    }),
    heatmap: shelf.activity,
  };
}
