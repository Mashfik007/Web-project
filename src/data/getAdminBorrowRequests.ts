import connectDB from "@/dbConfig/dbConfig";
import { syncShelfBorrows } from "@/data/recordBorrowRequest";
import { BorrowRequest } from "@/Model/BorrowRequests";
import type { AdminBorrowRequest, AdminBorrowStatus } from "@/types/adminOps";

type StoredRequest = {
  _id: { toString(): string };
  member: string;
  book: string;
  requested: string;
  expectedReturn: string;
  status: AdminBorrowStatus;
  reason?: string;
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

export async function getAdminBorrowRequests(
  _adminId: string,
): Promise<AdminBorrowRequest[]> {
  await connectDB();
  await syncShelfBorrows();

  const requests = await BorrowRequest.find()
    .sort({ createdAt: -1 })
    .lean<StoredRequest[]>();

  return requests.map((request) => ({
    id: request._id.toString(),
    member: request.member,
    initials: initialsFrom(request.member),
    avatarClass: avatarClassFrom(request.member),
    book: request.book,
    requested: request.requested,
    expectedReturn: request.expectedReturn,
    status: request.status,
    reason: request.reason ?? "",
  }));
}
