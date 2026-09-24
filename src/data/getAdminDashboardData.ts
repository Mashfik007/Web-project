import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";
import { BorrowRequest } from "@/Model/BorrowRequests";
import { Fine } from "@/Model/Fines";
import { LibraryUser } from "@/Model/LibraryUsers";
import { Reservation } from "@/Model/Reservations";
import { ReturnRecord } from "@/Model/Returns";
import type { AdminDashboardData } from "@/types/adminDashboard";

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

function trend(value: number, tone: "positive" | "negative") {
  return {
    value: value > 0 ? 100 : 0,
    direction: "up" as const,
    tone,
  };
}

export async function getAdminDashboardData(
  adminId: string,
): Promise<AdminDashboardData> {
  await connectDB();
  const today = new Date().toISOString().slice(0, 10);
  const year = new Date().getFullYear();

  const [
    bookCount,
    activeUsers,
    borrowsToday,
    openReturns,
    pendingFines,
    reservations,
    books,
    requests,
    returns,
    users,
  ] = await Promise.all([
    Book.countDocuments(),
    LibraryUser.countDocuments({ status: "Active" }),
    BorrowRequest.countDocuments({ requested: today }),
    ReturnRecord.find({ status: { $ne: "Returned" } })
      .select("dueDate status")
      .lean<{ dueDate?: string; status: string }[]>(),
    Fine.find({ status: "Pending" }).select("amount").lean<{ amount?: number }[]>(),
    Reservation.countDocuments({ status: { $in: ["Waiting", "Ready"] } }),
    Book.find().select("metadata.genre").lean<{ metadata?: { genre?: string } }[]>(),
    BorrowRequest.find().sort({ createdAt: -1 }).limit(4).lean<
      { _id: { toString(): string }; member: string; book: string; status: string; createdAt?: Date }[]
    >(),
    ReturnRecord.find({ status: "Returned" }).sort({ updatedAt: -1 }).limit(3).lean<
      { _id: { toString(): string }; member: string; book: string; updatedAt?: Date }[]
    >(),
    LibraryUser.find().sort({ createdAt: -1 }).limit(2).lean<
      { _id: { toString(): string }; name: string; createdAt?: Date }[]
    >(),
  ]);

  const overdue = openReturns.filter(
    (record) => record.status === "Overdue" || (record.dueDate && record.dueDate < today),
  ).length;
  const fineTotal = pendingFines.reduce((sum, fine) => sum + (fine.amount ?? 0), 0);
  const genreCounts = new Map<string, number>();
  for (const book of books) {
    const genre = book.metadata?.genre?.trim() || "General";
    genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1);
  }

  const monthly = monthNames.map((month) => ({ month, borrows: 0 }));
  const yearRequests = await BorrowRequest.find({
    createdAt: {
      $gte: new Date(`${year}-01-01T00:00:00.000Z`),
      $lte: new Date(`${year}-12-31T23:59:59.999Z`),
    },
  }).select("createdAt").lean<{ createdAt?: Date }[]>();
  for (const request of yearRequests) {
    if (!request.createdAt) continue;
    const index = new Date(request.createdAt).getMonth();
    monthly[index].borrows += 1;
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
      action: `Returned '${record.book}'`,
      time: timeAgo(record.updatedAt),
      avatarClass: "bg-emerald-500",
      at: record.updatedAt ? new Date(record.updatedAt).getTime() : 0,
    })),
    ...users.map((user) => ({
      id: `user-${user._id.toString()}`,
      name: user.name,
      initials: initials(user.name),
      action: "New library member",
      time: timeAgo(user.createdAt),
      avatarClass: "bg-violet-500",
      at: user.createdAt ? new Date(user.createdAt).getTime() : 0,
    })),
  ]
    .sort((a, b) => b.at - a.at)
    .slice(0, 7)
    .map(({ at: _at, ...item }) => item);

  const inactive = Math.max(activeUsers - borrowsToday, 0);

  return {
    adminId,
    adminName: "Library Admin",
    stats: [
      { id: "total-books", label: "Total Books", value: bookCount.toLocaleString(), trend: trend(bookCount, "positive") },
      { id: "active-users", label: "Active Users", value: activeUsers.toLocaleString(), trend: trend(activeUsers, "positive") },
      { id: "borrows-today", label: "Borrows Today", value: String(borrowsToday), trend: trend(borrowsToday, "positive") },
      { id: "overdue", label: "Overdue", value: String(overdue), trend: trend(overdue, "negative") },
      { id: "fines-due", label: "Fines Due", value: `৳ ${fineTotal.toLocaleString()}`, trend: trend(fineTotal, "negative") },
      { id: "reservations", label: "Reservations", value: String(reservations), trend: trend(reservations, "positive") },
    ],
    monthlyBorrows: monthly,
    borrowYearLabel: String(year),
    userActivity: [
      { id: "active", label: "Active Borrowers", value: borrowsToday, color: "#3B82F6" },
      { id: "overdue", label: "Overdue", value: overdue, color: "#EF4444" },
      { id: "reserved", label: "Reserved", value: reservations, color: "#8B5CF6" },
      { id: "inactive", label: "Inactive", value: inactive, color: "#CBD5E1" },
    ],
    userActivityTotal: Math.max(activeUsers, 1),
    booksByGenre: [...genreCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([genre, count]) => ({ genre, count })),
    recentActivity: recent,
  };
}
