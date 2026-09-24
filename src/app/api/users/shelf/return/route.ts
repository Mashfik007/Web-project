import connectDB from "@/dbConfig/dbConfig";
import { closeOpenReturn } from "@/data/libraryLink";
import { Book } from "@/Model/Books";
import { ShelfLoan } from "@/Model/ShelfLoans";
import { User } from "@/Model/Users";
import { ShelfLoanAction_schema } from "@/Shchema/shelf";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const parsed = ShelfLoanAction_schema.safeParse(await request.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify(new ApiError(400, parsed.error.issues[0]?.message || "Invalid shelf request")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { userId, loanId } = parsed.data;
    if (!mongoose.Types.ObjectId.isValid(loanId)) {
      return new Response(JSON.stringify(new ApiError(400, "Invalid loan id")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();
    const loan = await ShelfLoan.findOne({ _id: loanId, userId });
    if (!loan || loan.status !== "reading") {
      return new Response(
        JSON.stringify(new ApiError(404, "This book is not on your active shelf")),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    loan.status = "returned";
    loan.returnedAt = new Date();
    await loan.save();

    const book = mongoose.Types.ObjectId.isValid(loan.bookId)
      ? await Book.findById(loan.bookId).select("title")
      : null;
    if (book) {
      await Book.updateOne(
        { _id: loan.bookId },
        { $inc: { "availability.current": 1 } },
      );
    }

    const account = mongoose.Types.ObjectId.isValid(userId)
      ? await User.findById(userId).select("name")
      : null;
    const returnDate = new Date().toISOString().slice(0, 10);
    await closeOpenReturn({
      userId,
      bookId: loan.bookId,
      member: account?.name?.trim() || `Member ${userId}`,
      bookTitle: book?.title || "Book",
      issueDate: loan.createdAt
        ? new Date(loan.createdAt).toISOString().slice(0, 10)
        : returnDate,
      dueDate: loan.dueDate
        ? new Date(loan.dueDate).toISOString().slice(0, 10)
        : returnDate,
      returnDate,
    });

    return new Response(
      JSON.stringify(new ApiResponce(200, null, "Book returned to the library")),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify(new ApiError(500, error.message || "Internal Server Error")),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
