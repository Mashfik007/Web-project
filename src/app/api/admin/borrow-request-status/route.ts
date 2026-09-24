import connectDB from "@/dbConfig/dbConfig";
import { BorrowRequest } from "@/Model/BorrowRequests";
import { Reservation } from "@/Model/Reservations";
import { ReturnRecord } from "@/Model/Returns";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { id, action } = await request.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify(new ApiError(400, "Invalid request id")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (action !== "approve" && action !== "reject") {
      return new Response(JSON.stringify(new ApiError(400, "Invalid action")), {
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

    if (borrowRequest.status !== "Pending") {
      return new Response(
        JSON.stringify(new ApiError(400, "This request has already been decided")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    borrowRequest.status = action === "approve" ? "Approved" : "Rejected";
    await borrowRequest.save();

    if (borrowRequest.status === "Approved") {
      const existingReturn = await ReturnRecord.findOne({
        borrowRequestId: borrowRequest._id,
      });
      const existingHold = await Reservation.findOne({
        borrowRequestId: borrowRequest._id,
      });
      if (!existingReturn && !existingHold) {
        const openLoan = await ReturnRecord.findOne({
          book: borrowRequest.book,
          status: { $ne: "Returned" },
        });
        if (openLoan) {
          await Reservation.create({
            member: borrowRequest.member,
            book: borrowRequest.book,
            reservedDate: borrowRequest.requested,
            status: "Waiting",
            borrowRequestId: borrowRequest._id,
          });
        } else {
          await ReturnRecord.create({
            member: borrowRequest.member,
            book: borrowRequest.book,
            issueDate: borrowRequest.requested,
            dueDate: borrowRequest.expectedReturn,
            status: "Active",
            borrowRequestId: borrowRequest._id,
          });
        }
      }
    }

    const message =
      borrowRequest.status === "Approved"
        ? "Request approved"
        : "Request rejected";

    return new Response(
      JSON.stringify(new ApiResponce(200, borrowRequest, message)),
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
