import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";
import { ShelfLoan } from "@/Model/ShelfLoans";
import { recordBorrowRequest } from "@/data/recordBorrowRequest";
import { ShelfBookAction_schema } from "@/Shchema/shelf";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const parsed = ShelfBookAction_schema.safeParse(await request.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify(new ApiError(400, parsed.error.issues[0]?.message || "Invalid borrow request")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { userId, bookId, returnDate } = parsed.data;
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return new Response(JSON.stringify(new ApiError(400, "Invalid book id")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const dueDate = returnDate ? new Date(returnDate) : new Date();
    if (!returnDate) dueDate.setDate(dueDate.getDate() + 14);
    if (Number.isNaN(dueDate.getTime())) {
      return new Response(JSON.stringify(new ApiError(400, "Choose a valid return date")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();
    const book = await Book.findById(bookId);
    if (!book) {
      return new Response(JSON.stringify(new ApiError(404, "Book not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if ((book.availability?.current ?? 0) <= 0) {
      return new Response(JSON.stringify(new ApiError(400, "No copies are available")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existing = await ShelfLoan.findOne({ userId, bookId });
    if (existing?.status === "reading") {
      return new Response(
        JSON.stringify(new ApiError(400, "This book is already on your shelf")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    book.availability.current -= 1;
    await book.save();

    const loan = existing
      ? existing
      : new ShelfLoan({
          userId,
          bookId,
          status: "reading",
          currentPage: 0,
        });

    loan.status = "reading";
    loan.dueDate = dueDate;
    loan.returnedAt = null;
    await loan.save();
    await recordBorrowRequest({
      userId,
      bookId,
      dueDate,
      createdAt: loan.createdAt,
    });

    return new Response(
      JSON.stringify(new ApiResponce(201, null, "Book added to your shelf")),
      { status: 201, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify(new ApiError(500, error.message || "Internal Server Error")),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
