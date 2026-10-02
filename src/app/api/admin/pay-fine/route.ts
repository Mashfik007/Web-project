import connectDB from "@/dbConfig/dbConfig";
import { Fine } from "@/Model/Fines";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";
import { publishFineUpdate } from "@/Helper/publishDomain";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { id } = await request.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify(new ApiError(400, "Invalid fine id")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const fine = await Fine.findById(id);
    if (!fine) {
      return new Response(JSON.stringify(new ApiError(404, "Fine not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (fine.status !== "Pending") {
      return new Response(
        JSON.stringify(new ApiError(400, "This fine is already settled")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    fine.status = "Paid";
    fine.paidAt = new Date().toISOString().slice(0, 10);
    await fine.save();

    await publishFineUpdate({ action: "paid", id: String(fine._id), userId: "", amount: fine.amount, status: "Paid" });
    return new Response(
      JSON.stringify(new ApiResponce(200, fine, "Payment recorded")),
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
