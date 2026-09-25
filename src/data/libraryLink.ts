import { daysAfter } from "@/data/getAdminReturns";
import { Book } from "@/Model/Books";
import { Fine } from "@/Model/Fines";
import { LibraryUser } from "@/Model/LibraryUsers";
import { Reservation } from "@/Model/Reservations";
import { ReturnRecord } from "@/Model/Returns";
import { ShelfLoan } from "@/Model/ShelfLoans";
import { User } from "@/Model/Users";
import mongoose from "mongoose";

const finePerDay = 10;

function dayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export async function syncLibraryMember(input: {
  name: string;
  email: string;
  phone: string;
}) {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const phone = input.phone.trim();
  if (!email || !name || !phone) return null;

  const existing = await LibraryUser.findOne({ email });
  if (existing) {
    existing.name = name;
    await existing.save();
    return existing;
  }

  try {
    return await LibraryUser.create({
      name,
      email,
      phone,
      role: "Member",
      status: "Active",
      borrows: 0,
    });
  } catch {
    return LibraryUser.findOne({ $or: [{ email }, { phone }] });
  }
}

export async function isAccountSuspended(email: string) {
  const member = await LibraryUser.findOne({ email: email.trim().toLowerCase() })
    .select("status")
    .lean<{ status?: string } | null>();
  return member?.status === "Suspended";
}

export async function memberBorrowBlock(userId: string) {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;

  const account = await User.findById(userId).select("name email phone");
  if (!account?.email) return null;

  const member = await syncLibraryMember({
    name: account.name,
    email: account.email,
    phone: account.phone,
  });

  if (member?.status === "Suspended") {
    return "Your library account is suspended";
  }

  return null;
}

export async function recordMemberBorrow(userId: string) {
  if (!mongoose.Types.ObjectId.isValid(userId)) return;

  const account = await User.findById(userId).select("email");
  if (!account?.email) return;

  await LibraryUser.updateOne(
    { email: account.email.toLowerCase() },
    { $inc: { borrows: 1 } },
  );
}

export async function closeOpenReturn(input: {
  userId: string;
  bookId: string;
  member: string;
  bookTitle: string;
  issueDate?: string;
  dueDate?: string;
  returnDate: string;
}) {
  const record =
    (await ReturnRecord.findOne({
      status: { $ne: "Returned" },
      $or: [
        { userId: input.userId, bookId: input.bookId },
        { member: input.member, book: input.bookTitle },
      ],
    })) ??
    new ReturnRecord({
      member: input.member,
      book: input.bookTitle,
      issueDate: input.issueDate || input.returnDate,
      dueDate: input.dueDate || input.returnDate,
      userId: input.userId,
      bookId: input.bookId,
      status: "Active",
    });

  if (record.status === "Returned") return record;

  const daysOverdue = Math.max(0, daysAfter(record.dueDate, input.returnDate));
  record.userId = record.userId || input.userId;
  record.bookId = record.bookId || input.bookId;
  record.returnDate = input.returnDate;
  record.daysOverdue = daysOverdue;
  record.fine = daysOverdue * finePerDay;
  record.status = "Returned";
  await record.save();

  await Reservation.findOneAndUpdate(
    { book: record.book, status: "Waiting" },
    { status: "Ready" },
    { sort: { reservedDate: 1, createdAt: 1 } },
  );

  if (record.fine > 0) {
    const existingFine = await Fine.findOne({ returnId: record._id });
    if (!existingFine) {
      await Fine.create({
        member: record.member,
        book: record.book,
        type: "Overdue",
        amount: record.fine,
        date: input.returnDate,
        status: "Pending",
        returnId: record._id,
      });
    }
  }

  return record;
}

export async function returnShelfCopy(input: {
  userId?: string;
  bookId?: string;
  bookTitle?: string;
}) {
  const found = input.bookTitle
    ? await Book.findOne({ title: input.bookTitle }).select("_id")
    : null;
  const bookId = input.bookId || found?._id.toString();

  if (!bookId) return false;

  const loan = await ShelfLoan.findOne({
    bookId,
    status: "reading",
    ...(input.userId ? { userId: input.userId } : {}),
  });
  if (!loan) return false;

  loan.status = "returned";
  loan.returnedAt = new Date();
  await loan.save();

  await Book.updateOne({ _id: bookId }, { $inc: { "availability.current": 1 } });
  return true;
}

export function todayKey() {
  return dayKey();
}
