import { daysAfter } from "@/data/getAdminReturns";
import connectDB from "@/dbConfig/dbConfig";
import { Fine } from "@/Model/Fines";
import { Reservation } from "@/Model/Reservations";
import { ReturnRecord } from "@/Model/Returns";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

const finePerDay = 10;

export async function POST(request: Request) {
  try {
    await connectDB();
    const { id, returnDate } = await request.json();
    const date = String(returnDate ?? "").trim();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify(new ApiError(400, "Invalid return id")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!date) {
      return new Response(
        JSON.stringify(new ApiError(400, "Return date is required")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const record = await ReturnRecord.findById(id);
    if (!record) {
      return new Response(JSON.stringify(new ApiError(404, "Return not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (record.status === "Returned") {
      return new Response(
        JSON.stringify(new ApiError(400, "This book is already returned")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const daysOverdue = Math.max(0, daysAfter(record.dueDate, date));
    record.returnDate = date;
    record.daysOverdue = daysOverdue;
    record.fine = daysOverdue * finePerDay;
    record.status = "Returned";
    await record.save();

    await Reservation.findOneAndUpdate(
      { book: record.book, status: "Waiting" },
      { status: "Ready" },
      { sort: { reservedDate: 1, createdAt: 1 } },
    );

    if (record.fine > 0) {
      const existingFine = await Fine.findOne({ returnId: record._id });
      if (!existingFine) {
        await Fine.create({
          member: record.member,
          book: record.book,
          type: "Overdue",
          amount: record.fine,
          date,
          status: "Pending",
          returnId: record._id,
        });
      }
    }

    return new Response(
      JSON.stringify(new ApiResponce(200, record, "Book returned")),
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
