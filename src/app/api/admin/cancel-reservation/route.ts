import connectDB from "@/dbConfig/dbConfig";
import { sendFolioEmail } from "@/Helper/sendFolioEmail";
import { LibraryUser } from "@/Model/LibraryUsers";
import { Reservation } from "@/Model/Reservations";
import { ReturnRecord } from "@/Model/Returns";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { id } = await request.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify(new ApiError(400, "Invalid reservation id")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return new Response(
        JSON.stringify(new ApiError(404, "Reservation not found")),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const book = reservation.book;
    const member = reservation.member;
    const wasReady = reservation.status === "Ready";
    await Reservation.deleteOne({ _id: reservation._id });

    if (wasReady) {
      const openLoan = await ReturnRecord.findOne({
        book,
        status: { $ne: "Returned" },
      });
      if (!openLoan) {
        await Reservation.findOneAndUpdate(
          { book, status: "Waiting" },
          { status: "Ready" },
          { sort: { reservedDate: 1, createdAt: 1 } },
        );
      }
    }

    try {
      const libraryUser = await LibraryUser.findOne({ name: member }).select(
        "email name",
      );
      if (libraryUser?.email) {
        await sendFolioEmail({
          email: libraryUser.email,
          name: libraryUser.name || member,
          type: "borrow_cancelled",
          bookTitle: book,
          reason: "Your reservation was cancelled by an administrator.",
        });
      }
    } catch (error) {
      console.error("[cancel-reservation] Cancel email failed:", error);
    }

    return new Response(
      JSON.stringify(new ApiResponce(200, null, "Reservation cancelled")),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify(
        new ApiError(500, error.message || "Internal Server Error"),
      ),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
