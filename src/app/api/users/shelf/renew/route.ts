import connectDB from "@/dbConfig/dbConfig";
import { ShelfLoan } from "@/Model/ShelfLoans";
import { ShelfLoanAction_schema } from "@/Shchema/shelf";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const parsed = ShelfLoanAction_schema.safeParse(await request.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify(new ApiError(400, parsed.error.issues[0]?.message || "Invalid shelf request")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { userId, loanId } = parsed.data;
    if (!mongoose.Types.ObjectId.isValid(loanId)) {
      return new Response(JSON.stringify(new ApiError(400, "Invalid loan id")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();
    const loan = await ShelfLoan.findOne({ _id: loanId, userId });
    if (!loan || loan.status !== "reading") {
      return new Response(
        JSON.stringify(new ApiError(404, "This book is not on your active shelf")),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const base = new Date(
      Math.max(Date.now(), loan.dueDate ? new Date(loan.dueDate).getTime() : 0),
    );
    base.setDate(base.getDate() + 14);
    loan.dueDate = base;
    loan.renewedCount = (loan.renewedCount ?? 0) + 1;
    await loan.save();

    const due = base.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return new Response(
      JSON.stringify(new ApiResponce(200, { dueDate: due }, `Due date extended to ${due}`)),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify(new ApiError(500, error.message || "Internal Server Error")),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
