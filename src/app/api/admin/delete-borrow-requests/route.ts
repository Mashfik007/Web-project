import connectDB from "@/dbConfig/dbConfig";
import { ArchivedBorrowRequest } from "@/Model/ArchivedBorrowRequests";
import { BorrowRequest } from "@/Model/BorrowRequests";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";
import { publishBorrowUpdate } from "@/Helper/publishBorrow";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { id } = await request.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify(new ApiError(400, "Invalid request id")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const borrowRequest = await BorrowRequest.findById(id);
    if (!borrowRequest) {
      return new Response(
        JSON.stringify(new ApiError(404, "Borrow request not found")),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    await ArchivedBorrowRequest.create({
      originalId: borrowRequest._id,
      request: borrowRequest.toObject(),
      archivedAt: new Date(),
    });
    await BorrowRequest.deleteOne({ _id: borrowRequest._id });

    await publishBorrowUpdate({
      id: String(borrowRequest._id),
      action: "rejected",
      scope: "library",
      status: "Rejected",
      userId: String(borrowRequest.userId || ""),
      member: String(borrowRequest.member || ""),
      book: String(borrowRequest.book || ""),
      requested: String(borrowRequest.requested || ""),
      expectedReturn: String(borrowRequest.expectedReturn || ""),
    });
    return new Response(
      JSON.stringify(
        new ApiResponce(200, null, "Borrow request archived and deleted"),
      ),
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
