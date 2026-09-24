import connectDB from "@/dbConfig/dbConfig";
import { LibraryUser } from "@/Model/LibraryUsers";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { id } = await request.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify(new ApiError(400, "Invalid user id")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await LibraryUser.findById(id);
    if (!user) {
      return new Response(JSON.stringify(new ApiError(404, "User not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    user.status = user.status === "Active" ? "Suspended" : "Active";
    await user.save();

    const message =
      user.status === "Active" ? "User activated" : "User suspended";

    return new Response(JSON.stringify(new ApiResponce(200, user, message)), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
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
