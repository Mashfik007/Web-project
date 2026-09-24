import { daysAfter } from "@/data/getAdminReturns";
import connectDB from "@/dbConfig/dbConfig";
import { Reservation } from "@/Model/Reservations";
import { ReturnRecord } from "@/Model/Returns";
import type { AdminReservation, AdminReservationStatus } from "@/types/adminOps";

type StoredReservation = {
  _id: { toString(): string };
  member: string;
  book: string;
  reservedDate: string;
  status: AdminReservationStatus;
  createdAt?: Date;
};

const avatarClasses = [
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
  return letters.join("") || name.slice(0, 2).toUpperCase();
}

function avatarClassFrom(name: string) {
  const code = name
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
  return avatarClasses[code % avatarClasses.length];
}

function waitLabel(status: AdminReservationStatus, dueDate?: string) {
  if (status === "Ready") return "Ready now";
  if (status === "Expired") return "Expired";
  if (!dueDate) return "—";

  const today = new Date().toISOString().slice(0, 10);
  const days = daysAfter(today, dueDate);
  if (days <= 1) return "1 day";
  return `${days} days`;
}

export async function getAdminReservations(
  _adminId: string,
): Promise<AdminReservation[]> {
  await connectDB();

  const [records, loans] = await Promise.all([
    Reservation.find().lean<StoredReservation[]>(),
    ReturnRecord.find({ status: { $ne: "Returned" } })
      .select("book dueDate")
      .lean<{ book: string; dueDate: string }[]>(),
  ]);

  const dueByBook = new Map<string, string>();
  for (const loan of loans) {
    const current = dueByBook.get(loan.book);
    if (!current || loan.dueDate < current) dueByBook.set(loan.book, loan.dueDate);
  }

  const ordered = [...records].sort((left, right) => {
    const byDate = left.reservedDate.localeCompare(right.reservedDate);
    if (byDate !== 0) return byDate;
    return (
      new Date(left.createdAt ?? 0).getTime() -
      new Date(right.createdAt ?? 0).getTime()
    );
  });

  const queueById = new Map<string, number>();
  const seenByBook = new Map<string, number>();
  for (const record of ordered) {
    const next = (seenByBook.get(record.book) ?? 0) + 1;
    seenByBook.set(record.book, next);
    queueById.set(record._id.toString(), next);
  }

  return [...records]
    .sort(
      (left, right) =>
        new Date(right.createdAt ?? 0).getTime() -
        new Date(left.createdAt ?? 0).getTime(),
    )
    .map((record) => {
      const id = record._id.toString();
      return {
        id,
        member: record.member,
        initials: initialsFrom(record.member),
        avatarClass: avatarClassFrom(record.member),
        book: record.book,
        reservedDate: record.reservedDate,
        queue: queueById.get(id) ?? 1,
        estWait: waitLabel(record.status, dueByBook.get(record.book)),
        status: record.status,
      };
    });
}
