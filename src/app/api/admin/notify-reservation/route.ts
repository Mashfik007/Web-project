import connectDB from "@/dbConfig/dbConfig";
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
