import connectDB from "@/dbConfig/dbConfig";
import { requireUserId } from "@/Helper/userFromToken";
import { Book } from "@/Model/Books";
import { ShelfLoan } from "@/Model/ShelfLoans";
import {
  ShelfBookAction_schema,
  ShelfLoanAction_schema,
} from "@/Shchema/shelf";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";
import { publishShelfUpdate } from "@/Helper/publishDomain";

export async function POST(request: Request) {
  try {
    const parsed = ShelfBookAction_schema.safeParse(await request.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify(new ApiError(400, parsed.error.issues[0]?.message || "Invalid wishlist request")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const session = await requireUserId();
    if (session instanceof Response) return session;
    const userId = session;
    const { bookId, blindDate } = parsed.data;
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return new Response(JSON.stringify(new ApiError(400, "Invalid book id")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();
    const book = await Book.findById(bookId).select("_id");
    if (!book) {
      return new Response(JSON.stringify(new ApiError(404, "Book not found")), {
        status: 404,
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

    if (existing) {
      if (blindDate) existing.blindDate = true;
      if (existing.status === "returned") existing.status = "wishlist";
      await existing.save();
    } else {
      await ShelfLoan.create({
        userId,
        bookId,
        status: "wishlist",
        currentPage: 0,
        dueDate: null,
        blindDate: Boolean(blindDate),
      });
    }

    await publishShelfUpdate({
      action: "wishlist",
      userId: String(userId),
      bookId: String(bookId),
    });
    return new Response(
      JSON.stringify(
        new ApiResponce(
          201,
          null,
          blindDate
            ? "Wrapped and added to your shelf"
            : "Added to your wishlist",
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

export async function DELETE(request: Request) {
  try {
    const parsed = ShelfLoanAction_schema.safeParse(await request.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify(
          new ApiError(
            400,
            parsed.error.issues[0]?.message || "Invalid wishlist request",
          ),
        ),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const session = await requireUserId();
    if (session instanceof Response) return session;
    const userId = session;
    const { loanId } = parsed.data;

    if (!mongoose.Types.ObjectId.isValid(loanId)) {
      return new Response(JSON.stringify(new ApiError(400, "Invalid loan id")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();
    const loan = await ShelfLoan.findOne({ _id: loanId, userId });
    if (!loan || loan.status !== "wishlist") {
      return new Response(
        JSON.stringify(
          new ApiError(404, "This book is not on your Want to Read list"),
        ),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const bookId = String(loan.bookId || "");
    await ShelfLoan.deleteOne({ _id: loan._id });

    await publishShelfUpdate({
      action: "wishlist",
      userId: String(userId),
      bookId,
    });

    return new Response(
      JSON.stringify(
        new ApiResponce(200, null, "Removed from Want to Read"),
      ),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify(new ApiError(500, error.message || "Internal Server Error")),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
