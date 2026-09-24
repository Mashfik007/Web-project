import connectDB from "@/dbConfig/dbConfig";
import { ArchivedLibraryUser } from "@/Model/ArchivedLibraryUsers";
import { LibraryUser } from "@/Model/LibraryUsers";
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

    const archived = await ArchivedLibraryUser.findById(id);
    if (!archived?.user) {
      return new Response(
        JSON.stringify(new ApiError(404, "Archived user not found")),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const snapshot = { ...archived.user };
    delete snapshot.__v;

    await LibraryUser.create(snapshot);
    await ArchivedLibraryUser.deleteOne({ _id: archived._id });

    return new Response(
      JSON.stringify(new ApiResponce(200, null, "User restored")),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    const message =
      error?.code === 11000
        ? "A user with this email or phone is already in the list."
        : error.message || "Internal Server Error";

    return new Response(JSON.stringify(new ApiError(500, message)), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
