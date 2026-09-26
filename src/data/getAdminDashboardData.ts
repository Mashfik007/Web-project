import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";
import { BorrowRequest } from "@/Model/BorrowRequests";
import { Fine } from "@/Model/Fines";
import { LibraryUser } from "@/Model/LibraryUsers";
import { Reservation } from "@/Model/Reservations";
import { ReturnRecord } from "@/Model/Returns";
import { User } from "@/Model/Users";
import type { AdminDashboardData, AdminStatTrend } from "@/types/adminDashboard";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function initials(name: string) {
  const letters = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "");
  return letters.join("") || "A";
}

function timeAgo(date?: Date) {
  if (!date) return "just now";
  const minutes = Math.max(1, Math.round((Date.now() - new Date(date).getTime()) / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)} d ago`;
}

function dayStamp(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function percentChange(
  current: number,
  previous: number,
  toneWhenUp: "positive" | "negative",
): AdminStatTrend {
  if (previous === 0 && current === 0) {
    return { value: 0, direction: "up", tone: "positive" };
  }
  if (previous === 0) {
    return { value: 100, direction: "up", tone: toneWhenUp };
  }
  const delta = Math.round(((current - previous) / previous) * 100);
  const direction = delta >= 0 ? "up" : "down";
  const tone =
    direction === "up" ? toneWhenUp : toneWhenUp === "positive" ? "negative" : "positive";
  return { value: Math.abs(delta), direction, tone };
}

export async function getAdminDashboardData(adminId: string): Promise<AdminDashboardData> {
  await connectDB();
  const now = new Date();
  const today = dayStamp(now);
  const year = now.getFullYear();
  const todayStart = startOfDay(now);
  const tomorrow = new Date(todayStart);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const monthStart = new Date(year, now.getMonth(), 1);
  const lastMonthStart = new Date(year, now.getMonth() - 1, 1);

  const [
    admin,
    bookCount,
    booksAddedThisMonth,
    readers,
    suspended,
    borrowsToday,
    borrowsYesterday,
    openReturns,
    pendingFines,
    reservations,
    books,
    requests,
    returns,
    newMembers,
    yearRequests,
    yearReturns,
  ] = await Promise.all([
    User.find({ isAdmin: true })
      .select("name email")
      .lean<{ _id: { toString(): string }; name?: string; email?: string }[]>(),
    Book.countDocuments(),
    Book.countDocuments({ createdAt: { $gte: monthStart } }),
    User.find({ isAdmin: { $ne: true } })
      .select("name email createdAt")
      .lean<{ name?: string; email?: string; createdAt?: Date }[]>(),
    LibraryUser.find({ status: "Suspended" })
      .select("email")
      .lean<{ email?: string }[]>(),
    BorrowRequest.countDocuments({ createdAt: { $gte: todayStart, $lt: tomorrow } }),
    BorrowRequest.countDocuments({ createdAt: { $gte: yesterdayStart, $lt: todayStart } }),
    ReturnRecord.find({ status: { $ne: "Returned" } })
      .select("member dueDate status")
      .lean<{ member?: string; dueDate?: string; status: string }[]>(),
    Fine.find({ status: "Pending" }).select("amount").lean<{ amount?: number }[]>(),
    Reservation.find({ status: { $in: ["Waiting", "Ready"] } })
      .select("member")
      .lean<{ member?: string }[]>(),
    Book.find().select("metadata.genre").lean<{ metadata?: { genre?: string } }[]>(),
    BorrowRequest.find().sort({ createdAt: -1 }).limit(6).lean<
      { _id: { toString(): string }; member: string; book: string; status: string; createdAt?: Date }[]
    >(),
    ReturnRecord.find().sort({ updatedAt: -1 }).limit(6).lean<
      { _id: { toString(): string }; member: string; book: string; status: string; updatedAt?: Date }[]
    >(),
    LibraryUser.find({ role: { $ne: "Admin" } })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean<{ _id: { toString(): string }; name: string; email?: string; createdAt?: Date }[]>(),
    BorrowRequest.find({
      createdAt: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31, 23, 59, 59, 999) },
    })
      .select("createdAt")
      .lean<{ createdAt?: Date }[]>(),
    ReturnRecord.find({
      status: "Returned",
      updatedAt: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31, 23, 59, 59, 999) },
    })
      .select("updatedAt")
      .lean<{ updatedAt?: Date }[]>(),
  ]);

  const adminEmails = new Set(
    admin
      .map((account) => account.email?.trim().toLowerCase())
      .filter((email): email is string => Boolean(email)),
  );
  const adminAccount = admin.find((account) => account._id.toString() === adminId);
  const suspendedEmails = new Set(
    suspended
      .map((row) => row.email?.trim().toLowerCase())
      .filter((email): email is string => Boolean(email)),
  );
  const activeReaders = readers.filter(
    (reader) => !suspendedEmails.has(reader.email?.trim().toLowerCase() || ""),
  );
  const readersAddedThisMonth = activeReaders.filter(
    (reader) => reader.createdAt && new Date(reader.createdAt) >= monthStart,
  ).length;
  const readersAddedLastMonth = activeReaders.filter((reader) => {
    if (!reader.createdAt) return false;
    const created = new Date(reader.createdAt);
    return created >= lastMonthStart && created < monthStart;
  }).length;

  const overdueNames = new Set(
    openReturns
      .filter((record) => record.status === "Overdue" || (record.dueDate && record.dueDate < today))
      .map((record) => record.member?.trim())
      .filter((name): name is string => Boolean(name)),
  );
  const openNames = new Set(
    openReturns.map((record) => record.member?.trim()).filter((name): name is string => Boolean(name)),
  );
  const reservedNames = new Set(
    reservations.map((row) => row.member?.trim()).filter((name): name is string => Boolean(name)),
  );
  const activeBorrowers = [...openNames].filter((name) => !overdueNames.has(name)).length;
  const reservedOnly = [...reservedNames].filter((name) => !openNames.has(name)).length;
  const inactive = activeReaders.filter((reader) => {
    const name = reader.name?.trim() || "";
    return name && !openNames.has(name) && !reservedNames.has(name);
  }).length;

  const fineTotal = pendingFines.reduce((sum, fine) => sum + (fine.amount ?? 0), 0);
  const genreCounts = new Map<string, number>();
  for (const book of books) {
    const genre = book.metadata?.genre?.trim() || "General";
    genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1);
  }

  const monthly = monthNames.map((month) => ({ month, borrows: 0, returns: 0 }));
  for (const request of yearRequests) {
    if (!request.createdAt) continue;
    monthly[new Date(request.createdAt).getMonth()].borrows += 1;
  }
  for (const record of yearReturns) {
    if (!record.updatedAt) continue;
    monthly[new Date(record.updatedAt).getMonth()].returns += 1;
  }

  const recent = [
    ...requests.map((request) => ({
      id: `request-${request._id.toString()}`,
      name: request.member,
      initials: initials(request.member),
      action: `${request.status} borrow for '${request.book}'`,
      time: timeAgo(request.createdAt),
      avatarClass: "bg-sky-500",
      at: request.createdAt ? new Date(request.createdAt).getTime() : 0,
    })),
    ...returns.map((record) => ({
      id: `return-${record._id.toString()}`,
      name: record.member,
      initials: initials(record.member),
      action:
        record.status === "Returned"
          ? `Returned '${record.book}'`
          : record.status === "Overdue"
            ? `Overdue on '${record.book}'`
            : `Borrowed '${record.book}'`,
      time: timeAgo(record.updatedAt),
      avatarClass: record.status === "Overdue" ? "bg-rose-500" : "bg-emerald-500",
      at: record.updatedAt ? new Date(record.updatedAt).getTime() : 0,
    })),
    ...newMembers
      .filter((user) => !adminEmails.has(user.email?.trim().toLowerCase() || ""))
      .map((user) => ({
      id: `user-${user._id.toString()}`,
      name: user.name,
      initials: initials(user.name),
      action: "Joined the library",
      time: timeAgo(user.createdAt),
      avatarClass: "bg-violet-500",
      at: user.createdAt ? new Date(user.createdAt).getTime() : 0,
    })),
  ]
    .sort((a, b) => b.at - a.at)
    .slice(0, 7)
    .map(({ at: _at, ...item }) => item);

  const previousBooks = Math.max(bookCount - booksAddedThisMonth, 0);

  return {
    adminId,
    adminName: adminAccount?.name?.trim() || "Admin",
    stats: [
      {
        id: "total-books",
        label: "Total Books",
        value: bookCount.toLocaleString(),
        trend: percentChange(bookCount, previousBooks, "positive"),
      },
      {
        id: "active-users",
        label: "Active Users",
        value: activeReaders.length.toLocaleString(),
        trend: percentChange(readersAddedThisMonth, readersAddedLastMonth, "positive"),
      },
      {
        id: "borrows-today",
        label: "Borrows Today",
        value: String(borrowsToday),
        trend: percentChange(borrowsToday, borrowsYesterday, "positive"),
      },
      {
        id: "overdue",
        label: "Overdue",
        value: String(overdueNames.size),
        trend: {
          value: 0,
          direction: "up",
          tone: overdueNames.size > 0 ? "negative" : "positive",
        },
      },
      {
        id: "fines-due",
        label: "Fines Due",
        value: `৳ ${fineTotal.toLocaleString()}`,
        trend: {
          value: 0,
          direction: "up",
          tone: fineTotal > 0 ? "negative" : "positive",
        },
      },
      {
        id: "reservations",
        label: "Reservations",
        value: String(reservations.length),
        trend: { value: 0, direction: "up", tone: "positive" },
      },
    ],
    monthlyBorrows: monthly,
    borrowYearLabel: String(year),
    userActivity: [
      { id: "active", label: "Active Borrowers", value: activeBorrowers, color: "#3B82F6" },
      { id: "overdue", label: "Overdue", value: overdueNames.size, color: "#EF4444" },
      { id: "reserved", label: "Reserved", value: reservedOnly, color: "#8B5CF6" },
      { id: "inactive", label: "Inactive", value: inactive, color: "#CBD5E1" },
    ],
    userActivityTotal: activeReaders.length,
    booksByGenre: [...genreCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([genre, count]) => ({ genre, count })),
    recentActivity: recent,
  };
}
