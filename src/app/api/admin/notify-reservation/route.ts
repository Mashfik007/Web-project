import connectDB from "@/dbConfig/dbConfig";
import { publishReservationUpdate } from "@/Helper/publishDomain";
import { LibraryUser } from "@/Model/LibraryUsers";
import { Reservation } from "@/Model/Reservations";
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

    reservation.status = "Ready";
    await reservation.save();

    const libraryUser = await LibraryUser.findOne({ name: reservation.member })
      .select("_id")
      .lean<{ _id: { toString(): string } }>();

    await publishReservationUpdate({
      action: "ready",
      id: String(reservation._id),
      userId: libraryUser?._id?.toString() || "",
      book: String(reservation.book || ""),
    });
    return new Response(
      JSON.stringify(new ApiResponce(200, reservation, "Notice sent")),
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
