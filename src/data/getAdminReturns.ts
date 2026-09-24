import connectDB from "@/dbConfig/dbConfig";
import { ReturnRecord } from "@/Model/Returns";
import type { AdminReturnRecord, AdminReturnStatus } from "@/types/adminOps";

const finePerDay = 10;

type StoredReturn = {
  _id: { toString(): string };
  member: string;
  book: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string | null;
  daysOverdue?: number;
  fine?: number;
  status: AdminReturnStatus;
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

export function daysAfter(from: string, to: string) {
  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  return Math.round((end.getTime() - start.getTime()) / 86400000);
}

export function openReturnStatus(dueDate: string, today: string) {
  const late = daysAfter(dueDate, today);
  if (late > 0) {
    return {
      status: "Overdue" as const,
      daysOverdue: late,
      fine: late * finePerDay,
    };
  }
  if (late === 0) {
    return { status: "Due Today" as const, daysOverdue: 0, fine: 0 };
  }
  return { status: "Active" as const, daysOverdue: 0, fine: 0 };
}

export async function getAdminReturns(
  _adminId: string,
): Promise<AdminReturnRecord[]> {
  await connectDB();

  const records = await ReturnRecord.find()
    .sort({ createdAt: -1 })
    .lean<StoredReturn[]>();
  const today = new Date().toISOString().slice(0, 10);

  return records.map((record) => {
    const open = record.returnDate
      ? null
      : openReturnStatus(record.dueDate, today);

    return {
      id: record._id.toString(),
      member: record.member,
      initials: initialsFrom(record.member),
      avatarClass: avatarClassFrom(record.member),
      book: record.book,
      issueDate: record.issueDate,
      dueDate: record.dueDate,
      returnDate: record.returnDate ?? null,
      daysOverdue: open?.daysOverdue ?? record.daysOverdue ?? 0,
      fine: open?.fine ?? record.fine ?? 0,
      status: open?.status ?? record.status,
    };
  });
}
