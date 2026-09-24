import connectDB from "@/dbConfig/dbConfig";
import { ArchivedBorrowRequest } from "@/Model/ArchivedBorrowRequests";
import { BorrowRequest } from "@/Model/BorrowRequests";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { id } = await request.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify(new ApiError(400, "Invalid archive id")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const archived = await ArchivedBorrowRequest.findById(id);
    if (!archived?.request) {
      return new Response(
        JSON.stringify(new ApiError(404, "Archived request not found")),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const snapshot = { ...archived.request };
    delete snapshot.__v;

    await BorrowRequest.create(snapshot);
    await ArchivedBorrowRequest.deleteOne({ _id: archived._id });

    return new Response(
      JSON.stringify(new ApiResponce(200, null, "Borrow request restored")),
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
