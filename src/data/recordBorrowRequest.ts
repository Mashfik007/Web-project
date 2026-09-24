import { Book } from "@/Model/Books";
import { BorrowRequest } from "@/Model/BorrowRequests";
import { ShelfLoan } from "@/Model/ShelfLoans";
import { User } from "@/Model/Users";
import mongoose from "mongoose";

function formatDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

async function memberLabel(userId: string) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return `Member ${userId}`;
  }

  const user = await User.findById(userId)
    .select("name")
    .lean<{ name?: string } | null>();

  return user?.name?.trim() || `Member ${userId}`;
}

export async function recordBorrowRequest(loan: {
  userId: string;
  bookId: string;
  dueDate?: Date | null;
  createdAt?: Date | null;
}) {
  const pending = await BorrowRequest.findOne({
    userId: loan.userId,
    bookId: loan.bookId,
    status: "Pending",
  });
  if (pending) return pending;

  const stillOut = await ShelfLoan.findOne({
    userId: loan.userId,
    bookId: loan.bookId,
    status: "reading",
  });
  if (stillOut) {
    const approved = await BorrowRequest.findOne({
      userId: loan.userId,
      bookId: loan.bookId,
      status: "Approved",
    });
    if (approved) return approved;
  }

  const book = await Book.findById(loan.bookId).select("title");
  if (!book) return null;

  const due = loan.dueDate ? new Date(loan.dueDate) : new Date();
  const requested = loan.createdAt ? new Date(loan.createdAt) : new Date();

  return BorrowRequest.create({
    member: await memberLabel(loan.userId),
    book: book.title,
    requested: formatDay(requested),
    expectedReturn: formatDay(due),
    status: "Pending",
    userId: loan.userId,
    bookId: loan.bookId,
  });
}

export async function syncShelfBorrows() {
  const loans = await ShelfLoan.find({ status: "reading" }).lean<
    {
      userId: string;
      bookId: string;
      dueDate?: Date | null;
      createdAt?: Date | null;
    }[]
  >();

  for (const loan of loans) {
    await recordBorrowRequest(loan);
  }
}
