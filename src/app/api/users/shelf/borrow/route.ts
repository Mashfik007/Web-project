import connectDB from "@/dbConfig/dbConfig";
import { requireUserId } from "@/Helper/userFromToken";
import { Book } from "@/Model/Books";
import { BorrowRequest } from "@/Model/BorrowRequests";
import { ShelfLoan } from "@/Model/ShelfLoans";
import { memberBorrowBlock } from "@/data/libraryLink";
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

    const session = await requireUserId();
    if (session instanceof Response) return session;
    const userId = session;
    const { bookId, returnDate } = parsed.data;
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
    const blocked = await memberBorrowBlock(userId);
    if (blocked) {
      return new Response(JSON.stringify(new ApiError(400, blocked)), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

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

    const pending = await BorrowRequest.findOne({
      userId,
      bookId,
      status: "Pending",
    });
    if (pending) {
      return new Response(
        JSON.stringify(new ApiError(400, "You already requested this book")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const stillOut = await ShelfLoan.findOne({ userId, bookId, status: "reading" });
    if (stillOut) {
      return new Response(
        JSON.stringify(
          new ApiError(400, "Return this book before you can borrow it again"),
        ),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const approved = await BorrowRequest.findOne({
      userId,
      bookId,
      status: "Approved",
    });
    if (approved) {
      const returned = await ShelfLoan.findOne({ userId, bookId, status: "returned" });
      if (!returned) {
        return new Response(
          JSON.stringify(
            new ApiError(400, "You already requested this book and it has not been returned"),
          ),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    await recordBorrowRequest({
      userId,
      bookId,
      dueDate,
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify(
        new ApiResponce(
          201,
          null,
          "Request sent. It appears under Currently Reading after the library approves it.",
        ),
      ),
      { status: 201, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify(new ApiError(500, error.message || "Internal Server Error")),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
