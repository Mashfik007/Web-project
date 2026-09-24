import connectDB from "@/dbConfig/dbConfig";
import { Fine } from "@/Model/Fines";
import type {
  AdminFine,
  AdminFineStatus,
  AdminFineSummary,
  AdminFineType,
} from "@/types/adminOps";

type StoredFine = {
  _id: { toString(): string };
  member: string;
  book: string;
  type: AdminFineType;
  amount: number;
  date: string;
  status: AdminFineStatus;
  paidAt?: string | null;
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

function inThisMonth(date: string) {
  const value = new Date(`${date}T00:00:00`);
  const today = new Date();
  return (
    value.getFullYear() === today.getFullYear() &&
    value.getMonth() === today.getMonth()
  );
}

export async function getAdminFines(_adminId: string): Promise<{
  summary: AdminFineSummary;
  fines: AdminFine[];
}> {
  await connectDB();

  const records = await Fine.find()
    .sort({ createdAt: -1 })
    .lean<StoredFine[]>();

  const summary: AdminFineSummary = {
    totalCollected: 0,
    pendingAmount: 0,
    waived: 0,
    thisMonth: 0,
  };

  const fines = records.map((record) => {
    if (record.status === "Paid") {
      summary.totalCollected += record.amount;
      if (inThisMonth(record.paidAt || record.date)) {
        summary.thisMonth += record.amount;
      }
    } else if (record.status === "Waived") {
      summary.waived += record.amount;
    } else {
      summary.pendingAmount += record.amount;
    }

    return {
      id: record._id.toString(),
      member: record.member,
      initials: initialsFrom(record.member),
      avatarClass: avatarClassFrom(record.member),
      book: record.book,
      type: record.type,
      amount: record.amount,
      date: record.date,
      status: record.status,
    };
  });

  return { summary, fines };
}
