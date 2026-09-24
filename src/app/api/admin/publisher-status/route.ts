import connectDB from "@/dbConfig/dbConfig";
import { Publisher } from "@/Model/Publishers";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { id } = await request.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify(new ApiError(400, "Invalid publisher id")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const publisher = await Publisher.findById(id);
    if (!publisher) {
      return new Response(
        JSON.stringify(new ApiError(404, "Publisher not found")),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    publisher.status = publisher.status === "Active" ? "Inactive" : "Active";
    await publisher.save();

    const message =
      publisher.status === "Active"
        ? "Publisher activated"
        : "Publisher deactivated";

    return new Response(
      JSON.stringify(new ApiResponce(200, publisher, message)),
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
