import connectDB from "@/dbConfig/dbConfig";
import {
  publishReservationUpdate,
  publishShelfUpdate,
} from "@/Helper/publishDomain";
import { requireUserId } from "@/Helper/userFromToken";
import { Book } from "@/Model/Books";
import { Reservation } from "@/Model/Reservations";
import { ShelfLoan } from "@/Model/ShelfLoans";
import { User } from "@/Model/Users";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const session = await requireUserId();
    if (session instanceof Response) return session;
    const userId = session;

    const body = await request.json();
    const bookId = String(body.bookId ?? "").trim();

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return new Response(JSON.stringify(new ApiError(400, "Invalid book id")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();

    const book = await Book.findById(bookId).select(
      "title author availability metadata",
    );
    if (!book) {
      return new Response(JSON.stringify(new ApiError(404, "Book not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if ((book.availability?.current ?? 0) <= 0) {
      return new Response(
        JSON.stringify(
          new ApiError(
            400,
            "This volume is not available in the library right now",
          ),
        ),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const account = mongoose.Types.ObjectId.isValid(userId)
      ? await User.findById(userId).select("name").lean<{ name?: string } | null>()
      : null;
    const member = account?.name?.trim() || `Member ${userId}`;

    const loan = await ShelfLoan.findOne({ userId, bookId });
    if (loan?.status === "reading") {
      return new Response(
        JSON.stringify(
          new ApiError(400, "This book is already on your active shelf"),
        ),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const existingHold = await Reservation.findOne({
      userId,
      bookId,
      status: { $in: ["Ready", "Waiting"] },
    }).select("_id status");

    if (existingHold) {
      return new Response(
        JSON.stringify(
          new ApiError(400, "You already have a reservation for this volume"),
        ),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const today = new Date().toISOString().slice(0, 10);
    const reservation = await Reservation.create({
      member,
      book: book.title,
      userId,
      bookId,
      reservedDate: today,
      status: "Ready",
    });

    if (loan) {
      loan.status = "wishlist";
      loan.blindDate = false;
      await loan.save();
    } else {
      await ShelfLoan.create({
        userId,
        bookId,
        status: "wishlist",
        currentPage: 0,
        dueDate: null,
        blindDate: false,
      });
    }

    await publishReservationUpdate({
      action: "created",
      id: String(reservation._id),
      userId: String(userId),
      book: book.title,
    });
    await publishShelfUpdate({
      action: "wishlist",
      userId: String(userId),
      bookId: String(bookId),
    });

    return new Response(
      JSON.stringify(
        new ApiResponce(
          201,
          {
            reservationId: String(reservation._id),
            bookId,
            title: book.title,
            status: reservation.status,
          },
          `"${book.title}" reserved and added to Want to Read on your shelf`,
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
